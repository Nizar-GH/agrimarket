package com.agrimarket.controller;

import com.agrimarket.model.Client;
import com.agrimarket.repository.ClientRepository;
import com.agrimarket.service.ReCaptchaService;
import com.agrimarket.dto.ClientCreateWithCaptchaDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*")
public class ClientController {
    private static final Logger logger = LoggerFactory.getLogger(ClientController.class);

    private final ClientRepository clientRepository;
    private final ReCaptchaService reCaptchaService;

    public ClientController(ClientRepository clientRepository, ReCaptchaService reCaptchaService) {
        this.clientRepository = clientRepository;
        this.reCaptchaService = reCaptchaService;
    }

    @GetMapping
    public List<Client> getAllClients() {
        // Retourner tous les clients sans filtrer par estActif
        List<Client> clients = clientRepository.findAll();
        logger.info("GET /api/clients - Returned {} clients", clients.size());
        return clients;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        return clientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createClient(@RequestBody ClientCreateWithCaptchaDto clientDto) {
        logger.debug("POST /api/clients - Creating client with email: {}", clientDto.getEmail());
        
        // Valider le token reCAPTCHA
        if (clientDto.getRecaptchaToken() == null || clientDto.getRecaptchaToken().trim().isEmpty()) {
            logger.warn("POST /api/clients - Missing reCAPTCHA token");
            return ResponseEntity.badRequest().body(Map.of("message", "Token reCAPTCHA requis"));
        }

        if (!reCaptchaService.validateToken(clientDto.getRecaptchaToken())) {
            logger.warn("POST /api/clients - reCAPTCHA validation failed");
            return ResponseEntity.status(403).body(Map.of("message", "Validation reCAPTCHA échouée. Vous semblez être un robot."));
        }

        // Valider l'email
        if (clientDto.getEmail() == null || clientDto.getEmail().trim().isEmpty()) {
            logger.warn("POST /api/clients - Missing email");
            return ResponseEntity.badRequest().body(Map.of("message", "Email requis"));
        }

        String normalizedEmail = clientDto.getEmail().trim().toLowerCase();
        boolean emailExists = clientRepository.existsByEmailIgnoreCase(normalizedEmail);
        logger.debug("POST /api/clients - Email {} exists: {}", normalizedEmail, emailExists);
        
        if (emailExists) {
            logger.warn("POST /api/clients - Email {} already exists", normalizedEmail);
            return ResponseEntity.status(409).body(Map.of("message", "Email déjà utilisé"));
        }

        // Créer le client à partir du DTO
        Client client = new Client();
        client.setNom(clientDto.getNom());
        client.setPrenom(clientDto.getPrenom());
        client.setGenre(clientDto.getGenre());
        client.setEmail(normalizedEmail);
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

        try {
            Client created = clientRepository.save(client);
            logger.info("POST /api/clients - Client created successfully with id: {}", created.getId());
            return ResponseEntity.status(201).body(created);
        } catch (Exception e) {
            logger.error("POST /api/clients - Error creating client", e);
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de la création du client"));
        }
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
