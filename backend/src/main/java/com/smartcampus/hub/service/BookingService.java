package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.BookingRequestDto;
import com.smartcampus.hub.dto.BookingResponseDto;
import com.smartcampus.hub.entity.Booking;
import com.smartcampus.hub.entity.Resource;
import com.smartcampus.hub.enums.BookingStatus;
import com.smartcampus.hub.enums.NotificationType;
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

    public BookingService(
            BookingRepository bookingRepository,
            ResourceRepository resourceRepository,
            NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
        this.notificationService = notificationService;
    }

    public List<BookingResponseDto> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    public BookingResponseDto getBookingById(Long id) {
        return bookingRepository.findById(id)
                .map(this::mapToResponseDto)
                .orElse(null);
    }

    public BookingResponseDto createBooking(BookingRequestDto requestDto) {
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
        booking.setResource(resource);
        booking.setBookingDate(requestDto.getBookingDate());
        booking.setStartTime(requestDto.getStartTime());
        booking.setEndTime(requestDto.getEndTime());
        booking.setPurpose(requestDto.getPurpose());
        booking.setExpectedAttendees(requestDto.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        notificationService.createNotification(
                NotificationType.BOOKING,
                "New booking request created",
                "A booking request was created for resource: " + resource.getName());

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
                NotificationType.BOOKING,
                "Booking approved",
                "Booking #" + booking.getId() + " has been approved.");

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
                NotificationType.BOOKING,
                "Booking rejected",
                "Booking #" + booking.getId() + " has been rejected.");

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
                NotificationType.BOOKING,
                "Booking cancelled",
                "Booking #" + booking.getId() + " has been cancelled.");

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
        return new BookingResponseDto(
                booking.getId(),
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
}