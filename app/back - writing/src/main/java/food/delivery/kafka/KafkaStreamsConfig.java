package food.delivery.kafka;

import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.KStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.support.serializer.JacksonJsonSerde;

import food.delivery.kafka.dto.OrderEvent;
import food.delivery.kafka.dto.OrderEventType;
import food.delivery.sse.SseEmitters;

@Configuration
public class KafkaStreamsConfig {

    @Autowired
    private SseEmitters sseEmitters;

    @Bean
    public KStream<String, OrderEvent> orderEventsStream(StreamsBuilder builder) {
        JacksonJsonSerde<OrderEvent> orderEventSerde = new JacksonJsonSerde<>(OrderEvent.class);

        KStream<String, OrderEvent> orderStream = builder.stream(
                "orders.events",
                Consumed.with(Serdes.String(), orderEventSerde));

        orderStream.peek((key, event) -> {
            System.out.println("========== ORDER STREAM ==========");
            System.out.println("Event type: " + event.getEventType());
            System.out.println("Order ID: " + event.getOrderId());
            System.out.println("Customer ID: " + event.getCustomerId());
            System.out.println("==================================");
        });

        orderStream
                .filter((key, event) -> event.getCustomerId() != null)
                .foreach((key, event) -> {
                    sseEmitters.sendToCustomer(event.getCustomerId(), event);
                });

        orderStream
                .filter((key, event) -> event.getEventType() == OrderEventType.ORDER_PLACED)
                .foreach((key, event) -> {
                    sseEmitters.sendToWorkers(event);
                });

        return orderStream;
    }
}