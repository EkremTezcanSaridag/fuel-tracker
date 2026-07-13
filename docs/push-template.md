# Faz Commit ve Push Sablonu

Her faz commit/push aciklamasi icin kok dizindeki `.gitmessage` dosyasi kullanilir.
Repo yerel olarak `git config commit.template .gitmessage` komutuyla bu sablona baglanir.

## Commit Basligi

```text
Faz: <kisa ve net is>
```

## Commit Aciklamasi

```text
- [x] Degisiklik: <ne yapildi>
- [x] Neden: <hangi sorun/cozum icin yapildi>
- [x] Etki: <mobil/backend/db/build tarafinda ne degisti>
- [x] Test: <hangi komutlar veya manuel kontroller gecti>
- [x] Not: <SQL, secret, build, aksiyon veya kullanici adimi>
- [x] Sonraki: <bir sonraki faz>
```

## Final Rapor Basliklari

```text
Commit: <hash>
Push: main
Degisenler:
- ...
Kontroller:
- ...
Kullanici adimi:
- ...
Sonraki faz:
- ...
```
