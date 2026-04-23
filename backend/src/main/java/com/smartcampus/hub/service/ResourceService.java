package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.ResourceRequestDto;
import com.smartcampus.hub.dto.ResourceResponseDto;
import com.smartcampus.hub.entity.Resource;
import com.smartcampus.hub.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
public class ResourceService {

        public static final LocalTime DEFAULT_AVAILABLE_FROM_TIME = LocalTime.of(8, 0);
        public static final LocalTime DEFAULT_AVAILABLE_TO_TIME = LocalTime.of(18, 0);

        private final ResourceRepository resourceRepository;

        // Spring injects the repository here so the service can talk to the database.
        public ResourceService(ResourceRepository resourceRepository) {
                this.resourceRepository = resourceRepository;
        }

        public List<ResourceResponseDto> getAllResources() {
                return resourceRepository.findAll()
                                .stream()
                                .map(this::mapToResponseDto)
                                .toList();
        }

        public ResourceResponseDto getResourceById(Long id) {
                return resourceRepository.findById(id)
                                .map(this::mapToResponseDto)
                                .orElse(null);
        }

        public ResourceResponseDto createResource(ResourceRequestDto requestDto) {
                Resource resource = new Resource();
                resource.setName(requestDto.getName());
                resource.setType(requestDto.getType());
                resource.setCapacity(requestDto.getCapacity());
                resource.setLocation(requestDto.getLocation());
                resource.setAvailableFromTime(resolveAvailableFromTime(requestDto.getAvailableFromTime()));
                resource.setAvailableToTime(resolveAvailableToTime(requestDto.getAvailableToTime()));
                resource.setStatus(requestDto.getStatus());

                Resource savedResource = resourceRepository.save(resource);
                return mapToResponseDto(savedResource);
        }

        public ResourceResponseDto updateResource(Long id, ResourceRequestDto requestDto) {
                Resource existingResource = resourceRepository.findById(id).orElse(null);

                if (existingResource == null) {
                        return null;
                }

                existingResource.setName(requestDto.getName());
                existingResource.setType(requestDto.getType());
                existingResource.setCapacity(requestDto.getCapacity());
                existingResource.setLocation(requestDto.getLocation());
                existingResource.setAvailableFromTime(resolveAvailableFromTime(requestDto.getAvailableFromTime()));
                existingResource.setAvailableToTime(resolveAvailableToTime(requestDto.getAvailableToTime()));
                existingResource.setStatus(requestDto.getStatus());

                Resource updatedResource = resourceRepository.save(existingResource);
                return mapToResponseDto(updatedResource);
        }

        public boolean deleteResource(Long id) {
                Resource existingResource = resourceRepository.findById(id).orElse(null);

                if (existingResource == null) {
                        return false;
                }

                resourceRepository.delete(existingResource);
                return true;
        }

        private ResourceResponseDto mapToResponseDto(Resource resource) {
                return new ResourceResponseDto(
                                resource.getId(),
                                resource.getName(),
                                resource.getType(),
                                resource.getCapacity(),
                                resource.getLocation(),
                                resolveAvailableFromTime(resource.getAvailableFromTime()),
                                resolveAvailableToTime(resource.getAvailableToTime()),
                                resource.getStatus());
        }

        private LocalTime resolveAvailableFromTime(LocalTime availableFromTime) {
                return availableFromTime != null ? availableFromTime : DEFAULT_AVAILABLE_FROM_TIME;
        }

        private LocalTime resolveAvailableToTime(LocalTime availableToTime) {
                return availableToTime != null ? availableToTime : DEFAULT_AVAILABLE_TO_TIME;
        }
}
