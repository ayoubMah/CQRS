package food.delivery.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import food.delivery.model.Order;
import food.delivery.model.OrderStatus;
import food.delivery.repository.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderrepo;

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

}
