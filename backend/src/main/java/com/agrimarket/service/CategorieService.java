package com.agrimarket.service;

import com.agrimarket.model.Categorie;
import com.agrimarket.repository.CategorieRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CategorieService {

    private final CategorieRepository categorieRepository;

    public CategorieService(CategorieRepository categorieRepository) {
        this.categorieRepository = categorieRepository;
    }

    public List<Categorie> getAllActiveCategories() {
        return categorieRepository.findByEstActiveTrue();
    }

    public Optional<Categorie> getCategorieById(Long id) {
        return categorieRepository.findById(id);
    }

    public Categorie saveCategorie(Categorie categorie) {
        return categorieRepository.save(categorie);
    }

    public Optional<Categorie> updateCategorie(Long id, Categorie details) {
        return categorieRepository.findById(id).map(categorie -> {
            categorie.setLibelle(details.getLibelle());
            categorie.setDescription(details.getDescription());
            categorie.setImageUrl(details.getImageUrl());
            categorie.setOrdreAffichage(details.getOrdreAffichage());
            categorie.setEstActive(details.getEstActive());
            return categorieRepository.save(categorie);
        });
    }

    public boolean deleteCategorie(Long id) {
        return categorieRepository.findById(id).map(categorie -> {
            categorie.setEstActive(false);
            categorieRepository.save(categorie);
            return true;
        }).orElse(false);
    }
}
