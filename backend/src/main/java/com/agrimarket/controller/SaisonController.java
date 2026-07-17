package com.agrimarket.controller;

import com.agrimarket.model.Saison;
import com.agrimarket.repository.SaisonRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saisons")
@CrossOrigin(origins = "*")
public class SaisonController {

    private final SaisonRepository saisonRepository;

    public SaisonController(SaisonRepository saisonRepository) {
        this.saisonRepository = saisonRepository;
    }

    @GetMapping
    public List<Saison> getAllSaisons() {
        return saisonRepository.findByEstActifTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Saison> getSaisonById(@PathVariable Long id) {
        return saisonRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Saison createSaison(@RequestBody Saison saison) {
        return saisonRepository.save(saison);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Saison> updateSaison(@PathVariable Long id, @RequestBody Saison saisonDetails) {
        return saisonRepository.findById(id)
                .map(saison -> {
                    saison.setNomSaison(saisonDetails.getNomSaison());
                    saison.setDateDebut(saisonDetails.getDateDebut());
                    saison.setDateFin(saisonDetails.getDateFin());
                    saison.setDescription(saisonDetails.getDescription());
                    saison.setIcone(saisonDetails.getIcone());
                    return ResponseEntity.ok(saisonRepository.save(saison));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSaison(@PathVariable Long id) {
        return saisonRepository.findById(id)
                .map(saison -> {
                    saison.setEstActif(false);
                    saisonRepository.save(saison);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
