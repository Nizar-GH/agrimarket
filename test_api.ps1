# Test API Clients
Write-Host "=== Testing /api/clients endpoint ===" -ForegroundColor Cyan

try {
    # Test GET /api/clients
    $response = Invoke-WebRequest -Uri "http://localhost:8283/api/clients" `
        -Method GET `
        -Headers @{"Accept"="application/json"} `
        -UseBasicParsing `
        -TimeoutSec 5
    
    Write-Host "✓ GET /api/clients successful"
    Write-Host "  Status: $($response.StatusCode)"
    
    $clients = $response.Content | ConvertFrom-Json
    Write-Host "  Clients count: $($clients.Count)"
    if ($clients.Count -gt 0) {
        Write-Host "  First client: $($clients[0].nom) $($clients[0].prenom) ($($clients[0].email))"
    }
} catch {
    Write-Host "✗ GET /api/clients failed:"
    Write-Host "  Error: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "=== Testing POST /api/clients (Account Creation) ===" -ForegroundColor Cyan

try {
    $newEmail = "testuser_$(Get-Random)@example.com"
    $payload = @{
        nom = "TestUser"
        prenom = "Registration"
        email = $newEmail
        telephone = "0612345678"
        adresseLivraison = "123 Test Street"
        codePostal = "75001"
        ville = "Paris"
        recaptchaToken = "test-token-123"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:8283/api/clients" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $payload `
        -UseBasicParsing `
        -TimeoutSec 5
    
    Write-Host "✓ POST /api/clients successful"
    Write-Host "  Status: $($response.StatusCode)"
    Write-Host "  New email: $newEmail"
    $newClient = $response.Content | ConvertFrom-Json
    Write-Host "  Created client ID: $($newClient.id)"
} catch {
    Write-Host "✗ POST /api/clients failed:"
    Write-Host "  Status: $($_.Exception.Response.StatusCode)"
    Write-Host "  Response: $($_.Exception.Response)"
    if ($_.ErrorDetails) {
        Write-Host "  Error details: $($_.ErrorDetails.Message)"
    }
    try {
        $errorContent = $_.Exception.Response.Content.ReadAsStream() | ForEach-Object { [System.IO.StreamReader]::new($_).ReadToEnd() }
        Write-Host "  Response body: $errorContent"
    } catch {}
}
