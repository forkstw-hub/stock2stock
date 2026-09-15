# 📈 股票換股計算器 (Stock to Stock Calculator)

> 專為台灣股民量身打造的股票換股與資金轉換線上計算器。  
> 純前端實作，零伺服器負擔，直接放上 GitHub 即可透過 **GitHub Pages** 提供線上使用，手機瀏覽器完美適配！

---

## ✨ 核心特色

1. **雙向換算模式**
   - 🪙 **以賣估買 (賣股轉買)**：輸入目前想賣的股票價格與張數，自動算出賣出金額可買入新股票多少「整張 + 零股」，以及買進後的找零現金。
   - 🎯 **以買估賣 (想買湊錢)**：輸入目標想買的新股票價格與張數，自動算出需賣出多少張舊股票才能湊足款項，並列出湊足後的結餘金額。
2. **📱 手機體驗高度優化 (Mobile-First)**
   - 數字鍵盤自動喚起（`inputmode="decimal"`）。
   - 快捷張數調整按鈕（`+1`、`+5`、`+10`、`清空`）。
   - 買賣標的與價格一鍵對調（⇄ Swap）。
   - 一鍵複製文字摘要（格式清晰整齊，方便直接貼到 LINE、Telegram 或筆記）。
3. **⚙️ 靈活費用設定 (台股規則)**
   - 支援「純股價估算」或「精準試算」。
   - 可自訂券商手續費折扣（預設 6 折、2.8 折、5 折、自訂 %）。
   - 支援單筆最低手續費（預設 20 元）。
   - 支援證交稅率設定（現股 0.3%、當沖 0.15%、ETF 0.1%）。
4. **🌙 深色/淺色主題與自動記憶**
   - 支援深色模式切換，夜晚看盤不刺眼。
   - 自動記憶上次輸入數值，重開網頁免重新打字。

---

## 🚀 如何上傳到 GitHub 並開啟線上網頁 (GitHub Pages)

本專案無需任何 Node.js 建置（Build）指令，直接將程式碼推送至 GitHub 儲存庫即可啟用。

### 步驟 1：在 GitHub 建立新儲存庫 (Repository)
1. 登入 [GitHub](https://github.com/)。
2. 點擊右上角 **+** 號 $\rightarrow$ 選擇 **New repository**。
3. Repository name 輸入例如 `stock2stock`。
4. 設為 **Public**，點擊 **Create repository**。

### 步驟 2：將本地程式碼推送到 GitHub
在您的電腦終端機（Terminal / PowerShell）中進入本專案目錄執行：

```bash
# 1. 將所有檔案加入暫存區
git add .

# 2. 建立提交
git commit -m "feat: 完成股票換股計算器網頁與手機版優化"

# 3. 綁定您在 GitHub 建立的遠端庫 (請替換 YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/stock2stock.git

# 4. 推送至 main 分支
git branch -M main
git push -u origin main
```

### 步驟 3：啟用 GitHub Pages (免費線上網址)
1. 進入您剛建立的 GitHub 專案頁面。
2. 點擊上方的 **Settings**（設定）。
3. 在左側選單點擊 **Pages**。
4. 在 **Build and deployment** 下方的 **Branch**：
   - 將 `None` 改選為 **`main`**。
   - 資料夾保持選擇 **`/(root)`**。
   - 點擊 **Save**。
5. 等待 1~2 分鐘後重新整理頁面，最上方會出現您的專屬線上網址：
   > `https://YOUR_USERNAME.github.io/stock2stock/`

---

## 📱 手機快速使用密技（加到主畫面當 App 用）

用手機瀏覽器打開 GitHub Pages 網址後，可以將它變成手機 App：
* **iPhone (Safari)**：
  點擊底部「分享」按鈕（向上箭頭） $\rightarrow$ 選擇 **「加入主畫面」**。
* **Android (Chrome)**：
  點擊右上角「⋮」選單 $\rightarrow$ 選擇 **「加到主螢幕」** 或 **「安裝應用程式」**。

---

## 📁 檔案結構

```
stock2stock/
├── index.html        # 網頁結構與手機端優化 Meta
├── css/
│   └── style.css     # 響應式現代卡片樣式、金融質感、深淺主題
├── js/
│   ├── calculator.js # 核心換股數學邏輯（含台股手續費與稅金公式）
│   └── app.js        # 前端互動、即時計算、一鍵複製、LocalStorage 記憶
└── README.md         # 專案說明與 GitHub Pages 上線教學
```

---

## 📄 授權條款

MIT License - 開源免費，歡迎依個人需求自由修改或分享！
