import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json
import os
import re
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def tum_fiyatlari_cek():
    url = "https://www.aytemiz.com.tr/akaryakit-fiyatlari/benzin-fiyatlari"
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers, timeout=15)
    soup = BeautifulSoup(response.text, "html.parser")
    duz_metin = soup.get_text(separator=" ")
    desen = r"([A-ZÇĞİÖŞÜ][a-zçğıöşü]+(?:\s?/\s?[A-ZÇĞİÖŞÜ][a-zçğıöşü]+)?)\s*(\d{2},\d{2})\s*(\d{2},\d{2})\s*(\d{2},\d{2})\s*(\d{2},\d{2})\s*(\d{2},\d{2})"
    guncelleme = datetime.now().strftime("%Y-%m-%d %H:%M")
    il_verileri = {}
    for eslesme in re.finditer(desen, duz_metin):
        il_adi = eslesme.group(1).strip()
        if il_adi in il_verileri:
            continue
        il_verileri[il_adi] = {
            "il": il_adi,
            "benzin_95": eslesme.group(2),
            "motorin": eslesme.group(3),
            "lpg": eslesme.group(5),
            "guncelleme": guncelleme
        }
    return il_verileri

def supabase_yaz(veri):
    for il_adi, kayit in veri.items():
        supabase.table("fiyatlar").upsert(kayit).execute()
    print(f"Supabase'e {len(veri)} il yazıldı")

def gecmis_kaydet(veri):
    benzin_liste = []
    motorin_liste = []
    lpg_liste = []

    for il, kayit in veri.items():
        try:
            benzin_liste.append(float(kayit["benzin_95"].replace(",", ".")))
            motorin_liste.append(float(kayit["motorin"].replace(",", ".")))
            lpg_liste.append(float(kayit["lpg"].replace(",", ".")))
        except:
            continue

    if not benzin_liste:
        return

    bugun = datetime.now().strftime("%Y-%m-%d")
    ort_benzin = round(sum(benzin_liste) / len(benzin_liste), 2)
    ort_motorin = round(sum(motorin_liste) / len(motorin_liste), 2)
    ort_lpg = round(sum(lpg_liste) / len(lpg_liste), 2)

    onceki = supabase.table("gecmis").select("*").order("tarih", desc=True).limit(1).execute()

    benzin_degisim = "0.00"
    motorin_degisim = "0.00"
    lpg_degisim = "0.00"

    if onceki.data:
        onceki_kayit = onceki.data[0]
        benzin_degisim = str(round(ort_benzin - float(onceki_kayit["benzin_95"]), 2))
        motorin_degisim = str(round(ort_motorin - float(onceki_kayit["motorin"]), 2))
        lpg_degisim = str(round(ort_lpg - float(onceki_kayit["lpg"]), 2))

    supabase.table("gecmis").upsert({
        "tarih": bugun,
        "benzin_95": str(ort_benzin),
        "motorin": str(ort_motorin),
        "lpg": str(ort_lpg),
        "benzin_degisim": benzin_degisim,
        "motorin_degisim": motorin_degisim,
        "lpg_degisim": lpg_degisim
    }).execute()

    print(f"Geçmişe kaydedildi: Benzin {ort_benzin}, Motorin {ort_motorin}, LPG {ort_lpg}")

if __name__ == "__main__":
    print(f"Fiyatlar çekiliyor... {datetime.now().strftime('%d/%m/%Y %H:%M')}\n")
    veri = tum_fiyatlari_cek()
    klasor = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(klasor, "fiyatlar.json"), "w", encoding="utf-8") as f:
        json.dump(veri, f, ensure_ascii=False, indent=2)
    for il in sorted(veri.keys()):
        print(f"  {il}: {veri[il]['benzin_95']}")
    supabase_yaz(veri)
    gecmis_kaydet(veri)