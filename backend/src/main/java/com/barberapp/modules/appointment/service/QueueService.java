package com.barberapp.modules.appointment.service;

import com.barberapp.modules.appointment.event.QueueUpdatedEvent;
import com.barberapp.modules.appointment.model.QueueEntry;
import com.barberapp.modules.appointment.model.QueueStatus;
import com.barberapp.modules.appointment.repository.QueueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class QueueService {

    @Autowired
    private QueueRepository queueRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    /**
     * Customer joins the queue for a specific barber
     */
    @Transactional
    public QueueEntry joinQueue(Long barberId, Long customerId) {
        // Check if customer is already in queue
        queueRepository.findByBarberIdAndCustomerId(barberId, customerId)
                .ifPresent(entry -> {
                    throw new RuntimeException("Customer already in queue");
                });

        // Get next position
        Integer maxPosition = queueRepository.findMaxPositionByBarberId(barberId);
        int nextPosition = (maxPosition == null) ? 1 : maxPosition + 1;

        QueueEntry entry = new QueueEntry();
        entry.setBarberId(barberId);
        entry.setCustomerId(customerId);
        entry.setPosition(nextPosition);
        entry.setStatus(QueueStatus.WAITING);

        QueueEntry saved = queueRepository.save(entry);

        // Publish event for WebSocket notification
        eventPublisher.publishEvent(new QueueUpdatedEvent(barberId, customerId, "JOIN"));

        return saved;
    }

    /**
     * Customer cancels their slot in the queue
     */
    @Transactional
    public void cancelSlot(Long barberId, Long customerId) {
        QueueEntry entry = queueRepository.findByBarberIdAndCustomerId(barberId, customerId)
                .orElseThrow(() -> new RuntimeException("Queue entry not found"));

        int cancelledPosition = entry.getPosition();

        // Mark as cancelled (soft delete approach)
        entry.setStatus(QueueStatus.COMPLETED); // or create CANCELLED status
        queueRepository.save(entry);

        // Reorder remaining entries
        List<QueueEntry> followingEntries = queueRepository
                .findByBarberIdAndPositionGreaterThan(barberId, cancelledPosition);

        for (QueueEntry following : followingEntries) {
            following.setPosition(following.getPosition() - 1);
        }
        queueRepository.saveAll(followingEntries);

        // Publish event
        eventPublisher.publishEvent(new QueueUpdatedEvent(barberId, customerId, "CANCEL"));
    }

    /**
     * Barber marks current customer as complete and advances queue
     */
    @Transactional
    public void completeCurrentCustomer(Long barberId) {
        List<QueueEntry> queue = queueRepository
                .findByBarberIdAndStatusOrderByPositionAsc(barberId, QueueStatus.IN_PROGRESS);

        if (queue.isEmpty()) {
            throw new RuntimeException("No customer in progress");
        }

        QueueEntry current = queue.get(0);
        current.setStatus(QueueStatus.COMPLETED);
        queueRepository.save(current);

        // Advance next customer to IN_PROGRESS
        advanceQueue(barberId);

        // Publish event
        eventPublisher.publishEvent(new QueueUpdatedEvent(barberId, current.getCustomerId(), "COMPLETE"));
    }

    /**
     * Barber marks current customer as no-show
     */
    @Transactional
    public void markNoShow(Long barberId) {
        List<QueueEntry> queue = queueRepository
                .findByBarberIdAndStatusOrderByPositionAsc(barberId, QueueStatus.IN_PROGRESS);

        if (queue.isEmpty()) {
            throw new RuntimeException("No customer in progress");
        }

        QueueEntry current = queue.get(0);
        current.setStatus(QueueStatus.NO_SHOW);
        queueRepository.save(current);

        // Advance next customer
        advanceQueue(barberId);

        // Publish event
        eventPublisher.publishEvent(new QueueUpdatedEvent(barberId, current.getCustomerId(), "NO_SHOW"));
    }

    /**
     * Advance the queue - move next WAITING customer to IN_PROGRESS
     */
    private void advanceQueue(Long barberId) {
        List<QueueEntry> waiting = queueRepository
                .findByBarberIdAndStatusOrderByPositionAsc(barberId, QueueStatus.WAITING);

        if (!waiting.isEmpty()) {
            QueueEntry next = waiting.get(0);
            next.setStatus(QueueStatus.IN_PROGRESS);
            queueRepository.save(next);

            // Publish event
            eventPublisher.publishEvent(new QueueUpdatedEvent(barberId, next.getCustomerId(), "ADVANCE"));
        }
    }

    /**
     * Get current queue for a barber
     */
    public List<QueueEntry> getQueue(Long barberId) {
        return queueRepository.findByBarberIdOrderByPositionAsc(barberId);
    }

    /**
     * Get queue position for a specific customer
     */
    public QueueEntry getCustomerPosition(Long barberId, Long customerId) {
        return queueRepository.findByBarberIdAndCustomerId(barberId, customerId)
                .orElseThrow(() -> new RuntimeException("Customer not in queue"));
    }

    /**
     * Calculate estimated wait time for a customer
     */
    public int calculateEstimatedWaitTime(Long barberId, Long customerId) {
        QueueEntry customerEntry = getCustomerPosition(barberId, customerId);

        // Average service duration in minutes (can be configurable)
        int avgServiceDuration = 30;

        // Count customers ahead
        List<QueueEntry> queue = queueRepository
                .findByBarberIdAndStatusOrderByPositionAsc(barberId, QueueStatus.WAITING);

        int customersAhead = 0;
        for (QueueEntry entry : queue) {
            if (entry.getPosition() < customerEntry.getPosition()) {
                customersAhead++;
            }
        }

        return customersAhead * avgServiceDuration;
    }
}
