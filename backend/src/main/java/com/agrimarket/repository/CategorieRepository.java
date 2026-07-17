package com.agrimarket.repository;

import com.agrimarket.model.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategorieRepository extends JpaRepository<Categorie, Long> {
    List<Categorie> findByEstActiveTrue();
}
