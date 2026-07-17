package com.agrimarket.config;

import com.agrimarket.model.*;
import com.agrimarket.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SaisonRepository saisonRepository;
    private final CategorieRepository categorieRepository;
    private final AgriculteurRepository agriculteurRepository;
    private final ProduitRepository produitRepository;

    public DataInitializer(SaisonRepository saisonRepository,
                          CategorieRepository categorieRepository,
                          AgriculteurRepository agriculteurRepository,
                          ProduitRepository produitRepository) {
        this.saisonRepository = saisonRepository;
        this.categorieRepository = categorieRepository;
        this.agriculteurRepository = agriculteurRepository;
        this.produitRepository = produitRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Compter les produits avec images
        long produitsAvecImages = produitRepository.findAll().stream()
            .filter(p -> p.getImageUrl() != null && !p.getImageUrl().isEmpty())
            .count();
        
        // Charger les données si pas de produits ou si images manquent
        if (produitsAvecImages == 0) {
            produitRepository.deleteAll();
            loadSaisons();
            loadCategories();
            loadAgriculteurs();
            loadProduits();
            System.out.println("✅ Données de démonstration chargées avec succès!");
        }
    }

    private void loadSaisons() {
        if (saisonRepository.count() == 0) {
            Saison spring = new Saison();
            spring.setNomSaison("Printemps");
            spring.setDateDebut(LocalDate.of(2026, 3, 21));
            spring.setDateFin(LocalDate.of(2026, 6, 20));
            spring.setDescription("Saison des semis et des premières récoltes");
            spring.setIcone("🌸");
            saisonRepository.save(spring);

            Saison summer = new Saison();
            summer.setNomSaison("Été");
            summer.setDateDebut(LocalDate.of(2026, 6, 21));
            summer.setDateFin(LocalDate.of(2026, 9, 22));
            summer.setDescription("Saison des fruits et légumes du soleil");
            summer.setIcone("☀️");
            saisonRepository.save(summer);

            Saison autumn = new Saison();
            autumn.setNomSaison("Automne");
            autumn.setDateDebut(LocalDate.of(2026, 9, 23));
            autumn.setDateFin(LocalDate.of(2026, 12, 20));
            autumn.setDescription("Saison des récoltes et des conserves");
            autumn.setIcone("🍂");
            saisonRepository.save(autumn);

            Saison winter = new Saison();
            winter.setNomSaison("Hiver");
            winter.setDateDebut(LocalDate.of(2025, 12, 21));
            winter.setDateFin(LocalDate.of(2026, 3, 20));
            winter.setDescription("Saison des légumes racines et agrumes");
            winter.setIcone("❄️");
            saisonRepository.save(winter);
        }
    }

    private void loadCategories() {
        if (categorieRepository.count() == 0) {
            Categorie legumes = new Categorie();
            legumes.setLibelle("Légumes");
            legumes.setDescription("Légumes frais de saison cultivés localement");
            legumes.setOrdreAffichage(1);
            legumes.setEstActive(true);
            categorieRepository.save(legumes);

            Categorie fruits = new Categorie();
            fruits.setLibelle("Fruits");
            fruits.setDescription("Fruits frais et de saison");
            fruits.setOrdreAffichage(2);
            fruits.setEstActive(true);
            categorieRepository.save(fruits);

            Categorie herbes = new Categorie();
            herbes.setLibelle("Herbes aromatiques");
            herbes.setDescription("Herbes fraîches pour la cuisine");
            herbes.setOrdreAffichage(3);
            herbes.setEstActive(true);
            categorieRepository.save(herbes);

            Categorie produitTransformes = new Categorie();
            produitTransformes.setLibelle("Produits transformés");
            produitTransformes.setDescription("Confitures, conserves, jus artisanaux");
            produitTransformes.setOrdreAffichage(4);
            produitTransformes.setEstActive(true);
            categorieRepository.save(produitTransformes);
        }
    }

    private void loadAgriculteurs() {
        if (agriculteurRepository.count() == 0) {
            Agriculteur marie = new Agriculteur();
            marie.setNom("Dupont");
            marie.setPrenom("Marie");
            marie.setNomExploitation("Ferme des Collines");
            marie.setEmail("marie.dupont@ferme.fr");
            marie.setTelephone("+33 6 12 34 56 78");
            marie.setAdresse("12 Route des Champs");
            marie.setCodePostal("14000");
            marie.setVille("Caen");
            marie.setSiret("12345678901234");
            marie.setDescription("Productrice bio depuis 15 ans, spécialisée dans les légumes racines.");
            marie.setEstVerifie(true);
            marie.setEstActif(true);
            marie.setNoteMoyenne(new BigDecimal("4.90"));
            marie.setDateInscription(LocalDateTime.now());
            agriculteurRepository.save(marie);

            Agriculteur pierre = new Agriculteur();
            pierre.setNom("Martin");
            pierre.setPrenom("Pierre");
            pierre.setNomExploitation("Les Jardins du Soleil");
            pierre.setEmail("pierre.martin@jardins.fr");
            pierre.setTelephone("+33 6 98 76 54 32");
            pierre.setAdresse("45 Chemin de Provence");
            pierre.setCodePostal("13100");
            pierre.setVille("Aix-en-Provence");
            pierre.setSiret("98765432109876");
            pierre.setDescription("Maraîcher passionné, fruits et légumes méditerranéens.");
            pierre.setEstVerifie(true);
            pierre.setEstActif(true);
            pierre.setNoteMoyenne(new BigDecimal("4.80"));
            pierre.setDateInscription(LocalDateTime.now());
            agriculteurRepository.save(pierre);

            Agriculteur sophie = new Agriculteur();
            sophie.setNom("Bernard");
            sophie.setPrenom("Sophie");
            sophie.setNomExploitation("Potager de Sophie");
            sophie.setEmail("sophie.bernard@potager.fr");
            sophie.setTelephone("+33 6 11 22 33 44");
            sophie.setAdresse("78 Rue de la Mer");
            sophie.setCodePostal("35000");
            sophie.setVille("Rennes");
            sophie.setSiret("11223344556677");
            sophie.setDescription("Spécialiste des légumes anciens et oubliés.");
            sophie.setEstVerifie(true);
            sophie.setEstActif(true);
            sophie.setNoteMoyenne(new BigDecimal("5.00"));
            sophie.setDateInscription(LocalDateTime.now());
            agriculteurRepository.save(sophie);

            Agriculteur jean = new Agriculteur();
            jean.setNom("Lefevre");
            jean.setPrenom("Jean");
            jean.setNomExploitation("Verger du Val");
            jean.setEmail("jean.lefevre@verger.fr");
            jean.setTelephone("+33 6 22 33 44 55");
            jean.setAdresse("5 Chemin des Pommiers");
            jean.setCodePostal("76000");
            jean.setVille("Rouen");
            jean.setSiret("22334455667788");
            jean.setDescription("Production de fruits bio, spécialité pommes et poires.");
            jean.setEstVerifie(true);
            jean.setEstActif(true);
            jean.setNoteMoyenne(new BigDecimal("4.70"));
            jean.setDateInscription(LocalDateTime.now());
            agriculteurRepository.save(jean);
        }
    }

    private void loadProduits() {
        if (produitRepository.count() == 0) {
            List<Agriculteur> agriculteurs = agriculteurRepository.findAll();
            List<Categorie> categories = categorieRepository.findAll();

            if (agriculteurs.size() >= 2 && categories.size() >= 2) {
                // Tomates
                Produit tomates = new Produit();
                tomates.setNomProduit("Tomates Cerises Bio");
                tomates.setDescriptionProduit("Délicieuses tomates cerises cultivées biologiquement, parfaites pour les salades");
                tomates.setVariete("Cherry");
                tomates.setPrixUnitaire(new BigDecimal("4.50"));
                tomates.setUniteMesure("kg");
                tomates.setImageUrl("https://images.unsplash.com/photo-1516169445163-66ef06d676d4?w=400&h=400&fit=crop");
                tomates.setAgriculteur(agriculteurs.get(0));
                tomates.setCategorie(categories.get(0));
                tomates.setEstActif(true);
                produitRepository.save(tomates);

                // Pommes
                Produit pommes = new Produit();
                pommes.setNomProduit("Pommes Jonagold");
                pommes.setDescriptionProduit("Pommes croquantes et juteuses de variété Jonagold");
                pommes.setVariete("Jonagold");
                pommes.setPrixUnitaire(new BigDecimal("3.80"));
                pommes.setUniteMesure("kg");
                pommes.setImageUrl("https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop");
                pommes.setAgriculteur(agriculteurs.get(3));
                pommes.setCategorie(categories.get(1));
                pommes.setEstActif(true);
                produitRepository.save(pommes);

                // Laitue
                Produit laitue = new Produit();
                laitue.setNomProduit("Laitue Verte Feuille de Chêne");
                laitue.setDescriptionProduit("Laitue fraîche avec feuilles délicates et saveur douce");
                laitue.setVariete("Feuille de Chêne");
                laitue.setPrixUnitaire(new BigDecimal("2.50"));
                laitue.setUniteMesure("pièce");
                laitue.setImageUrl("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop");
                laitue.setAgriculteur(agriculteurs.get(0));
                laitue.setCategorie(categories.get(0));
                laitue.setEstActif(true);
                produitRepository.save(laitue);

                // Menthe
                Produit menthe = new Produit();
                menthe.setNomProduit("Menthe Fraîche Bio");
                menthe.setDescriptionProduit("Menthe aromatique fraîche pour thés et cocktails");
                menthe.setVariete("Menthe Poivrée");
                menthe.setPrixUnitaire(new BigDecimal("3.00"));
                menthe.setUniteMesure("bottes");
                menthe.setImageUrl("https://images.unsplash.com/photo-1599599810694-b5ac4dd64b11?w=400&h=400&fit=crop");
                menthe.setAgriculteur(agriculteurs.get(1));
                menthe.setCategorie(categories.get(2));
                menthe.setEstActif(true);
                produitRepository.save(menthe);

                // Fraises
                Produit fraises = new Produit();
                fraises.setNomProduit("Fraises de Saison");
                fraises.setDescriptionProduit("Fraises juteuses et savoureuses de nos champs");
                fraises.setVariete("Gariguette");
                fraises.setPrixUnitaire(new BigDecimal("6.50"));
                fraises.setUniteMesure("kg");
                fraises.setImageUrl("https://images.unsplash.com/photo-1585069033036-6a7a9ad5820d?w=400&h=400&fit=crop");
                fraises.setAgriculteur(agriculteurs.get(1));
                fraises.setCategorie(categories.get(1));
                fraises.setEstActif(true);
                produitRepository.save(fraises);

                // Carottes
                Produit carottes = new Produit();
                carottes.setNomProduit("Carottes Orange Bio");
                carottes.setDescriptionProduit("Carottes croquantes et sucrées, cultivées sans pesticides");
                carottes.setVariete("Nantaise");
                carottes.setPrixUnitaire(new BigDecimal("2.80"));
                carottes.setUniteMesure("kg");
                carottes.setImageUrl("https://images.unsplash.com/photo-1599599810694-b5ac4dd64b11?w=400&h=400&fit=crop");
                carottes.setAgriculteur(agriculteurs.get(2));
                carottes.setCategorie(categories.get(0));
                carottes.setEstActif(true);
                produitRepository.save(carottes);
            }
        }
    }
}
