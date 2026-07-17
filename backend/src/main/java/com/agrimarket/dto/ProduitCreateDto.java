package com.agrimarket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProduitCreateDto {

    @NotNull(message = "L'agriculteur est requis")
    private Long agriculteurId;

    private Long categorieId;

    private Long saisonId;

    @NotBlank(message = "Le nom du produit est requis")
    private String nomProduit;

    private String descriptionProduit;

    private String variete;

    @NotNull(message = "Le prix unitaire est requis")
    @Positive(message = "Le prix doit être positif")
    private BigDecimal prixUnitaire;

    private String uniteMesure;

    private String imageUrl;

    private Boolean estBio;
    private Boolean estLocal;
    private Boolean estActif;
    private Boolean estNouveau;
}
