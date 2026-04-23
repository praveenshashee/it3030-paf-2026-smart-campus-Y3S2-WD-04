package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.BookingRequestDto;
import com.smartcampus.hub.dto.BookingResponseDto;
import com.smartcampus.hub.entity.Booking;
import com.smartcampus.hub.entity.Resource;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.enums.BookingStatus;
import com.smartcampus.hub.enums.NotificationType;
import com.smartcampus.hub.enums.Role;
import com.smartcampus.hub.repository.BookingRepository;
import com.smartcampus.hub.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;
    private final CurrentUserService currentUserService;

    public BookingService(
            BookingRepository bookingRepository,
            ResourceRepository resourceRepository,
            NotificationService notificationService,
            CurrentUserService currentUserService) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
        this.notificationService = notificationService;
        this.currentUserService = currentUserService;
    }

    public List<BookingResponseDto> getAllBookings() {
        User currentUser = currentUserService.getCurrentUser();

        if (currentUser == null) {
            return List.of();
        }

        List<Booking> bookings = currentUser.getRole() == Role.ADMIN
                ? bookingRepository.findAll()
                : bookingRepository.findByCreatedBy(currentUser);

        return bookings
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    public BookingResponseDto getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking == null || !canCurrentUserView(booking)) {
            return null;
        }

        return mapToResponseDto(booking);
    }

    public BookingResponseDto createBooking(BookingRequestDto requestDto) {
        User currentUser = currentUserService.getCurrentUser();

        if (currentUser == null) {
            return null;
        }

        Resource resource = resourceRepository.findById(requestDto.getResourceId()).orElse(null);

        if (resource == null) {
            return null;
        }

        // Basic validation: booking must end after it starts.
        if (!requestDto.getEndTime().isAfter(requestDto.getStartTime())) {
            return null;
        }

        // Prevent overlapping bookings for the same resource on the same date.
        boolean hasConflict = hasBookingConflict(
                resource,
                requestDto.getBookingDate(),
                requestDto.getStartTime(),
                requestDto.getEndTime());

        if (hasConflict) {
            return null;
        }

        Booking booking = new Booking();
        booking.setCreatedBy(currentUser);
        booking.setResource(resource);
        booking.setBookingDate(requestDto.getBookingDate());
        booking.setStartTime(requestDto.getStartTime());
        booking.setEndTime(requestDto.getEndTime());
        booking.setPurpose(requestDto.getPurpose());
        booking.setExpectedAttendees(requestDto.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        notificationService.notifyAdmins(
                NotificationType.BOOKING,
                "New booking request created",
                currentUser.getFullName() + " requested a booking for resource: " + resource.getName());

        return mapToResponseDto(savedBooking);
    }

    public BookingResponseDto approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking == null) {
            return null;
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setAdminReason(null);

        Booking updatedBooking = bookingRepository.save(booking);

        notificationService.createNotification(
                booking.getCreatedBy(),
                NotificationType.BOOKING,
                "Booking approved",
                "Your booking #" + booking.getId() + " has been approved.");

        return mapToResponseDto(updatedBooking);
    }

    public BookingResponseDto rejectBooking(Long id, String reason) {
        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking == null) {
            return null;
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setAdminReason(reason);

        Booking updatedBooking = bookingRepository.save(booking);

        notificationService.createNotification(
                booking.getCreatedBy(),
                NotificationType.BOOKING,
                "Booking rejected",
                "Your booking #" + booking.getId() + " has been rejected.");

        return mapToResponseDto(updatedBooking);
    }

    public BookingResponseDto cancelBooking(Long id, String reason) {
        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking == null) {
            return null;
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setAdminReason(reason);

        Booking updatedBooking = bookingRepository.save(booking);

        notificationService.createNotification(
                booking.getCreatedBy(),
                NotificationType.BOOKING,
                "Booking cancelled",
                "Your booking #" + booking.getId() + " has been cancelled.");

        return mapToResponseDto(updatedBooking);
    }

    private boolean hasBookingConflict(
            Resource resource,
            java.time.LocalDate bookingDate,
            java.time.LocalTime newStartTime,
            java.time.LocalTime newEndTime) {
        List<Booking> existingBookings = bookingRepository.findByResourceAndBookingDate(resource, bookingDate);

        return existingBookings.stream()
                .filter(booking -> booking.getStatus() != BookingStatus.REJECTED &&
                        booking.getStatus() != BookingStatus.CANCELLED)
                .anyMatch(booking -> newStartTime.isBefore(booking.getEndTime()) &&
                        newEndTime.isAfter(booking.getStartTime()));
    }

    private BookingResponseDto mapToResponseDto(Booking booking) {
        User createdBy = booking.getCreatedBy();

        return new BookingResponseDto(
                booking.getId(),
                createdBy != null ? createdBy.getId() : null,
                createdBy != null ? createdBy.getFullName() : null,
                createdBy != null ? createdBy.getEmail() : null,
                booking.getResource().getId(),
                booking.getResource().getName(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getPurpose(),
                booking.getExpectedAttendees(),
                booking.getStatus(),
                booking.getAdminReason(),
                booking.getCreatedAt());
    }

    private boolean canCurrentUserView(Booking booking) {
        User currentUser = currentUserService.getCurrentUser();

        if (currentUser == null) {
            return false;
        }

        if (currentUser.getRole() == Role.ADMIN) {
            return true;
        }

        User createdBy = booking.getCreatedBy();
        return createdBy != null && createdBy.getId().equals(currentUser.getId());
    }
}
