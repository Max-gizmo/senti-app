// Senti brokerage — shared atoms & micro-components
// Loaded as a Babel script; exports go to window at bottom.

// Hide scrollbars while keeping scroll behavior — applies anywhere that
// uses overflow:auto/scroll inside a senti screen. Injected once.
if (typeof document !== 'undefined' && !document.getElementById('senti-no-scrollbar')) {
  const s = document.createElement('style');
  s.id = 'senti-no-scrollbar';
  s.textContent = `
    [data-screen-label] *,
    [data-senti-noscrollbar] {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    [data-screen-label] *::-webkit-scrollbar,
    [data-senti-noscrollbar]::-webkit-scrollbar { display: none; width: 0; height: 0; }
  `;
  document.head.appendChild(s);
}

const SC = {
  green: '#00B86B',
  greenBright: '#00D17A',
  greenDeep: '#006B3F',
  greenSoft: '#C9F4DB',
  greenWash: '#EEFAF2',
  lime: '#C8FF4D',
  ink1000: '#0E1413',
  ink900: '#161D1B',
  ink800: '#1F2725',
  ink700: '#2A3331',
  ink500: '#6B7672',
  ink400: '#95A09C',
  ink300: '#C7CFCC',
  ink200: '#E4E9E6',
  ink100: '#F1F4F2',
  ink50: '#F7F8F6',
  paper: '#FFFFFF',
  danger: '#DC3232',
  fontDisplay: "'Geist', 'DM Sans', system-ui, sans-serif",
  fontMono: "'Geist Mono', 'JetBrains Mono', ui-monospace, monospace",
};

// ──────────────────────────────────────────────────────────────
// i18n — Russian primary, English fallback
// ──────────────────────────────────────────────────────────────
const TR = {
  ru: {
    hi: 'Доброе утро',
    portfolio: 'Портфель',
    portfolioTab: 'Портфель',
    home: 'Главная',
    menu: 'Меню',
    orders: 'Приказы',
    trades: 'Сделки',
    totalBalance: 'Всего на счёте',
    todayChange: 'За сегодня',
    buy: 'Купить',
    sell: 'Продать',
    exchange: 'Обмен',
    withdraw: 'Вывод',
    topUp: 'Пополнить',
    withdrawLong: 'Вывести',
    assets: 'Активы',
    markets: 'Рынки',
    ideas: 'Идеи',
    investIdeas: 'Инвестиционные идеи',
    history: 'История',
    profile: 'Профиль',
    seeAll: 'Все',
    localMarket: 'Кыргызский рынок',
    globalCFD: 'Мировые акции · CFD',
    crypto: 'Криптовалюта',
    forex: 'Валюта',
    allocation: 'Структура портфеля',
    insight: 'Совет на сегодня',
    moversToday: 'Сегодня в движении',
    watchlist: 'Список наблюдения',
    overview: 'Обзор',
    dayPnL: '+4 280 с сегодня',
    insightText: 'Ваш портфель растёт третий день подряд. Лидер — NVDA, +2,3%.',
    quickTrade: 'Быстрая сделка',
    chart7d: '7 дней',
    chart1m: '1 мес',
    chart1y: '1 год',
    welcomeBack: 'С возвращением',
    deposits: 'Депозит',
    learn: 'Обучение',
    education: 'Учиться',
    educationCard: 'Узнайте, как работают CFD',
    educationSub: '3 минуты на чтение',
    news: 'Новости',
    soms: 'сом',
    commodities: 'Товары',
    fx: 'Fx',
    chat: 'Чат',
  },
  en: {
    hi: 'Good morning',
    portfolio: 'Portfolio',
    portfolioTab: 'Portfolio',
    home: 'Home',
    menu: 'Menu',
    orders: 'Orders',
    trades: 'Trades',
    totalBalance: 'Total balance',
    todayChange: 'Today',
    buy: 'Buy',
    sell: 'Sell',
    exchange: 'Exchange',
    withdraw: 'Withdraw',
    topUp: 'Top up',
    withdrawLong: 'Withdraw',
    assets: 'Assets',
    markets: 'Markets',
    ideas: 'Ideas',
    investIdeas: 'Investment ideas',
    history: 'History',
    profile: 'Profile',
    seeAll: 'All',
    localMarket: 'Kyrgyz market',
    globalCFD: 'Global stocks · CFD',
    crypto: 'Crypto',
    forex: 'Forex',
    allocation: 'Portfolio mix',
    insight: 'Today',
    moversToday: 'Today\u2019s movers',
    watchlist: 'Watchlist',
    overview: 'Overview',
    dayPnL: '+4,280 KGS today',
    insightText: 'Your portfolio is up three days running. Top mover — NVDA, +2.3%.',
    quickTrade: 'Quick trade',
    chart7d: '7d',
    chart1m: '1m',
    chart1y: '1y',
    welcomeBack: 'Welcome back',
    deposits: 'Deposit',
    learn: 'Learn',
    education: 'Learn',
    educationCard: 'How CFDs work',
    educationSub: '3 min read',
    news: 'News',
    soms: 'KGS',
    commodities: 'Commodities',
    fx: 'Fx',
    chat: 'Chat',
  },
};
const t = (lang, key) => (TR[lang] && TR[lang][key]) || TR.en[key] || key;

// ──────────────────────────────────────────────────────────────
// Money formatter — KGS with thousands separator, tabular figures
// fmtKGS(value, opts?) -> '248 420,50 с'
// ──────────────────────────────────────────────────────────────
function fmtKGS(value, { decimals = 2, sign = false } = {}) {
  const negative = value < 0;
  const abs = Math.abs(value);
  const [whole, dec] = abs.toFixed(decimals).split('.');
  const w = whole.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F'); // thin space
  const signStr = sign ? (negative ? '−' : '+') : (negative ? '−' : '');
  return decimals ? `${signStr}${w},${dec}` : `${signStr}${w}`;
}
function fmtUSD(value, { decimals = 2, sign = false } = {}) {
  const negative = value < 0;
  const abs = Math.abs(value);
  const [whole, dec] = abs.toFixed(decimals).split('.');
  const w = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const signStr = sign ? (negative ? '−' : '+') : (negative ? '−' : '');
  return decimals ? `${signStr}$${w}.${dec}` : `${signStr}$${w}`;
}

// ──────────────────────────────────────────────────────────────
// KGS money display — large number, sub "с" symbol, tabular
// ──────────────────────────────────────────────────────────────
function MoneyKGS({ value, size = 48, weight = 600, color, decimals = 2, suffix = 'с', monoOnly = false }) {
  const formatted = fmtKGS(value, { decimals });
  return (
    <span style={{
      fontFamily: monoOnly ? SC.fontMono : SC.fontDisplay,
      fontFeatureSettings: "'tnum' 1, 'cv11' 1",
      fontSize: size, fontWeight: weight, color: color || 'inherit',
      letterSpacing: '-0.03em', lineHeight: 1,
      display: 'inline-flex', alignItems: 'baseline', whiteSpace: 'nowrap',
    }}>
      <span>{formatted}</span>
      <span style={{ opacity: 0.5, fontSize: size * 0.46, marginLeft: size * 0.12, fontWeight: 500 }}>{suffix}</span>
    </span>
  );
}

// ──────────────────────────────────────────────────────────────
// Lucide-style icons
// ──────────────────────────────────────────────────────────────
function Icon({ name, size = 24, color = 'currentColor', strokeWidth = 1.75 }) {
  const paths = {
    home:     <><path d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></>,
    chart:    <><path d="M3 3v18h18"/><path d="M7 14l4-4 4 3 5-7"/></>,
    swap:     <><path d="M7 3v14m0 0-4-4m4 4 4-4M17 21V7m0 0-4 4m4-4 4 4"/></>,
    wallet:   <><rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18M16 14h2"/></>,
    user:     <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>,
    bell:     <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 21a2 2 0 0 0 4 0"/></>,
    search:   <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
    plus:     <><path d="M12 5v14M5 12h14"/></>,
    minus:    <><path d="M5 12h14"/></>,
    arrUp:    <><path d="M12 19V5M5 12l7-7 7 7"/></>,
    arrDn:    <><path d="M12 5v14M5 12l7 7 7-7"/></>,
    upload:   <><path d="M12 16V3M6 9l6-6 6 6M3 21h18"/></>,
    chat:     <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/></>,
    commodity:<><path d="M4 7l8-4 8 4-8 4z"/><path d="M4 17l8 4 8-4M4 12l8 4 8-4"/></>,
    news:     <><path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    arrR:     <><path d="M5 12h14M13 5l7 7-7 7"/></>,
    arrRup:   <><path d="M7 17 17 7M9 7h8v8"/></>,
    arrRdn:   <><path d="M7 7l10 10M17 9v8H9"/></>,
    chevR:    <><path d="m9 18 6-6-6-6"/></>,
    chevL:    <><path d="m15 18-6-6 6-6"/></>,
    chevD:    <><path d="m6 9 6 6 6-6"/></>,
    chevU:    <><path d="m6 15 6-6 6 6"/></>,
    eye:      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    eyeOff:   <><path d="M3 3l18 18M10.6 6.2A11 11 0 0 1 12 6c7 0 11 6 11 6a18 18 0 0 1-3 3.4M6 6.4a18 18 0 0 0-5 5.6s4 6 11 6c1.7 0 3.3-.4 4.7-1"/></>,
    sliders:  <><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></>,
    spark:    <><path d="M12 3v4M3 12h4M12 17v4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></>,
    info:     <><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v4h1"/></>,
    book:     <><path d="M4 4v16h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2zM8 4v16"/></>,
    btc:      <><circle cx="12" cy="12" r="10"/><path d="M9 7v10M9 7h4a2.5 2.5 0 0 1 0 5H9M9 12h5a2.5 2.5 0 0 1 0 5H9M11 5v2M11 17v2M14 5v2M14 17v2"/></>,
    coin:     <><circle cx="12" cy="12" r="9"/><path d="M14 9.5C13.5 8.5 12.5 8 11.5 8c-2 0-2.5 4-1 4s2 4 0 4c-1 0-2-.5-2.5-1.5"/></>,
    qr:       <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v7h-7v-3"/></>,
    download: <><path d="M12 3v13M6 11l6 6 6-6M3 21h18"/></>,
    flag:     <><path d="M4 21V4M4 4h13l-3 5 3 5H4"/></>,
    layers:   <><path d="m2 12 10 5 10-5M2 17l10 5 10-5M12 2 2 7l10 5 10-5z"/></>,
    target:   <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></>,
    sparkles: <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14zM5 14l.6 1.6L7 16l-1.4.4L5 18l-.6-1.6L3 16l1.4-.4L5 14z"/></>,
    flame:    <><path d="M12 2c4 5 6 8 6 12a6 6 0 0 1-12 0c0-2 1-3 2-5 .5 1 1 1.5 2 1.5C9 6 11 4 12 2z"/></>,
    grid:     <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// Sparkline — tiny SVG line chart for asset rows
// ──────────────────────────────────────────────────────────────
function Sparkline({ data, width = 64, height = 22, color, strokeWidth = 1.5, fill = false }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pad = 1;
  const step = (width - pad * 2) / (data.length - 1);
  const pts = data.map((v, i) => [pad + i * step, pad + (1 - (v - min) / range) * (height - pad * 2)]);
  const d = 'M' + pts.map(p => p.map(n => n.toFixed(2)).join(',')).join(' L');
  const last = data[data.length - 1], first = data[0];
  const up = last >= first;
  const stroke = color || (up ? SC.green : SC.danger);
  const gradId = `spg-${Math.random().toString(36).slice(2, 9)}`;
  const areaPath = `${d} L${pts[pts.length-1][0]},${height} L${pts[0][0]},${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {fill && (
        <>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.25"/>
              <stop offset="100%" stopColor={stroke} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradId})`}/>
        </>
      )}
      <path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// Big chart — portfolio value over time, with gradient area
// ──────────────────────────────────────────────────────────────
function BigChart({ data, width = 600, height = 200, color = SC.green, fillColor, showDot = true, padX = 0, padY = 18 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const step = (width - padX * 2) / (data.length - 1);
  const pts = data.map((v, i) => [padX + i * step, padY + (1 - (v - min) / range) * (height - padY * 2)]);
  const d = 'M' + pts.map(p => p.map(n => n.toFixed(2)).join(',')).join(' L');
  const lastPt = pts[pts.length - 1];
  const gradId = `bcg-${Math.random().toString(36).slice(2, 9)}`;
  const areaPath = `${d} L${lastPt[0]},${height} L${pts[0][0]},${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillColor || color} stopOpacity="0.22"/>
          <stop offset="100%" stopColor={fillColor || color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`}/>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {showDot && (
        <>
          <circle cx={lastPt[0]} cy={lastPt[1]} r="6" fill={color} opacity="0.18"/>
          <circle cx={lastPt[0]} cy={lastPt[1]} r="3.5" fill={color}/>
        </>
      )}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// Delta pill — "+1.2%" / "−0.4%" — green / red
// ──────────────────────────────────────────────────────────────
function DeltaPill({ value, size = 'sm', mode = 'soft' }) {
  // value as percent number, e.g. 1.2 or -0.4
  const up = value >= 0;
  const colorFg = up ? SC.greenDeep : '#8E1F1F';
  const colorBg = up ? SC.greenSoft : '#FBE0E0';
  const sizes = { sm: { fs: 12, py: 3, px: 8, ai: 10 }, md: { fs: 13, py: 4, px: 10, ai: 12 } };
  const s = sizes[size];
  const styles = mode === 'soft'
    ? { background: colorBg, color: colorFg }
    : mode === 'ghost'
      ? { background: 'transparent', color: colorFg }
      : { background: up ? SC.green : SC.danger, color: '#fff' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: `${s.py}px ${s.px}px`, borderRadius: 999,
      fontFamily: SC.fontMono, fontFeatureSettings: "'tnum' 1",
      fontSize: s.fs, fontWeight: 600, letterSpacing: '-0.2px',
      ...styles,
    }}>
      <span style={{ display: 'inline-block', transform: up ? 'rotate(0deg)' : 'rotate(180deg)', lineHeight: 0 }}>
        <svg width={s.ai} height={s.ai} viewBox="0 0 12 12"><path d="M6 2v8M3 5l3-3 3 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
      <span>{(up ? '' : '−')}{Math.abs(value).toFixed(value === Math.floor(value) ? 1 : Math.abs(value) < 1 ? 2 : 1)}%</span>
    </span>
  );
}

// ──────────────────────────────────────────────────────────────
// Ticker logo — colored squircle with 2-3 letters
// (used for both equity tickers and crypto)
// ──────────────────────────────────────────────────────────────
function TickerLogo({ symbol, size = 40, palette }) {
  const palettes = {
    AAPL: ['#000', '#fff'],
    TSLA: ['#E31937', '#fff'],
    NVDA: ['#76B900', '#0E1413'],
    GOOGL: ['#4285F4', '#fff'],
    BTC: ['#F7931A', '#fff'],
    ETH: ['#627EEA', '#fff'],
    USDT: ['#26A17B', '#fff'],
    KCEL: ['#0066B3', '#fff'],
    BKAI: ['#003D7A', '#fff'],
    KICB: ['#C8102E', '#fff'],
    USD: ['#1A5731', '#fff'],
    EUR: ['#0033A0', '#fff'],
    RUB: ['#D52B1E', '#fff'],
    KGS: ['#E8112D', '#fff'],
    GBP: ['#1D3160', '#fff'],
    JPY: ['#BC002D', '#fff'],
    GOLD: ['#D4AF37', '#3E2E08'],
    SILV: ['#B5B5B5', '#1F2725'],
    OIL:  ['#2A3331', '#C8FF4D'],
    GAS:  ['#1F4B7A', '#fff'],
    COPP: ['#B66B2C', '#fff'],
  };
  const p = palette || palettes[symbol] || [SC.ink100, SC.ink1000];
  const label = symbol.length <= 2 ? symbol : symbol.slice(0, symbol === 'AAPL' || symbol === 'USDT' ? 1 : 3);
  // pretty initials
  const initial = ({
    AAPL: '\uF8FF', // apple glyph approximation; use letter fallback
    TSLA: 'T', NVDA: 'N', GOOGL: 'G',
    BTC: '₿', ETH: 'Ξ', USDT: '₮',
    KCEL: 'K', BKAI: 'B', KICB: 'K',
    USD: '$', EUR: '€', RUB: '₽', KGS: 'с',
    GBP: '£', JPY: '¥',
    GOLD: 'Au', SILV: 'Ag', OIL: 'Oil', GAS: 'NG', COPP: 'Cu',
  })[symbol] || symbol.slice(0, 1);
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.35,
      background: p[0], color: p[1], flex: '0 0 auto',
      display: 'grid', placeItems: 'center',
      fontFamily: SC.fontDisplay, fontWeight: 700, fontSize: size * 0.48,
      letterSpacing: '-0.04em',
    }}>{initial}</div>
  );
}

// ──────────────────────────────────────────────────────────────
// Allocation strip — stacked horizontal bar of portfolio segments
// segments: [{ id, label, pct, color }]
// ──────────────────────────────────────────────────────────────
function AllocationStrip({ segments, height = 12, gap = 3, showLabels = true, labelLang = 'ru' }) {
  return (
    <div>
      <div style={{ display: 'flex', gap, height, borderRadius: 999, overflow: 'hidden' }}>
        {segments.map((s, i) => (
          <div key={s.id} style={{
            flex: s.pct, background: s.color, height,
            borderRadius: 999,
          }}/>
        ))}
      </div>
      {showLabels && (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
          {segments.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 999, background: s.color }}/>
              <span style={{ fontSize: 12, fontWeight: 500, color: SC.ink500, letterSpacing: '-0.1px' }}>{s.label}</span>
              <span style={{ fontFamily: SC.fontMono, fontSize: 12, fontWeight: 600, color: SC.ink1000 }}>{s.pct}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Asset row — used in holdings lists
// ──────────────────────────────────────────────────────────────
function AssetRow({ symbol, name, price, priceCcy = '$', change, sparkData, qty, dark = false, last = false, onClick }) {
  const textCol = dark ? '#fff' : SC.ink1000;
  const subCol = dark ? 'rgba(255,255,255,0.5)' : SC.ink500;
  const border = dark ? 'rgba(255,255,255,0.07)' : SC.ink200;
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0',
      borderBottom: last ? 'none' : `1px solid ${border}`,
      cursor: onClick ? 'pointer' : 'default',
    }}>
      <TickerLogo symbol={symbol} size={40}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: textCol, letterSpacing: '-0.2px' }}>{symbol}</div>
        <div style={{ fontSize: 12, color: subCol, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
      </div>
      {sparkData && <div style={{ marginRight: 4 }}><Sparkline data={sparkData} width={56} height={20}/></div>}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: SC.fontMono, fontSize: 14, fontWeight: 600, color: textCol, letterSpacing: '-0.2px' }}>
          {typeof price === 'number' ? `${priceCcy}${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : price}
        </div>
        <div style={{ marginTop: 4 }}><DeltaPill value={change} size="sm" mode="ghost"/></div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Pill button — primary / dark / outline / soft
// ──────────────────────────────────────────────────────────────
function Pill({ children, variant = 'primary', size = 'md', arrow = false, full = false, onClick, style = {}, icon }) {
  const sizes = { sm: { h: 36, px: 14, fs: 13 }, md: { h: 48, px: 22, fs: 15 }, lg: { h: 56, px: 28, fs: 17 } };
  const s = sizes[size];
  const variants = {
    primary: { bg: SC.green, color: '#fff' },
    dark:    { bg: SC.ink1000, color: '#fff' },
    outline: { bg: 'transparent', color: SC.ink1000, border: `1.5px solid ${SC.ink1000}` },
    outlineLight: { bg: 'transparent', color: '#fff', border: `1.5px solid rgba(255,255,255,0.3)` },
    soft:    { bg: SC.ink100, color: SC.ink1000 },
    softDark: { bg: 'rgba(255,255,255,0.08)', color: '#fff' },
    ghost:   { bg: 'transparent', color: SC.ink1000 },
  };
  const v = variants[variant];
  return (
    <button onClick={onClick} style={{
      height: s.h, padding: `0 ${s.px}px`, fontSize: s.fs, fontWeight: 600,
      fontFamily: SC.fontDisplay, borderRadius: 999, cursor: 'pointer',
      letterSpacing: '-0.2px',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: icon ? 8 : 6,
      width: full ? '100%' : 'auto', border: v.border || 'none',
      transition: 'all 140ms cubic-bezier(.22,1,.36,1)',
      background: v.bg, color: v.color, ...style,
    }}>
      {icon && <Icon name={icon} size={s.fs + 2} color="currentColor"/>}
      {children}
      {arrow && <span style={{ fontWeight: 500, fontSize: s.fs + 1 }}>→</span>}
    </button>
  );
}

// ──────────────────────────────────────────────────────────────
// Senti S logo glyph — matches design system /assets/logo-s.svg
// ──────────────────────────────────────────────────────────────
function SentiLogo({ size = 32, color = SC.green, fg = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" style={{ display: 'block', flex: '0 0 auto' }}>
      <rect width="120" height="120" rx="28" fill={color}/>
      <path d="M 84 30 C 84 14 36 14 36 36 C 36 58 84 62 84 84 C 84 106 36 106 36 90"
        fill="none" stroke={fg} strokeWidth="20" strokeLinecap="round"/>
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// Senti horizontal wordmark — S tile + "Senti" — design system lockup
// ──────────────────────────────────────────────────────────────
function SentiWordmark({ height = 28, color = SC.green, textColor }) {
  const width = height * 3.4;
  const tc = textColor || SC.ink1000;
  return (
    <svg width={width} height={height} viewBox="0 0 340 100" fill="none" style={{ display: 'block' }}>
      <rect width="100" height="100" rx="24" fill={color}/>
      <path d="M 70 25 C 70 11.7 30 11.7 30 30 C 30 48.3 70 51.7 70 70 C 70 88.3 30 88.3 30 75"
        fill="none" stroke="#fff" strokeWidth="16.6" strokeLinecap="round"/>
      <text x="120" y="68"
        fontFamily="'Geist','DM Sans',system-ui,sans-serif"
        fontSize="62" fontWeight="700" letterSpacing="-2"
        fill={tc}>Senti</text>
    </svg>
  );
}

Object.assign(window, {
  SC, TR, t, fmtKGS, fmtUSD, MoneyKGS, Icon, Sparkline, BigChart,
  DeltaPill, TickerLogo, AllocationStrip, AssetRow, Pill, SentiLogo, SentiWordmark,
});
