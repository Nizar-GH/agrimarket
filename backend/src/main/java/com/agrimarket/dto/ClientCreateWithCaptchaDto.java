package com.agrimarket.dto;

/**
 * DTO pour la création d'un client avec validation reCAPTCHA
 */
public class ClientCreateWithCaptchaDto {
    private String nom;
    private String prenom;
    private String genre;
    private String email;
    private String telephone;
    private String adresseLivraison;
    private String codePostal;
    private String ville;
    private String imageProfil;
    private Boolean estActif;
    private String recaptchaToken;

    // Constructeurs
    public ClientCreateWithCaptchaDto() {}

    public ClientCreateWithCaptchaDto(String nom, String prenom, String genre, String email, 
                                      String telephone, String adresseLivraison, String codePostal, 
                                      String ville, String imageProfil, Boolean estActif, String recaptchaToken) {
        this.nom = nom;
        this.prenom = prenom;
        this.genre = genre;
        this.email = email;
        this.telephone = telephone;
        this.adresseLivraison = adresseLivraison;
        this.codePostal = codePostal;
        this.ville = ville;
        this.imageProfil = imageProfil;
        this.estActif = estActif;
        this.recaptchaToken = recaptchaToken;
    }

    // Getters et Setters
    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getAdresseLivraison() {
        return adresseLivraison;
    }

    public void setAdresseLivraison(String adresseLivraison) {
        this.adresseLivraison = adresseLivraison;
    }

    public String getCodePostal() {
        return codePostal;
    }

    public void setCodePostal(String codePostal) {
        this.codePostal = codePostal;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public String getImageProfil() {
        return imageProfil;
    }

    public void setImageProfil(String imageProfil) {
        this.imageProfil = imageProfil;
    }

    public Boolean getEstActif() {
        return estActif;
    }

    public void setEstActif(Boolean estActif) {
        this.estActif = estActif;
    }

    public String getRecaptchaToken() {
        return recaptchaToken;
    }

    public void setRecaptchaToken(String recaptchaToken) {
        this.recaptchaToken = recaptchaToken;
    }
}
