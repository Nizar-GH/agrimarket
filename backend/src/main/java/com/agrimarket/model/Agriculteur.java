package com.agrimarket.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "agriculteur")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Agriculteur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nom;

    @Column(nullable = false, length = 150)
    private String prenom;

    @Column(name = "nom_exploitation", length = 200)
    private String nomExploitation;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(length = 30)
    private String telephone;

    @Column(columnDefinition = "TEXT")
    private String adresse;

    @Column(name = "code_postal", length = 10)
    private String codePostal;

    @Column(length = 100)
    private String ville;

    @Column(unique = true, length = 14)
    private String siret;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "photo_url", columnDefinition = "TEXT")
    private String photoUrl;

    @Column(name = "note_moyenne", precision = 3, scale = 2)
    private BigDecimal noteMoyenne = BigDecimal.ZERO;

    @Column(name = "est_verifie")
    private Boolean estVerifie = false;

    @Column(name = "est_actif")
    private Boolean estActif = true;

    @Column(name = "date_inscription")
    private LocalDateTime dateInscription;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        dateInscription = LocalDateTime.now();
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
