// Senti brokerage — three mobile portfolio variations
// Each renders the iOS frame content area (390×844 - status bar - home indicator)
// V1: Зелёный/light · V2: Минимализм/light · V3: Тёмная/dark

// ──────────────────────────────────────────────────────────────
// Shared portfolio data
// ──────────────────────────────────────────────────────────────
const PORTFOLIO = {
  balance: 248420.50,
  dayChange: 4280.20,
  dayChangePct: 1.72,
  series7d: [243200, 244100, 243600, 245200, 244700, 246800, 248420],
  series1m: [232000, 228000, 235000, 230000, 237500, 236000, 240000, 244100, 241500, 243800, 245200, 248420],
  allocation: {
    ru: [
      { id: 'kg',    label: 'Кырг. рынок',  pct: 32, color: '#00B86B' },
      { id: 'cfd',   label: 'CFD',          pct: 41, color: '#006B3F' },
      { id: 'crypto',label: 'Крипто',       pct: 19, color: '#C8FF4D' },
      { id: 'cash',  label: 'Кэш · сом',    pct:  8, color: '#C7CFCC' },
    ],
    en: [
      { id: 'kg',    label: 'KG market',    pct: 32, color: '#00B86B' },
      { id: 'cfd',   label: 'CFD',          pct: 41, color: '#006B3F' },
      { id: 'crypto',label: 'Crypto',       pct: 19, color: '#C8FF4D' },
      { id: 'cash',  label: 'Cash · KGS',   pct:  8, color: '#C7CFCC' },
    ],
  },
  // sample asset rows
  holdings: [
    { symbol: 'NVDA', name: 'Nvidia',    cls: 'cfd',    price: 498.12,  ccy: '$', change:  2.3, qty: 4,    spark: [490,494,491,495,493,497,498] },
    { symbol: 'AAPL', name: 'Apple Inc.',cls: 'cfd',    price: 189.45,  ccy: '$', change:  0.8, qty: 12,   spark: [187,188,189,188,189,189,189.45] },
    { symbol: 'TSLA', name: 'Tesla',     cls: 'cfd',    price: 245.20,  ccy: '$', change: -1.2, qty: 6,    spark: [248,247,249,246,245,245,245.2] },
    { symbol: 'BTC',  name: 'Bitcoin',   cls: 'crypto', price: 69420.10,ccy: '$', change:  0.4, qty: 0.04, spark: [69100,69300,69200,69500,69300,69400,69420] },
    { symbol: 'ETH',  name: 'Ethereum',  cls: 'crypto', price:  3520.55,ccy: '$', change: -0.8, qty: 0.6,  spark: [3580,3550,3570,3540,3530,3525,3520] },
    { symbol: 'KCEL', name: 'Кыргызтелеком', cls:'kg',  price: 248.00,  ccy: 'с', change:  1.2, qty: 50,   spark: [244,245,246,246,247,247.5,248] },
  ],
  movers: [
    { symbol: 'NVDA', name: 'Nvidia',  change:  2.3, spark: [490,494,491,495,493,497,498] },
    { symbol: 'KCEL', name: 'Кырг.тел.', change: 1.2, spark: [244,245,246,246,247,247.5,248] },
    { symbol: 'TSLA', name: 'Tesla',   change: -1.2, spark: [248,247,249,246,245,245,245.2] },
    { symbol: 'BTC',  name: 'Bitcoin', change:  0.4, spark: [69100,69300,69200,69500,69300,69400,69420] },
  ],
};

// ──────────────────────────────────────────────────────────────
// Bottom tab bar — 5 items: Главная · Рынки · [+] · Активы · Профиль
// (with floating green [+] button for quick trade — novel element)
// ──────────────────────────────────────────────────────────────
function BrokerTabs({ active, onChange, lang = 'ru', dark = false }) {
  const items = [
    { id: 'home',    label: t(lang, 'home'),    icon: 'home' },
    { id: 'markets', label: t(lang, 'markets'), icon: 'chart' },
    { id: 'trade',   label: '',                 icon: 'plus', cta: true },
    { id: 'assets',  label: t(lang, 'assets'),  icon: 'wallet' },
    { id: 'menu',    label: t(lang, 'menu'),    icon: 'grid' },
  ];
  const bg = dark ? 'rgba(14,20,19,0.72)' : 'rgba(255,255,255,0.78)';
  const border = dark ? 'rgba(255,255,255,0.06)' : SC.ink200;
  const inactive = dark ? 'rgba(255,255,255,0.45)' : SC.ink400;
  const activeC = dark ? '#fff' : SC.ink1000;
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingBottom: 28, paddingTop: 10,
      background: bg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderTop: `1px solid ${border}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start',
    }}>
      {items.map(item => {
        if (item.cta) {
          return (
            <button key={item.id} onClick={() => onChange(item.id)} style={{
              border: 'none', cursor: 'pointer', background: 'none',
              padding: 0, marginTop: -28,
              width: 56, height: 56,
              borderRadius: 999, display: 'grid', placeItems: 'center',
              boxShadow: '0 8px 18px -4px rgba(0, 184, 107, 0.45)',
            }}>
              <div style={{ width: 56, height: 56, borderRadius: 999, background: SC.green, display: 'grid', placeItems: 'center' }}>
                <Icon name="plus" size={26} color="#fff" strokeWidth={2.5}/>
              </div>
            </button>
          );
        }
        const on = active === item.id;
        return (
          <button key={item.id} onClick={() => onChange(item.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '4px 8px', minWidth: 56,
            color: on ? activeC : inactive,
          }}>
            <Icon name={item.icon} size={22} color={on ? activeC : inactive} strokeWidth={on ? 2 : 1.75}/>
            <span style={{ fontSize: 11, fontWeight: on ? 600 : 500, letterSpacing: '-0.1px', fontFamily: SC.fontDisplay }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// V1 — "Зелёный" : green hero card on light, more brand presence
// ──────────────────────────────────────────────────────────────
function MobileV1Green({ lang = 'ru', onProfile = () => {} }) {
  return (
    <div data-screen-label={`Mobile / V1 Green / ${lang}`} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: SC.paper, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '64px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onProfile} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: 999, background: SC.greenSoft, color: SC.greenDeep, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 16, fontFamily: SC.fontDisplay }}>А</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 11, color: SC.ink500, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t(lang, 'hi')}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: SC.ink1000, letterSpacing: '-0.2px' }}>{lang === 'ru' ? 'Айгуль' : 'Aigul'}</div>
          </div>
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ width: 40, height: 40, borderRadius: 999, background: SC.ink100, border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="chat" size={20}/>
          </button>
          <button style={{ width: 40, height: 40, borderRadius: 999, background: SC.ink100, border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer', position: 'relative' }}>
            <Icon name="bell" size={20}/>
            <span style={{ position: 'absolute', top: 9, right: 10, width: 8, height: 8, borderRadius: 999, background: SC.green, border: '1.5px solid #fff' }}/>
          </button>
        </div>
      </div>

      {/* Hero: green wash card */}
      <div style={{ padding: '0 20px' }}>
        <div style={{
          background: SC.greenWash, borderRadius: 28, padding: '20px 22px 22px',
          border: `1px solid ${SC.greenSoft}`, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ fontSize: 13, color: SC.greenDeep, fontWeight: 500, letterSpacing: '-0.1px', marginBottom: 6 }}>
            {t(lang, 'totalBalance')}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
            <MoneyKGS value={PORTFOLIO.balance} size={40} weight={600} color={SC.ink1000}/>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <DeltaPill value={PORTFOLIO.dayChangePct} size="md" mode="ghost"/>
            <span style={{ fontFamily: SC.fontMono, fontSize: 13, color: SC.ink500, fontWeight: 500 }}>
              {fmtKGS(PORTFOLIO.dayChange, { sign: true })} {t(lang, 'soms')}
            </span>
          </div>
          {/* Mini chart inside hero */}
          <div style={{ marginLeft: -22, marginRight: -22, marginBottom: -22, position: 'relative' }}>
            <BigChart data={PORTFOLIO.series7d} width={350} height={66} color={SC.green} padY={6} showDot={false}/>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ padding: '18px 20px 12px', display: 'flex', gap: 12 }}>
        {[
          { id: 'buy',    label: t(lang, 'buy'),     icon: 'plus', accent: true },
          { id: 'sell',   label: t(lang, 'sell'),    icon: 'minus' },
          { id: 'with',   label: t(lang, 'withdraw'),icon: 'upload' },
          { id: 'topup',  label: t(lang, 'topUp'),   icon: 'download' },
        ].map(a => (
          <button key={a.id} style={{
            flex: 1, border: 'none', cursor: 'pointer',
            background: a.accent ? SC.ink1000 : SC.ink100,
            color: a.accent ? '#fff' : SC.ink1000,
            borderRadius: 18, padding: '12px 6px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 999,
              background: a.accent ? SC.green : '#fff',
              display: 'grid', placeItems: 'center',
            }}>
              <Icon name={a.icon} size={16} color={a.accent ? '#fff' : SC.ink1000} strokeWidth={2}/>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '-0.1px', fontFamily: SC.fontDisplay }}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* Allocation strip */}
      <div style={{ padding: '8px 20px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: SC.ink1000, letterSpacing: '-0.2px' }}>{t(lang, 'allocation')}</span>
          <button style={{ background: 'none', border: 'none', color: SC.ink500, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>{t(lang, 'seeAll')} →</button>
        </div>
        <AllocationStrip segments={PORTFOLIO.allocation[lang]} height={10}/>
      </div>

      {/* Holdings preview → replaced by Ideas + News */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <HomeIdeasNews lang={lang}/>
      </div>

      <div style={{ height: 86 }}/>
      <BrokerTabs active="home" onChange={() => {}} lang={lang}/>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// V2 — "Минимализм" : white-first, no green hero block, ink only
// ──────────────────────────────────────────────────────────────
function MobileV2Minimal({ lang = 'ru', onProfile = () => {} }) {
  const [tab, setTab] = React.useState('all');
  const tabs = [
    { id: 'all',    label: lang === 'ru' ? 'Все'    : 'All' },
    { id: 'kg',     label: lang === 'ru' ? 'KG'     : 'KG' },
    { id: 'cfd',    label: lang === 'ru' ? 'CFD'    : 'CFD' },
    { id: 'crypto', label: lang === 'ru' ? 'Крипто' : 'Crypto' },
  ];
  const filtered = tab === 'all'
    ? PORTFOLIO.holdings
    : PORTFOLIO.holdings.filter(h => h.cls === tab);
  return (
    <div data-screen-label={`Mobile / V2 Minimal / ${lang}`} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: SC.paper, overflow: 'hidden' }}>
      {/* tiny header */}
      <div style={{ padding: '64px 24px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onProfile} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 13, color: SC.ink500, fontWeight: 500, letterSpacing: '-0.1px' }}>
          {t(lang, 'hi')}, <span style={{ color: SC.ink1000, fontWeight: 600 }}>{lang === 'ru' ? 'Айгуль' : 'Aigul'}</span>
        </button>
        <div style={{ display: 'flex', gap: 14 }}>
          <Icon name="chat" size={20} color={SC.ink500}/>
          <Icon name="search" size={20} color={SC.ink500}/>
          <Icon name="bell" size={20} color={SC.ink500}/>
        </div>
      </div>

      {/* huge balance number — minimal */}
      <div style={{ padding: '26px 24px 8px' }}>
        <div style={{ fontSize: 12, color: SC.ink500, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          {t(lang, 'totalBalance')}
        </div>
        <MoneyKGS value={PORTFOLIO.balance} size={54} weight={600} color={SC.ink1000}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: SC.greenDeep, fontFamily: SC.fontMono, fontWeight: 600, fontSize: 13 }}>
            <Icon name="arrUp" size={12} color={SC.greenDeep} strokeWidth={2.4}/>
            +{PORTFOLIO.dayChangePct.toFixed(1)}%
          </span>
          <span style={{ fontFamily: SC.fontMono, fontSize: 13, color: SC.ink500 }}>{fmtKGS(PORTFOLIO.dayChange, { sign: true })} {t(lang, 'soms')} · {t(lang, 'todayChange')}</span>
        </div>
      </div>

      {/* compact chart */}
      <div style={{ padding: '4px 24px 0', position: 'relative' }}>
        <BigChart data={PORTFOLIO.series1m} width={342} height={80} color={SC.ink1000} fillColor={SC.ink1000} padY={4}/>
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          {['7d','1m','1y'].map((p, i) => (
            <span key={p} style={{
              padding: '4px 10px', borderRadius: 999,
              background: i === 1 ? SC.ink1000 : 'transparent',
              color: i === 1 ? '#fff' : SC.ink500,
              fontSize: 11, fontWeight: 600, fontFamily: SC.fontMono, letterSpacing: '-0.1px',
            }}>{p}</span>
          ))}
        </div>
      </div>

      {/* asset list → ideas + news */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <HomeIdeasNews lang={lang}/>
      </div>

      <div style={{ height: 86 }}/>
      <BrokerTabs active="home" onChange={() => {}} lang={lang}/>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// V3 — "Тёмная" : ink-1000 dark, green accents, more data dense
// ──────────────────────────────────────────────────────────────
function MobileV3Dark({ lang = 'ru', onProfile = () => {} }) {
  return (
    <div data-screen-label={`Mobile / V3 Dark / ${lang}`} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: SC.ink1000, overflow: 'hidden', color: '#fff' }}>
      {/* Header */}
      <div style={{ padding: '64px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onProfile} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: 999, background: 'rgba(0,184,107,0.18)', color: SC.greenBright, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 16, fontFamily: SC.fontDisplay }}>А</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t(lang, 'hi')}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: '-0.2px' }}>{lang === 'ru' ? 'Айгуль' : 'Aigul'}</div>
          </div>
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ width: 40, height: 40, borderRadius: 999, background: 'rgba(255,255,255,0.08)', border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="chat" size={20} color="#fff"/>
          </button>
          <button style={{ width: 40, height: 40, borderRadius: 999, background: 'rgba(255,255,255,0.08)', border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Icon name="search" size={20} color="#fff"/>
          </button>
          <button style={{ width: 40, height: 40, borderRadius: 999, background: 'rgba(255,255,255,0.08)', border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer', position: 'relative' }}>
            <Icon name="bell" size={20} color="#fff"/>
            <span style={{ position: 'absolute', top: 9, right: 10, width: 8, height: 8, borderRadius: 999, background: SC.greenBright, border: `1.5px solid ${SC.ink1000}` }}/>
          </button>
        </div>
      </div>

      {/* Balance hero — dark with subtle gradient */}
      <div style={{ padding: '6px 20px 0' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
          {t(lang, 'totalBalance')}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <MoneyKGS value={PORTFOLIO.balance} size={44} weight={600} color="#fff"/>
          <Icon name="eye" size={18} color="rgba(255,255,255,0.45)"/>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 999,
            background: 'rgba(0,184,107,0.22)', color: SC.greenBright,
            fontFamily: SC.fontMono, fontWeight: 600, fontSize: 12,
          }}>
            <Icon name="arrUp" size={10} color={SC.greenBright} strokeWidth={2.4}/>
            +{PORTFOLIO.dayChangePct.toFixed(2)}%
          </span>
          <span style={{ fontFamily: SC.fontMono, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{fmtKGS(PORTFOLIO.dayChange, { sign: true })} {t(lang, 'soms')}</span>
        </div>
        {/* chart */}
        <div style={{ marginTop: 6, marginLeft: -8, marginRight: -8 }}>
          <BigChart data={PORTFOLIO.series7d} width={358} height={70} color={SC.greenBright} padY={8}/>
        </div>
      </div>

      {/* Quick action chips — dark */}
      <div style={{ padding: '12px 20px 14px', display: 'flex', gap: 10 }}>
        {[
          { id: 'buy',    label: t(lang, 'buy'),     icon: 'plus',  accent: true },
          { id: 'sell',   label: t(lang, 'sell'),    icon: 'minus' },
          { id: 'with',   label: t(lang, 'withdraw'),icon: 'upload' },
          { id: 'topup',  label: t(lang, 'topUp'),   icon: 'download' },
        ].map(a => (
          <button key={a.id} style={{
            flex: 1, border: 'none', cursor: 'pointer',
            background: a.accent ? SC.green : 'rgba(255,255,255,0.06)',
            color: '#fff',
            borderRadius: 16, padding: '11px 6px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          }}>
            <Icon name={a.icon} size={18} color="#fff" strokeWidth={2}/>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '-0.1px', fontFamily: SC.fontDisplay }}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* Allocation strip — dark variant */}
      <div style={{ padding: '4px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: '-0.2px' }}>{t(lang, 'allocation')}</span>
          <span style={{ fontFamily: SC.fontMono, fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>4 {lang === 'ru' ? 'класса' : 'classes'}</span>
        </div>
        <div style={{ display: 'flex', gap: 3, height: 10, borderRadius: 999, overflow: 'hidden' }}>
          {PORTFOLIO.allocation[lang].map(s => (
            <div key={s.id} style={{ flex: s.pct, background: s.color, height: 10 }}/>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 10 }}>
          {PORTFOLIO.allocation[lang].map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: 999, background: s.color }}/>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.55)' }}>{s.label}</span>
              <span style={{ fontFamily: SC.fontMono, fontSize: 11, fontWeight: 600, color: '#fff' }}>{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ideas + News (replaces Assets list) */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <HomeIdeasNews lang={lang} dark/>
      </div>

      <div style={{ height: 86 }}/>
      <BrokerTabs active="home" onChange={() => {}} lang={lang} dark/>
    </div>
  );
}

Object.assign(window, { PORTFOLIO, BrokerTabs, MobileV1Green, MobileV2Minimal, MobileV3Dark });
