package com.agrimarket.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "produit")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Produit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom_produit", nullable = false, length = 200)
    private String nomProduit;

    @Column(name = "description_produit", columnDefinition = "TEXT")
    private String descriptionProduit;

    @Column(length = 100)
    private String variete;

    @Column(name = "prix_unitaire", nullable = false, precision = 10, scale = 2)
    private BigDecimal prixUnitaire;

    @Column(name = "unite_mesure", length = 20)
    private String uniteMesure = "kg";

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_agriculteur", nullable = false)
    private Agriculteur agriculteur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categorie")
    private Categorie categorie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_saison")
    private Saison saison;

    @Column(name = "est_bio")
    private Boolean estBio = false;

    @Column(name = "est_local")
    private Boolean estLocal = true;

    @Column(name = "est_actif")
    private Boolean estActif = true;

    @Column(name = "est_nouveau")
    private Boolean estNouveau = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
