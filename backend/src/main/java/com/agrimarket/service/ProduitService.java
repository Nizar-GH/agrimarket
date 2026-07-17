package com.agrimarket.service;

import com.agrimarket.dto.ProduitCreateDto;
import com.agrimarket.dto.ProduitResponseDto;
import com.agrimarket.dto.ProduitUpdateDto;
import com.agrimarket.model.Agriculteur;
import com.agrimarket.model.Categorie;
import com.agrimarket.model.Produit;
import com.agrimarket.model.Saison;
import com.agrimarket.repository.AgriculteurRepository;
import com.agrimarket.repository.CategorieRepository;
import com.agrimarket.repository.ProduitRepository;
import com.agrimarket.repository.SaisonRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProduitService {

    private final ProduitRepository produitRepository;
    private final AgriculteurRepository agriculteurRepository;
    private final CategorieRepository categorieRepository;
    private final SaisonRepository saisonRepository;

    public ProduitService(ProduitRepository produitRepository,
                          AgriculteurRepository agriculteurRepository,
                          CategorieRepository categorieRepository,
                          SaisonRepository saisonRepository) {
        this.produitRepository = produitRepository;
        this.agriculteurRepository = agriculteurRepository;
        this.categorieRepository = categorieRepository;
        this.saisonRepository = saisonRepository;
    }

    public List<ProduitResponseDto> getAllProduits(boolean actifsOnly) {
        List<Produit> produits = actifsOnly
                ? produitRepository.findByEstActifTrue()
                : produitRepository.findAll();
        return produits.stream().map(ProduitResponseDto::from).toList();
    }

    public Optional<ProduitResponseDto> getProduitById(Long id) {
        return produitRepository.findById(id).map(ProduitResponseDto::from);
    }

    public ProduitResponseDto createProduit(ProduitCreateDto dto) {
        if (dto.getAgriculteurId() == null) {
            throw new IllegalArgumentException("L'agriculteur est requis");
        }
        Agriculteur agriculteur = agriculteurRepository.findById(dto.getAgriculteurId())
                .orElseThrow(() -> new IllegalArgumentException("Agriculteur introuvable: " + dto.getAgriculteurId()));

        Categorie categorie = null;
        if (dto.getCategorieId() != null) {
            categorie = categorieRepository.findById(dto.getCategorieId())
                    .orElseThrow(() -> new IllegalArgumentException("Catégorie introuvable: " + dto.getCategorieId()));
        }

        Saison saison = null;
        if (dto.getSaisonId() != null) {
            saison = saisonRepository.findById(dto.getSaisonId())
                    .orElseThrow(() -> new IllegalArgumentException("Saison introuvable: " + dto.getSaisonId()));
        }

        Produit produit = new Produit();
        produit.setAgriculteur(agriculteur);
        produit.setCategorie(categorie);
        produit.setSaison(saison);
        produit.setNomProduit(dto.getNomProduit());
        produit.setDescriptionProduit(dto.getDescriptionProduit());
        produit.setVariete(dto.getVariete());
        produit.setPrixUnitaire(dto.getPrixUnitaire());
        produit.setUniteMesure(dto.getUniteMesure() != null ? dto.getUniteMesure() : "kg");
        produit.setImageUrl(dto.getImageUrl());
        if (dto.getEstBio() != null) produit.setEstBio(dto.getEstBio());
        if (dto.getEstLocal() != null) produit.setEstLocal(dto.getEstLocal());
        if (dto.getEstActif() != null) produit.setEstActif(dto.getEstActif());
        if (dto.getEstNouveau() != null) produit.setEstNouveau(dto.getEstNouveau());

        return ProduitResponseDto.from(produitRepository.save(produit));
    }

    public Optional<ProduitResponseDto> updateProduit(Long id, ProduitUpdateDto dto) {
        return produitRepository.findById(id).map(produit -> {
            if (dto.getAgriculteurId() != null) {
                Agriculteur agriculteur = agriculteurRepository.findById(dto.getAgriculteurId())
                        .orElseThrow(() -> new IllegalArgumentException("Agriculteur introuvable: " + dto.getAgriculteurId()));
                produit.setAgriculteur(agriculteur);
            }
            if (dto.getCategorieId() != null) {
                Categorie categorie = categorieRepository.findById(dto.getCategorieId())
                        .orElseThrow(() -> new IllegalArgumentException("Catégorie introuvable: " + dto.getCategorieId()));
                produit.setCategorie(categorie);
            }
            if (dto.getSaisonId() != null) {
                Saison saison = saisonRepository.findById(dto.getSaisonId())
                        .orElseThrow(() -> new IllegalArgumentException("Saison introuvable: " + dto.getSaisonId()));
                produit.setSaison(saison);
            }
            if (dto.getNomProduit() != null) produit.setNomProduit(dto.getNomProduit());
            if (dto.getDescriptionProduit() != null) produit.setDescriptionProduit(dto.getDescriptionProduit());
            if (dto.getVariete() != null) produit.setVariete(dto.getVariete());
            if (dto.getPrixUnitaire() != null) produit.setPrixUnitaire(dto.getPrixUnitaire());
            if (dto.getUniteMesure() != null) produit.setUniteMesure(dto.getUniteMesure());
            if (dto.getImageUrl() != null) produit.setImageUrl(dto.getImageUrl());
            if (dto.getEstBio() != null) produit.setEstBio(dto.getEstBio());
            if (dto.getEstLocal() != null) produit.setEstLocal(dto.getEstLocal());
            if (dto.getEstActif() != null) produit.setEstActif(dto.getEstActif());
            if (dto.getEstNouveau() != null) produit.setEstNouveau(dto.getEstNouveau());

            return ProduitResponseDto.from(produitRepository.save(produit));
        });
    }

    public boolean deleteProduit(Long id) {
        return produitRepository.findById(id).map(produit -> {
            produit.setEstActif(false);
            produitRepository.save(produit);
            return true;
        }).orElse(false);
    }
}
