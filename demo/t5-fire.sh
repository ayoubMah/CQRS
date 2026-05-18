#!/bin/bash
clear
echo ""
echo "  ╔══════════════════════════════════════════════════════════╗"
echo "  ║              CQRS DEMO  —  COMMAND CENTER                ║"
echo "  ╚══════════════════════════════════════════════════════════╝"
echo ""
echo "  Resetting demo state..."

# 1. Truncate both DBs
docker exec postgres-write psql -U admin -d write_db -c "TRUNCATE TABLE orders;" > /dev/null 2>&1
docker exec postgres-read  psql -U admin -d read_db  -c "TRUNCATE TABLE orders;" > /dev/null 2>&1
docker exec postgres-read  psql -U admin -d read_db  -c "REFRESH MATERIALIZED VIEW customer_order_stats;" > /dev/null 2>&1

# 2. Stop sync-worker so we can reset its Kafka offset
docker stop sync-worker > /dev/null 2>&1

# 3. Reset sync-group offset to latest (skip all old messages)
docker exec kafka-broker /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server localhost:9092 \
  --group sync-group \
  --topic orders \
  --reset-offsets --to-latest --execute > /dev/null 2>&1

# 4. Restart sync-worker — it will now only consume NEW messages
docker start sync-worker > /dev/null 2>&1
sleep 2

echo "  Done. Both DBs are empty. Kafka offset reset. Ready."
echo ""
echo "  ╔══════════════════════════════════════════════════════════╗"
echo "  ║  FLOW:  POST /orders  →  write_db  +  Kafka topic       ║"
echo "  ║         sync-worker consumes  →  read_db view refreshed  ║"
echo "  ║         GET /stats  →  aggregated read model             ║"
echo "  ╚══════════════════════════════════════════════════════════╝"
echo ""

fire_order() {
  local name=$1
  local amount=$2
  echo "  ──────────────────────────────────────────────────────────"
  echo "  >>> POST /orders  { customer: $name, amount: $amount }"
  echo "  ──────────────────────────────────────────────────────────"
  result=$(curl -s -X POST http://localhost:8080/orders \
    -H "Content-Type: application/json" \
    -d "{\"customer_name\": \"$name\", \"amount\": $amount}")
  echo "  << $result"
  echo ""
}

read_stats() {
  echo "  ──────────────────────────────────────────────────────────"
  echo "  >>> GET /stats  (read-api :8081)"
  echo "  ──────────────────────────────────────────────────────────"
  curl -s http://localhost:8081/stats | python3 -m json.tool --indent 2 | sed 's/^/  /'
  echo ""
}

echo "  [1/5] First order: Alice buys 42.50"
echo "  Press ENTER to fire..."
read
fire_order "Alice" 42.50
sleep 1

echo "  [2/5] Second order: Bob buys 99.99"
echo "  Press ENTER to fire..."
read
fire_order "Bob" 99.99
sleep 1

echo "  [3/5] Read the stats NOW  (Alice: 1 order / Bob: 1 order)"
echo "  Press ENTER to query..."
read
read_stats

echo "  [4/5] Alice buys again: 18.00  (watch the view update)"
echo "  Press ENTER to fire..."
read
fire_order "Alice" 18.00
sleep 1

echo "  [5/5] Final stats — Alice: 2 orders / 60.50 total"
echo "  Press ENTER to query..."
read
read_stats

echo "  ══════════════════════════════════════════════════════════"
echo "  DEMO COMPLETE"
echo "  write-api  → wrote to DB + published to Kafka"
echo "  sync-worker → consumed Kafka → synced read DB → refreshed view"
echo "  read-api   → served aggregated view with zero coupling"
echo "  ══════════════════════════════════════════════════════════"
