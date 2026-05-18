package food.delivery.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import food.delivery.model.MenuItem;
import food.delivery.repository.MenuItemRepository;

@Service
public class MenuItemService {

    @Autowired
    private MenuItemRepository menuItemRepo;

    public MenuItem saveMenuItem(MenuItem menuItem) {
        return menuItemRepo.save(menuItem);
    }

    public void deleteMenuItem(MenuItem menuItem) {
        menuItemRepo.delete(menuItem);
    }

    public MenuItem getMenuItem(int id) {
        Optional<MenuItem> potentialMenuItem = menuItemRepo.findById(id);

        if (potentialMenuItem.isPresent()) {
            return potentialMenuItem.get();
        }

        return null;
    }

    public List<MenuItem> getMenuItems() {
        return menuItemRepo.findAll();
    }
}