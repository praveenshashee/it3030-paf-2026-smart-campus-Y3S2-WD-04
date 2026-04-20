package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.BookingRequestDto;
import com.smartcampus.hub.dto.BookingResponseDto;
import com.smartcampus.hub.entity.Booking;
import com.smartcampus.hub.entity.Resource;
import com.smartcampus.hub.enums.BookingStatus;
import com.smartcampus.hub.repository.BookingRepository;
import com.smartcampus.hub.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;

    public BookingService(BookingRepository bookingRepository, ResourceRepository resourceRepository) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
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
        return mapToResponseDto(savedBooking);
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