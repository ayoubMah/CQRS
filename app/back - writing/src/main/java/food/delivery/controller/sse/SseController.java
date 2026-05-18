package food.delivery.controller.sse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import food.delivery.sse.SseEmitters;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class SseController {

    @Autowired
    private SseEmitters sseEmitters;

    @GetMapping("/sse/workers")
    public SseEmitter connectWorker() {
        return sseEmitters.addWorker();
    }

    @GetMapping("/sse/customer/{customerId}")
    public SseEmitter connectCustomer(
            @PathVariable Integer customerId
    ) {
        return sseEmitters.addCustomer(customerId);
    }
}