package com.agrimarket.controller;

import com.agrimarket.model.Client;
import com.agrimarket.repository.ClientRepository;
import com.agrimarket.service.ReCaptchaService;
import com.agrimarket.dto.ClientCreateWithCaptchaDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*")
public class ClientController {

    private final ClientRepository clientRepository;
    private final ReCaptchaService reCaptchaService;

    public ClientController(ClientRepository clientRepository, ReCaptchaService reCaptchaService) {
        this.clientRepository = clientRepository;
        this.reCaptchaService = reCaptchaService;
    }

    @GetMapping
    public List<Client> getAllClients() {
        return clientRepository.findByEstActifTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        return clientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createClient(@RequestBody ClientCreateWithCaptchaDto clientDto) {
        // Valider le token reCAPTCHA
        if (clientDto.getRecaptchaToken() == null || clientDto.getRecaptchaToken().trim().isEmpty()) {
            return ResponseEntity.status(400).body("Token reCAPTCHA requis");
        }

        if (!reCaptchaService.validateToken(clientDto.getRecaptchaToken())) {
            return ResponseEntity.status(403).body("Validation reCAPTCHA échouée. Vous semblez être un robot.");
        }

        // Valider l'email
        if (clientDto.getEmail() == null || clientDto.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email requis");
        }

        if (clientRepository.existsByEmailIgnoreCase(clientDto.getEmail().trim())) {
            return ResponseEntity.status(409).body("Email déjà utilisé");
        }

        // Créer le client à partir du DTO
        Client client = new Client();
        client.setNom(clientDto.getNom());
        client.setPrenom(clientDto.getPrenom());
        client.setGenre(clientDto.getGenre());
        client.setEmail(clientDto.getEmail().trim().toLowerCase());
        client.setTelephone(clientDto.getTelephone());
        client.setAdresseLivraison(clientDto.getAdresseLivraison());
        client.setCodePostal(clientDto.getCodePostal());
        client.setVille(clientDto.getVille());
        client.setImageProfil(clientDto.getImageProfil());
        
        if (clientDto.getEstActif() == null) {
            client.setEstActif(true);
        } else {
            client.setEstActif(clientDto.getEstActif());
        }

        Client created = clientRepository.save(client);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @RequestBody Client clientDetails) {
        return clientRepository.findById(id)
                .map(client -> {
                    client.setNom(clientDetails.getNom());
                    client.setPrenom(clientDetails.getPrenom());
                    client.setGenre(clientDetails.getGenre());
                    client.setEmail(clientDetails.getEmail());
                    client.setTelephone(clientDetails.getTelephone());
                    client.setAdresseLivraison(clientDetails.getAdresseLivraison());
                    client.setImageProfil(clientDetails.getImageProfil());
                    client.setCodePostal(clientDetails.getCodePostal());
                    client.setVille(clientDetails.getVille());
                    client.setEstActif(clientDetails.getEstActif());
                    return ResponseEntity.ok(clientRepository.save(client));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        return clientRepository.findById(id)
                .map(client -> {
                    client.setEstActif(false);
                    clientRepository.save(client);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
