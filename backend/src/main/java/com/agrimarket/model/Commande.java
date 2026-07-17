package com.agrimarket.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "commande")
@Data
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_commande", nullable = false, unique = true, length = 20)
    private String numeroCommande;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_client", nullable = false)
    private Client client;

    @Column(name = "date_commande", nullable = false)
    private LocalDateTime dateCommande;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(50)")
    private StatutCommande statut = StatutCommande.EN_ATTENTE;

    @Column(precision = 10, scale = 2)
    private BigDecimal total = BigDecimal.ZERO;

    @Column(name = "adresse_livraison", columnDefinition = "TEXT")
    private String adresseLivraison;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LigneCommande> lignesCommande = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        dateCommande = LocalDateTime.now();
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum StatutCommande {
        EN_ATTENTE,
        CONFIRMEE,
        EN_PREPARATION,
        EXPEDIEE,
        LIVREE,
        ANNULEE
    }
}
