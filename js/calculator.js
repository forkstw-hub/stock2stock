/**
 * 股票換股計算核心邏輯
 * 支援台股一般交易（1張 = 1,000股）及無費用/含費用雙模式
 */

const DEFAULT_CONFIG = {
  sharesPerLot: 1000,          // 每張股數
  feeRate: 0.001425,           // 基本手續費率 0.1425%
  feeDiscount: 1.0,            // 手續費折扣 (如 0.6 代表 6折)
  minFee: 20,                  // 最低手續費 (元)
  taxRate: 0.003,              // 證券交易稅 0.3% (賣出收取)
  includeFees: false           // 是否計入手續費與稅金
};

/**
 * 計算賣出股票相關金額
 */
function calculateSellProceeds(price, shares, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const gross = Math.floor(price * shares);

  if (!cfg.includeFees) {
    return {
      gross,
      fee: 0,
      tax: 0,
      net: gross
    };
  }

  // 手續費計算（取整數）
  let rawFee = Math.floor(gross * cfg.feeRate * cfg.feeDiscount);
  if (cfg.minFee > 0 && rawFee < cfg.minFee && gross > 0) {
    rawFee = cfg.minFee;
  }

  // 證交稅
  const tax = Math.floor(gross * cfg.taxRate);
  const net = gross - rawFee - tax;

  return {
    gross,
    fee: rawFee,
    tax,
    net: Math.max(0, net)
  };
}

/**
 * 計算買入股票所需花費
 */
function calculateBuyCost(price, shares, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const gross = Math.floor(price * shares);

  if (!cfg.includeFees) {
    return {
      gross,
      fee: 0,
      net: gross
    };
  }

  let rawFee = Math.floor(gross * cfg.feeRate * cfg.feeDiscount);
  if (cfg.minFee > 0 && rawFee < cfg.minFee && gross > 0) {
    rawFee = cfg.minFee;
  }

  const net = gross + rawFee;

  return {
    gross,
    fee: rawFee,
    net
  };
}

/**
 * 模式 A：以賣估買 (已知賣出張數/股數，計算可買入多少)
 * @param {number} sellPrice 賣出價格
 * @param {number} sellShares 賣出總股數
 * @param {number} buyPrice 欲買入價格
 * @param {object} config 設定參數
 */
function calculateSellToBuy(sellPrice, sellShares, buyPrice, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  if (sellPrice <= 0 || sellShares <= 0 || buyPrice <= 0) {
    return null;
  }

  // 1. 計算賣出實收金額
  const sellInfo = calculateSellProceeds(sellPrice, sellShares, cfg);
  const availableBudget = sellInfo.net;

  if (availableBudget <= 0) {
    return {
      sellInfo,
      buyLots: 0,
      buyOddShares: 0,
      totalBuyShares: 0,
      buyCostInfo: { gross: 0, fee: 0, net: 0 },
      leftoverCash: 0,
      lotOnly: {
        lots: 0,
        shares: 0,
        costInfo: { gross: 0, fee: 0, net: 0 },
        leftoverCash: availableBudget
      }
    };
  }

  // 2. 二分搜尋找出最大可買總股數（可含零股）
  let low = 0;
  let high = Math.floor(availableBudget / (buyPrice * 0.9)) + 1000;
  let bestShares = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const cost = calculateBuyCost(buyPrice, mid, cfg).net;
    if (cost <= availableBudget) {
      bestShares = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  const buyCostInfo = calculateBuyCost(buyPrice, bestShares, cfg);
  const leftoverCash = availableBudget - buyCostInfo.net;

  const buyLots = Math.floor(bestShares / cfg.sharesPerLot);
  const buyOddShares = bestShares % cfg.sharesPerLot;

  // 3. 同時計算「若只買整張（不買零股）」的情況
  const lotOnlyShares = buyLots * cfg.sharesPerLot;
  const lotOnlyCost = calculateBuyCost(buyPrice, lotOnlyShares, cfg);
  const lotOnlyLeftover = availableBudget - lotOnlyCost.net;

  return {
    sellInfo,
    buyLots,
    buyOddShares,
    totalBuyShares: bestShares,
    buyCostInfo,
    leftoverCash,
    lotOnly: {
      lots: buyLots,
      shares: lotOnlyShares,
      costInfo: lotOnlyCost,
      leftoverCash: lotOnlyLeftover
    }
  };
}

/**
 * 模式 B：以買估賣 (已知欲買入張數/股數，計算需賣出多少來湊)
 * @param {number} buyPrice 欲買入價格
 * @param {number} buyShares 欲買入總股數
 * @param {number} sellPrice 賣出價格
 * @param {object} config 設定參數
 */
function calculateBuyToSell(buyPrice, buyShares, sellPrice, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  if (buyPrice <= 0 || buyShares <= 0 || sellPrice <= 0) {
    return null;
  }

  // 1. 計算買入所需總金額
  const buyCostInfo = calculateBuyCost(buyPrice, buyShares, cfg);
  const targetFunds = buyCostInfo.net;

  // 2. 二分搜尋找出最少需要賣出多少股，才足以支付 targetFunds
  let low = 1;
  let high = Math.ceil(targetFunds / (sellPrice * 0.9)) + 2000;
  let exactSharesNeeded = high;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const proceeds = calculateSellProceeds(sellPrice, mid, cfg).net;
    if (proceeds >= targetFunds) {
      exactSharesNeeded = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  // 精確賣出股數得到的淨額與結餘
  const exactSellProceeds = calculateSellProceeds(sellPrice, exactSharesNeeded, cfg);
  const exactRemainingCash = exactSellProceeds.net - targetFunds;

  // 3. 計算若只能賣「整張」需要多少張
  const lotsNeeded = Math.ceil(exactSharesNeeded / cfg.sharesPerLot);
  const lotShares = lotsNeeded * cfg.sharesPerLot;
  const lotSellProceeds = calculateSellProceeds(sellPrice, lotShares, cfg);
  const lotRemainingCash = lotSellProceeds.net - targetFunds;

  return {
    buyCostInfo,
    targetFunds,
    exactSharesNeeded,
    exactSellLots: Math.floor(exactSharesNeeded / cfg.sharesPerLot),
    exactOddShares: exactSharesNeeded % cfg.sharesPerLot,
    exactSellProceeds,
    exactRemainingCash,
    lotOnly: {
      lotsNeeded,
      totalShares: lotShares,
      proceeds: lotSellProceeds,
      surplusCash: lotRemainingCash
    }
  };
}

// 支援模組匯出（若在 Node.js 測試）或掛在 window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DEFAULT_CONFIG,
    calculateSellProceeds,
    calculateBuyCost,
    calculateSellToBuy,
    calculateBuyToSell
  };
} else if (typeof window !== 'undefined') {
  window.StockCalculator = {
    DEFAULT_CONFIG,
    calculateSellProceeds,
    calculateBuyCost,
    calculateSellToBuy,
    calculateBuyToSell
  };
}
