# Localization

HSPlanner 將 canonical 遊戲／Build 資料與顯示文字分開。翻譯只影響 UI，不得成為 Item、Skill、Affix、Talent node、Ether node、Build、Profile、Share URL 或 Loot Filter 的 identity。

## 結構

- `language/translations*.csv`：Hero Siege 官方 pipe-delimited 翻譯資料。
- `tools/localization/parse-translations.mjs`：容錯 parser。
- `tools/localization/generate-localization.mjs`：build-time generator。
- `frontend/localization/gameTranslations.generated.ts`：runtime map；請勿手動修改。
- `frontend/localization/i18n.ts`：Planner UI dictionary 與 `useI18n()`。
- `frontend/localization/game.ts`：遊戲資料 lookup 與雙語搜尋 helper。
- `frontend/store/settings.ts`：`en`／`zh-TW` locale persistence；舊設定預設為 `en`。

## 更新翻譯

將新賽季的 canonical CSV 放入 `language/`，維持既有檔名，接著執行：

```bash
npm run generate:i18n
npm test
npm run lint
npm run parity
```

正式 build 會先自動執行 generator。App 啟動時不會解析 CSV。

Parser 將 `[en]` 視為 `en`、`zh` 視為 `zh-TW`，保留 UTF-8，忽略空白／section row。單列 malformed 資料只會提出 warning；duplicate key 固定保留第一筆並提出 warning。整份檔案找不到可用的 `en`／`zh` header 才會失敗。

## Fallback

遊戲資料的顯示順序為：

1. CSV `zh`
2. CSV `en`
3. Planner canonical English
4. raw translation key

沒有官方 `zh` 時請保留英文，不要自行補上看似官方的專有名詞。Planner 自有 UI 文字則在 `i18n.ts` 以 semantic key 維護。

## 新增語言

1. 在 `frontend/localization/locales.ts` 新增穩定 locale ID。
2. 在 `i18n.ts` 提供完整 UI dictionary。
3. 擴充 generator 與 game lookup 以輸出該語言欄位。
4. 在 Settings language selector 加入選項。
5. 新增 fallback、persistence、搜尋及 compatibility tests。

## Identity 安全

以下資料必須維持 canonical：

- `data/*.json` 與 season patch 中的 ID、關聯、數值和 graph edge
- Build／Profile save schema 與 Share URL payload
- Skill prerequisite、rank、sub-skill relationship
- Affix family、tier、roll range、tag
- Loot Filter keyword、stat code、item／rarity identifier與輸出 syntax

搜尋索引可以合併 canonical English 與 localized display name，但 selection value 必須仍是原 ID。Notes、Build 名稱與 Profile 名稱是使用者內容，不翻譯。
