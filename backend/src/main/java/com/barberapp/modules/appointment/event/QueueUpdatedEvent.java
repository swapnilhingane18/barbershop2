package com.barberapp.modules.appointment.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QueueUpdatedEvent {
    private Long barberId;
    private Long customerId;
    private String actionType; // JOIN, CANCEL, COMPLETE, NO_SHOW
}
