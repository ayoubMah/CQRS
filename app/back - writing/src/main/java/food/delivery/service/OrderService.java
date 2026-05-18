package food.delivery.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import food.delivery.kafka.KafkaPublisher;
import food.delivery.kafka.dto.OrderEvent;
import food.delivery.kafka.dto.OrderEventType;
import food.delivery.model.Order;
import food.delivery.model.OrderStatus;
import food.delivery.repository.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderrepo;

    @Autowired
    private KafkaPublisher kafkaPublisher;

    public Order createOrder(Order order) {
        order.setStatus(OrderStatus.PLACED);

        Order savedOrder = orderrepo.save(order);

        kafkaPublisher.publishOrderEvent(
                new OrderEvent(OrderEventType.ORDER_PLACED, savedOrder.getId(), order.getCustomer().getId()));

        return savedOrder;
    }

    public void deleteOrder(Order order) {
        orderrepo.delete(order);
    }

    public Order getOrder(int id) {
        Optional<Order> potentialOrder = orderrepo.findById(id);

        if (potentialOrder.isPresent()) {
            return potentialOrder.get();
        }

        return null;
    }

    public Order getCurrentCustomerOrder(int customerId) {
        return orderrepo
                .findFirstByCustomerIdAndStatusNotOrderByIdDesc(
                        customerId,
                        OrderStatus.PICKED_UP)
                .orElse(null);
    }

    public List<Order> getOrders() {
        return orderrepo.findAll();
    }

    public Order updateOrderStatus(int id, OrderStatus status) {
        Order order = getOrder(id);

        if (order == null) {
            return null;
        }

        order.setStatus(status);
        return orderrepo.save(order);
    }

    public Order prepareOrder(int id) {
        Order preparedOrder = updateOrderStatus(id, OrderStatus.PREPARING);
        if (preparedOrder != null) {
            kafkaPublisher.publishOrderEvent(
                    new OrderEvent(OrderEventType.ORDER_PREPARING, id, preparedOrder.getCustomer().getId()));
        }
        return preparedOrder;
    }

    public Order readyOrder(int id) {
        Order readyOrder = updateOrderStatus(id, OrderStatus.READY);
        if (readyOrder != null) {
            kafkaPublisher.publishOrderEvent(
                    new OrderEvent(OrderEventType.ORDER_READY, id, readyOrder.getCustomer().getId()));
        }
        return readyOrder;
    }

    public Order pickUpOrder(int id) {
        Order pickedUp = updateOrderStatus(id, OrderStatus.PICKED_UP);
        if (pickedUp != null) {
            kafkaPublisher.publishOrderEvent(
                    new OrderEvent(OrderEventType.ORDER_PICKED_UP, id, pickedUp.getCustomer().getId()));
        }
        return pickedUp;
    }

    public Order cancelOrder(int id) {
        Order canceledOrder = updateOrderStatus(id, OrderStatus.CANCELED);
        if (canceledOrder != null) {
            kafkaPublisher.publishOrderEvent(
                    new OrderEvent(OrderEventType.ORDER_CANCELED, id, canceledOrder.getCustomer().getId()));
        }
        return canceledOrder;
    }

}
