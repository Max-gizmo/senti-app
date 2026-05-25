// Senti brokerage — three web dashboard variations
// Each renders an 1440×900 surface (the personal cabinet of a newbie investor).
// V1: Зелёный/light · V2: Минимализм/light · V3: Тёмная/dark

// ──────────────────────────────────────────────────────────────
// Shared web-only data (extends PORTFOLIO from mobile-variations)
// ──────────────────────────────────────────────────────────────
const WEB_NEWS_RU = [
  { tag: 'CFD',    title: 'Apple отчитается на следующей неделе', meta: 'Reuters · 12 мин назад' },
  { tag: 'Крипто', title: 'BTC удерживает $69 000 после ралли', meta: 'CoinDesk · 1 ч назад' },
  { tag: 'KG',     title: 'НБКР сохранил ставку на 9,00%',        meta: 'НБКР · 3 ч назад' },
];
const WEB_NEWS_EN = [
  { tag: 'CFD',    title: 'Apple to report earnings next week',   meta: 'Reuters · 12 min' },
  { tag: 'Crypto', title: 'BTC holds $69,000 after rally',        meta: 'CoinDesk · 1h' },
  { tag: 'KG',     title: 'NBKR keeps rate at 9.00%',             meta: 'NBKR · 3h' },
];

const WATCHLIST_RU = [
  { symbol: 'GOOGL', name: 'Alphabet', ccy: '$', price: 174.55, change:  0.6, spark: [172,173,174,173,174,174,174.55] },
  { symbol: 'USD',   name: 'USD / KGS', ccy: 'с',price:  88.95, change: -0.1, spark: [89.1,89.05,89.0,88.98,88.96,88.95,88.95] },
  { symbol: 'EUR',   name: 'EUR / KGS', ccy: 'с',price:  95.20, change:  0.3, spark: [94.7,94.9,95.0,95.1,95.0,95.15,95.2] },
];

// Sidebar nav items for the personal cabinet
const NAV_RU = [
  { id: 'home',     label: 'Главная',    icon: 'home',     active: true },
  { id: 'portfolio',label: 'Портфель',   icon: 'wallet' },
  { id: 'markets',  label: 'Рынки',      icon: 'chart' },
  { id: 'withdraw', label: 'Вывод',       icon: 'upload' },
  { id: 'history',  label: 'История',    icon: 'layers' },
  { id: 'learn',    label: 'Обучение',   icon: 'book' },
  { id: 'settings', label: 'Настройки',  icon: 'settings' },
];
const NAV_EN = [
  { id: 'home',     label: 'Home',       icon: 'home',     active: true },
  { id: 'portfolio',label: 'Portfolio',  icon: 'wallet' },
  { id: 'markets',  label: 'Markets',    icon: 'chart' },
  { id: 'withdraw', label: 'Withdraw',   icon: 'upload' },
  { id: 'history',  label: 'History',    icon: 'layers' },
  { id: 'learn',    label: 'Learn',      icon: 'book' },
  { id: 'settings', label: 'Settings',   icon: 'settings' },
];

// ──────────────────────────────────────────────────────────────
// Sidebar — left column, ~240px
// ──────────────────────────────────────────────────────────────
function WebSidebar({ lang = 'ru', dark = false, active = 'home', onNav, accent = SC.green }) {
  const items = lang === 'ru' ? NAV_RU : NAV_EN;
  const bg = dark ? SC.ink1000 : SC.paper;
  const sectionBg = dark ? 'rgba(255,255,255,0.04)' : SC.ink50;
  const text = dark ? '#fff' : SC.ink1000;
  const sub = dark ? 'rgba(255,255,255,0.5)' : SC.ink500;
  const hover = dark ? 'rgba(255,255,255,0.06)' : SC.ink100;
  return (
    <aside style={{
      width: 240, flex: '0 0 240px',
      background: bg,
      borderRight: dark ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${SC.ink200}`,
      display: 'flex', flexDirection: 'column',
      padding: '24px 16px 20px',
    }}>
      {/* Logo + name (design system wordmark) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px 28px' }}>
        <SentiWordmark height={26} color={SC.green} textColor={text}/>
        <span style={{
          marginLeft: 4, padding: '2px 7px', borderRadius: 999,
          background: dark ? 'rgba(0,184,107,0.18)' : SC.greenSoft,
          color: dark ? SC.greenBright : SC.greenDeep,
          fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>broker</span>
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(item => {
          const on = (active === item.id) || (active === undefined && item.active);
          return (
            <button key={item.id} onClick={() => onNav && onNav(item.id)} style={{
              background: on ? (dark ? 'rgba(0,184,107,0.16)' : SC.greenWash) : 'transparent',
              color: on ? (dark ? SC.greenBright : SC.greenDeep) : sub,
              border: 'none', cursor: 'pointer',
              padding: '10px 12px', borderRadius: 12,
              display: 'flex', alignItems: 'center', gap: 12,
              fontFamily: SC.fontDisplay, fontWeight: on ? 600 : 500, fontSize: 14,
              letterSpacing: '-0.2px', textAlign: 'left',
            }}>
              <Icon name={item.icon} size={18} color={on ? (dark ? SC.greenBright : SC.greenDeep) : sub}/>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.id === 'learn' && (
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 999,
                  background: SC.lime, color: SC.ink1000,
                }}>NEW</span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }}/>

      {/* Promo card — учиться */}
      <div style={{
        marginTop: 16, padding: 14, borderRadius: 16,
        background: dark ? 'rgba(200,255,77,0.10)' : SC.ink1000,
        color: dark ? '#fff' : '#fff',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 999, background: SC.lime, color: SC.ink1000, display: 'grid', placeItems: 'center', marginBottom: 10 }}>
          <Icon name="sparkles" size={18} color={SC.ink1000} strokeWidth={2}/>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.2px', marginBottom: 4 }}>
          {lang === 'ru' ? 'Как работают CFD' : 'How CFDs work'}
        </div>
        <div style={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.55)', marginBottom: 10 }}>
          {lang === 'ru' ? '3 минуты на чтение' : '3 min read'}
        </div>
        <button style={{
          background: '#fff', color: SC.ink1000, border: 'none', cursor: 'pointer',
          padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600,
          fontFamily: SC.fontDisplay, letterSpacing: '-0.1px',
        }}>{lang === 'ru' ? 'Открыть' : 'Open'} →</button>
      </div>

      {/* User card */}
      <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 12, background: sectionBg, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 999, background: SC.greenSoft, color: SC.greenDeep, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13, fontFamily: SC.fontDisplay }}>А</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: text, letterSpacing: '-0.2px' }}>{lang === 'ru' ? 'Айгуль К.' : 'Aigul K.'}</div>
          <div style={{ fontSize: 11, color: sub, fontFamily: SC.fontMono }}>ID 7841 · KYC ✓</div>
        </div>
        <Icon name="chevR" size={16} color={sub}/>
      </div>
    </aside>
  );
}

// ──────────────────────────────────────────────────────────────
// Web top bar — search + language switch + bell + small avatar
// ──────────────────────────────────────────────────────────────
function WebTopBar({ lang = 'ru', setLang, dark = false }) {
  const bg = dark ? SC.ink1000 : SC.paper;
  const text = dark ? '#fff' : SC.ink1000;
  const sub = dark ? 'rgba(255,255,255,0.5)' : SC.ink500;
  const border = dark ? 'rgba(255,255,255,0.08)' : SC.ink200;
  const fieldBg = dark ? 'rgba(255,255,255,0.05)' : SC.ink50;
  return (
    <div style={{
      height: 64, flex: '0 0 64px',
      background: bg,
      borderBottom: `1px solid ${border}`,
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '0 28px',
    }}>
      {/* Search */}
      <div style={{
        flex: 1, maxWidth: 420, display: 'flex', alignItems: 'center', gap: 10,
        background: fieldBg, borderRadius: 12, padding: '8px 14px',
        border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}>
        <Icon name="search" size={16} color={sub}/>
        <input placeholder={lang === 'ru' ? 'Поиск тикера, валюты, новостей…' : 'Search ticker, currency, news…'}
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            fontSize: 13, color: text, fontFamily: SC.fontDisplay, letterSpacing: '-0.2px',
          }}/>
        <span style={{ fontFamily: SC.fontMono, fontSize: 11, padding: '2px 6px', borderRadius: 6, background: dark ? 'rgba(255,255,255,0.07)' : SC.ink100, color: sub }}>⌘K</span>
      </div>

      <div style={{ flex: 1 }}/>

      {/* lang switch */}
      <div style={{ display: 'flex', alignItems: 'center', background: fieldBg, borderRadius: 999, padding: 2, gap: 0 }}>
        {['ru', 'en'].map(l => (
          <button key={l} onClick={() => setLang && setLang(l)} style={{
            background: lang === l ? (dark ? '#fff' : SC.ink1000) : 'transparent',
            color: lang === l ? (dark ? SC.ink1000 : '#fff') : sub,
            border: 'none', cursor: 'pointer',
            padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600,
            fontFamily: SC.fontDisplay, letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>{l}</button>
        ))}
      </div>

      <button style={{ width: 36, height: 36, borderRadius: 999, background: fieldBg, border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', position: 'relative' }}>
        <Icon name="bell" size={16} color={text}/>
        <span style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: 999, background: SC.green, border: `2px solid ${bg}` }}/>
      </button>

      <Pill variant={dark ? 'primary' : 'dark'} size="sm" arrow>{lang === 'ru' ? 'Пополнить' : 'Top up'}</Pill>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Donut / pie chart for allocation (SVG)
// ──────────────────────────────────────────────────────────────
function Donut({ segments, size = 160, thickness = 22, gap = 2, dark = false }) {
  const total = segments.reduce((s, x) => s + x.pct, 0);
  const c = size / 2;
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={c} cy={c} r={r} fill="none" stroke={dark ? 'rgba(255,255,255,0.06)' : SC.ink100} strokeWidth={thickness}/>
      {segments.map(s => {
        const len = (s.pct / total) * C;
        const dashArr = `${len - gap} ${C - len + gap}`;
        const el = (
          <circle key={s.id} cx={c} cy={c} r={r} fill="none"
            stroke={s.color} strokeWidth={thickness}
            strokeDasharray={dashArr} strokeDashoffset={-offset}
            strokeLinecap="butt"/>
        );
        offset += len;
        return el;
      })}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// V1 — Web "Зелёный" : green hero card, allocation donut, holdings table
// ──────────────────────────────────────────────────────────────
function WebV1Green({ lang = 'ru', setLang = () => {}, onNav, active = 'home' }) {
  return (
    <div data-screen-label={`Web / V1 Green / ${lang}`} style={{
      display: 'flex', flex: 1, minWidth: 0, minHeight: 0,
      background: SC.bg2 || SC.ink50,
      fontFamily: SC.fontDisplay, color: SC.ink1000,
    }}>
      <WebSidebar lang={lang} onNav={onNav} active={active}/>
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: SC.paper, overflow: 'hidden' }}>
        <WebTopBar lang={lang} setLang={setLang}/>

        <div style={{ flex: 1, padding: '24px 32px 32px', overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 320px', gridTemplateRows: 'auto auto', gap: 20, alignContent: 'start' }}>
          {/* Hero card — green wash */}
          <section style={{
            gridColumn: '1 / -1', gridRow: '1',
            background: SC.greenWash, borderRadius: 28, padding: '24px 28px',
            border: `1px solid ${SC.greenSoft}`,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: SC.greenDeep, fontWeight: 500 }}>{t(lang, 'totalBalance')}</span>
                <Icon name="eye" size={14} color={SC.greenDeep}/>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 14 }}>
                <MoneyKGS value={PORTFOLIO.balance} size={68} weight={600}/>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <DeltaPill value={PORTFOLIO.dayChangePct} size="md"/>
                <span style={{ fontFamily: SC.fontMono, fontSize: 14, color: SC.ink500 }}>
                  {fmtKGS(PORTFOLIO.dayChange, { sign: true })} {t(lang, 'soms')} · {t(lang, 'todayChange')}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Pill variant="dark" size="md" arrow icon="plus">{t(lang, 'buy')}</Pill>
                <Pill variant="outline" size="md">{t(lang, 'sell')}</Pill>
                <Pill variant="outline" size="md" icon="upload">{t(lang, 'withdraw')}</Pill>
              </div>
            </div>
            {/* Big chart on hero */}
            <div style={{ position: 'relative', minWidth: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginBottom: 8 }}>
                {['1Д','7Д','1М','3М','1Г'].map((p, i) => (
                  <span key={p} style={{
                    padding: '4px 10px', borderRadius: 999,
                    background: i === 2 ? SC.ink1000 : 'transparent',
                    color: i === 2 ? '#fff' : SC.ink500,
                    fontSize: 11, fontWeight: 600, fontFamily: SC.fontMono, cursor: 'pointer',
                  }}>{lang === 'en' ? ['1D','7D','1M','3M','1Y'][i] : p}</span>
                ))}
              </div>
              <BigChart data={PORTFOLIO.series1m} width={500} height={180} color={SC.greenDeep} fillColor={SC.green}/>
            </div>
          </section>

          {/* Holdings table */}
          <section style={{
            gridColumn: '1', gridRow: '2',
            background: SC.paper, borderRadius: 24, padding: '20px 24px',
            border: `1px solid ${SC.ink200}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.3px' }}>{t(lang, 'assets')}</h3>
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { id: 'all',    label: lang === 'ru' ? 'Все'         : 'All' },
                  { id: 'kg',     label: lang === 'ru' ? 'KG'          : 'KG' },
                  { id: 'cfd',    label: 'CFD' },
                  { id: 'crypto', label: lang === 'ru' ? 'Крипто'      : 'Crypto' },
                ].map((tg, i) => (
                  <span key={tg.id} style={{
                    padding: '5px 12px', borderRadius: 999,
                    background: i === 0 ? SC.ink1000 : SC.ink50,
                    color: i === 0 ? '#fff' : SC.ink500,
                    fontSize: 12, fontWeight: 600, fontFamily: SC.fontDisplay,
                    letterSpacing: '-0.2px', cursor: 'pointer',
                  }}>{tg.label}</span>
                ))}
              </div>
            </div>
            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.6fr', gap: 12, padding: '8px 4px', fontSize: 11, color: SC.ink500, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: `1px solid ${SC.ink200}` }}>
              <span>{lang === 'ru' ? 'Актив' : 'Asset'}</span>
              <span>{lang === 'ru' ? 'Кол-во' : 'Qty'}</span>
              <span style={{ textAlign: 'right' }}>{lang === 'ru' ? 'Цена' : 'Price'}</span>
              <span style={{ textAlign: 'right' }}>{lang === 'ru' ? 'За сегодня' : 'Today'}</span>
              <span></span>
            </div>
            {PORTFOLIO.holdings.slice(0, 5).map((h, i, arr) => (
              <div key={h.symbol} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.6fr', gap: 12,
                padding: '12px 4px', alignItems: 'center',
                borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${SC.ink200}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <TickerLogo symbol={h.symbol} size={34}/>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.2px' }}>{h.symbol}</div>
                    <div style={{ fontSize: 12, color: SC.ink500 }}>{h.name}</div>
                  </div>
                </div>
                <div style={{ fontFamily: SC.fontMono, fontSize: 13, fontWeight: 500, color: SC.ink1000 }}>{h.qty}</div>
                <div style={{ fontFamily: SC.fontMono, fontSize: 13, fontWeight: 600, color: SC.ink1000, textAlign: 'right' }}>
                  {h.ccy}{h.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ textAlign: 'right' }}><DeltaPill value={h.change}/></div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Sparkline data={h.spark} width={72} height={28}/>
                </div>
              </div>
            ))}
          </section>

          {/* Right rail */}
          <aside style={{ gridColumn: '2', gridRow: '2', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Allocation card with donut */}
            <div style={{ background: SC.paper, borderRadius: 24, padding: 20, border: `1px solid ${SC.ink200}` }}>
              <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.2px', marginBottom: 14 }}>{t(lang, 'allocation')}</div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ flex: '0 0 auto', position: 'relative' }}>
                  <Donut segments={PORTFOLIO.allocation[lang]} size={120} thickness={18}/>
                  <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: SC.fontMono, fontSize: 18, fontWeight: 700, letterSpacing: '-0.04em' }}>4</div>
                      <div style={{ fontSize: 10, color: SC.ink500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{lang === 'ru' ? 'класса' : 'classes'}</div>
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {PORTFOLIO.allocation[lang].map(s => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 999, background: s.color }}/>
                      <span style={{ fontSize: 12, color: SC.ink500, fontWeight: 500, flex: 1, letterSpacing: '-0.1px' }}>{s.label}</span>
                      <span style={{ fontFamily: SC.fontMono, fontSize: 12, fontWeight: 600 }}>{s.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Insight card (novel) */}
            <div style={{ background: SC.ink1000, color: '#fff', borderRadius: 24, padding: 20, position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Icon name="sparkles" size={16} color={SC.lime} strokeWidth={2}/>
                <span style={{ fontSize: 11, color: SC.lime, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t(lang, 'insight')}</span>
              </div>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.4, letterSpacing: '-0.2px', color: '#fff' }}>{t(lang, 'insightText')}</p>
              <button style={{
                marginTop: 14, background: '#fff', color: SC.ink1000, border: 'none', cursor: 'pointer',
                padding: '8px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, fontFamily: SC.fontDisplay,
              }}>{lang === 'ru' ? 'Подробнее' : 'Read more'} →</button>
            </div>

            {/* Binance account card */}
            {typeof BinanceAccountCard === 'function' && (
              <BinanceAccountCard lang={lang} dark={false}/>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// V2 — Web "Минимализм" : ink only on paper, sparse, generous whitespace
// ──────────────────────────────────────────────────────────────
function WebV2Minimal({ lang = 'ru', setLang = () => {}, onNav, active = 'home' }) {
  return (
    <div data-screen-label={`Web / V2 Minimal / ${lang}`} style={{
      display: 'flex', flex: 1, minWidth: 0, minHeight: 0,
      background: SC.paper,
      fontFamily: SC.fontDisplay, color: SC.ink1000,
    }}>
      <WebSidebar lang={lang} onNav={onNav} active={active}/>
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: SC.paper, overflow: 'hidden' }}>
        <WebTopBar lang={lang} setLang={setLang}/>

        <div style={{ flex: 1, padding: '40px 56px 40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 12, color: SC.ink500, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                {t(lang, 'hi')}, {lang === 'ru' ? 'Айгуль' : 'Aigul'}
              </div>
              <div style={{ fontSize: 14, color: SC.ink500, letterSpacing: '-0.2px' }}>
                {lang === 'ru' ? 'Вот ваш портфель сегодня.' : 'Here is your portfolio today.'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Pill variant="outline" size="md" icon="download">{t(lang, 'topUp')}</Pill>
              <Pill variant="dark" size="md" arrow icon="plus">{t(lang, 'buy')}</Pill>
            </div>
          </div>

          {/* Hero — pure ink */}
          <section style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, color: SC.ink500, fontWeight: 500, marginBottom: 14 }}>{t(lang, 'totalBalance')}</div>
              <MoneyKGS value={PORTFOLIO.balance} size={84} weight={600}/>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18 }}>
                <DeltaPill value={PORTFOLIO.dayChangePct} size="md" mode="ghost"/>
                <span style={{ fontFamily: SC.fontMono, fontSize: 14, color: SC.ink500 }}>
                  {fmtKGS(PORTFOLIO.dayChange, { sign: true })} {t(lang, 'soms')}
                </span>
                <span style={{ fontSize: 13, color: SC.ink500 }}>· {t(lang, 'todayChange')}</span>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 10 }}>
                {[
                  lang === 'ru' ? '1Д' : '1D',
                  lang === 'ru' ? '7Д' : '7D',
                  lang === 'ru' ? '1М' : '1M',
                  lang === 'ru' ? '3М' : '3M',
                  lang === 'ru' ? '1Г' : '1Y',
                ].map((p, i) => (
                  <span key={i} style={{
                    padding: '5px 12px', fontSize: 11, fontWeight: 600,
                    borderRadius: 8, fontFamily: SC.fontMono,
                    color: i === 2 ? SC.ink1000 : SC.ink400,
                    borderBottom: i === 2 ? `2px solid ${SC.ink1000}` : '2px solid transparent',
                    cursor: 'pointer',
                  }}>{p}</span>
                ))}
              </div>
              <BigChart data={PORTFOLIO.series1m} width={760} height={200} color={SC.ink1000} fillColor={SC.ink1000}/>
            </div>
          </section>

          {/* 2-column structure (news moved to Home) */}
          <section style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64 }}>
            {/* Holdings column */}
            <div>
              <div style={{ fontSize: 11, color: SC.ink500, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>{t(lang, 'assets')}</div>
              {PORTFOLIO.holdings.slice(0, 5).map((h, i, arr) => (
                <AssetRow key={h.symbol} {...h} sparkData={h.spark} priceCcy={h.ccy} last={i === arr.length - 1}/>
              ))}
            </div>
            {/* Allocation column — linear list, no donut */}
            <div>
              <div style={{ fontSize: 11, color: SC.ink500, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>{t(lang, 'allocation')}</div>
              <AllocationStrip segments={PORTFOLIO.allocation[lang]} height={8} showLabels={false}/>
              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {PORTFOLIO.allocation[lang].map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 14, borderBottom: `1px solid ${SC.ink200}` }}>
                    <div style={{ width: 10, height: 10, borderRadius: 999, background: s.color }}/>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: SC.ink1000 }}>{s.label}</span>
                    <span style={{ fontFamily: SC.fontMono, fontSize: 14, fontWeight: 600 }}>{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            {/* News column moved to Home; portfolio keeps only assets + allocation */}
          </section>
        </div>
      </main>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// V3 — Web "Тёмная" : ink-1000 surfaces, green accent, denser
// ──────────────────────────────────────────────────────────────
function WebV3Dark({ lang = 'ru', setLang = () => {}, onNav, active = 'home' }) {
  return (
    <div data-screen-label={`Web / V3 Dark / ${lang}`} style={{
      display: 'flex', flex: 1, minWidth: 0, minHeight: 0,
      background: SC.ink1000,
      fontFamily: SC.fontDisplay, color: '#fff',
    }}>
      <WebSidebar lang={lang} dark onNav={onNav} active={active}/>
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: SC.ink1000, overflow: 'hidden' }}>
        <WebTopBar lang={lang} setLang={setLang} dark/>

        <div style={{ flex: 1, padding: '24px 32px 32px', overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 320px', gridTemplateRows: 'auto auto', gap: 20, alignContent: 'start' }}>
          {/* Hero — black with subtle gradient */}
          <section style={{
            gridColumn: '1 / -1', gridRow: '1',
            background: 'linear-gradient(135deg, #161D1B 0%, #0E1413 100%)',
            borderRadius: 28, padding: '24px 28px',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* subtle green glow */}
            <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,184,107,0.18), rgba(0,184,107,0) 70%)' }}/>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t(lang, 'totalBalance')}</span>
                <Icon name="eye" size={14} color="rgba(255,255,255,0.45)"/>
              </div>
              <MoneyKGS value={PORTFOLIO.balance} size={64} weight={600} color="#fff"/>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, marginBottom: 18 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '5px 12px', borderRadius: 999,
                  background: 'rgba(0,184,107,0.22)', color: SC.greenBright,
                  fontFamily: SC.fontMono, fontWeight: 600, fontSize: 13,
                }}>
                  <Icon name="arrUp" size={12} color={SC.greenBright} strokeWidth={2.4}/>
                  +{PORTFOLIO.dayChangePct.toFixed(2)}%
                </span>
                <span style={{ fontFamily: SC.fontMono, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                  {fmtKGS(PORTFOLIO.dayChange, { sign: true })} {t(lang, 'soms')} · {t(lang, 'todayChange')}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Pill variant="primary" size="md" arrow icon="plus">{t(lang, 'buy')}</Pill>
                <Pill variant="softDark" size="md">{t(lang, 'sell')}</Pill>
                <Pill variant="softDark" size="md" icon="upload">{t(lang, 'withdraw')}</Pill>
              </div>
            </div>
            <div style={{ position: 'relative', minWidth: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginBottom: 8 }}>
                {(lang === 'ru' ? ['1Д','7Д','1М','3М','1Г'] : ['1D','7D','1M','3M','1Y']).map((p, i) => (
                  <span key={p} style={{
                    padding: '4px 10px', borderRadius: 999,
                    background: i === 2 ? '#fff' : 'rgba(255,255,255,0.06)',
                    color: i === 2 ? SC.ink1000 : 'rgba(255,255,255,0.55)',
                    fontSize: 11, fontWeight: 600, fontFamily: SC.fontMono, cursor: 'pointer',
                  }}>{p}</span>
                ))}
              </div>
              <BigChart data={PORTFOLIO.series1m} width={500} height={180} color={SC.greenBright} fillColor={SC.greenBright}/>
            </div>
          </section>

          {/* Holdings */}
          <section style={{
            gridColumn: '1', gridRow: '2',
            background: SC.ink900, borderRadius: 24, padding: '20px 24px',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.3px', color: '#fff' }}>{t(lang, 'assets')}</h3>
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { id: 'all',    label: lang === 'ru' ? 'Все'    : 'All' },
                  { id: 'kg',     label: 'KG' },
                  { id: 'cfd',    label: 'CFD' },
                  { id: 'crypto', label: lang === 'ru' ? 'Крипто' : 'Crypto' },
                ].map((tg, i) => (
                  <span key={tg.id} style={{
                    padding: '5px 12px', borderRadius: 999,
                    background: i === 0 ? '#fff' : 'rgba(255,255,255,0.06)',
                    color: i === 0 ? SC.ink1000 : 'rgba(255,255,255,0.55)',
                    fontSize: 12, fontWeight: 600, letterSpacing: '-0.2px', cursor: 'pointer',
                  }}>{tg.label}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.6fr', gap: 12, padding: '8px 4px', fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span>{lang === 'ru' ? 'Актив' : 'Asset'}</span>
              <span>{lang === 'ru' ? 'Кол-во' : 'Qty'}</span>
              <span style={{ textAlign: 'right' }}>{lang === 'ru' ? 'Цена' : 'Price'}</span>
              <span style={{ textAlign: 'right' }}>{lang === 'ru' ? 'За сегодня' : 'Today'}</span>
              <span></span>
            </div>
            {PORTFOLIO.holdings.slice(0, 5).map((h, i, arr) => (
              <div key={h.symbol} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.6fr', gap: 12,
                padding: '12px 4px', alignItems: 'center',
                borderBottom: i === arr.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <TickerLogo symbol={h.symbol} size={34}/>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', letterSpacing: '-0.2px' }}>{h.symbol}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{h.name}</div>
                  </div>
                </div>
                <div style={{ fontFamily: SC.fontMono, fontSize: 13, fontWeight: 500, color: '#fff' }}>{h.qty}</div>
                <div style={{ fontFamily: SC.fontMono, fontSize: 13, fontWeight: 600, color: '#fff', textAlign: 'right' }}>
                  {h.ccy}{h.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ textAlign: 'right' }}><DeltaPill value={h.change}/></div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Sparkline data={h.spark} width={72} height={28}/>
                </div>
              </div>
            ))}
          </section>

          {/* Right rail */}
          <aside style={{ gridColumn: '2', gridRow: '2', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Allocation donut */}
            <div style={{ background: SC.ink900, borderRadius: 24, padding: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', letterSpacing: '-0.2px', marginBottom: 14 }}>{t(lang, 'allocation')}</div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ flex: '0 0 auto', position: 'relative' }}>
                  <Donut segments={PORTFOLIO.allocation[lang]} size={120} thickness={18} dark/>
                  <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: SC.fontMono, fontSize: 18, fontWeight: 700, color: '#fff' }}>4</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{lang === 'ru' ? 'класса' : 'classes'}</div>
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {PORTFOLIO.allocation[lang].map(s => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 999, background: s.color }}/>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500, flex: 1 }}>{s.label}</span>
                      <span style={{ fontFamily: SC.fontMono, fontSize: 12, fontWeight: 600, color: '#fff' }}>{s.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Insight */}
            <div style={{ background: SC.lime, color: SC.ink1000, borderRadius: 24, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Icon name="sparkles" size={16} color={SC.ink1000} strokeWidth={2}/>
                <span style={{ fontSize: 11, color: SC.ink1000, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t(lang, 'insight')}</span>
              </div>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.4, letterSpacing: '-0.2px', color: SC.ink1000 }}>{t(lang, 'insightText')}</p>
              <button style={{
                marginTop: 14, background: SC.ink1000, color: '#fff', border: 'none', cursor: 'pointer',
                padding: '8px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, fontFamily: SC.fontDisplay,
              }}>{lang === 'ru' ? 'Подробнее' : 'Read more'} →</button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { WebSidebar, WebTopBar, Donut, WebV1Green, WebV2Minimal, WebV3Dark });
