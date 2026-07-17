package com.agrimarket.controller;

import com.agrimarket.model.Client;
import com.agrimarket.repository.ClientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*")
public class ClientController {

    private final ClientRepository clientRepository;

    public ClientController(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
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
    public ResponseEntity<?> createClient(@RequestBody Client client) {
        if (client.getEmail() == null || client.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email requis");
        }

        if (clientRepository.existsByEmailIgnoreCase(client.getEmail().trim())) {
            return ResponseEntity.status(409).body("Email déjà utilisé");
        }

        client.setEmail(client.getEmail().trim().toLowerCase());
        if (client.getEstActif() == null) {
            client.setEstActif(true);
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
