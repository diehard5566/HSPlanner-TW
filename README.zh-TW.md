# HSPlanner 繁體中文版

[English](README.md) | **繁體中文**

## 介紹

HSPlanner 是 Hero Siege 的桌面 Build Planner，可規劃角色屬性、Incarnation Tree、Ether Tree、技能與子技能、裝備、傭兵、Affix、Stats、Loot Filter，以及產生 Build 分享連結。

此 Fork 保留英文介面，並加入繁體中文顯示。Hero Siege 的道具、技能、子技能、Ether 與屬性等專有名詞優先採用遊戲翻譯 CSV 的 `zh` 欄位；官方翻譯缺漏時顯示英文，不自行創造譯名。

## 主要功能

- 即時計算傷害、防禦、有效生命值與各項屬性
- Incarnation／Ether 天賦樹配置、路徑預覽與重設
- 技能、子技能、裝備、插槽、符文、寶石、套裝與 Runeword
- 傭兵裝備與貢獻
- 多個 Build、Profile、筆記及分享連結
- Loot Filter 編輯與「從 Build 產生」
- English／繁體中文切換，語言設定會保存在本機

## 安裝

請從本 Fork 的 Releases 頁面下載對應作業系統的版本。Windows 安裝檔通常為 `HSPlanner-x64-setup.exe`。預先建置的應用程式不需要另外安裝 Node.js 或 Rust。

## 基本使用

開啟或建立 Build 後，先在「設定」選擇職業與等級，再配置技能、天賦樹和裝備。「屬性」頁會彙總計算結果。右上角設定視窗可在 English 與繁體中文間切換；切換語言不會改變 Build 資料。

## 繁中 Fork 差異

- Planner 主要 UI 的繁體中文顯示
- Hero Siege 官方 CSV 提供的道具、技能、子技能、Ether 與屬性翻譯
- 道具、技能與屬性的中英文搜尋
- 中文系統字型 fallback
- Build、Profile、分享連結與 Loot Filter 持續使用 canonical ID／語法，中文只存在於顯示層

## 開發

需求：Node.js 22.x、npm 11.x、Rust stable（至少 1.82）與對應平台的 Tauri prerequisites。

```bash
npm install
npm run generate:i18n
npm test
npm run tauri:dev
```

更新遊戲翻譯與 identity 安全規則請參閱 [Localization 開發文件](docs/LOCALIZATION.md)。

## 原始專案

[HeroSiegePlanner/HSPlanner](https://github.com/HeroSiegePlanner/HSPlanner)

## 授權

沿用原 repository 的 [MIT License](LICENSE)。
