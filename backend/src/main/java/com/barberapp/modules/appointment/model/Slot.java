package com.barberapp.modules.appointment.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "slots", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"barberId", "startTime"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Slot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long barberId;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SlotStatus status;

    @Version
    private Long version;
    
    @Column(name = "booked_by_user_id")
    private Long bookedByUserId;

    public enum SlotStatus {
        AVAILABLE,
        BOOKED,
        LOCKED // For temporary hold
    }
}
