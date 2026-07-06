import csv
import io
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError
from xml.etree import ElementTree

import requests

def resolve_istanbul_timezone():
    try:
        return ZoneInfo("Europe/Istanbul")
    except ZoneInfoNotFoundError:
        return timezone(timedelta(hours=3))


ISTANBUL_TZ = resolve_istanbul_timezone()

BRENT_SOURCES = [
    {
        "name": "DataHub Brent Daily",
        "url": "https://datahub.io/core/oil-prices/r/brent-daily.csv",
        "date_field": "Date",
        "price_fields": ["Price"],
    },
    {
        "name": "FRED DCOILBRENTEU",
        "url": "https://fred.stlouisfed.org/graph/fredgraph.csv?id=DCOILBRENTEU",
        "date_field": "observation_date",
        "price_fields": ["DCOILBRENTEU", "Price"],
    },
]

FUEL_SIGNAL_FACTORS = {
    "Benzin": 1.0,
    "Motorin": 1.12,
    "LPG": 0.72,
}


def parse_float(value):
    if value is None:
        return None

    if isinstance(value, (int, float)):
        return float(value)

    normalized = str(value).strip().replace(",", ".")

    if not normalized or normalized == ".":
        return None

    try:
        return float(normalized)
    except ValueError:
        return None


def parse_date(value):
    return datetime.strptime(value.strip(), "%Y-%m-%d").date()


def percent_change(current, previous):
    if previous in (None, 0) or current is None:
        return 0

    return round(((current - previous) / previous) * 100, 2)


def format_percent(value):
    return f"{value:+.2f}%"


def safe_history_value(records, offset, field):
    if not records:
        return None

    index = max(0, len(records) - 1 - offset)

    return records[index].get(field)


def multiply_values(first, second):
    if first is None or second is None:
        raise RuntimeError("Piyasa sinyali icin yeterli gecmis veri yok")

    return first * second


def fetch_csv_text(url):
    response = requests.get(
        url,
        headers={"User-Agent": "PompaMetre/1.0"},
        timeout=30,
    )
    response.raise_for_status()

    return response.text


def fetch_brent_history(limit=12):
    last_error = None

    for source in BRENT_SOURCES:
        try:
            content = fetch_csv_text(source["url"])
            reader = csv.DictReader(io.StringIO(content))
            records = []

            for row in reader:
                date_value = row.get(source["date_field"]) or row.get("Date")
                price = None

                for field in source["price_fields"]:
                    price = parse_float(row.get(field))

                    if price is not None:
                        break

                if not date_value or price is None:
                    continue

                records.append(
                    {
                        "date": parse_date(date_value),
                        "price": price,
                        "source": source["name"],
                        "source_url": source["url"],
                    }
                )

            if records:
                return sorted(records, key=lambda item: item["date"])[-limit:]
        except Exception as error:
            last_error = error

    raise RuntimeError(f"Brent verisi alinamadi: {last_error}")


def tcmb_url_for_date(day):
    today = datetime.now(ISTANBUL_TZ).date()

    if day == today:
        return "https://www.tcmb.gov.tr/kurlar/today.xml"

    return f"https://www.tcmb.gov.tr/kurlar/{day:%Y%m}/{day:%d%m%Y}.xml"


def fetch_usd_try_for_date(day):
    response = requests.get(
        tcmb_url_for_date(day),
        headers={"User-Agent": "PompaMetre/1.0"},
        timeout=20,
    )
    response.raise_for_status()

    root = ElementTree.fromstring(response.content)
    usd_node = root.find("./Currency[@CurrencyCode='USD']")

    if usd_node is None:
        return None

    rate = parse_float(usd_node.findtext("ForexSelling")) or parse_float(usd_node.findtext("ForexBuying"))

    if rate is None:
        return None

    return {
        "date": day,
        "rate": rate,
        "source": "TCMB",
        "source_url": "https://www.tcmb.gov.tr/kurlar/today.xml",
    }


def fetch_usd_try_history(limit=12):
    records = []
    today = datetime.now(ISTANBUL_TZ).date()

    for offset in range(0, 32):
        day = today - timedelta(days=offset)

        try:
            record = fetch_usd_try_for_date(day)
        except Exception:
            continue

        if record:
            records.append(record)

        if len(records) >= limit:
            break

    if not records:
        raise RuntimeError("TCMB USD/TRY verisi alinamadi")

    return sorted(records, key=lambda item: item["date"])


def resolve_direction(index_change_3d, index_change_7d):
    decisive_change = index_change_3d if abs(index_change_3d) >= 2.5 else index_change_7d

    if decisive_change >= 2.5:
        return "increase"

    if decisive_change <= -2.5:
        return "decrease"

    return "neutral"


def resolve_confidence(index_change_3d, index_change_7d):
    pressure = max(abs(index_change_3d), abs(index_change_7d))

    if pressure >= 5:
        return "high"

    if pressure >= 2.5:
        return "medium"

    return "low"


def direction_label(direction):
    if direction == "increase":
        return "artis baskisi"

    if direction == "decrease":
        return "indirim baskisi"

    return "notr"


def build_fuel_signals(direction, confidence, score):
    signals = []

    for fuel, factor in FUEL_SIGNAL_FACTORS.items():
        fuel_score = min(100, round(score * factor))
        fuel_direction = direction
        fuel_confidence = confidence

        if fuel == "LPG" and fuel_score < 42:
            fuel_direction = "neutral"
            fuel_confidence = "low"

        signals.append(
            {
                "fuel": fuel,
                "direction": fuel_direction,
                "confidence": fuel_confidence,
                "score": fuel_score,
                "label": direction_label(fuel_direction),
            }
        )

    return signals


def build_summary(direction, confidence, index_change_3d, index_change_7d, brent_change_3d, usd_change_3d):
    confidence_text = {
        "high": "guclu",
        "medium": "orta",
        "low": "dusuk",
    }.get(confidence, "dusuk")
    decisive_days = 3 if abs(index_change_3d) >= 2.5 else 7
    decisive_change = index_change_3d if decisive_days == 3 else index_change_7d

    if direction == "increase":
        return (
            f"Brent TL endeksi {decisive_days} piyasa gununde %{decisive_change:.2f} yukseldi. "
            f"Brent {format_percent(brent_change_3d)}, USD/TL {format_percent(usd_change_3d)} hareket etti; "
            f"yukari yonlu {confidence_text} sinyal olustu."
        )

    if direction == "decrease":
        return (
            f"Brent TL endeksi {decisive_days} piyasa gununde %{abs(decisive_change):.2f} geriledi. "
            f"Brent {format_percent(brent_change_3d)}, USD/TL {format_percent(usd_change_3d)} hareket etti; "
            f"asagi yonlu {confidence_text} sinyal olustu."
        )

    return (
        f"Brent TL endeksi 3 piyasa gununde %{index_change_3d:.2f} degisti. "
        "Pompa fiyatlari icin belirgin bir yukari ya da asagi baski olusmadi."
    )


def build_market_signal():
    brent_history = fetch_brent_history()
    usd_history = fetch_usd_try_history()

    latest_brent = brent_history[-1]
    latest_usd = usd_history[-1]
    current_index = latest_brent["price"] * latest_usd["rate"]
    index_3d = multiply_values(safe_history_value(brent_history, 3, "price"), safe_history_value(usd_history, 3, "rate"))
    index_7d = multiply_values(safe_history_value(brent_history, 7, "price"), safe_history_value(usd_history, 7, "rate"))
    brent_change_3d = percent_change(latest_brent["price"], safe_history_value(brent_history, 3, "price"))
    usd_change_3d = percent_change(latest_usd["rate"], safe_history_value(usd_history, 3, "rate"))
    index_change_3d = percent_change(current_index, index_3d)
    index_change_7d = percent_change(current_index, index_7d)
    direction = resolve_direction(index_change_3d, index_change_7d)
    confidence = resolve_confidence(index_change_3d, index_change_7d)
    score = min(100, round(max(abs(index_change_3d), abs(index_change_7d)) * 12))
    calculated_at = datetime.now(ISTANBUL_TZ)

    return {
        "signal_date": calculated_at.strftime("%Y-%m-%d"),
        "direction": direction,
        "confidence": confidence,
        "score": score,
        "summary": build_summary(direction, confidence, index_change_3d, index_change_7d, brent_change_3d, usd_change_3d),
        "brent_usd": round(latest_brent["price"], 2),
        "usd_try": round(latest_usd["rate"], 4),
        "brent_try_index": round(current_index, 2),
        "brent_change_3d": brent_change_3d,
        "usd_change_3d": usd_change_3d,
        "index_change_3d": index_change_3d,
        "index_change_7d": index_change_7d,
        "signals": build_fuel_signals(direction, confidence, score),
        "sources": {
            "brent": latest_brent["source"],
            "brent_url": latest_brent["source_url"],
            "usd_try": latest_usd["source"],
            "usd_try_url": latest_usd["source_url"],
        },
        "calculated_at": calculated_at.isoformat(),
    }
