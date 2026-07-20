package com.agrimarket.controller;

import com.agrimarket.dto.ProduitCreateDto;
import com.agrimarket.dto.ProduitResponseDto;
import com.agrimarket.dto.ProduitUpdateDto;
import com.agrimarket.model.Produit;
import com.agrimarket.service.ProduitService;
import com.agrimarket.service.FileStorageService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/produits")
@CrossOrigin(origins = "*")
public class ProduitController {

    private final ProduitService produitService;
    private final FileStorageService fileStorageService;

    public ProduitController(ProduitService produitService, FileStorageService fileStorageService) {
        this.produitService = produitService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public List<ProduitResponseDto> getAllProduits(@RequestParam(name = "actifsOnly", defaultValue = "true") boolean actifsOnly) {
        return produitService.getAllProduits(actifsOnly);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProduitResponseDto> getProduitById(@PathVariable Long id) {
        return produitService.getProduitById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ProduitResponseDto createProduit(@Valid @RequestBody ProduitCreateDto dto) {
        return produitService.createProduit(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProduitResponseDto> updateProduit(@PathVariable Long id, @Valid @RequestBody ProduitUpdateDto dto) {
        return produitService.updateProduit(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduit(@PathVariable Long id) {
        if (produitService.deleteProduit(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/upload-image")
    public ResponseEntity<Map<String, String>> uploadProductImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile file) {
        try {
            // Upload file
            String imageUrl = fileStorageService.uploadFile(file);
            
            // Update product with new image URL
            produitService.updateProductImage(id, imageUrl);
            
            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", imageUrl);
            response.put("message", "Image uploaded successfully");
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
