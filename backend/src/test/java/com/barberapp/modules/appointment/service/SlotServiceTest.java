package com.barberapp.modules.appointment.service;

import com.barberapp.modules.appointment.model.Slot;
import com.barberapp.modules.appointment.repository.SlotRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SlotServiceTest {

    @Mock
    private SlotRepository slotRepository;

    @InjectMocks
    private SlotService slotService;

    @Test
    public void testGenerateSlots() {
        LocalDateTime start = LocalDateTime.of(2023, 10, 27, 9, 0);
        LocalDateTime end = LocalDateTime.of(2023, 10, 27, 10, 0); // 1 hour window
        int duration = 30;

        when(slotRepository.findByBarberIdAndStartTimeBetween(any(), any(), any()))
                .thenReturn(Collections.emptyList());
        when(slotRepository.saveAll(any())).thenAnswer(i -> i.getArguments()[0]);

        List<Slot> slots = slotService.generateSlots(1L, start, end, duration);

        assertEquals(2, slots.size()); // 9:00-9:30, 9:30-10:00
        assertEquals(start, slots.get(0).getStartTime());
    }

    @Test
    public void testBookSlotSuccess() {
        Slot slot = new Slot();
        slot.setId(1L);
        slot.setStatus(Slot.SlotStatus.AVAILABLE);

        when(slotRepository.findByIdWithLock(1L)).thenReturn(Optional.of(slot));
        when(slotRepository.save(any(Slot.class))).thenReturn(slot);

        Slot bookedSlot = slotService.bookSlot(1L, 101L);

        assertEquals(Slot.SlotStatus.BOOKED, bookedSlot.getStatus());
        assertEquals(101L, bookedSlot.getBookedByUserId());
    }

    @Test
    public void testBookSlotAlreadyBooked() {
        Slot slot = new Slot();
        slot.setId(1L);
        slot.setStatus(Slot.SlotStatus.BOOKED);

        when(slotRepository.findByIdWithLock(1L)).thenReturn(Optional.of(slot));

        assertThrows(RuntimeException.class, () -> {
            slotService.bookSlot(1L, 101L);
        });
    }
}
