import json
import os
import re
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from supabase import create_client

from market_signals import build_market_signal

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY")
NOTIFICATION_MIN_CHANGE = float(os.getenv("NOTIFICATION_MIN_CHANGE", "0.01"))
EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"


def resolve_istanbul_timezone():
    try:
        return ZoneInfo("Europe/Istanbul")
    except ZoneInfoNotFoundError:
        return timezone(timedelta(hours=3))


ISTANBUL_TZ = resolve_istanbul_timezone()

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


def degisim_ozeti(degisimler, limit=8):
    return [
        {
            "city": degisim["city"],
            "fuel": degisim["fuel"],
            "diff": degisim["diff"],
            "old_price": degisim.get("old_price"),
            "new_price": degisim.get("new_price"),
            "source": degisim.get("source", "price_change"),
        }
        for degisim in degisimler[:limit]
    ]


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
    yeni_fiyat = degisim.get("new_price")

    if degisim.get("source") == "price_memory":
        return {
            "to": token_kayit["expo_push_token"],
            "sound": "default",
            "title": f"{degisim['fuel']} icin gunluk {hareket} sinyali",
            "body": (
                f"{degisim['city']} {degisim['fuel']} tarafinda bugun "
                f"{abs(degisim['diff']):.2f} TL {yon} etkisi korunuyor."
            ),
            "data": {
                "city": degisim["city"],
                "fuel": degisim["fuel"],
                "type": "fuel_memory_change",
            },
        }

    return {
        "to": token_kayit["expo_push_token"],
        "sound": "default",
        "title": f"{degisim['fuel']} fiyatinda {hareket}",
        "body": (
            f"{degisim['city']} {degisim['fuel']} {abs(degisim['diff']):.2f} TL {yon}. "
            f"Yeni fiyat: {fiyat_format(yeni_fiyat)}"
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


def bildirim_log_kaydet(
    mesaj_sayisi,
    degisim_sayisi,
    status="sent",
    reason=None,
    token_count=0,
    candidate_count=0,
    skipped_quiet_count=0,
    skipped_empty_token_count=0,
    skipped_no_match_count=0,
    error_message=None,
    details=None,
):
    try:
        supabase.table("notification_logs").insert(
            {
                "status": status,
                "reason": reason,
                "sent_count": mesaj_sayisi,
                "change_count": degisim_sayisi,
                "token_count": token_count,
                "candidate_count": candidate_count,
                "skipped_quiet_count": skipped_quiet_count,
                "skipped_empty_token_count": skipped_empty_token_count,
                "skipped_no_match_count": skipped_no_match_count,
                "error_message": error_message,
                "details": details or {},
                "created_at": datetime.now(ISTANBUL_TZ).isoformat(),
            }
        ).execute()
    except Exception as hata:
        print(f"Bildirim audit log kaydi yazilamadi: {hata}")


def gunluk_pompa_hafizasi_oku():
    bugun = datetime.now(ISTANBUL_TZ).strftime("%Y-%m-%d")

    try:
        sonuc = (
            supabase.table("market_signals")
            .select("analysis")
            .eq("signal_date", bugun)
            .limit(1)
            .execute()
        )
    except Exception as hata:
        print(f"Gunluk pompa hafizasi okunamadi: {hata}")
        return None

    if not sonuc.data:
        return None

    analysis = sonuc.data[0].get("analysis") or {}
    price_score = int(analysis.get("price_score") or 0)

    if price_score == 0:
        return None

    return {
        "score": price_score,
        "direction": analysis.get("price_direction", "neutral"),
        "summary": analysis.get("price_summary"),
        "items": analysis.get("price_items", []),
        "remembered_at": analysis.get("price_memory", {}).get("remembered_at")
        or datetime.now(ISTANBUL_TZ).isoformat(),
    }


def gunluk_hafiza_bildirimi_gonderildi_mi():
    bugun = datetime.now(ISTANBUL_TZ).strftime("%Y-%m-%dT00:00:00+03:00")

    try:
        sonuc = (
            supabase.table("notification_logs")
            .select("id")
            .eq("reason", "price_memory")
            .gte("created_at", bugun)
            .limit(1)
            .execute()
        )
    except Exception as hata:
        print(f"Gunluk hafiza bildirim logu okunamadi: {hata}")
        return False

    return bool(sonuc.data)


def hafiza_degisimi_olustur(price_memory):
    if not price_memory or int(price_memory.get("score") or 0) == 0:
        return []

    degisimler = []

    for item in price_memory.get("items") or []:
        average_diff = float(item.get("average_diff") or 0)

        if average_diff == 0:
            continue

        degisimler.append(
            {
                "city": "Turkiye geneli",
                "fuel": item.get("fuel", "Yakit"),
                "field": None,
                "old_price": None,
                "new_price": None,
                "diff": average_diff,
                "direction": "increase" if average_diff > 0 else "decrease",
                "source": "price_memory",
            }
        )

    return sorted(degisimler, key=lambda item: abs(item["diff"]), reverse=True)


def piyasa_sinyali_kaydet(degisimler=None, onceki_pompa_hafizasi=None):
    try:
        sinyal = build_market_signal(degisimler or [], onceki_pompa_hafizasi)
        supabase.table("market_signals").upsert(sinyal, on_conflict="signal_date").execute()
        print(
            "Piyasa sinyali kaydedildi: "
            f"{sinyal['direction']} / {sinyal['confidence']} / skor {sinyal['score']}"
        )
        return sinyal
    except Exception as hata:
        print("Piyasa sinyali kaydedilemedi. backend/supabase_market_signals.sql dosyasini Supabase'de calistirin.")
        print(f"Detay: {hata}")
        return None


def fiyat_bildirimleri_gonder(degisimler, price_memory=None):
    notification_reason = None

    if not degisimler:
        hafiza_degisimi = hafiza_degisimi_olustur(price_memory)

        if hafiza_degisimi and not gunluk_hafiza_bildirimi_gonderildi_mi():
            degisimler = hafiza_degisimi
            notification_reason = "price_memory"
            print("Anlik fiyat degisimi yok, gunluk pompa hafizasi bildirimi deneniyor")
        else:
            reason = "price_memory_already_sent" if hafiza_degisimi else "no_changes"
            print("Fiyat degisimi yok, bildirim gonderilmedi")
            bildirim_log_kaydet(
                0,
                0,
                status="skipped",
                reason=reason,
                details={"price_memory": price_memory or {}},
            )
            return

    if not degisimler:
        print("Fiyat degisimi yok, bildirim gonderilmedi")
        bildirim_log_kaydet(0, 0, status="skipped", reason="no_changes")
        return

    print(f"Bildirim icin {len(degisimler)} fiyat degisimi bulundu")
    for degisim in degisimler[:8]:
        if degisim.get("source") == "price_memory":
            print(
                "  Hafiza degisimi: "
                f"{degisim['city']} {degisim['fuel']} "
                f"({degisim['diff']:+.2f} TL)"
            )
        else:
            print(
                "  Degisim: "
                f"{degisim['city']} {degisim['fuel']} "
                f"{degisim['old_price']:.2f} -> {degisim['new_price']:.2f} "
                f"({degisim['diff']:+.2f} TL)"
            )

    tokenlar = push_tokenlarini_oku()

    if not tokenlar:
        print("Kayitli push token yok, bildirim gonderilmedi")
        bildirim_log_kaydet(
            0,
            len(degisimler),
            status="skipped",
            reason="no_tokens",
            details={
                "changes": degisim_ozeti(degisimler),
                "price_memory": price_memory or {},
                "trigger": notification_reason or "price_change",
            },
        )
        return

    mesajlar = []
    skipped_quiet_count = 0
    skipped_empty_token_count = 0
    skipped_no_match_count = 0

    for token_kayit in tokenlar:
        if sessiz_saatte_mi(token_kayit):
            skipped_quiet_count += 1
            continue

        if not token_kayit.get("expo_push_token"):
            skipped_empty_token_count += 1
            continue

        degisim = token_icin_degisim_sec(token_kayit, degisimler)

        if not degisim:
            skipped_no_match_count += 1
            continue

        mesajlar.append(bildirim_mesaji_olustur(token_kayit, degisim))

    if not mesajlar:
        print("Bildirim kosullarina uyan cihaz yok")
        bildirim_log_kaydet(
            0,
            len(degisimler),
            status="skipped",
            reason="no_matching_devices",
            token_count=len(tokenlar),
            skipped_quiet_count=skipped_quiet_count,
            skipped_empty_token_count=skipped_empty_token_count,
            skipped_no_match_count=skipped_no_match_count,
            details={
                "changes": degisim_ozeti(degisimler),
                "price_memory": price_memory or {},
                "trigger": notification_reason or "price_change",
            },
        )
        return

    gonderilen = 0
    expo_responses = []

    try:
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
            expo_response = response.json()
            expo_responses.append(expo_response)
            gonderilen += len(parca)
    except Exception as hata:
        print(f"Expo Push API bildirimi gonderemedi: {hata}")
        bildirim_log_kaydet(
            gonderilen,
            len(degisimler),
            status="error",
            reason="expo_api_error",
            token_count=len(tokenlar),
            candidate_count=len(mesajlar),
            skipped_quiet_count=skipped_quiet_count,
            skipped_empty_token_count=skipped_empty_token_count,
            skipped_no_match_count=skipped_no_match_count,
            error_message=str(hata),
            details={
                "changes": degisim_ozeti(degisimler),
                "expo_responses": expo_responses,
                "price_memory": price_memory or {},
                "trigger": notification_reason or "price_change",
            },
        )
        return

    bildirim_log_kaydet(
        gonderilen,
        len(degisimler),
        status="sent",
        reason=notification_reason,
        token_count=len(tokenlar),
        candidate_count=len(mesajlar),
        skipped_quiet_count=skipped_quiet_count,
        skipped_empty_token_count=skipped_empty_token_count,
        skipped_no_match_count=skipped_no_match_count,
        details={
            "changes": degisim_ozeti(degisimler),
            "expo_responses": expo_responses,
            "price_memory": price_memory or {},
            "trigger": notification_reason or "price_change",
        },
    )
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
    onceki_pompa_hafizasi = gunluk_pompa_hafizasi_oku()
    sinyal = piyasa_sinyali_kaydet(degisimler, onceki_pompa_hafizasi)
    price_memory = (sinyal or {}).get("analysis", {})
    fiyat_bildirimleri_gonder(
        degisimler,
        {
            "score": price_memory.get("price_score", 0),
            "direction": price_memory.get("price_direction", "neutral"),
            "summary": price_memory.get("price_summary"),
            "items": price_memory.get("price_items", []),
            "remembered_at": price_memory.get("price_memory", {}).get("remembered_at"),
        },
    )
