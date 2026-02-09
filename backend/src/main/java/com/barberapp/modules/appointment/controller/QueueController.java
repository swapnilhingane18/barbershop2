package com.barberapp.modules.appointment.controller;

import com.barberapp.modules.appointment.model.QueueEntry;
import com.barberapp.modules.appointment.service.QueueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/queue")
public class QueueController {

    @Autowired
    private QueueService queueService;

    /**
     * Customer joins the queue
     */
    @PostMapping("/join")
    public ResponseEntity<QueueEntry> joinQueue(
            @RequestParam Long barberId,
            @RequestParam Long customerId) {
        try {
            return ResponseEntity.ok(queueService.joinQueue(barberId, customerId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Customer cancels their slot
     */
    @PostMapping("/cancel")
    public ResponseEntity<String> cancelSlot(
            @RequestParam Long barberId,
            @RequestParam Long customerId) {
        try {
            queueService.cancelSlot(barberId, customerId);
            return ResponseEntity.ok("Slot cancelled successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Barber completes current customer
     */
    @PostMapping("/complete")
    public ResponseEntity<String> completeCustomer(@RequestParam Long barberId) {
        try {
            queueService.completeCurrentCustomer(barberId);
            return ResponseEntity.ok("Customer completed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Barber marks current customer as no-show
     */
    @PostMapping("/no-show")
    public ResponseEntity<String> markNoShow(@RequestParam Long barberId) {
        try {
            queueService.markNoShow(barberId);
            return ResponseEntity.ok("Customer marked as no-show");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Get current queue for a barber
     */
    @GetMapping
    public ResponseEntity<List<QueueEntry>> getQueue(@RequestParam Long barberId) {
        return ResponseEntity.ok(queueService.getQueue(barberId));
    }

    /**
     * Get customer's position and estimated wait time
     */
    @GetMapping("/position")
    public ResponseEntity<Map<String, Object>> getCustomerPosition(
            @RequestParam Long barberId,
            @RequestParam Long customerId) {
        try {
            QueueEntry entry = queueService.getCustomerPosition(barberId, customerId);
            int waitTime = queueService.calculateEstimatedWaitTime(barberId, customerId);

            return ResponseEntity.ok(Map.of(
                    "position", entry.getPosition(),
                    "status", entry.getStatus(),
                    "estimatedWaitTime", waitTime));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
