import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json
import os
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate(os.path.join(os.path.dirname(os.path.abspath(__file__)), "firebase-key.json"))
firebase_admin.initialize_app(cred)
db = firestore.client()



def tum_fiyatlari_cek():
    url = "https://www.aytemiz.com.tr/akaryakit-fiyatlari/benzin-fiyatlari"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        # ensure correct encoding
        if not response.encoding or response.encoding == 'ISO-8859-1':
            response.encoding = 'utf-8'
        soup = BeautifulSoup(response.text, "html.parser")
        tablo = soup.find("table")

        if not tablo:
            print("Tablo bulunamadı! Sayfa yapısı değişmiş olabilir.")
            return {}

        satirlar = tablo.find_all("tr")
        guncelleme = datetime.now().strftime("%Y-%m-%d %H:%M")

        il_verileri = {}

        for satir in satirlar:
            hucreler = satir.find_all("td")
            if len(hucreler) < 2:
                continue

            il_adi = hucreler[0].text.strip()
            fiyatlar = [h.text.strip() for h in hucreler[1:]]

            if il_adi:
                il_verileri[il_adi] = {
                    "il": il_adi,
                    "benzin_95": fiyatlar[0] if len(fiyatlar) > 0 else None,
                    "guncelleme": guncelleme
                }

        print(f"Toplam {len(il_verileri)} il bulundu")
        return il_verileri
    except requests.RequestException as e:
        print(f"İstek hatası: {e}")
        return {}
    except Exception as e:
        print(f"Hata: {e}")
        return {}


def firestore_yaz(veri):
    for il_adi, kayit in veri.items():
        db.collection("fiyatlar").document(il_adi).set(kayit)
    print(f"Firestore'a {len(veri)} il yazıldı")

if __name__ == "__main__":
    print(f"Aytemiz'den tüm il fiyatları çekiliyor... {datetime.now().strftime('%d/%m/%Y %H:%M')}\n")
    veri = tum_fiyatlari_cek()

    if veri:
        klasor = os.path.dirname(os.path.abspath(__file__))
        dosya_yolu = os.path.join(klasor, "fiyatlar.json")

        with open(dosya_yolu, "w", encoding="utf-8") as f:
            json.dump(veri, f, ensure_ascii=False, indent=2)

        for il in sorted(veri.keys()):
            print(f"  {il}: {veri[il]['benzin_95']}")

        print(f"\nTamamlandı! {dosya_yolu} → {len(veri)} il")
    else:
        print("Veri çekilemedi, dosya oluşturulmadı.")