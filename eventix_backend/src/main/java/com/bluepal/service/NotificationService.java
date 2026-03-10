package com.bluepal.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class NotificationService {

    // T7: Store active emitters per organization
    private final Map<Long, Map<String, SseEmitter>> emitters = new ConcurrentHashMap<>();

    public SseEmitter createEmitter(Long orgId, String userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // Keep open

        // T13: Cleanup logic
        emitter.onCompletion(() -> removeEmitter(orgId, userId));
        emitter.onTimeout(() -> removeEmitter(orgId, userId));
        emitter.onError((e) -> removeEmitter(orgId, userId));

        emitters.computeIfAbsent(orgId, k -> new ConcurrentHashMap<>()).put(userId, emitter);
        return emitter;
    }

    /**
     * T5: Broadcast a sale event to all connected organizers of an organization.
     */
    public void publishSaleNotification(Long orgId, Object saleData) {
        Map<String, SseEmitter> orgEmitters = emitters.get(orgId);
        if (orgEmitters != null) {
            orgEmitters.forEach((userId, emitter) -> {
                try {
                    // Send the "sale" event
                    emitter.send(SseEmitter.event()
                            .name("sale")
                            .data(saleData));
                } catch (IOException e) {
                    removeEmitter(orgId, userId);
                }
            });
        }
    }

    private void removeEmitter(Long orgId, String userId) {
        if (emitters.containsKey(orgId)) {
            emitters.get(orgId).remove(userId);
        }
    }
}