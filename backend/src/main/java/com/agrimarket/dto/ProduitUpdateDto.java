package com.agrimarket.dto;

import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProduitUpdateDto {
    private Long agriculteurId;
    private Long categorieId;
    private Long saisonId;

    private String nomProduit;
    private String descriptionProduit;
    private String variete;

    @Positive(message = "Le prix doit être positif")
    private BigDecimal prixUnitaire;
    private String uniteMesure;
    private String imageUrl;

    private Boolean estBio;
    private Boolean estLocal;
    private Boolean estActif;
    private Boolean estNouveau;
}
