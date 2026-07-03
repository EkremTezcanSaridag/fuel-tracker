# Fuel Tracker

Türkiye'deki akaryakıt fiyatlarını takip eden Android/iOS mobil uygulaması.

## Özellikler

- 81 ilin güncel benzin, motorin ve LPG fiyatları
- İl bazlı fiyat karşılaştırması
- Günlük otomatik güncelleme

## Teknoloji Stack

- **Backend:** Python (requests, BeautifulSoup)
- **Veritabanı:** Supabase
- **Mobile:** React Native + Expo
- **Otomasyon:** GitHub Actions

## Geliştirme Aşamaları

1. **Veri Çekme** ✅ — Aytemiz'den fiyat verisi çekiliyor
2. **Veritabanı** ✅ — Supabase'e yazılıyor
3. **Otomasyonu** 🔄 — Günlük güncelleme kurulacak
4. **Mobil App** ⏳ — React Native ile geliştirilecek
5. **Play Store** ⏳ — Yayınlanacak

## Kurulum

Backend veri çekici:

```bash
cd backend
pip install -r requirements.txt
python fiyat_servisi.py
```

## Veri Kaynağı

Aytemiz'in resmi fiyat sayfasından çekiliyor. Her çalıştırıldığında 81 ilin güncel verisi alınır.