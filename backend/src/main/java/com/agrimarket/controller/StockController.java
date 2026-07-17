package com.agrimarket.controller;

import com.agrimarket.dto.StockUpsertDto;
import com.agrimarket.dto.StockResponseDto;
import com.agrimarket.model.Produit;
import com.agrimarket.model.Stock;
import com.agrimarket.repository.ProduitRepository;
import com.agrimarket.repository.StockRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "*")
public class StockController {

    private final StockRepository stockRepository;
    private final ProduitRepository produitRepository;

    public StockController(StockRepository stockRepository, ProduitRepository produitRepository) {
        this.stockRepository = stockRepository;
        this.produitRepository = produitRepository;
    }

    @GetMapping
    public List<StockResponseDto> getAllStocks() {
        return stockRepository.findAll().stream()
                .map(StockResponseDto::from)
                .toList();
    }

    @GetMapping("/produit/{produitId}")
    public ResponseEntity<StockResponseDto> getStockByProduitId(@PathVariable Long produitId) {
        return stockRepository.findByProduit_Id(produitId)
                .map(StockResponseDto::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/reapprovisionner")
    public ResponseEntity<StockResponseDto> reapprovisionnerStock(@PathVariable Long id, @RequestParam Integer quantite) {
        return stockRepository.findById(id)
                .map(stock -> {
                    stock.setQuantiteDisponible(stock.getQuantiteDisponible() + quantite);
                    return ResponseEntity.ok(StockResponseDto.from(stockRepository.save(stock)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<StockResponseDto> updateStock(@PathVariable Long id, @RequestBody Stock stockDetails) {
        return stockRepository.findById(id)
                .map(stock -> {
                    stock.setQuantiteDisponible(stockDetails.getQuantiteDisponible());
                    stock.setSeuilAlerte(stockDetails.getSeuilAlerte());
                    return ResponseEntity.ok(StockResponseDto.from(stockRepository.save(stock)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/produit/{produitId}")
    public ResponseEntity<StockResponseDto> upsertStockByProduitId(@PathVariable Long produitId, @RequestBody StockUpsertDto dto) {
        Produit produit = produitRepository.findById(produitId)
                .orElse(null);
        if (produit == null) {
            return ResponseEntity.notFound().build();
        }

        Stock stock = stockRepository.findByProduit_Id(produitId).orElseGet(Stock::new);
        stock.setProduit(produit);
        if (dto.getQuantiteDisponible() != null) {
            stock.setQuantiteDisponible(dto.getQuantiteDisponible());
        }
        if (dto.getSeuilAlerte() != null) {
            stock.setSeuilAlerte(dto.getSeuilAlerte());
        }

        return ResponseEntity.ok(StockResponseDto.from(stockRepository.save(stock)));
    }
}
