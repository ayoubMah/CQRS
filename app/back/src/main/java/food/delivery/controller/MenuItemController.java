package food.delivery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import food.delivery.model.MenuItem;
import food.delivery.service.MenuItemService;

@RestController
@RequestMapping("/items")
public class MenuItemController {

    @Autowired
    private MenuItemService itemservice;

    @GetMapping
    public List<MenuItem> getAllItems() {
        return itemservice.getMenuItems();
    }

    @GetMapping("/{id}")
    public MenuItem getItemById(@PathVariable int id) {
        return itemservice.getMenuItem(id);
    }

    @PostMapping("/new")
    public MenuItem createMenuItem(@RequestBody MenuItem item) {
        return itemservice.saveMenuItem(item);
    }
}