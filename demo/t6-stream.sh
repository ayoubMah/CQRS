#!/bin/bash
clear
echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║         READ API — GET /stream               ║"
echo "  ║  SSE: orders pushed live, no polling         ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""
echo "  Connecting to http://localhost:8081/stream ..."
echo "  Waiting for live orders..."
echo ""
curl -s -N http://localhost:8081/stream | while IFS= read -r line; do
  if [[ "$line" == data:* ]]; then
    echo "  >> $line"
  elif [[ "$line" == event:* ]]; then
    echo ""
    echo "  [$line]"
  fi
done
