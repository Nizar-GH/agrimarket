package com.agrimarket.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock")
@Data
public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_produit", nullable = false, unique = true)
    private Produit produit;

    @Column(name = "quantite_disponible", nullable = false)
    private Integer quantiteDisponible = 0;

    @Column(name = "seuil_alerte")
    private Integer seuilAlerte = 10;

    @Column(name = "date_mise_a_jour")
    private LocalDateTime dateMiseAJour;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        dateMiseAJour = LocalDateTime.now();
    }
}
