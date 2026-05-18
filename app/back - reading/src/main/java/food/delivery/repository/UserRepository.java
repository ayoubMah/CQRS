package food.delivery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import food.delivery.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    public User findByUsernameAndPassword(String username, String password);
}
