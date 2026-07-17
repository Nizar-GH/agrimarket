package com.agrimarket.repository;

import com.agrimarket.model.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {
    List<Produit> findByEstActifTrue();
    List<Produit> findByCategorie_Id(Long categorieId);
    List<Produit> findByAgriculteur_Id(Long agriculteurId);
    List<Produit> findByEstNouveauTrue();
}
