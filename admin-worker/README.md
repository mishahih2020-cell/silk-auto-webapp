# Admin Worker — прокси для кнопки «Обновить базу машин»

Маленький Cloudflare Worker (бесплатный тариф), который безопасно связывает
кнопку в админке Mini App с GitHub Actions. Токены живут только здесь, в
секретах Worker'а — не в репозитории и не в клиентском коде.

## Что нужно перед деплоем

1. **Аккаунт Cloudflare** (бесплатный) — https://dash.cloudflare.com/sign-up
2. **API-токен Cloudflare** с правом на редактирование Workers:
   Dashboard → My Profile → API Tokens → Create Token → шаблон
   "Edit Cloudflare Workers".
3. **Account ID Cloudflare** — виден в правой панели дашборда.
4. **GitHub fine-grained personal access token**, выданный только на репозиторий
   `silk-auto-webapp`, с правом **Actions: Read and write**:
   GitHub → Settings → Developer settings → Fine-grained tokens → Generate new.
5. **Пароль администратора** — придумайте сами, его будете вводить в
   разделе «Администрирование» в приложении.

## Деплой

```bash
cd admin-worker
npm install -g wrangler   # если ещё не установлен
export CLOUDFLARE_API_TOKEN=...   # токен из пункта 2
wrangler deploy --account-id <account-id-из-пункта-3>
wrangler secret put GH_PAT           # вставить токен из пункта 4
wrangler secret put ADMIN_PASSWORD   # вставить пароль из пункта 5
```

После деплоя wrangler выведет адрес вида
`https://potatuev-auto-admin.<ваш-субдомен>.workers.dev` — его нужно
вставить в `app.js` вместо `ADMIN_WORKER_URL = '...'` в самом начале файла,
закоммитить и запушить.

## Проверка

```bash
curl https://potatuev-auto-admin.<субдомен>.workers.dev/status
```

Должен вернуться JSON со статусом последнего запуска workflow (или
`{"status":"none"}`, если синхронизаций ещё не было).
