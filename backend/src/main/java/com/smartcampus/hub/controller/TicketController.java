package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.TicketRequestDto;
import com.smartcampus.hub.dto.TicketResponseDto;
import com.smartcampus.hub.dto.TicketStatusUpdateRequestDto;
import com.smartcampus.hub.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public ResponseEntity<List<TicketResponseDto>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDto> getTicketById(@PathVariable Long id) {
        TicketResponseDto ticket = ticketService.getTicketById(id);

        if (ticket == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(ticket);
    }

    @PostMapping
    public ResponseEntity<TicketResponseDto> createTicket(@Valid @RequestBody TicketRequestDto requestDto) {
        TicketResponseDto createdTicket = ticketService.createTicket(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTicket);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TicketResponseDto> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody TicketStatusUpdateRequestDto requestDto) {
        TicketResponseDto updatedTicket = ticketService.updateTicketStatus(id, requestDto);

        if (updatedTicket == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedTicket);
    }
}