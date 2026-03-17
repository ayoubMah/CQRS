package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/segmentio/kafka-go"
)

// Order represents the incoming HTTP request and the database record
type Order struct {
	ID           string  `json:"id"`
	CustomerName string  `json:"customer_name"`
	Amount       float64 `json:"amount"`
	Status       string  `json:"status"`
}

func main() {
	ctx := context.Background()

	// 1. Connect to PostgreSQL (Write DB)
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
    dbURL = "postgres://admin:secretpassword@localhost:5432/write_db?sslmode=disable"
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

		var order Order
		if err := json.NewDecoder(r.Body).Decode(&order); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Assign a UUID and default status
		order.ID = uuid.New().String()
		order.Status = "CREATED"

		// Step A: Write to PostgreSQL
		_, err = conn.Exec(ctx,
			"INSERT INTO orders (id, customer_name, amount, status) VALUES ($1, $2, $3, $4)",
			order.ID, order.CustomerName, order.Amount, order.Status,
		)
		if err != nil {
			http.Error(w, "Failed to save to DB: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Step B: Publish Event to Kafka
		orderJSON, _ := json.Marshal(order)
		err = kafkaWriter.WriteMessages(ctx,
			kafka.Message{
				Key:   []byte(order.ID), // Use ID as key to ensure ordering per order
				Value: orderJSON,
			},
		)
		if err != nil {
			// In a production app, you'd want the Outbox Pattern here to handle DB success but Kafka failure
			log.Printf("Failed to write to Kafka: %v", err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(order)
		log.Printf("Order created and published: %s\n", order.ID)
	})

	// 4. Start the server
	fmt.Println("Write API listening on :8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}