package food.delivery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import food.delivery.model.Order;
import food.delivery.service.OrderService;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getOrders();
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable int id) {
        return orderService.getOrder(id);
    }

    @GetMapping("/customer/{customerId}/current")
    public Order getCurrentCustomerOrder(
            @PathVariable int customerId) {
        return orderService.getCurrentCustomerOrder(customerId);
    }

    @PostMapping("/new")
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable int id) {
        Order order = orderService.getOrder(id);

        if (order != null) {
            orderService.deleteOrder(order);
        }
    }

    @PatchMapping("/{id}/prepare")
    public Order prepareOrder(@PathVariable int id) {
        return orderService.prepareOrder(id);
    }

    @PatchMapping("/{id}/ready")
    public Order readyOrder(@PathVariable int id) {
        return orderService.readyOrder(id);
    }

    @PatchMapping("/{id}/pickup")
    public Order pickUpOrder(@PathVariable int id) {
        return orderService.pickUpOrder(id);
    }

    @PatchMapping("/{id}/cancel")
    public Order cancelOrder(@PathVariable int id) {
        return orderService.cancelOrder(id);
    }
}