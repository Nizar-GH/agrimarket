package com.agrimarket.controller;

import com.agrimarket.model.Categorie;
import com.agrimarket.service.CategorieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategorieController {

    private final CategorieService categorieService;

    public CategorieController(CategorieService categorieService) {
        this.categorieService = categorieService;
    }

    @GetMapping
    public List<Categorie> getAllCategories() {
        return categorieService.getAllActiveCategories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categorie> getCategorieById(@PathVariable Long id) {
        return categorieService.getCategorieById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Categorie createCategorie(@RequestBody Categorie categorie) {
        return categorieService.saveCategorie(categorie);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categorie> updateCategorie(@PathVariable Long id, @RequestBody Categorie details) {
        return categorieService.updateCategorie(id, details)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategorie(@PathVariable Long id) {
        if (categorieService.deleteCategorie(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
