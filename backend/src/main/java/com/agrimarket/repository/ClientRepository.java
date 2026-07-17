package com.agrimarket.repository;

import com.agrimarket.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByEstActifTrue();
    boolean existsByEmailIgnoreCase(String email);
}
