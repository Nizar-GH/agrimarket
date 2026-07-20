package com.agrimarket.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * Service pour valider les tokens reCAPTCHA v3 avec l'API Google
 */
@Service
public class ReCaptchaService {
    private static final Logger logger = LoggerFactory.getLogger(ReCaptchaService.class);
    private static final String RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
    private static final double MIN_SCORE = 0.5; // Score minimum pour accepter (0.0 = robot, 1.0 = humain)

    @Value("${recaptcha.secret-key:}")
    private String recaptchaSecretKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public ReCaptchaService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * Valide un token reCAPTCHA avec l'API Google
     * @param token Le token reCAPTCHA reçu du client
     * @return true si le token est valide et le score est acceptable
     */
    public boolean validateToken(String token) {
        if (token == null || token.isEmpty()) {
            logger.warn("Token reCAPTCHA vide");
            return false;
        }

        if (recaptchaSecretKey == null || recaptchaSecretKey.isEmpty()) {
            logger.error("Clé secrète reCAPTCHA non configurée");
            return false;
        }

        try {
            Map<String, String> params = new HashMap<>();
            params.put("secret", recaptchaSecretKey);
            params.put("response", token);

            String response = restTemplate.postForObject(RECAPTCHA_VERIFY_URL, params, String.class);
            JsonNode jsonNode = objectMapper.readTree(response);

            boolean success = jsonNode.get("success").asBoolean();
            double score = jsonNode.get("score").asDouble(0.0);
            String action = jsonNode.has("action") ? jsonNode.get("action").asText() : "";

            logger.info("reCAPTCHA validation - Success: {}, Score: {}, Action: {}", success, score, action);

            // Vérifier que c'est l'action 'signup' et que le score est acceptable
            if (!success || score < MIN_SCORE || !action.equals("signup")) {
                logger.warn("reCAPTCHA validation failed - Success: {}, Score: {}, Action: {}", success, score, action);
                return false;
            }

            return true;
        } catch (Exception e) {
            logger.error("Erreur lors de la validation du token reCAPTCHA", e);
            return false;
        }
    }

    /**
     * Obtient le score reCAPTCHA pour affichage ou logging (optionnel)
     * @param token Le token reCAPTCHA
     * @return Le score entre 0.0 et 1.0, ou -1 en cas d'erreur
     */
    public double getScore(String token) {
        if (token == null || token.isEmpty()) {
            return -1.0;
        }

        try {
            Map<String, String> params = new HashMap<>();
            params.put("secret", recaptchaSecretKey);
            params.put("response", token);

            String response = restTemplate.postForObject(RECAPTCHA_VERIFY_URL, params, String.class);
            JsonNode jsonNode = objectMapper.readTree(response);

            return jsonNode.get("score").asDouble(-1.0);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération du score reCAPTCHA", e);
            return -1.0;
        }
    }
}
