/**
 * 股票換股計算器 (Stock to Stock)
 * 前端互動與狀態控制邏輯
 */

(function () {
  'use strict';

  // 狀態管理
  const state = {
    mode: 'sell-to-buy', // 'sell-to-buy' 或 'buy-to-sell'
    sellName: '',
    sellPrice: 100,
    sellLots: 1,
    buyName: '',
    buyPrice: 25,
    buyLots: 4,
    includeFees: false,
    feeDiscount: 0.6,    // 預設 6 折
    customDiscount: 60,  // 自訂折扣 %
    minFee: 20,
    taxRate: 0.003,      // 現股 0.3%
    sharesPerLot: 1000
  };

  // DOM 元素引用
  const el = {
    // 主題
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    resetBtn: document.getElementById('resetBtn'),

    // 模式切換 Tabs
    tabSellToBuy: document.getElementById('tabSellToBuy'),
    tabBuyToSell: document.getElementById('tabBuyToSell'),

    // 賣出卡片
    sellCardTitle: document.getElementById('sellCardTitle'),
    sellNameInput: document.getElementById('sellNameInput'),
    sellPriceInput: document.getElementById('sellPriceInput'),
    sellLotsGroup: document.getElementById('sellLotsGroup'),
    sellLotsInput: document.getElementById('sellLotsInput'),

    // 買賣互換
    swapBtn: document.getElementById('swapBtn'),

    // 買入卡片
    buyCardTitle: document.getElementById('buyCardTitle'),
    buyNameInput: document.getElementById('buyNameInput'),
    buyPriceInput: document.getElementById('buyPriceInput'),
    buyLotsGroup: document.getElementById('buyLotsGroup'),
    buyLotsInput: document.getElementById('buyLotsInput'),

    // 費用設定
    feeToggle: document.getElementById('feeToggle'),
    feeDetails: document.getElementById('feeDetails'),
    feeDiscountSelect: document.getElementById('feeDiscountSelect'),
    customDiscountGroup: document.getElementById('customDiscountGroup'),
    customDiscountInput: document.getElementById('customDiscountInput'),
    minFeeInput: document.getElementById('minFeeInput'),
    taxRateSelect: document.getElementById('taxRateSelect'),

    // 結果區域
    resultCard: document.getElementById('resultCard'),
    resultHeroLabel: document.getElementById('resultHeroLabel'),
    resultHeroValue: document.getElementById('resultHeroValue'),
    resultHeroSub: document.getElementById('resultHeroSub'),

    // 統計卡片
    valSellProceeds: document.getElementById('valSellProceeds'),
    valBuyCost: document.getElementById('valBuyCost'),
    valLeftoverCash: document.getElementById('valLeftoverCash'),
    valTotalFees: document.getElementById('valTotalFees'),

    // 明細表格
    tableSellPrice: document.getElementById('tableSellPrice'),
    tableSellFee: document.getElementById('tableSellFee'),
    tableSellTax: document.getElementById('tableSellTax'),
    tableBuyPrice: document.getElementById('tableBuyPrice'),
    tableBuyFee: document.getElementById('tableBuyFee'),
    feeDetailsRows: document.querySelectorAll('.fee-detail-row'),

    // 操作按鈕
    copyBtn: document.getElementById('copyBtn'),
    toast: document.getElementById('toast')
  };

  // 格式化數字千分位
  function formatMoney(num) {
    if (isNaN(num) || num === null || num === undefined) return '0';
    return new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 0 }).format(Math.round(num));
  }

  function formatDecimal(num, digits = 2) {
    if (isNaN(num) || num === null || num === undefined) return '0';
    return new Intl.NumberFormat('zh-TW', {
      minimumFractionDigits: 0,
      maximumFractionDigits: digits
    }).format(num);
  }

  // Toast 提示
  let toastTimer = null;
  function showToast(msg) {
    if (!el.toast) return;
    el.toast.textContent = msg;
    el.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.toast.classList.remove('show');
    }, 2200);
  }

  // 本地快照儲存與載入
  function saveState() {
    try {
      localStorage.setItem('stock2stock_state', JSON.stringify({
        mode: state.mode,
        sellName: state.sellName,
        sellPrice: state.sellPrice,
        sellLots: state.sellLots,
        buyName: state.buyName,
        buyPrice: state.buyPrice,
        buyLots: state.buyLots,
        includeFees: state.includeFees,
        feeDiscount: state.feeDiscount,
        customDiscount: state.customDiscount,
        minFee: state.minFee,
        taxRate: state.taxRate
      }));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  function loadState() {
    try {
      const saved = localStorage.getItem('stock2stock_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed);
      }
    } catch (e) {
      console.warn('LocalStorage load failed:', e);
    }
  }

  // 模式切換 UI 刷新
  function updateModeUI() {
    if (state.mode === 'sell-to-buy') {
      el.tabSellToBuy.classList.add('active');
      el.tabBuyToSell.classList.remove('active');

      // 賣出張數顯示，買入張數隱藏（由計算得出）
      el.sellLotsGroup.style.display = 'block';
      el.buyLotsGroup.style.display = 'none';

      el.resultHeroLabel.textContent = '可買進買入股票';
    } else {
      el.tabBuyToSell.classList.add('active');
      el.tabSellToBuy.classList.remove('active');

      // 買入張數顯示，賣出張數隱藏（由計算得出）
      el.sellLotsGroup.style.display = 'none';
      el.buyLotsGroup.style.display = 'block';

      el.resultHeroLabel.textContent = '需賣出持股以湊足資金';
    }
  }

  // 取得有效折扣數值
  function getEffectiveDiscount() {
    if (state.feeDiscount === 'custom') {
      return (parseFloat(state.customDiscount) || 100) / 100;
    }
    return parseFloat(state.feeDiscount) || 1.0;
  }

  // 核心執行計算與渲染
  function recalculate() {
    // 同步表單數據至狀態
    state.sellName = el.sellNameInput.value.trim();
    state.sellPrice = parseFloat(el.sellPriceInput.value) || 0;
    state.sellLots = parseFloat(el.sellLotsInput.value) || 0;

    state.buyName = el.buyNameInput.value.trim();
    state.buyPrice = parseFloat(el.buyPriceInput.value) || 0;
    state.buyLots = parseFloat(el.buyLotsInput.value) || 0;

    state.includeFees = el.feeToggle.checked;
    state.feeDiscount = el.feeDiscountSelect.value;
    state.customDiscount = parseFloat(el.customDiscountInput.value) || 60;
    state.minFee = parseFloat(el.minFeeInput.value) || 0;
    state.taxRate = parseFloat(el.taxRateSelect.value) || 0.003;

    // 自訂折扣欄位顯示判斷
    el.customDiscountGroup.style.display = (state.feeDiscount === 'custom') ? 'block' : 'none';

    // 費用明細行顯示判斷
    el.feeDetailsRows.forEach(row => {
      row.style.display = state.includeFees ? 'table-row' : 'none';
    });

    const config = {
      sharesPerLot: state.sharesPerLot,
      feeDiscount: getEffectiveDiscount(),
      minFee: state.minFee,
      taxRate: state.taxRate,
      includeFees: state.includeFees
    };

    saveState();

    if (state.mode === 'sell-to-buy') {
      renderSellToBuy(config);
    } else {
      renderBuyToSell(config);
    }
  }

  // 渲染模式 A (以賣估買)
  function renderSellToBuy(config) {
    const sellShares = state.sellLots * state.sharesPerLot;
    const result = window.StockCalculator.calculateSellToBuy(state.sellPrice, sellShares, state.buyPrice, config);

    if (!result || state.sellPrice <= 0 || state.buyPrice <= 0 || state.sellLots <= 0) {
      el.resultHeroValue.innerHTML = `<span style="font-size:1.4rem; color:var(--text-muted)">請輸入完整買賣價格與張數</span>`;
      el.resultHeroSub.innerHTML = '';
      el.valSellProceeds.textContent = '$0';
      el.valBuyCost.textContent = '$0';
      el.valLeftoverCash.textContent = '$0';
      el.valTotalFees.textContent = '$0';
      return;
    }

    // 大字結論
    if (result.buyOddShares > 0) {
      el.resultHeroValue.innerHTML = `${result.buyLots}<span class="unit">張</span> + ${result.buyOddShares}<span class="unit">股</span>`;
      el.resultHeroSub.innerHTML = `共可買 <strong class="money">${formatMoney(result.totalBuyShares)}</strong> 股｜剩餘現金 <strong class="money">$${formatMoney(result.leftoverCash)}</strong>`;
    } else {
      el.resultHeroValue.innerHTML = `${result.buyLots}<span class="unit">張整</span>`;
      el.resultHeroSub.innerHTML = `可剛好買滿｜剩餘現金 <strong class="money">$${formatMoney(result.leftoverCash)}</strong>`;
    }

    // 若有整張不買零股的比較
    if (result.buyOddShares > 0) {
      el.resultHeroSub.innerHTML += `<br><span style="font-size:0.78rem; color:var(--text-secondary)">（若只買整張 ${result.lotOnly.lots} 張，可剩現金 <strong>$${formatMoney(result.lotOnly.leftoverCash)}</strong>）</span>`;
    }

    // 統計卡片
    el.valSellProceeds.textContent = `$${formatMoney(result.sellInfo.net)}`;
    el.valBuyCost.textContent = `$${formatMoney(result.buyCostInfo.net)}`;
    el.valLeftoverCash.textContent = `$${formatMoney(result.leftoverCash)}`;

    const totalFees = (result.sellInfo.fee || 0) + (result.sellInfo.tax || 0) + (result.buyCostInfo.fee || 0);
    el.valTotalFees.textContent = state.includeFees ? `$${formatMoney(totalFees)}` : '未計費用';

    // 明細表格
    el.tableSellPrice.textContent = `$${formatMoney(result.sellInfo.gross)}`;
    el.tableSellFee.textContent = `-$${formatMoney(result.sellInfo.fee)}`;
    el.tableSellTax.textContent = `-$${formatMoney(result.sellInfo.tax)}`;
    el.tableBuyPrice.textContent = `$${formatMoney(result.buyCostInfo.gross)}`;
    el.tableBuyFee.textContent = `+$${formatMoney(result.buyCostInfo.fee)}`;
  }

  // 渲染模式 B (以買估賣)
  function renderBuyToSell(config) {
    const buyShares = state.buyLots * state.sharesPerLot;
    const result = window.StockCalculator.calculateBuyToSell(state.buyPrice, buyShares, state.sellPrice, config);

    if (!result || state.buyPrice <= 0 || state.sellPrice <= 0 || state.buyLots <= 0) {
      el.resultHeroValue.innerHTML = `<span style="font-size:1.4rem; color:var(--text-muted)">請輸入完整買賣價格與張數</span>`;
      el.resultHeroSub.innerHTML = '';
      el.valSellProceeds.textContent = '$0';
      el.valBuyCost.textContent = '$0';
      el.valLeftoverCash.textContent = '$0';
      el.valTotalFees.textContent = '$0';
      return;
    }

    // 大字結論：最少需賣出整張張數
    const lotsNeeded = result.lotOnly.lotsNeeded;
    el.resultHeroValue.innerHTML = `${lotsNeeded}<span class="unit">張整</span>`;

    let subHtml = `賣出 ${lotsNeeded} 張實得 <strong class="money">$${formatMoney(result.lotOnly.proceeds.net)}</strong>，湊足後找零 <strong class="money">$${formatMoney(result.lotOnly.surplusCash)}</strong>`;
    if (result.exactSharesNeeded !== result.lotOnly.totalShares) {
      subHtml += `<br><span style="font-size:0.78rem; color:var(--text-secondary)">（若賣精確零股：只需賣 <strong>${result.exactSellLots} 張 + ${result.exactOddShares} 股</strong>，共 ${formatMoney(result.exactSharesNeeded)} 股）</span>`;
    }
    el.resultHeroSub.innerHTML = subHtml;

    // 統計卡片
    el.valSellProceeds.textContent = `$${formatMoney(result.lotOnly.proceeds.net)}`;
    el.valBuyCost.textContent = `$${formatMoney(result.buyCostInfo.net)}`;
    el.valLeftoverCash.textContent = `$${formatMoney(result.lotOnly.surplusCash)}`;

    const totalFees = (result.lotOnly.proceeds.fee || 0) + (result.lotOnly.proceeds.tax || 0) + (result.buyCostInfo.fee || 0);
    el.valTotalFees.textContent = state.includeFees ? `$${formatMoney(totalFees)}` : '未計費用';

    // 明細表格
    el.tableSellPrice.textContent = `$${formatMoney(result.lotOnly.proceeds.gross)}`;
    el.tableSellFee.textContent = `-$${formatMoney(result.lotOnly.proceeds.fee)}`;
    el.tableSellTax.textContent = `-$${formatMoney(result.lotOnly.proceeds.tax)}`;
    el.tableBuyPrice.textContent = `$${formatMoney(result.buyCostInfo.gross)}`;
    el.tableBuyFee.textContent = `+$${formatMoney(result.buyCostInfo.fee)}`;
  }

  // 買賣標的互換 (Swap)
  function swapStocks() {
    const tempName = el.sellNameInput.value;
    const tempPrice = el.sellPriceInput.value;

    el.sellNameInput.value = el.buyNameInput.value;
    el.sellPriceInput.value = el.buyPriceInput.value;

    el.buyNameInput.value = tempName;
    el.buyPriceInput.value = tempPrice;

    showToast('已對調買入與賣出標的');
    recalculate();
  }

  // 一鍵複製文字摘要
  function copySummary() {
    const sellTitle = state.sellName ? `${state.sellName} ($${state.sellPrice})` : `賣出股 ($${state.sellPrice})`;
    const buyTitle = state.buyName ? `${state.buyName} ($${state.buyPrice})` : `買入股 ($${state.buyPrice})`;

    let text = `【股票換股試算結果】\n`;
    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📤 賣出標的：${sellTitle}\n`;
    text += `📥 買入標的：${buyTitle}\n`;
    text += `⚙️ 計算模式：${state.mode === 'sell-to-buy' ? '以賣估買 (賣股轉買)' : '以買估賣 (想買湊錢)'}\n`;
    text += `💰 交易費用：${state.includeFees ? '含手續費與證交稅' : '純市值估算 (不計手續費/稅)'}\n`;
    text += `────────────────────\n`;

    if (state.mode === 'sell-to-buy') {
      text += `• 預計賣出：${state.sellLots} 張 (${formatMoney(state.sellLots * 1000)} 股)\n`;
      text += `• 賣出淨得：${el.valSellProceeds.textContent}\n`;
      text += `• 🎯 可買進：${el.resultHeroValue.textContent.replace(/\s+/g, ' ').trim()}\n`;
      text += `• 買入花費：${el.valBuyCost.textContent}\n`;
      text += `• 剩餘現金：${el.valLeftoverCash.textContent}\n`;
    } else {
      text += `• 目標買入：${state.buyLots} 張 (${formatMoney(state.buyLots * 1000)} 股)\n`;
      text += `• 買入花費：${el.valBuyCost.textContent}\n`;
      text += `• 🎯 需賣出：${el.resultHeroValue.textContent.replace(/\s+/g, ' ').trim()}\n`;
      text += `• 賣出淨得：${el.valSellProceeds.textContent}\n`;
      text += `• 找零現金：${el.valLeftoverCash.textContent}\n`;
    }

    if (state.includeFees) {
      text += `• 預估稅費：${el.valTotalFees.textContent}\n`;
    }
    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📱 stock2stock 換股計算器`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('已複製試算摘要到剪貼簿！');
      }).catch(() => {
        fallbackCopyText(text);
      });
    } else {
      fallbackCopyText(text);
    }
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('已複製試算摘要到剪貼簿！');
    } catch (err) {
      showToast('複製失敗，請手動選取');
    }
    document.body.removeChild(textArea);
  }

  // 主題切換
  function initTheme() {
    const savedTheme = localStorage.getItem('stock2stock_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      el.themeToggleBtn.textContent = '☀️';
    } else {
      document.documentElement.removeAttribute('data-theme');
      el.themeToggleBtn.textContent = '🌙';
    }
  }

  function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      el.themeToggleBtn.textContent = '🌙';
      localStorage.setItem('stock2stock_theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      el.themeToggleBtn.textContent = '☀️';
      localStorage.setItem('stock2stock_theme', 'dark');
    }
  }

  // 重設為預設值
  function resetAll() {
    state.sellName = '';
    state.sellPrice = 100;
    state.sellLots = 1;
    state.buyName = '';
    state.buyPrice = 25;
    state.buyLots = 4;
    state.includeFees = false;
    state.feeDiscount = 0.6;
    state.minFee = 20;
    state.taxRate = 0.003;

    populateForm();
    recalculate();
    showToast('已重設為預設數值');
  }

  // 將狀態帶入 HTML 輸入欄位
  function populateForm() {
    el.sellNameInput.value = state.sellName || '';
    el.sellPriceInput.value = state.sellPrice || '';
    el.sellLotsInput.value = state.sellLots || 1;

    el.buyNameInput.value = state.buyName || '';
    el.buyPriceInput.value = state.buyPrice || '';
    el.buyLotsInput.value = state.buyLots || 1;

    el.feeToggle.checked = !!state.includeFees;
    el.feeDiscountSelect.value = state.feeDiscount || '0.6';
    el.customDiscountInput.value = state.customDiscount || 60;
    el.minFeeInput.value = state.minFee || 20;
    el.taxRateSelect.value = state.taxRate || 0.003;

    updateModeUI();
  }

  // 事件綁定
  function bindEvents() {
    // 模式切換 Tabs
    el.tabSellToBuy.addEventListener('click', () => {
      state.mode = 'sell-to-buy';
      updateModeUI();
      recalculate();
    });

    el.tabBuyToSell.addEventListener('click', () => {
      state.mode = 'buy-to-sell';
      updateModeUI();
      recalculate();
    });

    // 數值變動監聽 (支援即時計算)
    const liveInputs = [
      el.sellNameInput, el.sellPriceInput, el.sellLotsInput,
      el.buyNameInput, el.buyPriceInput, el.buyLotsInput,
      el.customDiscountInput, el.minFeeInput
    ];
    liveInputs.forEach(input => {
      input.addEventListener('input', recalculate);
      // 點擊自動選取
      input.addEventListener('focus', () => {
        if (input.type === 'number') input.select();
      });
    });

    el.feeToggle.addEventListener('change', recalculate);
    el.feeDiscountSelect.addEventListener('change', recalculate);
    el.taxRateSelect.addEventListener('change', recalculate);

    // 快捷增減張數按鈕
    document.querySelectorAll('.tag-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetInputId = btn.getAttribute('data-target');
        const action = btn.getAttribute('data-action');
        const targetInput = document.getElementById(targetInputId);
        if (!targetInput) return;

        let val = parseFloat(targetInput.value) || 0;
        if (action === 'clear') {
          val = 0;
        } else if (action.startsWith('+')) {
          const add = parseFloat(action.substring(1));
          val += add;
        } else if (action.startsWith('-')) {
          const sub = parseFloat(action.substring(1));
          val = Math.max(0, val - sub);
        }
        targetInput.value = val;
        recalculate();
      });
    });

    // 互換標的
    el.swapBtn.addEventListener('click', swapStocks);

    // 複製與主題
    el.copyBtn.addEventListener('click', copySummary);
    el.themeToggleBtn.addEventListener('click', toggleTheme);
    el.resetBtn.addEventListener('click', resetAll);
  }

  // 初始化入口
  function init() {
    initTheme();
    loadState();
    populateForm();
    bindEvents();
    recalculate();
  }

  // DOM 載入後啟動
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
