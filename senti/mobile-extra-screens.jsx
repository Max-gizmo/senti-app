// Mobile prototype screens — markets, trade, asset detail, profile.
// Reuses brokerage-atoms + mobile-variations data (PORTFOLIO).

// ─────────────────────────────────────────────────────────────
// Markets screen — browse by class with search + price list
// ─────────────────────────────────────────────────────────────
const MARKETS_ALL = [
  // CFD
  { symbol: 'AAPL',  name: 'Apple Inc.',  cls: 'cfd',    ccy: '$', price:  189.45,  change:  0.8, spark: [187,188,189,188,189,189,189.45] },
  { symbol: 'TSLA',  name: 'Tesla',       cls: 'cfd',    ccy: '$', price:  245.20,  change: -1.2, spark: [248,247,249,246,245,245,245.2] },
  { symbol: 'NVDA',  name: 'Nvidia',      cls: 'cfd',    ccy: '$', price:  498.12,  change:  2.3, spark: [490,494,491,495,493,497,498] },
  { symbol: 'GOOGL', name: 'Alphabet',    cls: 'cfd',    ccy: '$', price:  174.55,  change:  0.6, spark: [172,173,174,173,174,174,174.55] },
  // Crypto
  { symbol: 'BTC',   name: 'Bitcoin',     cls: 'crypto', ccy: '$', price: 69420.10, change:  0.4, spark: [69100,69300,69200,69500,69300,69400,69420] },
  { symbol: 'ETH',   name: 'Ethereum',    cls: 'crypto', ccy: '$', price:  3520.55, change: -0.8, spark: [3580,3550,3570,3540,3530,3525,3520] },
  { symbol: 'USDT',  name: 'Tether',      cls: 'crypto', ccy: '$', price:     1.00, change:  0.0, spark: [1,1,1,1,1,1,1] },
  // KG
  { symbol: 'KCEL',  name: 'Кыргызтелеком',cls:'kg',     ccy: 'с', price:   248.00, change:  1.2, spark: [244,245,246,246,247,247.5,248] },
  { symbol: 'BKAI',  name: 'Банк Кыргызстана', cls:'kg', ccy: 'с', price:  1420.00, change: -0.4, spark: [1430,1425,1424,1422,1420,1420,1420] },
  { symbol: 'KICB',  name: 'KICB',        cls: 'kg',     ccy: 'с', price:    76.00, change:  2.1, spark: [73,74,74.5,75,75.5,76,76] },
  // Cash / Currency (Валюта) — KGS exchange rates
  { symbol: 'USD',   name: 'USD / KGS',   cls: 'forex',  ccy: 'с', price:    88.95, change: -0.1, spark: [89.1,89.05,89.0,88.98,88.96,88.95,88.95] },
  { symbol: 'EUR',   name: 'EUR / KGS',   cls: 'forex',  ccy: 'с', price:    95.20, change:  0.3, spark: [94.7,94.9,95.0,95.1,95.0,95.15,95.2] },
  { symbol: 'RUB',   name: 'RUB / KGS',   cls: 'forex',  ccy: 'с', price:     0.92, change:  0.2, spark: [0.91,0.91,0.92,0.92,0.92,0.92,0.92] },
  // Fx (global pairs)
  { symbol: 'EUR',   name: 'EUR / USD',   cls: 'fx',     ccy: '$', price:     1.0825, change:  0.4, spark: [1.078,1.079,1.081,1.080,1.082,1.083,1.0825] },
  { symbol: 'GBP',   name: 'GBP / USD',   cls: 'fx',     ccy: '$', price:     1.2640, change: -0.2, spark: [1.267,1.266,1.265,1.264,1.263,1.264,1.264] },
  { symbol: 'JPY',   name: 'USD / JPY',   cls: 'fx',     ccy: '¥', price:   156.80, change:  0.6, spark: [155.9,156.1,156.3,156.4,156.7,156.9,156.8] },
  // Commodities (Товары)
  { symbol: 'GOLD',  name: 'Gold',        cls: 'comm',   ccy: '$', price:  2348.40, change:  0.5, spark: [2335,2338,2342,2340,2345,2349,2348] },
  { symbol: 'SILV',  name: 'Silver',      cls: 'comm',   ccy: '$', price:    29.84, change:  1.8, spark: [29.3,29.4,29.6,29.5,29.7,29.9,29.84] },
  { symbol: 'OIL',   name: 'Brent oil',   cls: 'comm',   ccy: '$', price:    83.20, change: -0.7, spark: [83.8,83.6,83.4,83.3,83.2,83.1,83.2] },
  { symbol: 'COPP',  name: 'Copper',      cls: 'comm',   ccy: '$', price:     4.62, change:  0.3, spark: [4.59,4.60,4.61,4.62,4.61,4.62,4.62] },
];

function MarketsScreen({ lang = 'ru', onAsset, dark = false }) {
  const [cls, setCls] = React.useState('forex');
  const tabs = [
    { id: 'forex',  label: lang === 'ru' ? 'Валюта'     : 'Currency' },
    { id: 'cfd',    label: 'CFD' },
    { id: 'kg',     label: 'KG' },
    { id: 'crypto', label: lang === 'ru' ? 'Крипто'      : 'Crypto' },
    { id: 'fx',     label: 'Fx' },
    { id: 'comm',   label: lang === 'ru' ? 'Товары'      : 'Commodities' },
  ];
  const filtered = MARKETS_ALL.filter(m => m.cls === cls);
  const bg = dark ? SC.ink1000 : SC.paper;
  const text = dark ? '#fff' : SC.ink1000;
  const sub = dark ? 'rgba(255,255,255,0.5)' : SC.ink500;
  const fieldBg = dark ? 'rgba(255,255,255,0.05)' : SC.ink50;
  return (
    <div style={{ position: 'absolute', inset: 0, background: bg, display: 'flex', flexDirection: 'column', color: text, overflow: 'hidden' }}>
      <div style={{ padding: '64px 20px 12px' }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: '-0.04em', fontFamily: SC.fontDisplay }}>{t(lang, 'markets')}</h1>
      </div>
      {/* Search */}
      <div style={{ padding: '4px 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: fieldBg, borderRadius: 14, padding: '10px 14px' }}>
          <Icon name="search" size={16} color={sub}/>
          <span style={{ flex: 1, fontSize: 13, color: sub, fontFamily: SC.fontDisplay }}>
            {lang === 'ru' ? 'Найти AAPL, BTC, USD…' : 'Search AAPL, BTC, USD…'}
          </span>
        </div>
      </div>
      {/* Tabs */}
      <div style={{ padding: '0 20px 8px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {tabs.map(tg => (
          <button key={tg.id} onClick={() => setCls(tg.id)} style={{
            background: cls === tg.id ? (dark ? '#fff' : SC.ink1000) : (dark ? 'rgba(255,255,255,0.06)' : SC.ink100),
            color: cls === tg.id ? (dark ? SC.ink1000 : '#fff') : (dark ? 'rgba(255,255,255,0.6)' : SC.ink500),
            border: 'none', cursor: 'pointer',
            padding: '7px 14px', borderRadius: 999,
            fontSize: 12, fontWeight: 600, letterSpacing: '-0.2px',
            fontFamily: SC.fontDisplay, whiteSpace: 'nowrap',
          }}>{tg.label}</button>
        ))}
      </div>
      {/* List */}
      <div style={{ flex: 1, padding: '4px 20px 96px', overflowY: 'auto' }}>
        {filtered.map((h, i) => (
          <AssetRow key={h.symbol} {...h} sparkData={h.spark} priceCcy={h.ccy} dark={dark}
            onClick={() => onAsset && onAsset(h)}
            last={i === filtered.length - 1}/>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Asset detail screen — chart + Buy/Sell
// ─────────────────────────────────────────────────────────────
function AssetDetailScreen({ asset, lang = 'ru', onBack, onTrade, dark = false }) {
  const bg = dark ? SC.ink1000 : SC.paper;
  const text = dark ? '#fff' : SC.ink1000;
  const sub = dark ? 'rgba(255,255,255,0.5)' : SC.ink500;
  const fieldBg = dark ? 'rgba(255,255,255,0.05)' : SC.ink50;
  const up = asset.change >= 0;
  // Build a longer series for the detail chart
  const long = [];
  for (let i = 0; i < 32; i++) {
    const base = asset.spark[i % asset.spark.length];
    long.push(base * (1 + (Math.sin(i * 0.7) * 0.012) + (i / 200)));
  }
  return (
    <div style={{ position: 'absolute', inset: 0, background: bg, display: 'flex', flexDirection: 'column', color: text, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '54px 20px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 999, background: fieldBg, border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
          <Icon name="chevL" size={18} color={text}/>
        </button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
          <TickerLogo symbol={asset.symbol} size={32}/>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.2px' }}>{asset.symbol}</div>
            <div style={{ fontSize: 11, color: sub }}>{asset.name}</div>
          </div>
        </div>
        <button style={{ width: 40, height: 40, borderRadius: 999, background: fieldBg, border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
          <Icon name="bell" size={18} color={text}/>
        </button>
      </div>
      {/* Price */}
      <div style={{ padding: '8px 20px 8px' }}>
        <div style={{ fontFamily: SC.fontMono, fontSize: 36, fontWeight: 700, letterSpacing: '-0.04em' }}>
          {asset.ccy}{asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
          <DeltaPill value={asset.change} size="md"/>
          <span style={{ fontSize: 12, color: sub }}>{lang === 'ru' ? 'за сегодня' : 'today'}</span>
        </div>
      </div>
      {/* Chart */}
      <div style={{ padding: '12px 0 4px', position: 'relative' }}>
        <BigChart data={long} width={402} height={180} color={up ? (dark ? SC.greenBright : SC.green) : SC.danger} fillColor={up ? (dark ? SC.greenBright : SC.green) : SC.danger} padY={20}/>
        <div style={{ padding: '8px 20px', display: 'flex', gap: 6 }}>
          {(lang === 'ru' ? ['1Ч','1Д','7Д','1М','1Г'] : ['1H','1D','7D','1M','1Y']).map((p, i) => (
            <span key={p} style={{
              padding: '5px 12px', borderRadius: 999,
              background: i === 2 ? (dark ? '#fff' : SC.ink1000) : 'transparent',
              color: i === 2 ? (dark ? SC.ink1000 : '#fff') : sub,
              fontSize: 11, fontWeight: 600, fontFamily: SC.fontMono, cursor: 'pointer',
            }}>{p}</span>
          ))}
        </div>
      </div>
      {/* Stats grid */}
      <div style={{ padding: '8px 20px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: 16, borderRadius: 18, background: fieldBg }}>
          {[
            [lang === 'ru' ? 'Объём 24ч' : '24h volume',   '128M'],
            [lang === 'ru' ? 'Капитал.'  : 'Market cap',    '2.9T'],
            [lang === 'ru' ? 'Макс. 52н' : '52w high',      `${asset.ccy}${(asset.price * 1.18).toFixed(2)}`],
            [lang === 'ru' ? 'Мин. 52н'  : '52w low',       `${asset.ccy}${(asset.price * 0.74).toFixed(2)}`],
          ].map(([k, v], i) => (
            <div key={i}>
              <div style={{ fontSize: 11, color: sub, fontWeight: 500, letterSpacing: '-0.1px', marginBottom: 4 }}>{k}</div>
              <div style={{ fontFamily: SC.fontMono, fontSize: 14, fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Educational nudge — newbie audience */}
      <div style={{ padding: '0 20px 0' }}>
        <div style={{
          padding: '12px 14px', borderRadius: 14,
          background: dark ? 'rgba(0,184,107,0.10)' : SC.greenWash,
          border: dark ? 'none' : `1px solid ${SC.greenSoft}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <Icon name="info" size={18} color={dark ? SC.greenBright : SC.greenDeep}/>
          <div style={{ flex: 1, fontSize: 12, color: dark ? SC.greenBright : SC.greenDeep, lineHeight: 1.4 }}>
            {asset.cls === 'cfd'
              ? (lang === 'ru' ? 'Это CFD. Вы зарабатываете на разнице цен, не владея акцией.' : 'This is a CFD. You profit from price moves without owning the stock.')
              : asset.cls === 'crypto'
              ? (lang === 'ru' ? 'Крипто волатильно. Начинайте с малой суммы.' : 'Crypto is volatile. Start with a small amount.')
              : (lang === 'ru' ? 'Биржа KG. Торги Пн–Пт 10:00–17:00.' : 'KG exchange. Trading Mon–Fri 10:00–17:00.')}
          </div>
          <Icon name="chevR" size={16} color={dark ? SC.greenBright : SC.greenDeep}/>
        </div>
      </div>
      {/* Bottom action bar */}
      <div style={{ flex: 1 }}/>
      <div style={{
        padding: '14px 20px 38px',
        background: bg,
        borderTop: dark ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${SC.ink200}`,
        display: 'flex', gap: 10,
      }}>
        <Pill variant={dark ? 'softDark' : 'soft'} size="lg" full onClick={() => onTrade('sell', asset)}>
          {t(lang, 'sell')}
        </Pill>
        <Pill variant="primary" size="lg" arrow full onClick={() => onTrade('buy', asset)}>
          {t(lang, 'buy')}
        </Pill>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Trade modal (bottom sheet) — buy / sell with numpad + slider
// ─────────────────────────────────────────────────────────────
function TradeSheet({ side, asset, lang = 'ru', onClose, onSubmit, dark = false }) {
  const [amount, setAmount] = React.useState('');
  const sub = dark ? 'rgba(255,255,255,0.5)' : SC.ink500;
  const text = dark ? '#fff' : SC.ink1000;
  const cardBg = dark ? SC.ink900 : SC.paper;
  const keyBg = dark ? 'rgba(255,255,255,0.06)' : SC.ink50;

  const onKey = (k) => {
    if (k === 'back') setAmount(a => a.slice(0, -1));
    else if (k === '.') { if (!amount.includes('.')) setAmount(a => (a || '0') + '.'); }
    else setAmount(a => (a + k).slice(0, 12));
  };

  const numpad = ['1','2','3','4','5','6','7','8','9','.','0','back'];
  const display = amount || '0';
  const numericAmount = parseFloat(amount || '0') || 0;
  const qty = numericAmount / asset.price;
  const isBuy = side === 'buy';

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50 }}>
      {/* backdrop */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}/>
      {/* sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: cardBg, color: text,
        borderTopLeftRadius: 36, borderTopRightRadius: 36,
        padding: '12px 20px 30px',
        display: 'flex', flexDirection: 'column', gap: 14,
        boxShadow: '0 -8px 30px rgba(0,0,0,0.18)',
      }}>
        {/* grabber */}
        <div style={{ alignSelf: 'center', width: 40, height: 4, borderRadius: 999, background: dark ? 'rgba(255,255,255,0.2)' : SC.ink200, marginBottom: 4 }}/>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <TickerLogo symbol={asset.symbol} size={36}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: sub, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {isBuy ? (lang === 'ru' ? 'Покупка' : 'Buying') : (lang === 'ru' ? 'Продажа' : 'Selling')}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{asset.symbol} · {asset.name}</div>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 999, background: keyBg, border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="chevD" size={18} color={text}/>
          </button>
        </div>
        {/* amount */}
        <div style={{ textAlign: 'center', padding: '4px 0 0' }}>
          <div style={{ fontSize: 12, color: sub, fontWeight: 500, marginBottom: 6 }}>
            {lang === 'ru' ? 'Сумма в сомах' : 'Amount in KGS'}
          </div>
          <div style={{ fontFamily: SC.fontMono, fontSize: 56, fontWeight: 700, letterSpacing: '-0.04em', color: text }}>
            <span>{display}</span>
            <span style={{ opacity: 0.4, fontSize: 30, marginLeft: 6 }}>с</span>
          </div>
          <div style={{ fontSize: 12, color: sub, marginTop: 6, fontFamily: SC.fontMono }}>
            ≈ {qty.toFixed(qty < 1 ? 4 : 2)} {asset.symbol}
          </div>
        </div>
        {/* quick chips */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {[1000, 5000, 10000, 25000].map(v => (
            <button key={v} onClick={() => setAmount(String(v))} style={{
              background: keyBg, color: text, border: 'none', cursor: 'pointer',
              padding: '7px 14px', borderRadius: 999, fontFamily: SC.fontMono, fontSize: 12, fontWeight: 600,
            }}>{v.toLocaleString('en-US').replace(/,/g, '\u202F')} с</button>
          ))}
        </div>
        {/* numpad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {numpad.map(k => (
            <button key={k} onClick={() => onKey(k)} style={{
              background: 'transparent', color: text, border: 'none', cursor: 'pointer',
              padding: '14px 0', fontFamily: SC.fontMono, fontSize: 22, fontWeight: 500,
              borderRadius: 14,
            }}>
              {k === 'back' ? '⌫' : k}
            </button>
          ))}
        </div>
        {/* CTA */}
        <Pill variant={isBuy ? 'primary' : 'dark'} size="lg" arrow full onClick={() => onSubmit(side, asset, numericAmount)}>
          {isBuy ? t(lang, 'buy') : t(lang, 'sell')}
        </Pill>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Trade confirmation toast
// ─────────────────────────────────────────────────────────────
function TradeToast({ message, dark = false }) {
  return (
    <div style={{
      position: 'absolute', left: 20, right: 20, bottom: 110, zIndex: 60,
      padding: '14px 16px', borderRadius: 18,
      background: SC.green, color: '#fff',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 12px 30px -8px rgba(0,184,107,0.5)',
      animation: 'toast-in 0.4s cubic-bezier(.22,1,.36,1)',
    }}>
      <div style={{ width: 28, height: 28, borderRadius: 999, background: 'rgba(255,255,255,0.22)', display: 'grid', placeItems: 'center' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>
      </div>
      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, letterSpacing: '-0.2px' }}>{message}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Menu screen — main hub for everything beyond the trading flow
// ─────────────────────────────────────────────────────────────
function MenuScreen({ lang = 'ru', dark = false, onProfile = () => {} }) {
  const bg = dark ? SC.ink1000 : SC.paper;
  const text = dark ? '#fff' : SC.ink1000;
  const sub = dark ? 'rgba(255,255,255,0.5)' : SC.ink500;
  const fieldBg = dark ? 'rgba(255,255,255,0.05)' : SC.ink50;

  const groups = lang === 'ru' ? [
    {
      title: 'Финансы',
      items: [
        { icon: 'wallet',   label: 'Счета и карты',        meta: '2 счёта' },
        { icon: 'qr',       label: 'Реквизиты для пополнения' },
        { icon: 'layers',   label: 'Налоги и выписки',     meta: '2026' },
      ],
    },
    {
      title: 'Обучение и помощь',
      items: [
        { icon: 'book',     label: 'Обучение',             meta: '5 уроков' },
        { icon: 'sparkles', label: 'Инвестиционные идеи',  meta: 'NEW' },
        { icon: 'info',     label: 'Поддержка' },
      ],
    },
    {
      title: 'Безопасность',
      items: [
        { icon: 'fingerprint', label: 'Вход и пароль' },
        { icon: 'bell',        label: 'Уведомления' },
        { icon: 'settings',    label: 'Настройки' },
      ],
    },
  ] : [
    {
      title: 'Finance',
      items: [
        { icon: 'wallet',   label: 'Accounts & cards',   meta: '2 accounts' },
        { icon: 'qr',       label: 'Top-up details' },
        { icon: 'layers',   label: 'Tax & statements',   meta: '2026' },
      ],
    },
    {
      title: 'Learn & help',
      items: [
        { icon: 'book',     label: 'Learn',              meta: '5 lessons' },
        { icon: 'sparkles', label: 'Investment ideas',   meta: 'NEW' },
        { icon: 'info',     label: 'Support' },
      ],
    },
    {
      title: 'Security',
      items: [
        { icon: 'fingerprint', label: 'Sign-in & password' },
        { icon: 'bell',        label: 'Notifications' },
        { icon: 'settings',    label: 'Settings' },
      ],
    },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: bg, color: text, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '64px 20px 14px' }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: '-0.04em', fontFamily: SC.fontDisplay }}>{t(lang, 'menu')}</h1>
      </div>
      {/* Profile card — tap to open Profile */}
      <div style={{ padding: '4px 20px 20px' }}>
        <button onClick={onProfile} style={{
          padding: 18, borderRadius: 24,
          background: dark ? SC.ink900 : SC.greenWash,
          border: dark ? '1px solid rgba(255,255,255,0.05)' : `1px solid ${SC.greenSoft}`,
          display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
          width: '100%', textAlign: 'left', color: 'inherit',
        }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, background: dark ? 'rgba(0,184,107,0.18)' : SC.greenSoft, color: dark ? SC.greenBright : SC.greenDeep, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 22, fontFamily: SC.fontDisplay }}>А</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.2px' }}>{lang === 'ru' ? 'Айгуль Калыкова' : 'Aigul Kalykova'}</div>
            <div style={{ fontSize: 12, color: sub, fontFamily: SC.fontMono, marginTop: 2 }}>ID 7841 · KYC ✓ · +996 ··· 22 41</div>
          </div>
          <Icon name="chevR" size={20} color={sub}/>
        </button>
      </div>
      {/* Groups */}
      <div style={{ flex: 1, padding: '0 20px 96px', overflowY: 'auto' }}>
        {groups.map(g => (
          <div key={g.title} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 4px 8px' }}>{g.title}</div>
            <div style={{ background: fieldBg, borderRadius: 18, overflow: 'hidden' }}>
              {g.items.map((it, i, arr) => (
                <div key={it.label} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px',
                  borderBottom: i === arr.length - 1 ? 'none' : (dark ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${SC.ink200}`),
                  cursor: 'pointer',
                }}>
                  <Icon name={it.icon} size={20} color={text}/>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, letterSpacing: '-0.2px' }}>{it.label}</span>
                  {it.meta && (
                    <span style={{
                      fontSize: it.meta === 'NEW' ? 10 : 12,
                      fontWeight: it.meta === 'NEW' ? 700 : 600,
                      color: it.meta === 'NEW' ? SC.ink1000 : sub,
                      background: it.meta === 'NEW' ? SC.lime : 'transparent',
                      padding: it.meta === 'NEW' ? '2px 7px' : 0,
                      borderRadius: it.meta === 'NEW' ? 999 : 0,
                      letterSpacing: it.meta === 'NEW' ? '0.04em' : 'normal',
                      fontFamily: it.meta === 'NEW' ? SC.fontDisplay : SC.fontMono,
                    }}>{it.meta}</span>
                  )}
                  <Icon name="chevR" size={16} color={sub}/>
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* Logout */}
        <button style={{
          width: '100%', padding: '14px 16px', borderRadius: 18,
          background: fieldBg, color: SC.danger, border: 'none', cursor: 'pointer',
          fontFamily: SC.fontDisplay, fontWeight: 600, fontSize: 14, letterSpacing: '-0.2px',
        }}>{lang === 'ru' ? 'Выйти' : 'Sign out'}</button>
        <div style={{ marginTop: 18, textAlign: 'center', color: sub, fontSize: 11, fontFamily: SC.fontMono }}>
          Senti · v1.0.0 · 2026
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Profile screen — opens from header avatar tap; full personal info
// ─────────────────────────────────────────────────────────────
function ProfileScreen({ lang = 'ru', dark = false, onBack = () => {} }) {
  const bg = dark ? SC.ink1000 : SC.paper;
  const text = dark ? '#fff' : SC.ink1000;
  const sub = dark ? 'rgba(255,255,255,0.5)' : SC.ink500;
  const fieldBg = dark ? 'rgba(255,255,255,0.05)' : SC.ink50;
  const rows = lang === 'ru' ? [
    { label: 'ФИО',         value: 'Калыкова Айгуль Маратовна' },
    { label: 'Дата рожд.',  value: '14.06.1996' },
    { label: 'Гражданство', value: 'Кыргызская Республика' },
    { label: 'Паспорт',     value: 'AN 1840 ···· 8841' },
    { label: 'ИНН',         value: '20406199600541' },
    { label: 'Email',       value: 'a.kalykova@mail.kg' },
    { label: 'Телефон',     value: '+996 ··· 22 41' },
    { label: 'Адрес',       value: 'г. Бишкек, Чуйский пр-т, 162' },
  ] : [
    { label: 'Full name',    value: 'Kalykova Aigul Maratovna' },
    { label: 'Date of birth',value: '14.06.1996' },
    { label: 'Citizenship',  value: 'Kyrgyz Republic' },
    { label: 'Passport',     value: 'AN 1840 ···· 8841' },
    { label: 'Tax ID',       value: '20406199600541' },
    { label: 'Email',        value: 'a.kalykova@mail.kg' },
    { label: 'Phone',        value: '+996 ··· 22 41' },
    { label: 'Address',      value: 'Bishkek, Chuy prospect, 162' },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, background: bg, color: text, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '54px 20px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 999, background: fieldBg, border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
          <Icon name="chevL" size={18} color={text}/>
        </button>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.03em', fontFamily: SC.fontDisplay }}>{t(lang, 'profile')}</h1>
      </div>
      {/* Hero — avatar + KYC status */}
      <div style={{ padding: '4px 20px 18px', textAlign: 'center' }}>
        <div style={{ width: 96, height: 96, borderRadius: 999, background: dark ? 'rgba(0,184,107,0.18)' : SC.greenSoft, color: dark ? SC.greenBright : SC.greenDeep, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 36, fontFamily: SC.fontDisplay, margin: '8px auto 14px', position: 'relative' }}>
          А
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 999, background: SC.green, border: `3px solid ${bg}`, display: 'grid', placeItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>
          </div>
        </div>
        <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.3px' }}>{lang === 'ru' ? 'Айгуль Калыкова' : 'Aigul Kalykova'}</div>
        <div style={{ fontSize: 12, color: sub, marginTop: 4, fontFamily: SC.fontMono }}>ID 7841 · {lang === 'ru' ? 'с 12 марта 2024' : 'since Mar 12, 2024'}</div>
        <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: dark ? 'rgba(0,184,107,0.18)' : SC.greenSoft, color: dark ? SC.greenBright : SC.greenDeep, fontSize: 12, fontWeight: 600, letterSpacing: '-0.1px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>
          {lang === 'ru' ? 'KYC подтверждён' : 'KYC verified'}
        </div>
      </div>
      {/* Info table */}
      <div style={{ flex: 1, padding: '0 20px 96px', overflowY: 'auto' }}>
        <div style={{ background: fieldBg, borderRadius: 18, overflow: 'hidden' }}>
          {rows.map((r, i, arr) => (
            <div key={r.label} style={{
              display: 'flex', alignItems: 'center', padding: '13px 16px', gap: 12,
              borderBottom: i === arr.length - 1 ? 'none' : (dark ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${SC.ink200}`),
            }}>
              <span style={{ flex: '0 0 110px', fontSize: 12, color: sub, fontWeight: 500 }}>{r.label}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: text, fontFamily: r.label.toLowerCase().includes('паспорт') || r.label.toLowerCase().includes('passport') || r.label.toLowerCase().includes('инн') || r.label.toLowerCase().includes('tax') || r.label.toLowerCase().includes('phone') || r.label.toLowerCase().includes('телефон') ? SC.fontMono : SC.fontDisplay, letterSpacing: '-0.1px' }}>{r.value}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
          <Pill variant={dark ? 'softDark' : 'soft'} size="md" full>{lang === 'ru' ? 'Изменить' : 'Edit'}</Pill>
          <Pill variant="primary" size="md" full arrow>{lang === 'ru' ? 'Документы' : 'Documents'}</Pill>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mobile Assets view — 3 tabs: Портфель / Приказы / Сделки
// ─────────────────────────────────────────────────────────────
const MOBILE_ORDERS_RU = [
  { id: 1, side: 'buy',  symbol: 'AAPL', name: 'Apple Inc.',  price:  185.00, ccy: '$', qty: 5, status: 'Активен', date: 'Сегодня · 09:14', type: 'Лимитный' },
  { id: 2, side: 'sell', symbol: 'TSLA', name: 'Tesla',       price:  260.00, ccy: '$', qty: 3, status: 'Активен', date: 'Сегодня · 08:42', type: 'Стоп' },
  { id: 3, side: 'buy',  symbol: 'KCEL', name: 'Кыргызтелеком',price:  240.00, ccy: 'с', qty:100, status: 'Активен', date: 'Вчера · 16:00',  type: 'Лимитный' },
];
const MOBILE_ORDERS_EN = [
  { id: 1, side: 'buy',  symbol: 'AAPL', name: 'Apple Inc.',  price: 185.00, ccy: '$', qty: 5,   status: 'Active', date: 'Today · 09:14', type: 'Limit' },
  { id: 2, side: 'sell', symbol: 'TSLA', name: 'Tesla',       price: 260.00, ccy: '$', qty: 3,   status: 'Active', date: 'Today · 08:42', type: 'Stop' },
  { id: 3, side: 'buy',  symbol: 'KCEL', name: 'Kyrgyztelecom', price: 240.00, ccy: 'с', qty: 100, status: 'Active', date: 'Yesterday · 16:00', type: 'Limit' },
];

const MOBILE_TRADES_RU = [
  { id: 1, side: 'buy',  symbol: 'NVDA', name: 'Nvidia',       price: 498.12, ccy: '$', qty: 0.04,  total:   4980.20, date: '14 мая · 14:32' },
  { id: 2, side: 'sell', symbol: 'TSLA', name: 'Tesla',        price: 245.20, ccy: '$', qty: 0.6,   total:   1471.20, date: '12 мая · 18:04' },
  { id: 3, side: 'buy',  symbol: 'BTC',  name: 'Bitcoin',      price: 69420,  ccy: '$', qty: 0.001, total:     69.42, date: '08 мая · 12:18' },
  { id: 4, side: 'buy',  symbol: 'KCEL', name: 'Кыргызтелеком', price:  244.00, ccy: 'с', qty: 50,    total:  12200.00, date: '02 мая · 10:08' },
];
const MOBILE_TRADES_EN = MOBILE_TRADES_RU.map(t => ({ ...t, date: t.date.replace('мая', 'May').replace('14 ', 'May 14, ').replace('12 ', 'May 12, ').replace('08 ', 'May 8, ').replace('02 ', 'May 2, ') }));

function MobileAssetsView({ lang = 'ru', dark = false, onAsset = () => {} }) {
  const [tab, setTab] = React.useState('portfolio');
  const bg = dark ? SC.ink1000 : SC.paper;
  const text = dark ? '#fff' : SC.ink1000;
  const sub = dark ? 'rgba(255,255,255,0.5)' : SC.ink500;
  const fieldBg = dark ? 'rgba(255,255,255,0.05)' : SC.ink50;
  const border = dark ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${SC.ink200}`;
  const tabs = [
    { id: 'portfolio', label: t(lang, 'portfolioTab') },
    { id: 'orders',    label: t(lang, 'orders') },
    { id: 'trades',    label: t(lang, 'trades') },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, background: bg, color: text, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '64px 20px 8px' }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: '-0.04em', fontFamily: SC.fontDisplay }}>{t(lang, 'assets')}</h1>
      </div>
      {/* Tabs (segment) */}
      <div style={{ padding: '12px 20px 8px' }}>
        <div style={{ display: 'flex', background: fieldBg, borderRadius: 12, padding: 3, gap: 0 }}>
          {tabs.map(tg => (
            <button key={tg.id} onClick={() => setTab(tg.id)} style={{
              flex: 1, background: tab === tg.id ? (dark ? '#fff' : SC.ink1000) : 'transparent',
              color: tab === tg.id ? (dark ? SC.ink1000 : '#fff') : sub,
              border: 'none', cursor: 'pointer',
              padding: '8px 0', borderRadius: 10,
              fontFamily: SC.fontDisplay, fontWeight: 600, fontSize: 13, letterSpacing: '-0.2px',
            }}>{tg.label}</button>
          ))}
        </div>
      </div>

      {/* Summary card (depends on tab) */}
      <div style={{ padding: '6px 20px 6px' }}>
        {tab === 'portfolio' && (
          <div style={{ padding: '14px 16px', borderRadius: 16, background: fieldBg, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t(lang, 'totalBalance')}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4 }}>
                <MoneyKGS value={PORTFOLIO.balance} size={28} weight={600} color={text}/>
                <DeltaPill value={PORTFOLIO.dayChangePct} size="sm"/>
              </div>
            </div>
            {/* Allocation strip + legend */}
            <div>
              <div style={{ fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>{t(lang, 'allocation')}</div>
              <AllocationStrip segments={PORTFOLIO.allocation[lang]} height={6} showLabels={false}/>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 10 }}>
                {PORTFOLIO.allocation[lang].map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: 999, background: s.color, flexShrink: 0 }}/>
                    <span style={{ fontSize: 12, color: sub, fontWeight: 500 }}>{s.label}</span>
                    <span style={{ fontFamily: SC.fontMono, fontSize: 12, fontWeight: 600, color: text }}>{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === 'orders' && (
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, padding: '12px 14px', borderRadius: 14, background: fieldBg }}>
              <div style={{ fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{lang === 'ru' ? 'Активные' : 'Active'}</div>
              <div style={{ fontFamily: SC.fontMono, fontSize: 22, fontWeight: 700, color: text, letterSpacing: '-0.03em', marginTop: 2 }}>3</div>
            </div>
            <div style={{ flex: 1, padding: '12px 14px', borderRadius: 14, background: fieldBg }}>
              <div style={{ fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{lang === 'ru' ? 'За неделю' : 'This week'}</div>
              <div style={{ fontFamily: SC.fontMono, fontSize: 22, fontWeight: 700, color: text, letterSpacing: '-0.03em', marginTop: 2 }}>11</div>
            </div>
          </div>
        )}
        {tab === 'trades' && (
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, padding: '12px 14px', borderRadius: 14, background: fieldBg }}>
              <div style={{ fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{lang === 'ru' ? 'Всего сделок' : 'Total trades'}</div>
              <div style={{ fontFamily: SC.fontMono, fontSize: 22, fontWeight: 700, color: text, letterSpacing: '-0.03em', marginTop: 2 }}>48</div>
            </div>
            <div style={{ flex: 1, padding: '12px 14px', borderRadius: 14, background: fieldBg }}>
              <div style={{ fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{lang === 'ru' ? 'Прибыль ' : 'P&L · '}{lang === 'ru' ? 'мес.' : 'mo'}</div>
              <div style={{ fontFamily: SC.fontMono, fontSize: 22, fontWeight: 700, color: SC.greenDeep, letterSpacing: '-0.03em', marginTop: 2 }}>+12 480 с</div>
            </div>
          </div>
        )}
      </div>

      {/* List */}
      <div style={{ flex: 1, padding: '8px 20px 96px', overflowY: 'auto' }}>
        {tab === 'portfolio' && (
          PORTFOLIO.holdings.map((h, i, arr) => (
            <AssetRow key={h.symbol} {...h} sparkData={h.spark} priceCcy={h.ccy} last={i === arr.length - 1} dark={dark}
              onClick={() => onAsset(h)}/>
          ))
        )}
        {tab === 'orders' && (
          (lang === 'ru' ? MOBILE_ORDERS_RU : MOBILE_ORDERS_EN).map((o, i, arr) => (
            <div key={o.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0',
              borderBottom: i === arr.length - 1 ? 'none' : border,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: o.side === 'buy' ? SC.greenSoft : '#FBE0E0', color: o.side === 'buy' ? SC.greenDeep : '#8E1F1F', display: 'grid', placeItems: 'center' }}>
                <Icon name={o.side === 'buy' ? 'arrUp' : 'arrDn'} size={18} color="currentColor" strokeWidth={2.2}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.2px' }}>
                  {o.side === 'buy' ? (lang === 'ru' ? 'Покупка' : 'Buy') : (lang === 'ru' ? 'Продажа' : 'Sell')} · {o.symbol}
                </div>
                <div style={{ fontSize: 12, color: sub, fontFamily: SC.fontMono, marginTop: 2 }}>{o.type} · {o.date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: SC.fontMono, fontSize: 13, fontWeight: 600, color: text }}>{o.qty} × {o.ccy}{o.price.toFixed(2)}</div>
                <div style={{ fontSize: 11, color: SC.greenDeep, fontWeight: 600, marginTop: 2 }}>● {o.status}</div>
              </div>
            </div>
          ))
        )}
        {tab === 'trades' && (
          (lang === 'ru' ? MOBILE_TRADES_RU : MOBILE_TRADES_EN).map((tr, i, arr) => (
            <div key={tr.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0',
              borderBottom: i === arr.length - 1 ? 'none' : border,
            }}>
              <TickerLogo symbol={tr.symbol} size={40}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.2px' }}>
                  {tr.side === 'buy' ? (lang === 'ru' ? 'Купил' : 'Bought') : (lang === 'ru' ? 'Продал' : 'Sold')} {tr.symbol}
                </div>
                <div style={{ fontSize: 12, color: sub, fontFamily: SC.fontMono, marginTop: 2 }}>{tr.qty} × {tr.ccy}{tr.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} · {tr.date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: SC.fontMono, fontSize: 14, fontWeight: 600, color: text }}>
                  {tr.side === 'buy' ? '−' : '+'}{tr.ccy}{tr.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Mobile home — News + Investment ideas block (replaces Assets list)
// ──────────────────────────────────────────────────────────────
function NewsThumb({ kind, dark = false }) {
  const sets = {
    crypto: {
      bg: 'linear-gradient(135deg, #F7931A 0%, #FFC56C 100%)',
      glyph: '₿',
    },
    apple: {
      bg: 'linear-gradient(135deg, #0E1413 0%, #2A3331 100%)',
      glyph: '\uF8FF', // apple-ish; falls back to letter A
    },
    kg: {
      bg: 'linear-gradient(135deg, #006B3F 0%, #00B86B 100%)',
      glyph: 'KG',
    },
    market: {
      bg: 'linear-gradient(135deg, #2A6FDB 0%, #6FC2FF 100%)',
      glyph: '↗',
    },
  };
  const s = sets[kind] || sets.market;
  return (
    <div style={{
      width: 56, height: 56, borderRadius: 14,
      background: s.bg, flex: '0 0 auto',
      display: 'grid', placeItems: 'center', overflow: 'hidden',
      position: 'relative',
      boxShadow: dark ? 'inset 0 0 0 1px rgba(255,255,255,0.06)' : 'inset 0 0 0 1px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        position: 'absolute', bottom: -6, right: -8,
        fontFamily: SC.fontDisplay, fontWeight: 800, fontSize: 56,
        color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.05em', lineHeight: 0.9,
      }}>{s.glyph}</div>
      <div style={{
        position: 'absolute', top: 8, left: 8, width: 8, height: 8, borderRadius: 999,
        background: 'rgba(255,255,255,0.55)',
      }}/>
    </div>
  );
}

const MOBILE_NEWS_RU = [
  { tag: 'Крипто', title: 'BTC удерживает $69 000 после ралли',    meta: 'CoinDesk · 1 ч', img: 'crypto' },
  { tag: 'CFD',    title: 'Apple отчитается на следующей неделе',  meta: 'Reuters · 12 мин', img: 'apple' },
];
const MOBILE_NEWS_EN = [
  { tag: 'Crypto', title: 'BTC holds $69,000 after rally',          meta: 'CoinDesk · 1h', img: 'crypto' },
  { tag: 'CFD',    title: 'Apple to report earnings next week',     meta: 'Reuters · 12 min', img: 'apple' },
];
const MOBILE_IDEAS_RU = [
  { tag: 'AI · CFD',   title: 'Инфраструктура ИИ', upside: '+12%',  dark: true,  basket: ['NVDA','AMD','GOOGL'] },
  { tag: 'KG',         title: 'Дивиденды KG',      upside: '+6%',   dark: false, basket: ['KCEL','KICB'] },
];
const MOBILE_IDEAS_EN = [
  { tag: 'AI · CFD',   title: 'AI infrastructure', upside: '+12%',  dark: true,  basket: ['NVDA','AMD','GOOGL'] },
  { tag: 'KG',         title: 'KG dividends',      upside: '+6%',   dark: false, basket: ['KCEL','KICB'] },
];

function HomeIdeasNews({ lang = 'ru', dark = false, accent = 'green' }) {
  const text = dark ? '#fff' : SC.ink1000;
  const sub = dark ? 'rgba(255,255,255,0.5)' : SC.ink500;
  const border = dark ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${SC.ink200}`;
  const cardBg = dark ? SC.ink900 : SC.paper;
  const ideas = lang === 'ru' ? MOBILE_IDEAS_RU : MOBILE_IDEAS_EN;
  const news = lang === 'ru' ? MOBILE_NEWS_RU : MOBILE_NEWS_EN;
  return (
    <div style={{ padding: '14px 20px 100px' }}>
      {/* Ideas — 2 cards in a row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: text, letterSpacing: '-0.3px' }}>{t(lang, 'investIdeas')}</span>
        <span style={{ color: sub, fontSize: 13, fontWeight: 500 }}>{t(lang, 'seeAll')} →</span>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        {ideas.map((idea, i) => (
          <div key={i} style={{
            flex: 1,
            background: idea.dark ? SC.ink1000 : (dark ? 'rgba(255,255,255,0.06)' : SC.greenWash),
            color: idea.dark ? '#fff' : text,
            border: !idea.dark && !dark ? `1px solid ${SC.greenSoft}` : 'none',
            borderRadius: 16, padding: 10, position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', gap: 2,
          }}>
            <span style={{
              display: 'inline-block', alignSelf: 'flex-start',
              padding: '2px 7px', borderRadius: 999,
              background: idea.dark ? SC.lime : (dark ? 'rgba(255,255,255,0.1)' : '#fff'),
              color: idea.dark ? SC.ink1000 : (dark ? '#fff' : SC.greenDeep),
              fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>{idea.tag}</span>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.2px', lineHeight: 1.15, marginTop: 2 }}>{idea.title}</div>
            <div style={{ flex: 1 }}/>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: SC.fontMono, fontSize: 16, fontWeight: 700, color: idea.dark ? SC.greenBright : SC.greenDeep, letterSpacing: '-0.03em' }}>{idea.upside}</span>
              <div style={{ display: 'flex' }}>
                {idea.basket.slice(0, 3).map((sym, j) => (
                  <div key={sym} style={{ marginLeft: j === 0 ? 0 : -8, border: `2px solid ${idea.dark ? SC.ink1000 : (dark ? SC.ink900 : '#fff')}`, borderRadius: 8 }}>
                    <TickerLogo symbol={sym} size={22}/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* News */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: text, letterSpacing: '-0.3px' }}>{t(lang, 'news')}</span>
        <span style={{ color: sub, fontSize: 13, fontWeight: 500 }}>{t(lang, 'seeAll')} →</span>
      </div>
      {news.slice(0, 1).map((n, i, arr) => (
        <div key={i} style={{
          padding: '8px 0',
          borderBottom: i === arr.length - 1 ? 'none' : border,
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          {/* Thumbnail */}
          <NewsThumb kind={n.img} dark={dark}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'inline-block', padding: '2px 7px', borderRadius: 999, background: dark ? 'rgba(255,255,255,0.06)' : SC.ink100, color: sub, fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{n.tag}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: text, letterSpacing: '-0.1px', lineHeight: 1.25 }}>{n.title}</div>
            <div style={{ fontSize: 11, color: sub, fontFamily: SC.fontMono, marginTop: 2 }}>{n.meta}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  MARKETS_ALL, MarketsScreen, AssetDetailScreen, TradeSheet, TradeToast,
  ProfileScreen, MenuScreen, MobileAssetsView, HomeIdeasNews,
  MOBILE_NEWS_RU, MOBILE_NEWS_EN, MOBILE_IDEAS_RU, MOBILE_IDEAS_EN,
});
