package com.agrimarket.dto;

import lombok.Data;

@Data
public class StockUpsertDto {
    private Integer quantiteDisponible;
    private Integer seuilAlerte;
}