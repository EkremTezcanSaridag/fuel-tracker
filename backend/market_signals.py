import csv
import io
import json
import os
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
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

NEWS_FEEDS = [
    {
        "name": "Akaryakit Haberleri",
        "url": "https://news.google.com/rss/search?q=akaryak%C4%B1t%20zam%20indirim%20motorin%20benzin%20LPG%20T%C3%BCrkiye%20when%3A1d&hl=tr&gl=TR&ceid=TR:tr",
    },
    {
        "name": "Brent Petrol Haberleri",
        "url": "https://news.google.com/rss/search?q=brent%20petrol%20dolar%20akaryak%C4%B1t%20T%C3%BCrkiye%20when%3A1d&hl=tr&gl=TR&ceid=TR:tr",
    },
]
NEWS_MAX_AGE_HOURS = int(os.getenv("NEWS_MAX_AGE_HOURS", "24"))
NEWS_BLOCKED_SOURCES = {
    "instagram.com",
    "facebook.com",
    "x.com",
    "twitter.com",
    "youtube.com",
}
NEWS_STRONG_ACTION_KEYWORDS = [
    "bu gece",
    "yarindan itibaren",
    "yarından itibaren",
    "litre fiyatina",
    "litre fiyatına",
    "pompa fiyatina",
    "pompa fiyatına",
    "tabelalara yansidi",
    "tabelalara yansıdı",
]

NEWS_INCREASE_KEYWORDS = [
    "artis",
    "artış",
    "zam",
    "zamlandi",
    "zamlandı",
    "yuksel",
    "yüksel",
    "yukari",
    "yukarı",
    "gerilim",
    "arz",
    "kesinti",
]
NEWS_DECREASE_KEYWORDS = [
    "dus",
    "düş",
    "indirim",
    "gerile",
    "asagi",
    "aşağı",
    "bolluk",
    "ateskes",
    "ateşkes",
]
NEWS_ACTION_KEYWORDS = ["geldi", "geliyor", "gelecek", "bekleniyor", "yapildi", "yapıldı", "uygulandi", "uygulandı"]
NEWS_QUESTION_KEYWORDS = ["var mi", "var mı", "mi geldi", "mı geldi", "ne kadar", "kac tl", "kaç tl"]


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


def clamp(value, minimum, maximum):
    return max(minimum, min(maximum, value))


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
        headers={"User-Agent": "YakitRadar/1.0"},
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
        headers={"User-Agent": "YakitRadar/1.0"},
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


def normalize_text(value):
    replacements = {
        "İ": "i",
        "I": "i",
        "ı": "i",
        "Ş": "s",
        "ş": "s",
        "Ğ": "g",
        "ğ": "g",
        "Ü": "u",
        "ü": "u",
        "Ö": "o",
        "ö": "o",
        "Ç": "c",
        "ç": "c",
    }
    normalized = str(value or "").lower()

    for source, target in replacements.items():
        normalized = normalized.replace(source, target)

    return normalized


def parse_rss_date(value):
    if not value:
        return None

    try:
        parsed = parsedate_to_datetime(value)

        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)

        return parsed.astimezone(ISTANBUL_TZ)
    except Exception:
        return None


def is_blocked_news_source(source):
    normalized = normalize_text(source)

    return any(blocked in normalized for blocked in NEWS_BLOCKED_SOURCES)


def is_recent_news_item(published_at, max_age_hours=NEWS_MAX_AGE_HOURS):
    if published_at is None:
        return False

    cutoff = datetime.now(ISTANBUL_TZ) - timedelta(hours=max_age_hours)

    return published_at >= cutoff


def fetch_news_items(limit=8):
    items = []
    seen_titles = set()

    for feed in NEWS_FEEDS:
        try:
            response = requests.get(
                feed["url"],
                headers={
                    "User-Agent": "YakitRadar/1.0",
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache",
                },
                timeout=20,
            )
            response.raise_for_status()
            root = ElementTree.fromstring(response.content)

            for node in root.findall("./channel/item"):
                title = (node.findtext("title") or "").strip()

                if not title:
                    continue

                normalized_title = normalize_text(title)

                if normalized_title in seen_titles:
                    continue

                source = node.findtext("source") or feed["name"]
                published_at = parse_rss_date(node.findtext("pubDate"))

                clean_source = source.strip()

                if is_blocked_news_source(clean_source) or not is_recent_news_item(published_at):
                    continue

                seen_titles.add(normalized_title)
                items.append(
                    {
                        "title": title,
                        "source": clean_source,
                        "url": (node.findtext("link") or "").strip(),
                        "published_at": published_at.isoformat() if published_at else None,
                    }
                )
        except Exception as error:
            print(f"Haber akisi okunamadi ({feed['name']}): {error}")

    items.sort(key=lambda item: item.get("published_at") or "", reverse=True)

    return items[:limit]


def score_news_items(news_items):
    if not news_items:
        return {
            "score": 0,
            "direction": "neutral",
            "summary": "Son gunlerde filtreye uyan guvenilir haber basligi bulunamadi; haber etkisi notr kabul edildi.",
        }

    score = 0
    matched = []
    strong_direction = None

    for item in news_items[:8]:
        title = item["title"]
        normalized = normalize_text(title)
        increase_hits = sum(1 for keyword in NEWS_INCREASE_KEYWORDS if normalize_text(keyword) in normalized)
        decrease_hits = sum(1 for keyword in NEWS_DECREASE_KEYWORDS if normalize_text(keyword) in normalized)
        has_action = any(normalize_text(keyword) in normalized for keyword in NEWS_ACTION_KEYWORDS)
        has_strong_action = any(normalize_text(keyword) in normalized for keyword in NEWS_STRONG_ACTION_KEYWORDS)
        is_question = any(normalize_text(keyword) in normalized for keyword in NEWS_QUESTION_KEYWORDS)
        item_score = 0

        if increase_hits and has_strong_action:
            item_score += 34
            strong_direction = "increase"
        elif increase_hits and has_action:
            item_score += 22
            strong_direction = "increase"
        elif increase_hits:
            item_score += 5

        if decrease_hits and has_strong_action:
            item_score -= 34
            strong_direction = "decrease"
        elif decrease_hits and has_action:
            item_score -= 22
            strong_direction = "decrease"
        elif decrease_hits:
            item_score -= 5

        if increase_hits and decrease_hits and is_question:
            item_score = 0
        elif is_question:
            item_score = round(item_score * 0.35)

        item_score = clamp(item_score, -32, 32)

        if item_score:
            matched.append(title)

        score += item_score

    score = clamp(score, -90, 90)

    if score >= 12:
        direction = "increase"
        summary = "Son haber basliklari akaryakit tarafinda yukari yonlu riskleri one cikariyor."
    elif score <= -12:
        direction = "decrease"
        summary = "Son haber basliklari akaryakit tarafinda indirim veya gevseme ihtimalini one cikariyor."
    else:
        direction = "neutral"
        summary = "Son haber basliklari tek yonlu guclu bir baski gostermiyor."

    return {
        "score": score,
        "direction": direction,
        "summary": summary,
        "matched_titles": matched[:3],
        "strong_direction": strong_direction,
    }


def summarize_price_changes(price_changes):
    if not price_changes:
        return {
            "score": 0,
            "direction": "neutral",
            "summary": "Bugun kayda deger pompa fiyat degisimi algilanmadi.",
            "items": [],
        }

    grouped = {}

    for change in price_changes:
        fuel = change.get("fuel", "Yakit")
        grouped.setdefault(fuel, []).append(change)

    items = []
    signed_score = 0

    for fuel, changes in grouped.items():
        diffs = [float(change.get("diff") or 0) for change in changes]
        average_diff = round(sum(diffs) / len(diffs), 2)
        direction = "increase" if average_diff > 0 else "decrease" if average_diff < 0 else "neutral"
        fuel_score = clamp(round(abs(average_diff) * 45) + min(20, len(changes) // 8), 0, 45)

        if direction == "increase":
            signed_score += fuel_score
        elif direction == "decrease":
            signed_score -= fuel_score

        items.append(
            {
                "fuel": fuel,
                "direction": direction,
                "average_diff": average_diff,
                "city_count": len(changes),
                "score": fuel_score,
            }
        )

    signed_score = clamp(signed_score, -95, 95)

    if signed_score >= 35:
        direction = "increase"
        summary = "Guncel cekilen fiyatlarda zam etkisi dogrudan algilandi."
    elif signed_score <= -35:
        direction = "decrease"
        summary = "Guncel cekilen fiyatlarda indirim etkisi dogrudan algilandi."
    else:
        direction = "neutral"
        summary = "Guncel fiyat degisimleri tek basina guclu yon olusturmadi."

    return {
        "score": signed_score,
        "direction": direction,
        "summary": summary,
        "items": sorted(items, key=lambda item: abs(item["score"]), reverse=True),
    }


def merge_price_memory(current_analysis, previous_price_memory=None):
    previous_price_memory = previous_price_memory or {}

    if current_analysis["score"] != 0:
        return {
            **current_analysis,
            "memory_source": "current_run",
            "remembered_at": datetime.now(ISTANBUL_TZ).isoformat(),
        }

    previous_score = int(previous_price_memory.get("score") or 0)

    if previous_score == 0:
        return {
            **current_analysis,
            "memory_source": "none",
            "remembered_at": None,
        }

    remembered_at = previous_price_memory.get("remembered_at")
    summary = previous_price_memory.get("summary") or "Bugun daha once yakalanan pompa fiyat degisimi analizde korunuyor."

    return {
        "score": previous_score,
        "direction": previous_price_memory.get("direction", "neutral"),
        "summary": summary,
        "items": previous_price_memory.get("items", []),
        "memory_source": "same_day_memory",
        "remembered_at": remembered_at,
    }


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


def resolve_combined_direction(market_score, news_score, price_score=0):
    combined = market_score + news_score + price_score

    if price_score >= 55:
        return "increase"

    if price_score <= -55:
        return "decrease"

    if news_score >= 55:
        return "increase"

    if news_score <= -55:
        return "decrease"

    if combined >= 30:
        return "increase"

    if combined <= -30:
        return "decrease"

    return "neutral"


def resolve_combined_confidence(combined_pressure, market_pressure, news_pressure, price_pressure=0):
    if price_pressure >= 55:
        return "high"

    if combined_pressure >= 58 or (market_pressure >= 50 and news_pressure >= 18):
        return "high"

    if combined_pressure >= 30:
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


def build_analysis_factors(
    direction,
    confidence,
    market_score,
    news_analysis,
    price_analysis,
    index_change_3d,
    index_change_7d,
    brent_change_3d,
    usd_change_3d,
):
    return [
        {
            "label": "Brent TL endeksi",
            "value": format_percent(index_change_3d),
            "tone": "increase" if index_change_3d >= 2.5 else "decrease" if index_change_3d <= -2.5 else "neutral",
            "detail": f"7 gunluk hareket {format_percent(index_change_7d)}.",
        },
        {
            "label": "Brent petrol",
            "value": format_percent(brent_change_3d),
            "tone": "increase" if brent_change_3d >= 1 else "decrease" if brent_change_3d <= -1 else "neutral",
            "detail": "Ham petrol maliyet baskisini temsil eder.",
        },
        {
            "label": "USD/TL",
            "value": format_percent(usd_change_3d),
            "tone": "increase" if usd_change_3d >= 0.75 else "decrease" if usd_change_3d <= -0.75 else "neutral",
            "detail": "Kur hareketi pompa fiyatlarina geciskenligi etkiler.",
        },
        {
            "label": "Pompa degisimi",
            "value": f"{price_analysis['score']:+d}",
            "tone": price_analysis["direction"],
            "detail": price_analysis["summary"],
        },
        {
            "label": "Haber etkisi",
            "value": f"{news_analysis['score']:+d}",
            "tone": news_analysis["direction"],
            "detail": news_analysis["summary"],
        },
        {
            "label": "Genel beklenti",
            "value": direction_label(direction),
            "tone": direction,
            "detail": (
                f"Guven seviyesi: {confidence}; piyasa skoru {market_score}, "
                f"haber skoru {news_analysis['score']}, pompa skoru {price_analysis['score']}."
            ),
        },
    ]


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


def build_rule_based_ai_summary(direction, confidence, market_summary, news_analysis, price_analysis):
    if direction == "increase":
        action = "zam riskini"
    elif direction == "decrease":
        action = "indirim ihtimalini"
    else:
        action = "net bir fiyat yonu olusmadigini"

    return (
        f"Analiz {action} isaret ediyor. {market_summary} "
        f"Pompa verisi: {price_analysis['summary']} "
        f"Haber tarafinda: {news_analysis['summary']} "
        f"Bu yorum tahmin niteligindedir; resmi fiyat degisikligi duyurusu degildir."
    )


def extract_gemini_text(response_data):
    for candidate in response_data.get("candidates", []):
        content = candidate.get("content") or {}

        for part in content.get("parts", []):
            text = part.get("text")

            if text:
                return text

    return None


def call_gemini_analysis(payload):
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return None

    model = os.getenv("GEMINI_MODEL") or "gemini-2.5-flash"
    schema = {
        "type": "object",
        "properties": {
            "summary": {"type": "string"},
            "watch_level": {"type": "string", "enum": ["low", "medium", "high"]},
            "key_reason": {"type": "string"},
        },
        "required": ["summary", "watch_level", "key_reason"],
    }

    try:
        response = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
            headers={
                "x-goog-api-key": api_key,
                "Content-Type": "application/json",
            },
            json={
                "contents": [
                    {
                        "role": "user",
                        "parts": [
                            {
                                "text": (
                                    "Turkiye akaryakit piyasasi icin kisa, temkinli ve kanita dayali analiz yaz. "
                                    "Kesin zam/indirim vaadi verme; bunu bir beklenti sinyali olarak anlat. "
                                    "Sadece JSON uret. Veri:\n"
                                    f"{json.dumps(payload, ensure_ascii=False)}"
                                )
                            }
                        ],
                    },
                ],
                "generationConfig": {
                    "responseMimeType": "application/json",
                    "responseSchema": schema,
                },
            },
            timeout=45,
        )
        response.raise_for_status()
        output_text = extract_gemini_text(response.json())

        if not output_text:
            return None

        parsed = json.loads(output_text)

        return {
            "model": model,
            "summary": parsed["summary"],
            "watch_level": parsed["watch_level"],
            "key_reason": parsed["key_reason"],
        }
    except Exception as error:
        print(f"Gemini analizi kullanilamadi, kural tabanli analize donuldu: {error}")
        return None


def build_market_signal(price_changes=None, previous_price_memory=None):
    brent_history = fetch_brent_history()
    usd_history = fetch_usd_try_history()
    news_items = fetch_news_items()
    price_analysis = merge_price_memory(summarize_price_changes(price_changes or []), previous_price_memory)

    latest_brent = brent_history[-1]
    latest_usd = usd_history[-1]
    current_index = latest_brent["price"] * latest_usd["rate"]
    index_3d = multiply_values(safe_history_value(brent_history, 3, "price"), safe_history_value(usd_history, 3, "rate"))
    index_7d = multiply_values(safe_history_value(brent_history, 7, "price"), safe_history_value(usd_history, 7, "rate"))
    brent_change_3d = percent_change(latest_brent["price"], safe_history_value(brent_history, 3, "price"))
    usd_change_3d = percent_change(latest_usd["rate"], safe_history_value(usd_history, 3, "rate"))
    index_change_3d = percent_change(current_index, index_3d)
    index_change_7d = percent_change(current_index, index_7d)
    market_direction = resolve_direction(index_change_3d, index_change_7d)
    market_confidence = resolve_confidence(index_change_3d, index_change_7d)
    market_score = min(100, round(max(abs(index_change_3d), abs(index_change_7d)) * 12))
    signed_market_score = market_score if market_direction == "increase" else -market_score if market_direction == "decrease" else 0
    news_analysis = score_news_items(news_items)
    direction = resolve_combined_direction(signed_market_score, news_analysis["score"], price_analysis["score"])
    combined_pressure = abs(signed_market_score + news_analysis["score"] + price_analysis["score"])
    confidence = resolve_combined_confidence(
        combined_pressure,
        market_score,
        abs(news_analysis["score"]),
        abs(price_analysis["score"]),
    )
    score_floor = abs(price_analysis["score"]) if price_analysis["direction"] == direction else 0
    score = clamp(round(max(combined_pressure, score_floor)), 0, 100)
    calculated_at = datetime.now(ISTANBUL_TZ)
    market_summary = build_summary(
        market_direction,
        market_confidence,
        index_change_3d,
        index_change_7d,
        brent_change_3d,
        usd_change_3d,
    )
    analysis_factors = build_analysis_factors(
        direction,
        confidence,
        market_score,
        news_analysis,
        price_analysis,
        index_change_3d,
        index_change_7d,
        brent_change_3d,
        usd_change_3d,
    )
    ai_payload = {
        "market_direction": market_direction,
        "combined_direction": direction,
        "confidence": confidence,
        "score": score,
        "metrics": {
            "brent_usd": round(latest_brent["price"], 2),
            "usd_try": round(latest_usd["rate"], 4),
            "brent_change_3d": brent_change_3d,
            "usd_change_3d": usd_change_3d,
            "index_change_3d": index_change_3d,
            "index_change_7d": index_change_7d,
        },
        "news": news_items[:5],
        "news_analysis": news_analysis,
        "price_analysis": price_analysis,
    }
    ai_result = call_gemini_analysis(ai_payload)
    ai_summary = (
        ai_result["summary"]
        if ai_result
        else build_rule_based_ai_summary(direction, confidence, market_summary, news_analysis, price_analysis)
    )

    return {
        "signal_date": calculated_at.strftime("%Y-%m-%d"),
        "direction": direction,
        "confidence": confidence,
        "score": score,
        "summary": ai_summary,
        "brent_usd": round(latest_brent["price"], 2),
        "usd_try": round(latest_usd["rate"], 4),
        "brent_try_index": round(current_index, 2),
        "brent_change_3d": brent_change_3d,
        "usd_change_3d": usd_change_3d,
        "index_change_3d": index_change_3d,
        "index_change_7d": index_change_7d,
        "signals": build_fuel_signals(direction, confidence, score),
        "analysis": {
            "mode": "gemini" if ai_result else "rules",
            "market_direction": market_direction,
            "market_confidence": market_confidence,
            "market_score": market_score,
            "news_score": news_analysis["score"],
            "news_direction": news_analysis["direction"],
            "news_summary": news_analysis["summary"],
            "price_score": price_analysis["score"],
            "price_direction": price_analysis["direction"],
            "price_summary": price_analysis["summary"],
            "price_items": price_analysis["items"],
            "price_memory": {
                "source": price_analysis.get("memory_source", "none"),
                "remembered_at": price_analysis.get("remembered_at"),
            },
            "factors": analysis_factors,
            "ai": ai_result,
        },
        "news_items": news_items,
        "sources": {
            "brent": latest_brent["source"],
            "brent_url": latest_brent["source_url"],
            "usd_try": latest_usd["source"],
            "usd_try_url": latest_usd["source_url"],
        },
        "calculated_at": calculated_at.isoformat(),
    }
