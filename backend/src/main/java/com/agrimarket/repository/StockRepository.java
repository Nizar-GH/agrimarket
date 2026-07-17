package com.agrimarket.repository;

import com.agrimarket.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    Optional<Stock> findByProduit_Id(Long produitId);
}
