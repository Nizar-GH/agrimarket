package com.agrimarket.dto;

import com.agrimarket.model.Produit;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProduitResponseDto {
    private Long id;
    private String nomProduit;
    private String descriptionProduit;
    private String variete;
    private BigDecimal prixUnitaire;
    private String uniteMesure;
    private String imageUrl;
    private Boolean estBio;
    private Boolean estLocal;
    private Boolean estActif;
    private Boolean estNouveau;

    private CategorieInfo categorie;
    private AgriculteurInfo agriculteur;
    private SaisonInfo saison;

    @Data
    public static class CategorieInfo {
        private Long id;
        private String libelle;
        private String description;
        private String imageUrl;
    }

    @Data
    public static class AgriculteurInfo {
        private Long id;
        private String nom;
        private String prenom;
        private String nomExploitation;
        private String ville;
    }

    @Data
    public static class SaisonInfo {
        private Long id;
        private String nomSaison;
    }

    public static ProduitResponseDto from(Produit p) {
        ProduitResponseDto dto = new ProduitResponseDto();
        dto.setId(p.getId());
        dto.setNomProduit(p.getNomProduit());
        dto.setDescriptionProduit(p.getDescriptionProduit());
        dto.setVariete(p.getVariete());
        dto.setPrixUnitaire(p.getPrixUnitaire());
        dto.setUniteMesure(p.getUniteMesure());
        dto.setImageUrl(p.getImageUrl());
        dto.setEstBio(p.getEstBio());
        dto.setEstLocal(p.getEstLocal());
        dto.setEstActif(p.getEstActif());
        dto.setEstNouveau(p.getEstNouveau());

        if (p.getCategorie() != null) {
            CategorieInfo cat = new CategorieInfo();
            cat.setId(p.getCategorie().getId());
            cat.setLibelle(p.getCategorie().getLibelle());
            cat.setDescription(p.getCategorie().getDescription());
            cat.setImageUrl(p.getCategorie().getImageUrl());
            dto.setCategorie(cat);
        }

        if (p.getAgriculteur() != null) {
            AgriculteurInfo ag = new AgriculteurInfo();
            ag.setId(p.getAgriculteur().getId());
            ag.setNom(p.getAgriculteur().getNom());
            ag.setPrenom(p.getAgriculteur().getPrenom());
            ag.setNomExploitation(p.getAgriculteur().getNomExploitation());
            ag.setVille(p.getAgriculteur().getVille());
            dto.setAgriculteur(ag);
        }

        if (p.getSaison() != null) {
            SaisonInfo s = new SaisonInfo();
            s.setId(p.getSaison().getId());
            s.setNomSaison(p.getSaison().getNomSaison());
            dto.setSaison(s);
        }

        return dto;
    }
}
