package com.agrimarket.controller;

import com.agrimarket.dto.CommandeCreateDto;
import com.agrimarket.model.*;
import com.agrimarket.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/commandes")
@CrossOrigin(origins = "*")
public class CommandeController {

    private final CommandeRepository commandeRepository;
    private final ClientRepository clientRepository;
    private final ProduitRepository produitRepository;
    private final StockRepository stockRepository;

    public CommandeController(CommandeRepository commandeRepository,
                              ClientRepository clientRepository,
                              ProduitRepository produitRepository,
                              StockRepository stockRepository) {
        this.commandeRepository = commandeRepository;
        this.clientRepository = clientRepository;
        this.produitRepository = produitRepository;
        this.stockRepository = stockRepository;
    }

    @GetMapping
    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Commande> getCommandeById(@PathVariable Long id) {
        return commandeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createCommande(@RequestBody CommandeCreateDto dto) {
        // Vérifier les stocks avant de créer la commande
        for (CommandeCreateDto.LigneDto ligneDto : dto.getLignesCommande()) {
            var stockOpt = stockRepository.findByProduit_Id(ligneDto.getProduitId());
            if (stockOpt.isPresent()) {
                Stock stock = stockOpt.get();
                if (stock.getQuantiteDisponible() < ligneDto.getQuantite()) {
                    String nomProduit = stock.getProduit() != null ? stock.getProduit().getNomProduit() : "Produit #" + ligneDto.getProduitId();
                    return ResponseEntity.badRequest().body(
                            "Stock insuffisant pour " + nomProduit
                            + " (demandé: " + ligneDto.getQuantite()
                            + ", disponible: " + stock.getQuantiteDisponible() + ")"
                    );
                }
            }
        }

        // Résoudre ou créer le client
        Client client;
        if (dto.getClientId() != null) {
            client = clientRepository.findById(dto.getClientId()).orElse(null);
            if (client == null) return ResponseEntity.badRequest().body("Client introuvable");
        } else {
            if (dto.getClientNom() == null || dto.getClientEmail() == null)
                return ResponseEntity.badRequest().body("Nom et email du client requis");
            client = clientRepository.findAll().stream()
                    .filter(c -> c.getEmail().equalsIgnoreCase(dto.getClientEmail()))
                    .findFirst()
                    .orElseGet(() -> {
                        Client nouveau = new Client();
                        nouveau.setNom(dto.getClientNom());
                        nouveau.setPrenom(dto.getClientPrenom() != null ? dto.getClientPrenom() : "");
                        nouveau.setEmail(dto.getClientEmail());
                        nouveau.setTelephone(dto.getClientTelephone());
                        nouveau.setAdresseLivraison(dto.getAdresseLivraison());
                        return clientRepository.save(nouveau);
                    });
        }

        // Construire la commande
        Commande commande = new Commande();
        commande.setClient(client);
        commande.setAdresseLivraison(dto.getAdresseLivraison());
        commande.setNotes(dto.getNotes());
        commande.setNumeroCommande("CMD-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));

        BigDecimal total = BigDecimal.ZERO;
        for (CommandeCreateDto.LigneDto ligneDto : dto.getLignesCommande()) {
            Produit produit = produitRepository.findById(ligneDto.getProduitId()).orElse(null);
            if (produit == null) continue;
            LigneCommande ligne = new LigneCommande();
            ligne.setCommande(commande);
            ligne.setProduit(produit);
            ligne.setQuantite(ligneDto.getQuantite());
            ligne.setPrixUnitaireSnapshot(ligneDto.getPrixUnitaire());
            commande.getLignesCommande().add(ligne);
            total = total.add(ligneDto.getPrixUnitaire().multiply(BigDecimal.valueOf(ligneDto.getQuantite())));
        }
        commande.setTotal(total);

        Commande saved = commandeRepository.save(commande);

        // Décrémenter les stocks
        for (CommandeCreateDto.LigneDto ligneDto : dto.getLignesCommande()) {
            stockRepository.findByProduit_Id(ligneDto.getProduitId()).ifPresent(stock -> {
                stock.setQuantiteDisponible(stock.getQuantiteDisponible() - ligneDto.getQuantite());
                stockRepository.save(stock);
            });
        }

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<Commande> updateCommandeStatut(@PathVariable Long id, @RequestParam String statut) {
        return commandeRepository.findById(id)
                .map(commande -> {
                    commande.setStatut(Commande.StatutCommande.valueOf(statut));
                    return ResponseEntity.ok(commandeRepository.save(commande));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommande(@PathVariable Long id) {
        return commandeRepository.findById(id)
                .map(commande -> {
                    commandeRepository.delete(commande);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
