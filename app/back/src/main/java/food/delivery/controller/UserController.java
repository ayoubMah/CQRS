package food.delivery.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import food.delivery.model.User;
import food.delivery.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userservice;

    @GetMapping
    public List<User> getAllUsers() {
        return userservice.getAllUsers();
    }

    @PostMapping("/create")
    public User createUser(@RequestBody User user) {
        return userservice.saveUser(user);
    }

    @PostMapping("/auth")
    public ResponseEntity authenticateUser(String username, String password) {
        Map<String, Object> body = new HashMap<String, Object>();
        HttpStatus status;
        User authenticatedUser = userservice.getUserByUsernameAndPassword(username, password);

        if (authenticatedUser != null) {
            body.put("user", authenticatedUser);
            status = HttpStatus.OK;
        } else {
            status = HttpStatus.UNAUTHORIZED;
        }

        return ResponseEntity.status(status).body(body);
    }
}
