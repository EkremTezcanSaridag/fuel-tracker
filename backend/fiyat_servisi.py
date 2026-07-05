import json
import os
import re
from datetime import datetime
from zoneinfo import ZoneInfo

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
NOTIFICATION_MIN_CHANGE = float(os.getenv("NOTIFICATION_MIN_CHANGE", "0.01"))
EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"
ISTANBUL_TZ = ZoneInfo("Europe/Istanbul")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

FUEL_FIELDS = {
    "benzin_95": "Benzin",
    "motorin": "Motorin",
    "lpg": "LPG",
}


def fiyat_parse(deger):
    if deger is None:
        return None

    if isinstance(deger, (int, float)):
        return float(deger)

    temiz = str(deger).replace("TL", "").replace("₺", "").replace(" ", "").replace(",", ".")

    try:
        return float(temiz)
    except ValueError:
        return None


def fiyat_format(deger):
    return f"{deger:.2f} TL"


def liste_degeri(deger):
    if isinstance(deger, list):
        return [str(item) for item in deger if item]

    if isinstance(deger, str):
        try:
            parsed = json.loads(deger)

            if isinstance(parsed, list):
                return [str(item) for item in parsed if item]
        except json.JSONDecodeError:
            return [deger]

    return []


def tum_fiyatlari_cek():
    url = "https://www.aytemiz.com.tr/akaryakit-fiyatlari/benzin-fiyatlari"
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers, timeout=20)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    duz_metin = soup.get_text(separator=" ")
    desen = (
        r"([A-ZÇĞİÖŞÜ][a-zçğıöşü]+(?:\s?/\s?[A-ZÇĞİÖŞÜ][a-zçğıöşü]+)?)"
        r"\s*(\d{2},\d{2})\s*(\d{2},\d{2})\s*(\d{2},\d{2})\s*(\d{2},\d{2})\s*(\d{2},\d{2})"
    )
    guncelleme = datetime.now(ISTANBUL_TZ).strftime("%Y-%m-%d %H:%M")
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
            "guncelleme": guncelleme,
        }

    return il_verileri


def mevcut_fiyatlari_oku():
    try:
        sonuc = supabase.table("fiyatlar").select("il, benzin_95, motorin, lpg").execute()
    except Exception as hata:
        print(f"Onceki fiyatlar okunamadi, bildirim karsilastirmasi atlanabilir: {hata}")
        return {}

    return {kayit["il"]: kayit for kayit in sonuc.data or []}


def fiyat_degisimlerini_hesapla(onceki, yeni):
    degisimler = []

    for il_adi, yeni_kayit in yeni.items():
        onceki_kayit = onceki.get(il_adi)

        if not onceki_kayit:
            continue

        for alan, yakit_adi in FUEL_FIELDS.items():
            eski_fiyat = fiyat_parse(onceki_kayit.get(alan))
            yeni_fiyat = fiyat_parse(yeni_kayit.get(alan))

            if eski_fiyat is None or yeni_fiyat is None:
                continue

            fark = round(yeni_fiyat - eski_fiyat, 2)

            if abs(fark) < NOTIFICATION_MIN_CHANGE:
                continue

            degisimler.append(
                {
                    "city": il_adi,
                    "fuel": yakit_adi,
                    "field": alan,
                    "old_price": eski_fiyat,
                    "new_price": yeni_fiyat,
                    "diff": fark,
                    "direction": "increase" if fark > 0 else "decrease",
                }
            )

    return sorted(degisimler, key=lambda item: abs(item["diff"]), reverse=True)


def supabase_yaz(veri):
    for kayit in veri.values():
        supabase.table("fiyatlar").upsert(kayit).execute()

    print(f"Supabase'e {len(veri)} il yazildi")


def gecmis_kaydet(veri):
    benzin_liste = []
    motorin_liste = []
    lpg_liste = []

    for kayit in veri.values():
        benzin = fiyat_parse(kayit.get("benzin_95"))
        motorin = fiyat_parse(kayit.get("motorin"))
        lpg = fiyat_parse(kayit.get("lpg"))

        if benzin is not None:
            benzin_liste.append(benzin)
        if motorin is not None:
            motorin_liste.append(motorin)
        if lpg is not None:
            lpg_liste.append(lpg)

    if not benzin_liste or not motorin_liste or not lpg_liste:
        return

    bugun = datetime.now(ISTANBUL_TZ).strftime("%Y-%m-%d")
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

    supabase.table("gecmis").upsert(
        {
            "tarih": bugun,
            "benzin_95": str(ort_benzin),
            "motorin": str(ort_motorin),
            "lpg": str(ort_lpg),
            "benzin_degisim": benzin_degisim,
            "motorin_degisim": motorin_degisim,
            "lpg_degisim": lpg_degisim,
        }
    ).execute()

    print(f"Gecmise kaydedildi: Benzin {ort_benzin}, Motorin {ort_motorin}, LPG {ort_lpg}")


def push_tokenlarini_oku():
    try:
        sonuc = supabase.table("push_tokens").select("*").eq("enabled", True).execute()
    except Exception as hata:
        print("Push token tablosu okunamadi. backend/supabase_notifications.sql dosyasini Supabase'de calistirin.")
        print(f"Detay: {hata}")
        return []

    return sonuc.data or []


def sessiz_saatte_mi(token_kayit):
    if not token_kayit.get("quiet_hours", True):
        return False

    saat = datetime.now(ISTANBUL_TZ).hour

    return saat >= 22 or saat < 8


def token_icin_degisim_sec(token_kayit, degisimler):
    takip_iller = {item.lower() for item in liste_degeri(token_kayit.get("tracked_cities"))}
    takip_yakitlar = {item.lower() for item in liste_degeri(token_kayit.get("tracked_fuels"))}
    city_alerts = token_kayit.get("city_alerts", True)
    daily_alerts = token_kayit.get("daily_alerts", True)

    if city_alerts:
        adaylar = [
            degisim
            for degisim in degisimler
            if (not takip_iller or degisim["city"].lower() in takip_iller)
            and (not takip_yakitlar or degisim["fuel"].lower() in takip_yakitlar)
        ]

        if adaylar:
            return adaylar[0]

    if daily_alerts and degisimler:
        return degisimler[0]

    return None


def bildirim_mesaji_olustur(token_kayit, degisim):
    yon = "artti" if degisim["diff"] > 0 else "dustu"
    hareket = "artis" if degisim["diff"] > 0 else "indirim"

    return {
        "to": token_kayit["expo_push_token"],
        "sound": "default",
        "title": f"{degisim['fuel']} fiyatinda {hareket}",
        "body": (
            f"{degisim['city']} {degisim['fuel']} {abs(degisim['diff']):.2f} TL {yon}. "
            f"Yeni fiyat: {fiyat_format(degisim['new_price'])}"
        ),
        "data": {
            "city": degisim["city"],
            "fuel": degisim["fuel"],
            "newPrice": degisim["new_price"],
            "oldPrice": degisim["old_price"],
            "type": "fuel_change",
        },
    }


def parcalara_bol(liste, boyut):
    for index in range(0, len(liste), boyut):
        yield liste[index : index + boyut]


def bildirim_log_kaydet(mesaj_sayisi, degisim_sayisi):
    try:
        supabase.table("notification_logs").insert(
            {
                "sent_count": mesaj_sayisi,
                "change_count": degisim_sayisi,
                "created_at": datetime.now(ISTANBUL_TZ).isoformat(),
            }
        ).execute()
    except Exception:
        pass


def fiyat_bildirimleri_gonder(degisimler):
    if not degisimler:
        print("Fiyat degisimi yok, bildirim gonderilmedi")
        return

    tokenlar = push_tokenlarini_oku()

    if not tokenlar:
        print("Kayitli push token yok, bildirim gonderilmedi")
        return

    mesajlar = []

    for token_kayit in tokenlar:
        if sessiz_saatte_mi(token_kayit):
            continue

        if not token_kayit.get("expo_push_token"):
            continue

        degisim = token_icin_degisim_sec(token_kayit, degisimler)

        if not degisim:
            continue

        mesajlar.append(bildirim_mesaji_olustur(token_kayit, degisim))

    if not mesajlar:
        print("Bildirim kosullarina uyan cihaz yok")
        return

    gonderilen = 0

    for parca in parcalara_bol(mesajlar, 100):
        response = requests.post(
            EXPO_PUSH_URL,
            headers={
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            json=parca,
            timeout=30,
        )
        response.raise_for_status()
        gonderilen += len(parca)

    bildirim_log_kaydet(gonderilen, len(degisimler))
    print(f"{gonderilen} push bildirimi Expo Push API'ye gonderildi")


if __name__ == "__main__":
    print(f"Fiyatlar cekiliyor... {datetime.now(ISTANBUL_TZ).strftime('%d/%m/%Y %H:%M')}\n")

    onceki_fiyatlar = mevcut_fiyatlari_oku()
    veri = tum_fiyatlari_cek()
    degisimler = fiyat_degisimlerini_hesapla(onceki_fiyatlar, veri)
    klasor = os.path.dirname(os.path.abspath(__file__))

    with open(os.path.join(klasor, "fiyatlar.json"), "w", encoding="utf-8") as f:
        json.dump(veri, f, ensure_ascii=False, indent=2)

    for il in sorted(veri.keys()):
        print(f"  {il}: {veri[il]['benzin_95']}")

    supabase_yaz(veri)
    gecmis_kaydet(veri)
    fiyat_bildirimleri_gonder(degisimler)
