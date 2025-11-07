# Script de migration pour séparer frontend et backend
# PowerShell script to migrate files to frontend/backend structure

Write-Host "🚀 Début de la migration..." -ForegroundColor Green

# Créer les dossiers si nécessaire
Write-Host "📁 Création des dossiers..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "frontend\src" -Force | Out-Null
New-Item -ItemType Directory -Path "frontend\public" -Force | Out-Null

# Copier les fichiers src/
Write-Host "📋 Copie des fichiers src/ vers frontend/src/..." -ForegroundColor Yellow
if (Test-Path "src") {
    Copy-Item -Path "src\*" -Destination "frontend\src\" -Recurse -Force
    Write-Host "✅ Fichiers src/ copiés" -ForegroundColor Green
} else {
    Write-Host "⚠️  Dossier src/ non trouvé" -ForegroundColor Red
}

# Copier les fichiers public/
Write-Host "📋 Copie des fichiers public/ vers frontend/public/..." -ForegroundColor Yellow
if (Test-Path "public") {
    Copy-Item -Path "public\*" -Destination "frontend\public\" -Recurse -Force
    Write-Host "✅ Fichiers public/ copiés" -ForegroundColor Green
} else {
    Write-Host "⚠️  Dossier public/ non trouvé" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Migration terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "1. cd backend && npm install" -ForegroundColor White
Write-Host "2. cd ../frontend && npm install" -ForegroundColor White
Write-Host "3. Configurez les fichiers .env dans backend/ et frontend/" -ForegroundColor White
Write-Host "4. Lancez le backend : cd backend && npm run dev" -ForegroundColor White
Write-Host "5. Lancez le frontend : cd frontend && npm run dev" -ForegroundColor White

