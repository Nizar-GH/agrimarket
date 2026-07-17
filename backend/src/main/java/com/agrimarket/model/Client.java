package com.agrimarket.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "client")
@Data
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nom;

    @Column(nullable = false, length = 150)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(length = 20)
    private String genre;

    @Column(length = 30)
    private String telephone;

    @Column(name = "adresse_livraison", columnDefinition = "TEXT")
    private String adresseLivraison;

    @Column(name = "image_profil", columnDefinition = "TEXT")
    private String imageProfil;

    @Column(name = "code_postal", length = 10)
    private String codePostal;

    @Column(length = 100)
    private String ville;

    @Column(name = "date_inscription")
    private LocalDateTime dateInscription;

    @Column(name = "est_actif")
    private Boolean estActif = true;

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
