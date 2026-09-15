# 📈 股票換股計算器 (Stock to Stock Calculator)

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile%20PWA-success.svg?style=for-the-badge)
![Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(Vanilla%20JS)-orange.svg?style=for-the-badge)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blueviolet.svg?style=for-the-badge)

**專為台灣股民量身打造的換股與資金調度試算神器**  
免安裝、無廣告、零後端依賴，手機打開即可直接使用，亦可一鍵加入手機主畫面！

[線上展示 (Demo)](#-線上體驗) • [核心功能](#-核心特色) • [試算情境](#-常見應用情境) • [部署教學](#-快速部署至-github-pages) • [計算公式](#-計算公式說明)

</div>

---

## 🌐 線上體驗

只要推送到 GitHub 並開啟 GitHub Pages，即可擁有專屬線上網址：

> 🔗 **線上網址格式**：`https://<你的GitHub帳號>.github.io/stock2stock/`

---

## ✨ 核心特色

### 1. 🔄 雙向靈活換算
* **🪙 以賣估買 (賣股轉買)**
  * 輸入目前持股的賣出價格與張數，以及目標買入股票的價格。
  * 自動算出實得款項能買進新標的 **「多少張整 + 多少零股」**，並清楚列出買進後的 **找零剩餘現金**。
  * 同時提供「若只買整張不買零股」的對照數據。
* **🎯 以買估賣 (想買湊錢)**
  * 輸入心儀標的價格與想買進的目標張數，以及現有持股的賣出價格。
  * 自動倒推需要賣出 **「多少張股票」** 才能湊足款項，並列出湊足後的 **溢收/找零現金**；亦提供賣精確零股的股數參考。

### 2. 📱 手機體驗深度優化 (Mobile First)
* **原生 App 級操作感**：採用響應式卡片設計 (RWD)，適配各尺寸手機螢幕。
* **數字鍵盤優化**：輸入框自動喚起手機帶小數點的數字鍵盤 (`inputmode="decimal"`)，輸入不卡手。
* **張數快捷調整**：提供 `+1 張`、`+5 張`、`+10 張` 與 `清空` 快捷按鈕。
* **買賣標的一鍵對調**：點擊中間的 `⇅` 按鈕，瞬間將買入與賣出標的及價格對調。
* **一鍵複製摘要**：點擊複製按鈕自動生成排版乾淨整齊的試算報告，方便直接貼到 LINE、筆記或對話群組。

### 3. ⚙️ 精準台股交易成本試算
* **雙模式切換**：可隨時在「純股價市值估算」與「計入手續費與證交稅」間切換。
* **券商手續費折讓**：內建常見折讓（6 折、2.8 折、5 折、3.8 折、2 折、無折扣），亦支援「自訂 %」。
* **最低手續費保護**：支援單筆最低手續費設定（預設 20 元，亦可自訂）。
* **證券交易稅率**：支援現股賣出 (0.3%)、現股當沖 (0.15%)、ETF 賣出 (0.1%)。

### 4. 🌙 質感介面與狀態記憶
* **深淺色主題**：支援深色模式 (Dark Mode)，夜間看盤操作舒適不刺眼。
* **自動保存 (LocalStorage)**：自動記住上次輸入的價格、張數與手續費設定，下次打開即用，不怕資料丟失。

---

## 💡 常見應用情境

### 情境 A：高價股轉買高股息 ETF
> 賣出 1 張台積電 (假設現價 1,000 元)，想全部轉買 0056 (假設現價 38 元) 可以買多少？
* **以賣估買** 計算出：可買進 **26 張** 又 **315 股**，買進後剩餘現金 **$30** 元（若只買 26 整張，則剩餘現金 **$12,000** 元）。

### 情境 B：想買目標股票，算算手頭股票要賣幾張
> 看好某檔潛力股現價 45 元，想買進 5 張（需要約 22.5 萬元），手上有現價 80 元的持股，需要賣幾張才夠？
* **以買估賣** 計算出：需要賣出 **3 張整**，賣出實得約 24 萬元，湊足所需交割款後還會找回約 **$15,000** 元現金。

---

## 📱 手機快速使用密技（加到主畫面當 App）

將網頁加到手機主畫面，打開時全螢幕運作，體驗與原生 App 無異：

* **iOS (Safari)**：
  1. 使用 Safari 開啟線上網址。
  2. 點擊螢幕下方中央的 **「分享」** 按鈕（向上箭頭圖示）。
  3. 滑動選單並點選 **「加入主畫面」**。
* **Android (Chrome)**：
  1. 使用 Chrome 開啟線上網址。
  2. 點擊右上角 **「⋮」** 選單。
  3. 點選 **「加到主螢幕」** 或 **「安裝應用程式」**。

---

## 🚀 快速部署至 GitHub Pages

本專案為純前端設計，無須任何建置工具 (No Node.js / Webpack build required)，直接推送即可使用。

### 步驟 1：在 GitHub 建立 Repository
1. 登入 [GitHub](https://github.com/)。
2. 點擊右上角 **+** $\rightarrow$ 選擇 **New repository**。
3. 儲存庫名稱輸入 `stock2stock`，設定為 **Public**，點擊 **Create repository**。

### 步驟 2：推送到 GitHub
在專案根目錄開啟終端機（PowerShell 或 Bash）執行：

```bash
# 綁定您的 GitHub 遠端儲存庫 (請將 YOUR_USERNAME 換成您的 GitHub 帳號)
git remote add origin https://github.com/YOUR_USERNAME/stock2stock.git

# 切換為主分支並推送
git branch -M main
git push -u origin main
```

### 步驟 3：啟用 GitHub Pages
1. 進入您剛推送的 GitHub 專案頁面。
2. 點擊上方導覽列的 **Settings**（設定）。
3. 在左側選單中找到 **Pages**。
4. 在 **Build and deployment** 區塊：
   - **Source**：選擇 `Deploy from a branch`
   - **Branch**：將 `None` 改選為 **`main`**，路徑維持 **`/(root)`**
   - 點擊 **Save**。
5. 稍候約 1~2 分鐘，重新整理頁面後頂部便會顯示您的專屬網址！

---

## 💻 本地預覽與開發

若想在自己的電腦本機預覽：

1. **直接開啟**：直接雙擊點開 `index.html` 即可在瀏覽器執行。
2. **使用輕量伺服器 (推薦)**：
   ```bash
   # 使用 Python 內建伺服器
   python -m http.server 8080

   # 或使用 Node.js npx serve
   npx serve .
   ```
   瀏覽器打開 `http://localhost:8080` 即可預覽。

---

## 🧮 計算公式說明

依據台灣證券交易所現行交易規則計算：

$$\text{賣出成交金額} = \text{賣出價格} \times \text{賣出股數}$$

$$\text{買入成交金額} = \text{買入價格} \times \text{買入股數}$$

### 交易成本：
* **券商手續費**：$\lfloor \text{成交金額} \times 0.1425\% \times \text{折扣} \rfloor$（若未達最低手續費限制，則以最低手續費計）。
* **證券交易稅**：$\lfloor \text{賣出成交金額} \times 0.3\% \rfloor$（僅賣出時由政府課徵；若為當沖為 0.15%，ETF 為 0.1%）。
* **賣出實收金額**：$\text{賣出成交金額} - \text{賣出手續費} - \text{證交稅}$
* **買入實付金額**：$\text{買入成交金額} + \text{買入手續費}$

---

## 📂 專案檔案架構

```
stock2stock/
├── index.html        # 網頁結構與手機端優化 Meta (PWA ready)
├── css/
│   └── style.css     # 現代高質感卡片樣式、RWD、深淺主題變色
├── js/
│   ├── calculator.js # 核心計算數學邏輯 (支援 Node.js 與 Browser)
│   └── app.js        # DOM 互動、即時聯動、LocalStorage、剪貼簿複製
└── README.md         # 專案說明與 GitHub 上線指引
```

---

## 📄 授權條款 (License)

本專案基於 [MIT License](LICENSE) 條款開放原始碼，任何人皆可自由使用、修改、再發布或進行商業應用。

---

<div align="center">
  <sub>Made with ❤️ for Taiwan Stock Investors. 祝各位投資順遂、獲利滿滿！</sub>
</div>
