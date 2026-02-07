package com.barberapp.modules.appointment.controller;

import com.barberapp.modules.appointment.model.Slot;
import com.barberapp.modules.appointment.service.SlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
public class SlotController {

    @Autowired
    private SlotService slotService;

    @PostMapping("/generate")
    public ResponseEntity<List<Slot>> generateSlots(
            @RequestParam Long barberId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam int duration) {
        return ResponseEntity.ok(slotService.generateSlots(barberId, start, end, duration));
    }

    @GetMapping
    public ResponseEntity<List<Slot>> getSlots(
            @RequestParam Long barberId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        return ResponseEntity.ok(slotService.getAvailableSlots(barberId, date));
    }

    @PostMapping("/{id}/book")
    public ResponseEntity<Slot> bookSlot(
            @PathVariable Long id,
            @RequestParam Long userId) {
        try {
            return ResponseEntity.ok(slotService.bookSlot(id, userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null); // Simple error handling for now
        }
    }
}
