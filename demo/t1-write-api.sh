#!/bin/bash
clear
echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║           WRITE API  —  port 8080            ║"
echo "  ║  Receives orders, writes to DB + Kafka       ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""
docker logs --tail=0 -f write-api
