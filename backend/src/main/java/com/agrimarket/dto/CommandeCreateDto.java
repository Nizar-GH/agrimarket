package com.agrimarket.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CommandeCreateDto {

    private Long clientId;

    // Si pas de clientId, on crée le client à la volée
    private String clientNom;
    private String clientPrenom;
    private String clientEmail;
    private String clientTelephone;

    private String adresseLivraison;
    private String notes;

    private List<LigneDto> lignesCommande;

    @Data
    public static class LigneDto {
        private Long produitId;
        private Integer quantite;
        private BigDecimal prixUnitaire;
    }
}
