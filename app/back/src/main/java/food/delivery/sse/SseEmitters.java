package food.delivery.sse;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
public class SseEmitters {

    private final Map<Integer, List<SseEmitter>> customerEmitters = new ConcurrentHashMap<>();
    private final List<SseEmitter> workerEmitters = new CopyOnWriteArrayList<>();

    public SseEmitter addCustomer(Integer customerId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        customerEmitters
                .computeIfAbsent(customerId, id -> new CopyOnWriteArrayList<>())
                .add(emitter);

        emitter.onCompletion(() -> removeCustomerEmitter(customerId, emitter));
        emitter.onTimeout(() -> removeCustomerEmitter(customerId, emitter));
        emitter.onError(error -> removeCustomerEmitter(customerId, emitter));

        return emitter;
    }

    public SseEmitter addWorker() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        workerEmitters.add(emitter);

        emitter.onCompletion(() -> workerEmitters.remove(emitter));
        emitter.onTimeout(() -> workerEmitters.remove(emitter));
        emitter.onError(error -> workerEmitters.remove(emitter));

        return emitter;
    }

    public void sendToCustomer(Integer customerId, Object event) {
        List<SseEmitter> emitters = customerEmitters.get(customerId);

        if (emitters == null) {
            return;
        }

        for (SseEmitter emitter : emitters) {
            send(emitter, event);
        }
    }

    public void sendToWorkers(Object event) {
        for (SseEmitter emitter : workerEmitters) {
            send(emitter, event);
        }
    }

    private void send(SseEmitter emitter, Object event) {
        try {
            emitter.send(event);
        } catch (IOException error) {
            emitter.completeWithError(error);
        }
    }

    private void removeCustomerEmitter(Integer customerId, SseEmitter emitter) {
        List<SseEmitter> emitters = customerEmitters.get(customerId);

        if (emitters != null) {
            emitters.remove(emitter);
        }
    }
}