# Giriş sistemi kurulumu

Uygulamadaki e-posta/parola girişi ve kullanıcıya özel profil/geçmiş Vercel Postgres üzerinde çalışır. Tablo şeması ilk API çağrısında otomatik oluşur.

Vercel projesi **Footandhealth** için Production ve Preview ortamlarına şu değişkenleri ekleyin:

| Değişken | Değer |
| --- | --- |
| `AUTH_SECRET` | En az 32 karakterlik rastgele gizli anahtar |
| `APP_URL` | `https://footandhealth.vercel.app` |
| `GOOGLE_CLIENT_ID` | Google Cloud OAuth 2.0 Web Client ID |
| `GOOGLE_CLIENT_SECRET` | Google Cloud OAuth 2.0 Web Client secret |

Google Cloud Console'da OAuth istemci türü **Web application** olmalı ve şu yetkili yönlendirme URI'si eklenmelidir:

`https://footandhealth.vercel.app/api/auth/google/callback`

Geliştirme ortamı için ayrıca şunu ekleyebilirsiniz:

`http://localhost:8081/api/auth/google/callback`

Gizli değerleri Git'e koymayın ve sohbet içinde paylaşmayın. Değişkenler eklendikten sonra Vercel'de yeniden deploy edin.
