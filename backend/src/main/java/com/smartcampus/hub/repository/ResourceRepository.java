package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
}