package food.delivery.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import food.delivery.model.User;
import food.delivery.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userrepo;

    public User getUserById(int id) {
        Optional<User> user = userrepo.findById(id);
        if (user.isPresent()) {
            return user.get();
        }
        return null;
    }

    public List<User> getAllUsers() {
        return userrepo.findAll();
    }

    public User getUserByUsernameAndPassword(String username, String password) {
        return userrepo.findByUsernameAndPassword(username, password);
    }

}
