package com.agrimarket.dto;

import com.agrimarket.model.Stock;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StockResponseDto {

    private Long id;
    private Integer quantiteDisponible;
    private Integer seuilAlerte;
    private LocalDateTime dateMiseAJour;
    private ProduitInfo produit;

    @Data
    public static class ProduitInfo {
        private Long id;
        private String nomProduit;
        private String uniteMesure;
        private String imageUrl;
    }

    public static StockResponseDto from(Stock stock) {
        StockResponseDto dto = new StockResponseDto();
        dto.setId(stock.getId());
        dto.setQuantiteDisponible(stock.getQuantiteDisponible());
        dto.setSeuilAlerte(stock.getSeuilAlerte());
        dto.setDateMiseAJour(stock.getDateMiseAJour());

        if (stock.getProduit() != null) {
            ProduitInfo p = new ProduitInfo();
            p.setId(stock.getProduit().getId());
            p.setNomProduit(stock.getProduit().getNomProduit());
            p.setUniteMesure(stock.getProduit().getUniteMesure());
            p.setImageUrl(stock.getProduit().getImageUrl());
            dto.setProduit(p);
        }

        return dto;
    }
}
