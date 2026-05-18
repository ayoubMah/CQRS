package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/segmentio/kafka-go"
)

type CustomerStats struct {
	CustomerName string  `json:"customer_name"`
	TotalOrders  int     `json:"total_orders"`
	TotalSpent   float64 `json:"total_spent"`
}

func main() {
	ctx := context.Background()

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://admin:secretpassword@localhost:5433/read_db?sslmode=disable"
	}

	conn, err := pgx.Connect(ctx, dbURL)
	if err != nil {
		log.Fatalf("Read DB connection failed: %v", err)
	}
	defer conn.Close(ctx)
	fmt.Println("Connected to Read Database.")

	kafkaAddr := os.Getenv("KAFKA_BROKER")
	if kafkaAddr == "" {
		kafkaAddr = "localhost:9092"
	}

	// GET /stats — pull model: query the materialized view on demand
	http.HandleFunc("/stats", func(w http.ResponseWriter, r *http.Request) {
		rows, err := conn.Query(ctx, "SELECT customer_name, total_orders, total_spent FROM customer_order_stats")
		if err != nil {
			http.Error(w, "Query failed: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var results []CustomerStats
		for rows.Next() {
			var s CustomerStats
			if err := rows.Scan(&s.CustomerName, &s.TotalOrders, &s.TotalSpent); err != nil {
				log.Printf("Scan error: %v", err)
				continue
			}
			results = append(results, s)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(results)
	})

	// GET /stream — push model: SSE, streams only NEW Kafka events to the client.
	// We snapshot the current end-of-log offset at connect time so only messages
	// published after this client connected are delivered — no historical replay.
	http.HandleFunc("/stream", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		flusher, ok := w.(http.Flusher)
		if !ok {
			http.Error(w, "Streaming not supported", http.StatusInternalServerError)
			return
		}

		// Snapshot the current last offset so we start from NOW, not from the beginning
		kconn, err := kafka.DialLeader(r.Context(), "tcp", kafkaAddr, "orders", 0)
		if err != nil {
			http.Error(w, "Cannot reach Kafka: "+err.Error(), http.StatusInternalServerError)
			return
		}
		_, startOffset, err := kconn.ReadOffsets()
		kconn.Close()
		if err != nil {
			startOffset = kafka.LastOffset
		}

		reader := kafka.NewReader(kafka.ReaderConfig{
			Brokers:   []string{kafkaAddr},
			Topic:     "orders",
			Partition: 0,
			MinBytes:  1,
			MaxBytes:  10e6,
		})
		reader.SetOffset(startOffset)
		defer reader.Close()

		log.Printf("SSE client connected: %s (starting at offset %d)", r.RemoteAddr, startOffset)
		fmt.Fprint(w, "event: connected\n")
		fmt.Fprint(w, `data: {"status":"listening for orders"}`+"\n\n")
		flusher.Flush()

		ctx := r.Context()
		for {
			m, err := reader.ReadMessage(ctx)
			if err != nil {
				if ctx.Err() != nil {
					log.Printf("SSE client disconnected: %s", r.RemoteAddr)
				} else {
					log.Printf("Kafka read error: %v", err)
				}
				return
			}
			fmt.Fprintf(w, "event: order\ndata: %s\n\n", m.Value)
			flusher.Flush()
			log.Printf("Streamed order to %s", r.RemoteAddr)
		}
	})

	fmt.Println("Read API listening on :8081...")
	log.Fatal(http.ListenAndServe(":8081", nil))
}
