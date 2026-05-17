package food.delivery.kafka.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class OrderEvent {

    private OrderEventType eventType;
    private Integer orderId;
    private Integer customerId;
    private LocalDate date;
    private LocalTime timestamp;

    public OrderEvent() {}

    public OrderEvent(OrderEventType eventType, Integer orderId, Integer customerId) {
        this.eventType = eventType;
        this.orderId = orderId;
        this.customerId = customerId;
        this.date = LocalDate.now();
        this.timestamp = LocalTime.now();
    }

    public OrderEventType getEventType() {
        return eventType;
    }

    public void setEventType(OrderEventType eventType) {
        this.eventType = eventType;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalTime timestamp) {
        this.timestamp = timestamp;
    }

}