package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
}