package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.Booking;
import com.smartcampus.hub.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByResourceAndBookingDate(Resource resource, LocalDate bookingDate);

    List<Booking> findByResourceAndBookingDateAndIdNot(
            Resource resource,
            LocalDate bookingDate,
            Long id);
}