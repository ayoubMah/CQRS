package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/segmentio/kafka-go"
)

// Order mirrors the public.orders table
type Order struct {
	ID         int    `json:"id"`
	Date       string `json:"date"`        // "YYYY-MM-DD"
	Time       string `json:"time"`        // "HH:MM:SS"
	Quantity   int    `json:"quantity"`
	Status     string `json:"status"`
	CustomerID int    `json:"customer_id"`
	ItemID     int    `json:"item_id"`
}

// CreateOrderRequest is what the caller sends in the POST body
type CreateOrderRequest struct {
	Quantity   int `json:"quantity"`
	CustomerID int `json:"customer_id"`
	ItemID     int `json:"item_id"`
}

func main() {
	ctx := context.Background()

	// 1. Connect to PostgreSQL (Write DB)
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:root@172.31.253.3:5432/food_write?sslmode=disable"
	}

	conn, err := pgx.Connect(ctx, dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer conn.Close(ctx)
	fmt.Println("Connected to Write Database.")

	// 2. Setup Kafka Writer
	kafkaAddr := os.Getenv("KAFKA_BROKER")
	if kafkaAddr == "" {
		kafkaAddr = "localhost:9092"
	}

	kafkaWriter := &kafka.Writer{
		Addr:     kafka.TCP(kafkaAddr),
		Topic:    "orders",
		Balancer: &kafka.LeastBytes{},
	}
	defer kafkaWriter.Close()
	fmt.Println("Kafka Writer configured.")

	// 3. Define the HTTP Handler
	http.HandleFunc("/orders", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req CreateOrderRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
			return
		}

		if req.CustomerID == 0 || req.ItemID == 0 || req.Quantity <= 0 {
			http.Error(w, "customer_id, item_id, and quantity are required", http.StatusBadRequest)
			return
		}

		now := time.Now()
		order := Order{
			Date:       now.Format("2006-01-02"),
			Time:       now.Format("15:04:05"),
			Quantity:   req.Quantity,
			Status:     "PLACED",
			CustomerID: req.CustomerID,
			ItemID:     req.ItemID,
		}

		// Step A: Write to PostgreSQL — let the DB generate the ID
		err := conn.QueryRow(ctx,
			`INSERT INTO orders (date, time, quantity, status, customer_id, item_id)
			 VALUES ($1, $2, $3, $4, $5, $6)
			 RETURNING id`,
			order.Date, order.Time, order.Quantity, order.Status, order.CustomerID, order.ItemID,
		).Scan(&order.ID)
		if err != nil {
			http.Error(w, "Failed to save to DB: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Step B: Publish Event to Kafka
		orderJSON, _ := json.Marshal(order)
		if err := kafkaWriter.WriteMessages(ctx,
			kafka.Message{
				Key:   []byte(fmt.Sprintf("%d", order.ID)),
				Value: orderJSON,
			},
		); err != nil {
			// TODO: replace with Outbox Pattern to handle partial failures
			log.Printf("Warning: order %d saved to DB but failed to publish to Kafka: %v", order.ID, err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(order)
		log.Printf("Order created and published: %d\n", order.ID)
	})

	// 4. Start the server
	fmt.Println("Write API listening on :8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}