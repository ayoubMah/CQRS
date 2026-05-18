#!/bin/bash
clear
echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║         KAFKA — topic: orders                ║"
echo "  ║  Raw messages arriving on the bus            ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""
docker exec -it kafka-broker \
  /opt/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic orders \
  --formatter-property print.timestamp=true \
  --formatter-property print.key=true \
  --formatter-property key.separator=" → "
