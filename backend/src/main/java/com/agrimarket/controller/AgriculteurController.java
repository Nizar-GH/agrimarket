package com.agrimarket.controller;

import com.agrimarket.model.Agriculteur;
import com.agrimarket.repository.AgriculteurRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agriculteurs")
@CrossOrigin(origins = "*")
public class AgriculteurController {

    private final AgriculteurRepository agriculteurRepository;

    public AgriculteurController(AgriculteurRepository agriculteurRepository) {
        this.agriculteurRepository = agriculteurRepository;
    }

    @GetMapping
    public List<Agriculteur> getAllAgriculteurs() {
        return agriculteurRepository.findByEstActifTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Agriculteur> getAgriculteurById(@PathVariable Long id) {
        return agriculteurRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Agriculteur createAgriculteur(@RequestBody Agriculteur agriculteur) {
        return agriculteurRepository.save(agriculteur);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Agriculteur> updateAgriculteur(@PathVariable Long id, @RequestBody Agriculteur agriculteurDetails) {
        return agriculteurRepository.findById(id)
                .map(agriculteur -> {
                    agriculteur.setNom(agriculteurDetails.getNom());
                    agriculteur.setPrenom(agriculteurDetails.getPrenom());
                    agriculteur.setNomExploitation(agriculteurDetails.getNomExploitation());
                    agriculteur.setEmail(agriculteurDetails.getEmail());
                    agriculteur.setTelephone(agriculteurDetails.getTelephone());
                    agriculteur.setAdresse(agriculteurDetails.getAdresse());
                    agriculteur.setCodePostal(agriculteurDetails.getCodePostal());
                    agriculteur.setVille(agriculteurDetails.getVille());
                    agriculteur.setSiret(agriculteurDetails.getSiret());
                    agriculteur.setDescription(agriculteurDetails.getDescription());
                    agriculteur.setEstActif(agriculteurDetails.getEstActif());
                    return ResponseEntity.ok(agriculteurRepository.save(agriculteur));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAgriculteur(@PathVariable Long id) {
        return agriculteurRepository.findById(id)
                .map(agriculteur -> {
                    agriculteur.setEstActif(false);
                    agriculteurRepository.save(agriculteur);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
