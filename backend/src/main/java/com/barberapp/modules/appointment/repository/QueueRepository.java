package com.barberapp.modules.appointment.repository;

import com.barberapp.modules.appointment.model.QueueEntry;
import com.barberapp.modules.appointment.model.QueueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QueueRepository extends JpaRepository<QueueEntry, Long> {

    List<QueueEntry> findByBarberIdAndStatusOrderByPositionAsc(Long barberId, QueueStatus status);

    List<QueueEntry> findByBarberIdOrderByPositionAsc(Long barberId);

    Optional<QueueEntry> findByBarberIdAndCustomerId(Long barberId, Long customerId);

    @Query("SELECT MAX(q.position) FROM QueueEntry q WHERE q.barberId = :barberId")
    Integer findMaxPositionByBarberId(@Param("barberId") Long barberId);

    List<QueueEntry> findByBarberIdAndPositionGreaterThan(Long barberId, Integer position);
}
