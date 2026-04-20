package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.ResourceRequestDto;
import com.smartcampus.hub.dto.ResourceResponseDto;
import com.smartcampus.hub.entity.Resource;
import com.smartcampus.hub.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

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
                                resource.getStatus());
        }
}