package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/segmentio/kafka-go"
)

type Order struct {
	ID           string  `json:"id"`
	CustomerName string  `json:"customer_name"`
	Amount       float64 `json:"amount"`
	Status       string  `json:"status"`
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

	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:  []string{kafkaAddr},
		Topic:    "orders",
		GroupID:  "sync-group",
		MinBytes: 10e3,
		MaxBytes: 10e6,
	})
	defer reader.Close()
	fmt.Println("Sync Worker started. Listening for events...")

	for {
		m, err := reader.ReadMessage(ctx)
		if err != nil {
			log.Printf("Error reading message: %v", err)
			break
		}

		var order Order
		if err := json.Unmarshal(m.Value, &order); err != nil {
			log.Printf("Failed to unmarshal order: %v", err)
			continue
		}

		_, err = conn.Exec(ctx,
			"INSERT INTO orders (id, customer_name, amount, status) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING",
			order.ID, order.CustomerName, order.Amount, order.Status,
		)
		if err != nil {
			log.Printf("Failed to sync to Read DB: %v", err)
			continue
		}

		_, err = conn.Exec(ctx, "REFRESH MATERIALIZED VIEW CONCURRENTLY customer_order_stats")
		if err != nil {
			log.Printf("Failed to refresh view: %v", err)
		}

		fmt.Printf("Successfully synced Order: %s\n", order.ID)
	}
}