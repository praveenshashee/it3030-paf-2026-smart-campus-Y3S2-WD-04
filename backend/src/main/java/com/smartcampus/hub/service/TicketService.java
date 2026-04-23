package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.TicketRequestDto;
import com.smartcampus.hub.dto.TicketResponseDto;
import com.smartcampus.hub.dto.TicketStatusUpdateRequestDto;
import com.smartcampus.hub.entity.Resource;
import com.smartcampus.hub.entity.Ticket;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.enums.NotificationType;
import com.smartcampus.hub.enums.Role;
import com.smartcampus.hub.enums.TicketStatus;
import com.smartcampus.hub.exception.ApiException;
import com.smartcampus.hub.repository.ResourceRepository;
import com.smartcampus.hub.repository.TicketRepository;
import com.smartcampus.hub.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final CurrentUserService currentUserService;

    public TicketService(
            TicketRepository ticketRepository,
            ResourceRepository resourceRepository,
            UserRepository userRepository,
            NotificationService notificationService,
            CurrentUserService currentUserService) {
        this.ticketRepository = ticketRepository;
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.currentUserService = currentUserService;
    }

    public List<TicketResponseDto> getAllTickets() {
        User currentUser = currentUserService.getCurrentUser();

        if (currentUser == null) {
            return List.of();
        }

        List<Ticket> tickets;

        if (currentUser.getRole() == Role.ADMIN) {
            tickets = ticketRepository.findAll();
        } else if (currentUser.getRole() == Role.TECHNICIAN) {
            tickets = ticketRepository.findByAssignedTechnician(currentUser);
        } else {
            tickets = ticketRepository.findByCreatedBy(currentUser);
        }

        return tickets
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    public TicketResponseDto getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);

        if (ticket == null || !canCurrentUserView(ticket)) {
            return null;
        }

        return mapToResponseDto(ticket);
    }

    public TicketResponseDto createTicket(TicketRequestDto requestDto) {
        User currentUser = currentUserService.getCurrentUser();

        if (currentUser == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "You must be logged in to create a ticket.");
        }

        Resource resource = null;

        if (requestDto.getResourceId() != null) {
            resource = resourceRepository.findById(requestDto.getResourceId()).orElse(null);

            if (resource == null) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Selected resource does not exist.");
            }
        }

        Ticket ticket = new Ticket();
        ticket.setCreatedBy(currentUser);
        ticket.setResource(resource);
        ticket.setLocationText(requestDto.getLocationText());
        ticket.setCategory(requestDto.getCategory());
        ticket.setDescription(requestDto.getDescription());
        ticket.setPriority(requestDto.getPriority());
        ticket.setPreferredContact(requestDto.getPreferredContact());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());

        Ticket savedTicket = ticketRepository.save(ticket);

        notificationService.notifyAdmins(
                NotificationType.TICKET,
                "New ticket created",
                currentUser.getFullName() + " created a ticket for category: " + savedTicket.getCategory());

        return mapToResponseDto(savedTicket);
    }

    public TicketResponseDto updateTicketStatus(Long id, TicketStatusUpdateRequestDto requestDto) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);

        if (ticket == null) {
            return null;
        }

        User currentUser = currentUserService.getCurrentUser();

        if (currentUser == null || !canCurrentUserManage(ticket)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You are not allowed to update this ticket.");
        }

        User assignedTechnician = null;

        if (requestDto.getAssignedTechnicianId() != null) {
            assignedTechnician = userRepository.findById(requestDto.getAssignedTechnicianId()).orElse(null);

            if (assignedTechnician == null || assignedTechnician.getRole() != Role.TECHNICIAN) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Selected assignee is not a technician.");
            }
        }

        ticket.setStatus(requestDto.getStatus());
        ticket.setAssignedTechnician(assignedTechnician);
        ticket.setAssignedTechnicianName(resolveTechnicianName(assignedTechnician, requestDto.getAssignedTechnicianName()));
        ticket.setResolutionNotes(requestDto.getResolutionNotes());
        ticket.setRejectionReason(requestDto.getRejectionReason());

        Ticket updatedTicket = ticketRepository.save(ticket);

        notificationService.createNotification(
                ticket.getCreatedBy(),
                NotificationType.TICKET,
                "Ticket status updated",
                "Your ticket #" + ticket.getId() + " status changed to " + ticket.getStatus());

        if (assignedTechnician != null && currentUser.getRole() == Role.ADMIN) {
            notificationService.createNotification(
                    assignedTechnician,
                    NotificationType.TICKET,
                    "Ticket assigned",
                    "Ticket #" + ticket.getId() + " has been assigned to you.");
        }

        return mapToResponseDto(updatedTicket);
    }

    private TicketResponseDto mapToResponseDto(Ticket ticket) {
        User createdBy = ticket.getCreatedBy();
        User assignedTechnician = ticket.getAssignedTechnician();

        return new TicketResponseDto(
                ticket.getId(),
                createdBy != null ? createdBy.getId() : null,
                createdBy != null ? createdBy.getFullName() : null,
                createdBy != null ? createdBy.getEmail() : null,
                ticket.getResource() != null ? ticket.getResource().getId() : null,
                ticket.getResource() != null ? ticket.getResource().getName() : null,
                ticket.getLocationText(),
                ticket.getCategory(),
                ticket.getDescription(),
                ticket.getPriority(),
                ticket.getPreferredContact(),
                ticket.getStatus(),
                assignedTechnician != null ? assignedTechnician.getId() : null,
                ticket.getAssignedTechnicianName(),
                ticket.getResolutionNotes(),
                ticket.getRejectionReason(),
                ticket.getCreatedAt());
    }

    private boolean canCurrentUserView(Ticket ticket) {
        User currentUser = currentUserService.getCurrentUser();

        if (currentUser == null) {
            return false;
        }

        if (currentUser.getRole() == Role.ADMIN) {
            return true;
        }

        User createdBy = ticket.getCreatedBy();
        User assignedTechnician = ticket.getAssignedTechnician();

        return (createdBy != null && createdBy.getId().equals(currentUser.getId()))
                || (assignedTechnician != null && assignedTechnician.getId().equals(currentUser.getId()));
    }

    private boolean canCurrentUserManage(Ticket ticket) {
        User currentUser = currentUserService.getCurrentUser();

        if (currentUser == null) {
            return false;
        }

        if (currentUser.getRole() == Role.ADMIN) {
            return true;
        }

        User assignedTechnician = ticket.getAssignedTechnician();
        return currentUser.getRole() == Role.TECHNICIAN
                && assignedTechnician != null
                && assignedTechnician.getId().equals(currentUser.getId());
    }

    private String resolveTechnicianName(User assignedTechnician, String fallbackName) {
        if (assignedTechnician != null) {
            return assignedTechnician.getFullName() != null
                    ? assignedTechnician.getFullName()
                    : assignedTechnician.getEmail();
        }

        return fallbackName;
    }
}
