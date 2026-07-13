# Mobil Yenileme Backend Tetikleyici

Uygulamadaki yenileme butonu `refresh-prices` Supabase Edge Function'ini cagirir. Function, GitHub Actions uzerindeki `guncelle.yml` workflow'unu guvenli sekilde server tarafindan tetikler.

## Secret'lar

Supabase Edge Function secret olarak sunlari bekler:

```text
GITHUB_ACTION_TOKEN=<GitHub fine-grained token>
GITHUB_OWNER=EkremTezcanSaridag
GITHUB_REPO=fuel-tracker
GITHUB_WORKFLOW=guncelle.yml
GITHUB_REF=main
```

`GITHUB_ACTION_TOKEN` icin repo uzerinde Actions workflow calistirma yetkisi olan fine-grained token kullanilir. Token APK icine yazilmaz.

## Deploy

```bash
supabase functions deploy refresh-prices --project-ref phmmqamvornjwtcrbioh
supabase secrets set GITHUB_ACTION_TOKEN=... GITHUB_OWNER=EkremTezcanSaridag GITHUB_REPO=fuel-tracker GITHUB_WORKFLOW=guncelle.yml GITHUB_REF=main --project-ref phmmqamvornjwtcrbioh
```

## Akis

1. Kullanici uygulamada yenilemeye basar.
2. Mobil app `supabase.functions.invoke('refresh-prices')` cagirir.
3. Edge Function GitHub `workflow_dispatch` istegi atar.
4. GitHub Action fiyatlari, son 24 saatin haberlerini, haber-merkezli analizi ve bildirimleri yeniden calistirir.
5. Action bitince yeni veriler Supabase tablolarina yazilir.

Not: Workflow asenkron calisir. Uygulama ilk anda "Backend guncelleme siraya alindi" mesajini gosterir; fiyatlar Action tamamlaninca sonraki okumada yenilenir.
