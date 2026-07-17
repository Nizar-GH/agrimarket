package com.agrimarket.repository;

import com.agrimarket.model.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {
    List<Commande> findByClient_Id(Long clientId);
    List<Commande> findByStatut(Commande.StatutCommande statut);
}
