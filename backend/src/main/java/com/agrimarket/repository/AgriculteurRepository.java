package com.agrimarket.repository;

import com.agrimarket.model.Agriculteur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AgriculteurRepository extends JpaRepository<Agriculteur, Long> {
    List<Agriculteur> findByEstActifTrue();
}
