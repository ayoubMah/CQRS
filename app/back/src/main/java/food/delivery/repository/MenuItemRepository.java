package food.delivery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import food.delivery.model.MenuItem;

public interface MenuItemRepository extends JpaRepository<MenuItem, Integer> {

}
