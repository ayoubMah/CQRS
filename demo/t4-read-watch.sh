#!/bin/bash
clear
echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║      READ DB — customer_order_stats          ║"
echo "  ║  Materialized view — refreshes on each event ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""
watch -n 1 "
  echo '  ┌─── WRITE DB (source of truth) ──────────────────────────┐'
  docker exec postgres-write psql -U admin -d write_db -tA \
    -c \"SELECT '  ' || customer_name || ' | ' || amount || ' | ' || status FROM orders ORDER BY created_at;\" 2>/dev/null
  echo '  └─────────────────────────────────────────────────────────┘'
  echo ''
  echo '  ┌─── READ DB — materialized view (aggregated) ────────────┐'
  docker exec postgres-read psql -U admin -d read_db \
    -c \"SELECT customer_name, total_orders, total_spent FROM customer_order_stats ORDER BY total_spent DESC;\" 2>/dev/null
  echo '  └─────────────────────────────────────────────────────────┘'
"
