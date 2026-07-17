package com.agrimarket.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "frontend_setting")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class FrontendSetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String section;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "highlight_text", nullable = false, length = 150)
    private String highlightText;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "link_url", length = 500)
    private String linkUrl;

    @Column(name = "button_label", length = 100)
    private String buttonLabel;

    @Column(name = "gradient_from", length = 50)
    private String gradientFrom;

    @Column(name = "gradient_to", length = 50)
    private String gradientTo;

    @Column(name = "est_actif")
    private Boolean estActif;
}
