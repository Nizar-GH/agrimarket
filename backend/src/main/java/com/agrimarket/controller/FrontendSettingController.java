package com.agrimarket.controller;

import com.agrimarket.model.FrontendSetting;
import com.agrimarket.repository.FrontendSettingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/frontend-settings")
@CrossOrigin(origins = "*")
public class FrontendSettingController {

    private final FrontendSettingRepository frontendSettingRepository;

    public FrontendSettingController(FrontendSettingRepository frontendSettingRepository) {
        this.frontendSettingRepository = frontendSettingRepository;
    }

    @GetMapping
    public List<FrontendSetting> getAllSettings() {
        return frontendSettingRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FrontendSetting> getSettingById(@PathVariable Long id) {
        return frontendSettingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/section/{section}")
    public ResponseEntity<FrontendSetting> getSettingBySection(@PathVariable String section) {
        return frontendSettingRepository.findBySection(section)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public FrontendSetting createSetting(@RequestBody FrontendSetting setting) {
        if (setting.getSection() == null) {
            setting.setSection("special-offer");
        }
        return frontendSettingRepository.save(setting);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FrontendSetting> updateSetting(@PathVariable Long id, @RequestBody FrontendSetting setting) {
        return frontendSettingRepository.findById(id)
                .map(existing -> {
                    if (setting.getSection() != null) {
                        existing.setSection(setting.getSection());
                    }
                    existing.setTitle(setting.getTitle());
                    existing.setHighlightText(setting.getHighlightText());
                    existing.setDescription(setting.getDescription());
                    existing.setLinkUrl(setting.getLinkUrl());
                    existing.setButtonLabel(setting.getButtonLabel());
                    existing.setGradientFrom(setting.getGradientFrom());
                    existing.setGradientTo(setting.getGradientTo());
                    existing.setEstActif(setting.getEstActif() != null ? setting.getEstActif() : existing.getEstActif());
                    return ResponseEntity.ok(frontendSettingRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
