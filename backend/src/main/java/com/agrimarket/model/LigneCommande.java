package com.agrimarket.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ligne_commande")
@Data
public class LigneCommande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_commande", nullable = false)
    @JsonIgnore
    private Commande commande;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_produit", nullable = false)
    private Produit produit;

    @Column(nullable = false)
    private Integer quantite;

    @Column(name = "prix_unitaire_snapshot", nullable = false, precision = 10, scale = 2)
    private BigDecimal prixUnitaireSnapshot;

    @Column(name = "prix_ligne", precision = 10, scale = 2, insertable = false, updatable = false)
    private BigDecimal prixLigne;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
