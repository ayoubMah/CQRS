package food.delivery.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import food.delivery.model.Order;
import food.delivery.model.OrderStatus;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    Optional<Order> findFirstByCustomerIdAndStatusNotOrderByIdDesc(
            int customerId,
            OrderStatus status);
}
