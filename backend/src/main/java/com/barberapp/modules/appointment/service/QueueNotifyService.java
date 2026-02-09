package com.barberapp.modules.appointment.service;

import com.barberapp.modules.appointment.event.QueueUpdatedEvent;
import com.barberapp.modules.appointment.model.QueueEntry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QueueNotifyService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private QueueService queueService;

    /**
     * Listen for queue update events and broadcast to WebSocket clients
     */
    @Async
    @EventListener
    public void handleQueueUpdate(QueueUpdatedEvent event) {
        // Fetch latest queue state
        List<QueueEntry> queue = queueService.getQueue(event.getBarberId());

        // Broadcast to all clients subscribed to this barber's queue
        messagingTemplate.convertAndSend(
                "/topic/barber/" + event.getBarberId(),
                queue);

        // Also send personalized notification to the affected customer
        if (event.getCustomerId() != null) {
            messagingTemplate.convertAndSendToUser(
                    event.getCustomerId().toString(),
                    "/queue/notifications",
                    event);
        }
    }
}
