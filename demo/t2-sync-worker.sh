#!/bin/bash
clear
echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║            SYNC WORKER  —  Kafka consumer    ║"
echo "  ║  Consumes events → syncs Read DB → refreshes view  ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""
docker logs --tail=0 -f sync-worker
