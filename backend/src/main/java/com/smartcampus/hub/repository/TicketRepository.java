package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.Ticket;
import com.smartcampus.hub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByCreatedBy(User createdBy);

    List<Ticket> findByAssignedTechnician(User assignedTechnician);
}
