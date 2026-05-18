package food.delivery.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopics {

    @Bean
    public NewTopic ordersTopic() {
        return TopicBuilder
                .name("orders.events")
                .partitions(1)
                .replicas(1)
                .build();
    }

}