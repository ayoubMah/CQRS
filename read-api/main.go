package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/jackc/pgx/v5"
)

// OrderStats represents aggregated order data per customer
type OrderStats struct {
	CustomerID  int `json:"customer_id"`
	TotalOrders int `json:"total_orders"`
	TotalItems  int `json:"total_items"`
}

// Order mirrors the public.orders table on the read side
type Order struct {
	ID         int    `json:"id"`
	Date       string `json:"date"`
	Time       string `json:"time"`
	Quantity   int    `json:"quantity"`
	Status     string `json:"status"`
	CustomerID int    `json:"customer_id"`
	ItemID     int    `json:"item_id"`
}

func main() {
	ctx := context.Background()

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:root@172.31.253.3:5433/food_read?sslmode=disable"
	}

	conn, err := pgx.Connect(ctx, dbURL)
	if err != nil {
		log.Fatalf("Read DB connection failed: %v", err)
	}
	defer conn.Close(ctx)
	fmt.Println("Connected to Read Database.")

	// GET /orders?customer_id=X — list orders for a customer
	http.HandleFunc("/orders", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		customerIDStr := r.URL.Query().Get("customer_id")
		if customerIDStr == "" {
			http.Error(w, "customer_id query param is required", http.StatusBadRequest)
			return
		}
		customerID, err := strconv.Atoi(customerIDStr)
		if err != nil {
			http.Error(w, "customer_id must be an integer", http.StatusBadRequest)
			return
		}

		rows, err := conn.Query(ctx,
			`SELECT id, date, time, quantity, status, customer_id, item_id
			 FROM orders
			 WHERE customer_id = $1
			 ORDER BY date DESC, time DESC`,
			customerID,
		)
		if err != nil {
			http.Error(w, "Query failed: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var orders []Order
		for rows.Next() {
			var o Order
			if err := rows.Scan(&o.ID, &o.Date, &o.Time, &o.Quantity, &o.Status, &o.CustomerID, &o.ItemID); err != nil {
				log.Printf("Scan error: %v", err)
				continue
			}
			orders = append(orders, o)
		}

		if orders == nil {
			orders = []Order{} // return [] instead of null
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(orders)
	})

	// GET /stats?customer_id=X — aggregated stats per customer
	http.HandleFunc("/stats", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		customerIDStr := r.URL.Query().Get("customer_id")

		var rows pgx.Rows
		if customerIDStr == "" {
			// No filter — return stats for all customers
			rows, err = conn.Query(ctx,
				`SELECT customer_id, COUNT(*) AS total_orders, COALESCE(SUM(quantity), 0) AS total_items
				 FROM orders
				 GROUP BY customer_id
				 ORDER BY customer_id`,
			)
		} else {
			customerID, err := strconv.Atoi(customerIDStr)
			if err != nil {
				http.Error(w, "customer_id must be an integer", http.StatusBadRequest)
				return
			}
			rows, err = conn.Query(ctx,
				`SELECT customer_id, COUNT(*) AS total_orders, COALESCE(SUM(quantity), 0) AS total_items
				 FROM orders
				 WHERE customer_id = $1
				 GROUP BY customer_id`,
				customerID,
			)
		}
		if err != nil {
			http.Error(w, "Query failed: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var stats []OrderStats
		for rows.Next() {
			var s OrderStats
			if err := rows.Scan(&s.CustomerID, &s.TotalOrders, &s.TotalItems); err != nil {
				log.Printf("Scan error: %v", err)
				continue
			}
			stats = append(stats, s)
		}

		if stats == nil {
			stats = []OrderStats{}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(stats)
	})

	fmt.Println("Read API listening on :8081...")
	log.Fatal(http.ListenAndServe(":8081", nil))
}