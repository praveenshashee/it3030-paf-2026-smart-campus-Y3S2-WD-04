package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.TicketRequestDto;
import com.smartcampus.hub.dto.TicketResponseDto;
import com.smartcampus.hub.dto.TicketStatusUpdateRequestDto;
import com.smartcampus.hub.entity.Resource;
import com.smartcampus.hub.entity.Ticket;
import com.smartcampus.hub.enums.TicketStatus;
import com.smartcampus.hub.repository.ResourceRepository;
import com.smartcampus.hub.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final ResourceRepository resourceRepository;

    public TicketService(TicketRepository ticketRepository, ResourceRepository resourceRepository) {
        this.ticketRepository = ticketRepository;
        this.resourceRepository = resourceRepository;
    }

    public List<TicketResponseDto> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    public TicketResponseDto getTicketById(Long id) {
        return ticketRepository.findById(id)
                .map(this::mapToResponseDto)
                .orElse(null);
    }

    public TicketResponseDto createTicket(TicketRequestDto requestDto) {
        Resource resource = null;

        if (requestDto.getResourceId() != null) {
            resource = resourceRepository.findById(requestDto.getResourceId()).orElse(null);
        }

        Ticket ticket = new Ticket();
        ticket.setResource(resource);
        ticket.setLocationText(requestDto.getLocationText());
        ticket.setCategory(requestDto.getCategory());
        ticket.setDescription(requestDto.getDescription());
        ticket.setPriority(requestDto.getPriority());
        ticket.setPreferredContact(requestDto.getPreferredContact());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());

        Ticket savedTicket = ticketRepository.save(ticket);
        return mapToResponseDto(savedTicket);
    }

    public TicketResponseDto updateTicketStatus(Long id, TicketStatusUpdateRequestDto requestDto) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);

        if (ticket == null) {
            return null;
        }

        ticket.setStatus(requestDto.getStatus());
        ticket.setAssignedTechnicianName(requestDto.getAssignedTechnicianName());
        ticket.setResolutionNotes(requestDto.getResolutionNotes());
        ticket.setRejectionReason(requestDto.getRejectionReason());

        Ticket updatedTicket = ticketRepository.save(ticket);
        return mapToResponseDto(updatedTicket);
    }

    private TicketResponseDto mapToResponseDto(Ticket ticket) {
        return new TicketResponseDto(
                ticket.getId(),
                ticket.getResource() != null ? ticket.getResource().getId() : null,
                ticket.getResource() != null ? ticket.getResource().getName() : null,
                ticket.getLocationText(),
                ticket.getCategory(),
                ticket.getDescription(),
                ticket.getPriority(),
                ticket.getPreferredContact(),
                ticket.getStatus(),
                ticket.getAssignedTechnicianName(),
                ticket.getResolutionNotes(),
                ticket.getRejectionReason(),
                ticket.getCreatedAt());
    }
}