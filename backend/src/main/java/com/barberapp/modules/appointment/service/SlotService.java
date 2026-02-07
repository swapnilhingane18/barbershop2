package com.barberapp.modules.appointment.service;

import com.barberapp.modules.appointment.model.Slot;
import com.barberapp.modules.appointment.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SlotService {

    @Autowired
    private SlotRepository slotRepository;

    /**
     * Generates slots for a barber within a given time range and interval.
     * Prevents duplicates by checking existing slots.
     */
    @Transactional
    public List<Slot> generateSlots(Long barberId, LocalDateTime start, LocalDateTime end, int durationMinutes) {
        List<Slot> newSlots = new ArrayList<>();
        LocalDateTime current = start;

        while (current.plusMinutes(durationMinutes).isBefore(end) || current.plusMinutes(durationMinutes).isEqual(end)) {
            LocalDateTime slotEnd = current.plusMinutes(durationMinutes);

            // Check if slot already exists to avoid duplicates
            List<Slot> existing = slotRepository.findByBarberIdAndStartTimeBetween(barberId, current, current);
            
            if (existing.isEmpty()) {
                Slot slot = new Slot();
                slot.setBarberId(barberId);
                slot.setStartTime(current);
                slot.setEndTime(slotEnd);
                slot.setStatus(Slot.SlotStatus.AVAILABLE);
                newSlots.add(slot);
            }

            current = slotEnd;
        }

        return slotRepository.saveAll(newSlots);
    }

    /**
     * Atomically books a slot using pessimistic locking.
     */
    @Transactional
    public Slot bookSlot(Long slotId, Long userId) {
        // Fetch with lock to prevent race conditions
        Slot slot = slotRepository.findByIdWithLock(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (slot.getStatus() != Slot.SlotStatus.AVAILABLE) {
            throw new RuntimeException("Slot is already booked or unavailble");
        }

        slot.setStatus(Slot.SlotStatus.BOOKED);
        slot.setBookedByUserId(userId);
        
        return slotRepository.save(slot);
    }

    public List<Slot> getAvailableSlots(Long barberId, LocalDateTime date) {
        LocalDateTime start = date.withHour(0).withMinute(0);
        LocalDateTime end = date.withHour(23).withMinute(59);
        return slotRepository.findByBarberIdAndStartTimeBetween(barberId, start, end);
    }
}
