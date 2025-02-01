# Harry Potter NFT Oyun dApp'i 🧙‍♂️

Harry Potter evreninden esinlenerek geliştirilen, oyun içi varlıkların (karakterler, silahlar, eşyalar vb.) NFT olarak temsil edildiği merkeziyetsiz bir uygulama (dApp). Bu proje 7 günlük bir MVP (Minimum Uygulanabilir Ürün) olarak geliştirilmektedir.

## 🎮 Proje Genel Bakış

dApp aşağıdaki temel özellikleri içermektedir:
- NFT Basımı: Oyun içi varlıkların NFT olarak oluşturulması
- Pazar Yeri ve Açık Artırma: Oyuncular arası NFT alım-satımı ve açık artırmalara katılım
- Oyun İçi Görevler ve Turnuvalar: Görevleri tamamlayarak NFT ödülleri kazanma
- Evrim Mekanizması: NFT'ler için basit bir evrim sistemi (seviye atlama, güçlenme)
- Koleksiyon Tamamlama Ödülleri: Belirli koleksiyonları tamamlayarak bonus NFT'ler kazanma

## 🛠 Teknoloji Altyapısı

### Blockchain ve Akıllı Kontratlar
- Ağ: Polygon (Mumbai Test Ağı)
- Akıllı Kontrat: Solidity
- Geliştirme Ortamı: Hardhat
- Kütüphaneler: OpenZeppelin (ERC-721/1155)
- Test: Hardhat test framework ve OpenZeppelin test yardımcıları

### Önyüz (Frontend)
- Framework: React.js
- Blockchain Entegrasyonu: ethers.js
- Cüzdan Bağlantısı: Web3Modal/Onboard.js
- Arayüz: Tailwind CSS/Material-UI
- Programlama Dili: JavaScript/TypeScript

### Depolama
- IPFS: NFT metadata ve varlıkları için Pinata/NFT.Storage

## 🚀 Temel Özellikler (MVP)

### 1. NFT Sistemi
- ERC-721/1155 standart akıllı kontratları
- IPFS metadata depolama (görseller ve özellikler için)
- Temel basım (minting) işlevselliği

### 2. Pazar Yeri ve Açık Artırma
- NFT listeleme özelliği
- Basit satın alma işlevi
- Temel açık artırma sistemi ve teklif verme mekanizması

### 3. Görev/Turnuva Sistemi
- Basit görev tamamlama gösterimi
- Tamamlanan görevler için NFT ödülleri
- Temel turnuva yapısı

### 4. Evrim Sistemi
- Basit NFT evrim mekanikleri
- Seviye atlama sistemi
- Temel özellik geliştirme

## 👥 Takım Yapısı

- 2 Önyüz Geliştirici
  - Dashboard ve cüzdan entegrasyonu
  - Pazar yeri arayüzü ve oyun arayüzü
- 2 Blockchain Geliştirici
  - Akıllı kontrat geliştirme
  - NFT sistem implementasyonu

## 📅 Geliştirme Takvimi

### 1. Gün: Planlama ve Kurulum
- Proje gereksinimlerinin netleştirilmesi
- Repository kurulumu
- Geliştirme ortamı yapılandırması

### 2-3. Gün: Temel Geliştirme
- Akıllı kontrat temeli
- Önyüz temel yapısı
- NFT sistem entegrasyonu

### 4-5. Gün: Özellik Implementasyonu
- Açık artırma sistemi
- Görev/Turnuva mekanikleri
- Pazar yeri işlevselliği

### 6-7. Gün: İyileştirme ve Test
- Arayüz/kullanıcı deneyimi iyileştirmeleri
- Hata düzeltmeleri
- Dokümantasyon ve Demo hazırlığı

## 🔧 Kurulum ve Başlangıç

```bash
# Repository'i klonlayın
git clone [repository-url]

# Bağımlılıkları yükleyin
npm install

# Yerel geliştirme sunucusunu başlatın
npm run dev

# Testleri çalıştırın
npm test
```

## 🌐 Akıllı Kontrat Dağıtımı

```bash
# Yerel ağa dağıtım
npx hardhat run scripts/deploy.js --network localhost

# Mumbai Test Ağına dağıtım
npx hardhat run scripts/deploy.js --network mumbai
```

## 🔒 Güvenlik Önlemleri

- Akıllı kontrat güvenlik en iyi uygulamaları
- OpenZeppelin güvenlik kalıpları
- Temel erişim kontrolü implementasyonu

## 🎨 Tasarım Felsefesi

- Harry Potter temalı arayüz öğeleri
- Sezgisel kullanıcı deneyimi
- Farklı cihazlara uyumlu tasarım

## 📝 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için LICENSE dosyasına bakınız.

## ⚠️ Yasal Uyarı

Bu bir demo projesidir ve Harry Potter markası ile herhangi bir bağlantısı yoktur. Tüm Harry Potter referansları sadece gösterim amaçlı kullanılmıştır.