package com.agrimarket.repository;

import com.agrimarket.model.Saison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SaisonRepository extends JpaRepository<Saison, Long> {
    List<Saison> findByEstActifTrue();
}
