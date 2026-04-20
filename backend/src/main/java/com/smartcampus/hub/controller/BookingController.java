package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.BookingRequestDto;
import com.smartcampus.hub.dto.BookingResponseDto;
import com.smartcampus.hub.dto.BookingStatusUpdateRequestDto;
import com.smartcampus.hub.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<List<BookingResponseDto>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDto> getBookingById(@PathVariable Long id) {
        BookingResponseDto booking = bookingService.getBookingById(id);

        if (booking == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(booking);
    }

    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(@Valid @RequestBody BookingRequestDto requestDto) {
        BookingResponseDto createdBooking = bookingService.createBooking(requestDto);

        if (createdBooking == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(createdBooking);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<BookingResponseDto> approveBooking(@PathVariable Long id) {
        BookingResponseDto updatedBooking = bookingService.approveBooking(id);

        if (updatedBooking == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedBooking);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<BookingResponseDto> rejectBooking(
            @PathVariable Long id,
            @RequestBody BookingStatusUpdateRequestDto requestDto) {
        BookingResponseDto updatedBooking = bookingService.rejectBooking(id, requestDto.getReason());

        if (updatedBooking == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedBooking);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponseDto> cancelBooking(
            @PathVariable Long id,
            @RequestBody BookingStatusUpdateRequestDto requestDto) {
        BookingResponseDto updatedBooking = bookingService.cancelBooking(id, requestDto.getReason());

        if (updatedBooking == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedBooking);
    }
}