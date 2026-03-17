package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5"
)

// CustomerStats matches our Materialized View structure
type CustomerStats struct {
	CustomerName string  `json:"customer_name"`
	TotalOrders  int     `json:"total_orders"`
	TotalSpent   float64 `json:"total_spent"`
}

func main() {
	ctx := context.Background()

	// Connect to Read DB (port 5433)
	dbURL := "postgres://admin:secretpassword@localhost:5433/read_db?sslmode=disable"
	conn, err := pgx.Connect(ctx, dbURL)
	if err != nil {
		log.Fatalf("Read DB connection failed: %v", err)
	}
	defer conn.Close(ctx)
	fmt.Println("Connected to Read Database.")

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

	fmt.Println("Read API listening on :8081...")
	log.Fatal(http.ListenAndServe(":8081", nil))
}