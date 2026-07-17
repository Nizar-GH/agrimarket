package com.agrimarket.repository;

import com.agrimarket.model.FrontendSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FrontendSettingRepository extends JpaRepository<FrontendSetting, Long> {
    Optional<FrontendSetting> findBySection(String section);
}
