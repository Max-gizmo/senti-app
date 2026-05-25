// Web prototype extra screens — Markets table view, Asset detail, Exchange, History

// Assets with live Binance prices grouped by tab
const LIVE_ASSETS = {
  crypto: [
    { symbol: 'BTC',    name: 'Bitcoin',   binance: 'BTCUSDT',    ccy: '$', cls: 'crypto', src: 'spot' },
    { symbol: 'ETH',    name: 'Ethereum',  binance: 'ETHUSDT',    ccy: '$', cls: 'crypto', src: 'spot' },
    { symbol: 'BNB',    name: 'BNB',       binance: 'BNBUSDT',    ccy: '$', cls: 'crypto', src: 'spot' },
    { symbol: 'SOL',    name: 'Solana',    binance: 'SOLUSDT',    ccy: '$', cls: 'crypto', src: 'spot' },
    { symbol: 'XRP',    name: 'XRP',       binance: 'XRPUSDT',    ccy: '$', cls: 'crypto', src: 'spot' },
    { symbol: 'DOGE',   name: 'Dogecoin',  binance: 'DOGEUSDT',   ccy: '$', cls: 'crypto', src: 'spot' },
  ],
  cfd: [
    { symbol: 'AAPL',  name: 'Apple Inc.',  binance: 'AAPLUSDT',  ccy: '$', cls: 'cfd', src: 'futures' },
    { symbol: 'NVDA',  name: 'Nvidia',      binance: 'NVDAUSDT',  ccy: '$', cls: 'cfd', src: 'futures' },
    { symbol: 'TSLA',  name: 'Tesla',       binance: 'TSLAUSDT',  ccy: '$', cls: 'cfd', src: 'futures' },
    { symbol: 'GOOGL', name: 'Alphabet',    binance: 'GOOGLUSDT', ccy: '$', cls: 'cfd', src: 'futures' },
  ],
  comm: [
    { symbol: 'XAU',    name: 'Gold',        binance: 'XAUUSDT',    ccy: '$', cls: 'comm', src: 'futures' },
    { symbol: 'XAG',    name: 'Silver',      binance: 'XAGUSDT',    ccy: '$', cls: 'comm', src: 'futures' },
    { symbol: 'COPPER', name: 'Copper',      binance: 'COPPERUSDT', ccy: '$', cls: 'comm', src: 'futures' },
  ],
};

// Shared live row — works for spot (crypto) and futures (stocks/commodities)
function LiveAssetRow({ asset, price, change, volume, dark, border, sub, lang, onAsset }) {
  const text = dark ? '#fff' : SC.ink1000;
  const src = asset.src === 'futures' ? 'Futures' : 'Spot';
  const fmtPrice = p => p > 1000
    ? p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : p >= 1
    ? p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
    : p.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 });

  return (
    <div onClick={() => onAsset && onAsset({ ...asset, price: price || 0, change: change || 0,
        spark: change >= 0 ? [100,101,100,102,103,102,104] : [104,103,102,101,102,100,99] })}
      style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 1fr 1fr 1fr 0.8fr', gap: 12,
        padding: '14px 4px', alignItems: 'center', borderBottom: border, cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <TickerLogo symbol={asset.symbol} size={36}/>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.2px', color: text }}>{asset.symbol}</span>
            <span style={{ fontSize: 9, fontWeight: 600, padding: '1px 5px', borderRadius: 4,
              background: dark ? 'rgba(255,255,255,0.07)' : SC.ink100,
              color: sub, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{src}</span>
          </div>
          <div style={{ fontSize: 12, color: sub }}>{asset.name}</div>
        </div>
      </div>
      <div style={{ fontFamily: SC.fontMono, fontSize: 14, fontWeight: 600, textAlign: 'right', color: text }}>
        {price != null ? `$${fmtPrice(price)}` : <span style={{ color: sub }}>…</span>}
      </div>
      <div style={{ textAlign: 'right' }}>
        {change != null ? <DeltaPill value={change}/> : <span style={{ color: sub, fontSize: 12 }}>…</span>}
      </div>
      <div style={{ fontFamily: SC.fontMono, fontSize: 13, color: sub, textAlign: 'right' }}>
        {volume && price ? `$${(volume * price / 1e6).toFixed(0)}M` : '—'}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {change != null
          ? <Sparkline data={change >= 0
              ? [100,101,100,102,101,103,102,104]
              : [104,103,102,101,102,100,101,99]}
              width={80} height={28} color={change >= 0 ? SC.green : '#EF4444'}/>
          : null}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Pill variant={dark ? 'softDark' : 'soft'} size="sm">{t(lang, 'buy')} →</Pill>
      </div>
    </div>
  );
}

function WebMarketsView({ lang = 'ru', dark = false, onAsset }) {
  const [cls, setCls] = React.useState('forex');

  const spotSymbols    = LIVE_ASSETS.crypto.map(a => a.binance);
  const futuresSymbols = [...LIVE_ASSETS.cfd, ...LIVE_ASSETS.comm].map(a => a.binance);

  const { prices: spotPrices,    loading: spotLoading,    error: spotError }    =
    typeof useBinancePrices  === 'function' ? useBinancePrices(spotSymbols)    : { prices: {}, loading: false, error: null };
  const { prices: futuresPrices, loading: futuresLoading, error: futuresError } =
    typeof useBinanceFutures === 'function' ? useBinanceFutures(futuresSymbols) : { prices: {}, loading: false, error: null };

  const isLiveTab = ['crypto', 'cfd', 'comm'].includes(cls);
  const liveLoading = cls === 'crypto' ? spotLoading : futuresLoading;
  const liveError   = cls === 'crypto' ? spotError   : futuresError;

  const tabs = [
    { id: 'forex',  label: lang === 'ru' ? 'Валюта' : 'Currency' },
    { id: 'cfd',    label: 'CFD' },
    { id: 'kg',     label: 'KG' },
    { id: 'crypto', label: lang === 'ru' ? 'Крипто' : 'Crypto' },
    { id: 'fx',     label: 'Fx' },
    { id: 'comm',   label: lang === 'ru' ? 'Товары' : 'Commodities' },
  ];
  const filtered = MARKETS_ALL.filter(m => m.cls === cls);
  const text = dark ? '#fff' : SC.ink1000;
  const sub = dark ? 'rgba(255,255,255,0.5)' : SC.ink500;
  const cardBg = dark ? SC.ink900 : SC.paper;
  const border = dark ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${SC.ink200}`;

  return (
    <div style={{ padding: '24px 32px 32px', height: '100%', overflow: 'auto', color: text, fontFamily: SC.fontDisplay }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em' }}>{t(lang, 'markets')}</h1>
        {isLiveTab && typeof BinanceStatusBadge === 'function' && (
          <BinanceStatusBadge loading={liveLoading} error={liveError} dark={dark}/>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {tabs.map(tg => (
          <button key={tg.id} onClick={() => setCls(tg.id)} style={{
            background: cls === tg.id ? (dark ? '#fff' : SC.ink1000) : (dark ? 'rgba(255,255,255,0.06)' : SC.ink100),
            color: cls === tg.id ? (dark ? SC.ink1000 : '#fff') : sub,
            border: 'none', cursor: 'pointer',
            padding: '8px 16px', borderRadius: 999,
            fontSize: 13, fontWeight: 600, letterSpacing: '-0.2px', fontFamily: SC.fontDisplay,
          }}>{tg.label}</button>
        ))}
      </div>
      <div style={{ background: cardBg, borderRadius: 24, border, padding: '8px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 1fr 1fr 1fr 0.8fr', gap: 12,
          padding: '14px 4px', fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase', borderBottom: border }}>
          <span>{lang === 'ru' ? 'Актив' : 'Asset'}</span>
          <span style={{ textAlign: 'right' }}>{lang === 'ru' ? 'Цена' : 'Price'}</span>
          <span style={{ textAlign: 'right' }}>{lang === 'ru' ? 'За сегодня' : 'Today'}</span>
          <span style={{ textAlign: 'right' }}>{lang === 'ru' ? 'Объём' : 'Volume'}</span>
          <span style={{ textAlign: 'center' }}>{lang === 'ru' ? 'Тренд' : 'Trend'}</span>
          <span></span>
        </div>

        {/* Live tabs: Crypto (spot), CFD (futures), Commodities (futures) */}
        {cls === 'crypto' && LIVE_ASSETS.crypto.map((asset, i, arr) => {
          const live = spotPrices[asset.binance] || {};
          return <LiveAssetRow key={asset.symbol} asset={asset} lang={lang} dark={dark} sub={sub}
            price={live.price} change={live.change} volume={live.volume} onAsset={onAsset}
            border={i === arr.length - 1 ? 'none' : border}/>;
        })}
        {cls === 'cfd' && LIVE_ASSETS.cfd.map((asset, i, arr) => {
          const live = futuresPrices[asset.binance] || {};
          return <LiveAssetRow key={asset.symbol} asset={asset} lang={lang} dark={dark} sub={sub}
            price={live.price} change={live.change} volume={live.volume} onAsset={onAsset}
            border={i === arr.length - 1 ? 'none' : border}/>;
        })}
        {cls === 'comm' && LIVE_ASSETS.comm.map((asset, i, arr) => {
          const live = futuresPrices[asset.binance] || {};
          return <LiveAssetRow key={asset.symbol} asset={asset} lang={lang} dark={dark} sub={sub}
            price={live.price} change={live.change} volume={live.volume} onAsset={onAsset}
            border={i === arr.length - 1 ? 'none' : border}/>;
        })}

        {/* Static tabs: forex, kg, fx */}
        {!['crypto','cfd','comm'].includes(cls) && filtered.map((h, i, arr) => (
          <div key={h.symbol} onClick={() => onAsset && onAsset(h)} style={{
            display: 'grid', gridTemplateColumns: '2.2fr 1fr 1fr 1fr 1fr 0.8fr', gap: 12,
            padding: '14px 4px', alignItems: 'center',
            borderBottom: i === arr.length - 1 ? 'none' : border, cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <TickerLogo symbol={h.symbol} size={36}/>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.2px' }}>{h.symbol}</div>
                <div style={{ fontSize: 12, color: sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>{h.name}</div>
              </div>
            </div>
            <div style={{ fontFamily: SC.fontMono, fontSize: 14, fontWeight: 600, textAlign: 'right' }}>
              {h.ccy}{h.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{ textAlign: 'right' }}><DeltaPill value={h.change}/></div>
            <div style={{ fontFamily: SC.fontMono, fontSize: 13, color: sub, textAlign: 'right' }}>
              {h.cls === 'kg' ? '42K' : h.cls === 'fx' ? '1.4B' : h.cls === 'forex' ? '2.1B' : '—'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Sparkline data={h.spark} width={80} height={28}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Pill variant={dark ? 'softDark' : 'soft'} size="sm">{t(lang, 'buy')} →</Pill>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Asset detail page (web)
// ─────────────────────────────────────────────────────────────
function WebAssetDetail({ asset, lang = 'ru', dark = false, onBack, onTrade }) {
  const text = dark ? '#fff' : SC.ink1000;
  const sub = dark ? 'rgba(255,255,255,0.5)' : SC.ink500;
  const cardBg = dark ? SC.ink900 : SC.paper;
  const border = dark ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${SC.ink200}`;
  const up = asset.change >= 0;
  // Build longer series
  const long = [];
  for (let i = 0; i < 60; i++) {
    const base = asset.spark[i % asset.spark.length];
    long.push(base * (1 + (Math.sin(i * 0.4) * 0.014) + (i / 400)));
  }
  return (
    <div style={{ padding: '24px 32px 32px', height: '100%', overflow: 'auto', color: text, fontFamily: SC.fontDisplay }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: sub, fontSize: 13, fontWeight: 500, marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: SC.fontDisplay }}>
        <Icon name="chevL" size={14} color={sub}/> {t(lang, 'markets')}
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        {/* main */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <TickerLogo symbol={asset.symbol} size={56}/>
            <div>
              <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.03em' }}>{asset.symbol}</div>
              <div style={{ fontSize: 14, color: sub }}>{asset.name}</div>
            </div>
            <div style={{ flex: 1 }}/>
            <Pill variant={dark ? 'softDark' : 'soft'} size="md">+ {lang === 'ru' ? 'В список' : 'Watchlist'}</Pill>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 16 }}>
            <span style={{ fontFamily: SC.fontMono, fontSize: 56, fontWeight: 700, letterSpacing: '-0.04em' }}>
              {asset.ccy}{asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <DeltaPill value={asset.change} size="md"/>
            <span style={{ fontFamily: SC.fontMono, fontSize: 14, color: sub }}>{lang === 'ru' ? 'за сегодня' : 'today'}</span>
          </div>
          {/* chart */}
          <div style={{ marginTop: 20, background: cardBg, borderRadius: 24, border, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginBottom: 12 }}>
              {(lang === 'ru' ? ['1Ч','1Д','7Д','1М','3М','1Г'] : ['1H','1D','7D','1M','3M','1Y']).map((p, i) => (
                <span key={p} style={{
                  padding: '6px 12px', borderRadius: 999,
                  background: i === 3 ? (dark ? '#fff' : SC.ink1000) : 'transparent',
                  color: i === 3 ? (dark ? SC.ink1000 : '#fff') : sub,
                  fontSize: 11, fontWeight: 600, fontFamily: SC.fontMono, cursor: 'pointer',
                }}>{p}</span>
              ))}
            </div>
            <BigChart data={long} width={720} height={280} color={up ? (dark ? SC.greenBright : SC.green) : SC.danger} fillColor={up ? (dark ? SC.greenBright : SC.green) : SC.danger}/>
          </div>
          {/* About */}
          <div style={{ marginTop: 20, background: cardBg, borderRadius: 24, border, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.2px', marginBottom: 14 }}>{lang === 'ru' ? 'Об активе' : 'About'}</div>
            <p style={{ margin: 0, color: sub, fontSize: 14, lineHeight: 1.55, letterSpacing: '-0.1px', textWrap: 'pretty' }}>
              {asset.cls === 'cfd' && (lang === 'ru'
                ? `${asset.name} торгуется как CFD. Вы получаете прибыль или убыток от движения цены, не покупая саму акцию. Доступно плечо до 1:5 для новых клиентов.`
                : `${asset.name} trades as a CFD on Senti. You profit or lose from price moves without owning the stock. Leverage up to 1:5 for new accounts.`)}
              {asset.cls === 'crypto' && (lang === 'ru'
                ? `${asset.name} — криптовалюта. Цена меняется 24/7. Senti хранит активы в холодном кошельке.`
                : `${asset.name} is a crypto asset. Price moves 24/7. Senti stores assets in cold wallets.`)}
              {asset.cls === 'kg' && (lang === 'ru'
                ? `${asset.name} торгуется на КФБ. Торги Пн–Пт 10:00–17:00. Расчёт T+2.`
                : `${asset.name} trades on KSE. Hours Mon–Fri 10:00–17:00. T+2 settlement.`)}
              {asset.cls === 'forex' && (lang === 'ru'
                ? `Курс по данным Национального банка КР. Обмен без комиссии до 100 000 с в месяц.`
                : `Rate from National Bank of KR. Fee-free exchange up to 100,000 KGS per month.`)}
            </p>
          </div>
        </div>
        {/* trade panel */}
        <aside>
          <div style={{ background: cardBg, borderRadius: 24, border, padding: 20, position: 'sticky', top: 0 }}>
            <div style={{ display: 'flex', background: dark ? 'rgba(255,255,255,0.06)' : SC.ink100, borderRadius: 12, padding: 3, marginBottom: 18 }}>
              <button style={{ flex: 1, background: SC.green, color: '#fff', border: 'none', cursor: 'pointer', padding: '10px 0', borderRadius: 10, fontFamily: SC.fontDisplay, fontWeight: 600, fontSize: 13, letterSpacing: '-0.2px' }}>{t(lang, 'buy')}</button>
              <button style={{ flex: 1, background: 'transparent', color: sub, border: 'none', cursor: 'pointer', padding: '10px 0', fontFamily: SC.fontDisplay, fontWeight: 600, fontSize: 13, letterSpacing: '-0.2px' }}>{t(lang, 'sell')}</button>
            </div>
            <div style={{ fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
              {lang === 'ru' ? 'Сумма в сомах' : 'Amount in KGS'}
            </div>
            <div style={{ background: dark ? 'rgba(255,255,255,0.05)' : SC.ink50, borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
              <span style={{ fontFamily: SC.fontMono, fontSize: 24, fontWeight: 700, color: text, letterSpacing: '-0.03em' }}>5 000</span>
              <span style={{ fontFamily: SC.fontMono, fontSize: 14, color: sub }}>с</span>
              <div style={{ flex: 1 }}/>
              <span style={{ fontSize: 11, color: sub, fontFamily: SC.fontMono }}>≈ {(5000 / asset.price).toFixed(4)} {asset.symbol}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {[1000, 5000, 10000, 25000].map(v => (
                <span key={v} style={{
                  flex: 1, textAlign: 'center', padding: '7px 0', borderRadius: 8,
                  background: dark ? 'rgba(255,255,255,0.05)' : SC.ink100,
                  fontFamily: SC.fontMono, fontSize: 11, fontWeight: 600, color: text, cursor: 'pointer',
                }}>{(v / 1000)}k</span>
              ))}
            </div>
            {/* summary */}
            <div style={{ background: dark ? 'rgba(255,255,255,0.03)' : SC.ink50, borderRadius: 14, padding: 14, marginBottom: 14 }}>
              {[
                [lang === 'ru' ? 'Комиссия Senti' : 'Senti fee', '12,50 с'],
                [lang === 'ru' ? 'Курс ' + asset.symbol : asset.symbol + ' price', `${asset.ccy}${asset.price.toFixed(2)}`],
                [lang === 'ru' ? 'Получите' : 'You get', `${(5000 / asset.price).toFixed(4)} ${asset.symbol}`],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 12 }}>
                  <span style={{ color: sub }}>{k}</span>
                  <span style={{ fontFamily: SC.fontMono, fontWeight: 600, color: text }}>{v}</span>
                </div>
              ))}
            </div>
            <Pill variant="primary" size="lg" arrow full onClick={() => onTrade && onTrade('buy', asset)}>{t(lang, 'buy')} {asset.symbol}</Pill>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Web exchange screen — KGS swap
// ─────────────────────────────────────────────────────────────
function WebExchange({ lang = 'ru', dark = false }) {
  const text = dark ? '#fff' : SC.ink1000;
  const sub = dark ? 'rgba(255,255,255,0.5)' : SC.ink500;
  const cardBg = dark ? SC.ink900 : SC.paper;
  const fieldBg = dark ? 'rgba(255,255,255,0.05)' : SC.ink50;
  const border = dark ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${SC.ink200}`;
  return (
    <div style={{ padding: '24px 32px 32px', height: '100%', overflow: 'auto', color: text, fontFamily: SC.fontDisplay }}>
      <h1 style={{ margin: '4px 0 6px', fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em' }}>{t(lang, 'exchange')}</h1>
      <div style={{ fontSize: 14, color: sub, marginBottom: 26 }}>
        {lang === 'ru' ? 'Без комиссии до 100 000 с / мес.' : 'Fee-free up to 100,000 KGS / month.'}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '500px 1fr', gap: 28 }}>
        <div style={{ background: cardBg, borderRadius: 24, border, padding: 24 }}>
          {/* From */}
          <div style={{ fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
            {lang === 'ru' ? 'Отдаёте' : 'You send'}
          </div>
          <div style={{ background: fieldBg, borderRadius: 18, padding: 18, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <TickerLogo symbol="KGS" size={36}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SC.fontMono, fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em' }}>50 000</div>
              <div style={{ fontSize: 11, color: sub, fontFamily: SC.fontMono, marginTop: 2 }}>{lang === 'ru' ? 'Баланс: 87 421 с' : 'Balance: 87,421 KGS'}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999, background: dark ? 'rgba(255,255,255,0.06)' : '#fff', fontWeight: 600, fontSize: 13 }}>
              KGS <Icon name="chevD" size={14} color={text}/>
            </div>
          </div>
          {/* Swap icon */}
          <div style={{ display: 'grid', placeItems: 'center', margin: '4px 0' }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: SC.green, display: 'grid', placeItems: 'center', boxShadow: '0 6px 14px -2px rgba(0,184,107,0.45)' }}>
              <Icon name="swap" size={18} color="#fff"/>
            </div>
          </div>
          {/* To */}
          <div style={{ fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8, marginTop: 6 }}>
            {lang === 'ru' ? 'Получаете' : 'You get'}
          </div>
          <div style={{ background: fieldBg, borderRadius: 18, padding: 18, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <TickerLogo symbol="USD" size={36}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SC.fontMono, fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em' }}>561,86</div>
              <div style={{ fontSize: 11, color: sub, fontFamily: SC.fontMono, marginTop: 2 }}>{lang === 'ru' ? 'Курс 88,95 с/$' : 'Rate 88.95 KGS/$'}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999, background: dark ? 'rgba(255,255,255,0.06)' : '#fff', fontWeight: 600, fontSize: 13 }}>
              USD <Icon name="chevD" size={14} color={text}/>
            </div>
          </div>
          <Pill variant="primary" size="lg" arrow full>{lang === 'ru' ? 'Обменять' : 'Exchange'}</Pill>
        </div>
        {/* Rates panel */}
        <div>
          <div style={{ fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
            {lang === 'ru' ? 'Курсы на сегодня' : 'Today\u2019s rates'}
          </div>
          <div style={{ background: cardBg, borderRadius: 24, border, overflow: 'hidden' }}>
            {[
              { from: 'USD', to: 'KGS', rate: 88.95,  change: -0.1, spark: [89.1,89.05,89.0,88.98,88.96,88.95,88.95] },
              { from: 'EUR', to: 'KGS', rate: 95.20,  change:  0.3, spark: [94.7,94.9,95.0,95.1,95.0,95.15,95.2] },
              { from: 'RUB', to: 'KGS', rate:  0.92,  change:  0.2, spark: [0.91,0.91,0.92,0.92,0.92,0.92,0.92] },
              { from: 'KZT', to: 'KGS', rate:  0.18,  change: -0.1, spark: [0.181,0.18,0.18,0.18,0.18,0.18,0.18] },
              { from: 'BTC', to: 'KGS', rate: 6178350, change: 0.4, spark: [69100,69300,69200,69500,69300,69400,69420] },
            ].map((r, i, arr) => (
              <div key={r.from} style={{
                display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 12,
                padding: '14px 20px', alignItems: 'center',
                borderBottom: i === arr.length - 1 ? 'none' : border,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <TickerLogo symbol={r.from} size={32}/>
                  <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.2px' }}>{r.from} / {r.to}</div>
                </div>
                <div style={{ fontFamily: SC.fontMono, fontSize: 14, fontWeight: 600, textAlign: 'right' }}>
                  {r.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ textAlign: 'right' }}><DeltaPill value={r.change}/></div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Sparkline data={r.spark} width={80} height={26}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// History screen
// ─────────────────────────────────────────────────────────────
function WebHistory({ lang = 'ru', dark = false }) {
  const text = dark ? '#fff' : SC.ink1000;
  const sub = dark ? 'rgba(255,255,255,0.5)' : SC.ink500;
  const cardBg = dark ? SC.ink900 : SC.paper;
  const border = dark ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${SC.ink200}`;
  const items = lang === 'ru' ? [
    { type: 'Покупка',   sym: 'NVDA', amount:  4980.20, qty: '+0.04', date: '14 мая · 14:32', status: 'Исполнено' },
    { type: 'Обмен',     sym: 'KGS → USD', amount: -50000, qty: '+561,86 $', date: '13 мая · 09:12', status: 'Исполнено' },
    { type: 'Продажа',   sym: 'TSLA', amount: -1471.20, qty: '−0.6',  date: '12 мая · 18:04', status: 'Исполнено' },
    { type: 'Пополнение',sym: 'KGS',  amount: 25000,    qty: '',      date: '11 мая · 10:00', status: 'Зачислено' },
    { type: 'Покупка',   sym: 'BTC',  amount: 9420.40,  qty: '+0.001',date: '08 мая · 12:18', status: 'Исполнено' },
    { type: 'Дивиденд',  sym: 'AAPL', amount:    18.20, qty: '',      date: '02 мая · 09:00', status: 'Зачислено' },
  ] : [
    { type: 'Buy',       sym: 'NVDA', amount:  4980.20, qty: '+0.04', date: 'May 14 · 14:32', status: 'Filled' },
    { type: 'Exchange',  sym: 'KGS → USD', amount: -50000, qty: '+$561.86', date: 'May 13 · 09:12', status: 'Filled' },
    { type: 'Sell',      sym: 'TSLA', amount: -1471.20, qty: '−0.6',  date: 'May 12 · 18:04', status: 'Filled' },
    { type: 'Top-up',    sym: 'KGS',  amount: 25000,    qty: '',      date: 'May 11 · 10:00', status: 'Settled' },
    { type: 'Buy',       sym: 'BTC',  amount: 9420.40,  qty: '+0.001',date: 'May 8 · 12:18',  status: 'Filled' },
    { type: 'Dividend',  sym: 'AAPL', amount:    18.20, qty: '',      date: 'May 2 · 09:00',  status: 'Settled' },
  ];
  return (
    <div style={{ padding: '24px 32px 32px', height: '100%', overflow: 'auto', color: text, fontFamily: SC.fontDisplay }}>
      <h1 style={{ margin: '4px 0 18px', fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em' }}>{t(lang, 'history')}</h1>
      <div style={{ background: cardBg, borderRadius: 24, border, padding: '8px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr 0.8fr', gap: 12, padding: '14px 4px', fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: border }}>
          <span>{lang === 'ru' ? 'Тип' : 'Type'}</span>
          <span>{lang === 'ru' ? 'Актив' : 'Asset'}</span>
          <span style={{ textAlign: 'right' }}>{lang === 'ru' ? 'Сумма' : 'Amount'}</span>
          <span style={{ textAlign: 'right' }}>{lang === 'ru' ? 'Количество' : 'Quantity'}</span>
          <span>{lang === 'ru' ? 'Дата' : 'Date'}</span>
          <span style={{ textAlign: 'right' }}>{lang === 'ru' ? 'Статус' : 'Status'}</span>
        </div>
        {items.map((it, i, arr) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr 0.8fr', gap: 12,
            padding: '14px 4px', alignItems: 'center',
            borderBottom: i === arr.length - 1 ? 'none' : border,
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.2px' }}>{it.type}</span>
            <span style={{ fontSize: 13, fontFamily: SC.fontMono, color: sub }}>{it.sym}</span>
            <span style={{
              fontSize: 14, fontWeight: 600, textAlign: 'right',
              fontFamily: SC.fontMono,
              color: it.amount < 0 ? text : SC.greenDeep,
            }}>
              {it.amount < 0 ? '−' : '+'}{Math.abs(it.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, '\u202F')} с
            </span>
            <span style={{ fontSize: 13, fontFamily: SC.fontMono, color: sub, textAlign: 'right' }}>{it.qty}</span>
            <span style={{ fontSize: 12, color: sub, fontFamily: SC.fontMono }}>{it.date}</span>
            <span style={{
              fontSize: 11, fontWeight: 600,
              textAlign: 'right',
              color: SC.greenDeep,
            }}>● {it.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Withdraw screen (web) — choose source account, amount, destination
// ─────────────────────────────────────────────────────────────
function WebWithdraw({ lang = 'ru', dark = false }) {
  const text = dark ? '#fff' : SC.ink1000;
  const sub = dark ? 'rgba(255,255,255,0.5)' : SC.ink500;
  const cardBg = dark ? SC.ink900 : SC.paper;
  const fieldBg = dark ? 'rgba(255,255,255,0.05)' : SC.ink50;
  const border = dark ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${SC.ink200}`;
  return (
    <div style={{ padding: '24px 32px 32px', height: '100%', overflow: 'auto', color: text, fontFamily: SC.fontDisplay }}>
      <h1 style={{ margin: '4px 0 6px', fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em' }}>{t(lang, 'withdraw')}</h1>
      <div style={{ fontSize: 14, color: sub, marginBottom: 26 }}>
        {lang === 'ru' ? 'Выведите средства на карту или банковский счёт.' : 'Withdraw to a card or bank account.'}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '500px 1fr', gap: 28 }}>
        <div style={{ background: cardBg, borderRadius: 24, border, padding: 24 }}>
          {/* Source */}
          <div style={{ fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
            {lang === 'ru' ? 'Со счёта' : 'From account'}
          </div>
          <div style={{ background: fieldBg, borderRadius: 18, padding: 16, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <TickerLogo symbol="KGS" size={36}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{lang === 'ru' ? 'Основной счёт · KGS' : 'Main account · KGS'}</div>
              <div style={{ fontSize: 11, color: sub, fontFamily: SC.fontMono, marginTop: 2 }}>{lang === 'ru' ? 'Доступно: 87 421 с' : 'Available: 87,421 KGS'}</div>
            </div>
            <Icon name="chevD" size={16} color={sub}/>
          </div>
          {/* Amount */}
          <div style={{ fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
            {lang === 'ru' ? 'Сумма' : 'Amount'}
          </div>
          <div style={{ background: fieldBg, borderRadius: 18, padding: '16px 18px', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, whiteSpace: 'nowrap' }}>
              <span style={{ fontFamily: SC.fontMono, fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em' }}>25 000</span>
              <span style={{ fontFamily: SC.fontMono, fontSize: 18, color: sub }}>с</span>
            </div>
            <div style={{ fontSize: 11, color: sub, fontFamily: SC.fontMono, marginTop: 4 }}>
              {lang === 'ru' ? '≈ 281,06 $ по курсу 88,95' : '≈ $281.06 at 88.95'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {[10000, 25000, 50000, 87421].map((v, i) => (
              <span key={v} style={{
                flex: 1, textAlign: 'center', padding: '7px 0', borderRadius: 8,
                background: i === 1 ? (dark ? '#fff' : SC.ink1000) : fieldBg,
                color: i === 1 ? (dark ? SC.ink1000 : '#fff') : text,
                fontFamily: SC.fontMono, fontSize: 11, fontWeight: 600, cursor: 'pointer',
              }}>{i === 3 ? (lang === 'ru' ? 'Всё' : 'Max') : (v / 1000) + 'k'}</span>
            ))}
          </div>
          {/* Destination */}
          <div style={{ fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
            {lang === 'ru' ? 'Куда' : 'To'}
          </div>
          <div style={{ background: fieldBg, borderRadius: 18, padding: 16, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: SC.ink1000, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12, fontFamily: SC.fontDisplay }}>V</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Visa ··· 4291</div>
              <div style={{ fontSize: 11, color: sub, fontFamily: SC.fontMono, marginTop: 2 }}>{lang === 'ru' ? 'Зачисление за 10 минут' : 'Arrives in 10 minutes'}</div>
            </div>
            <Icon name="chevD" size={16} color={sub}/>
          </div>
          {/* Summary */}
          <div style={{ background: dark ? 'rgba(255,255,255,0.03)' : SC.ink50, borderRadius: 14, padding: 14, marginBottom: 16 }}>
            {[
              [lang === 'ru' ? 'К выводу'         : 'You withdraw', '25 000,00 с'],
              [lang === 'ru' ? 'Комиссия Senti'   : 'Senti fee',   '0 с'],
              [lang === 'ru' ? 'На карту'         : 'To card',     '25 000,00 с'],
            ].map(([k, v], i, arr) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, padding: '4px 0', fontSize: 13, borderTop: i === arr.length - 1 ? (dark ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${SC.ink200}`) : 'none', marginTop: i === arr.length - 1 ? 6 : 0, paddingTop: i === arr.length - 1 ? 10 : 4 }}>
                <span style={{ color: i === arr.length - 1 ? text : sub, fontWeight: i === arr.length - 1 ? 600 : 500, whiteSpace: 'nowrap' }}>{k}</span>
                <span style={{ fontFamily: SC.fontMono, fontWeight: 600, color: text, whiteSpace: 'nowrap' }}>{v}</span>
              </div>
            ))}
          </div>
          <Pill variant="primary" size="lg" arrow full icon="upload">{t(lang, 'withdrawLong')}</Pill>
        </div>
        {/* Saved methods */}
        <div>
          <div style={{ fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
            {lang === 'ru' ? 'Способы вывода' : 'Withdrawal methods'}
          </div>
          <div style={{ background: cardBg, borderRadius: 24, border, padding: '6px 18px' }}>
            {[
              { brand: 'V', label: 'Visa ··· 4291', eta: lang === 'ru' ? '10 минут · без комиссии' : '10 min · no fee',  on: true },
              { brand: 'M', label: 'Mastercard ··· 8814', eta: lang === 'ru' ? '15 минут · без комиссии' : '15 min · no fee' },
              { brand: 'Б', label: lang === 'ru' ? 'Банк KICB ··· 7710' : 'KICB bank ··· 7710', eta: lang === 'ru' ? '1 рабочий день' : '1 business day' },
              { brand: '+', label: lang === 'ru' ? 'Добавить способ' : 'Add method', eta: lang === 'ru' ? 'Карта или счёт' : 'Card or account', add: true },
            ].map((m, i, arr) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
                borderBottom: i === arr.length - 1 ? 'none' : border, cursor: 'pointer',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: m.add ? 'transparent' : SC.ink1000,
                  border: m.add ? `1.5px dashed ${sub}` : 'none',
                  color: '#fff', display: 'grid', placeItems: 'center',
                  fontWeight: 700, fontSize: 14, fontFamily: SC.fontDisplay,
                }}>{m.add ? <Icon name="plus" size={16} color={sub}/> : m.brand}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.2px' }}>{m.label}</div>
                  <div style={{ fontSize: 11, color: sub, marginTop: 2 }}>{m.eta}</div>
                </div>
                {m.on && (
                  <div style={{ width: 18, height: 18, borderRadius: 999, background: SC.green, display: 'grid', placeItems: 'center' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: 14, borderRadius: 14, background: dark ? 'rgba(0,184,107,0.10)' : SC.greenWash, border: dark ? 'none' : `1px solid ${SC.greenSoft}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="info" size={16} color={dark ? SC.greenBright : SC.greenDeep}/>
            <span style={{ flex: 1, fontSize: 12, color: dark ? SC.greenBright : SC.greenDeep, lineHeight: 1.4 }}>
              {lang === 'ru'
                ? 'Senti не берёт комиссию за вывод на карту KG.'
                : 'Senti charges no fee for withdrawal to KG cards.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Investment ideas (Home) — newbie-friendly idea cards + movers
// ─────────────────────────────────────────────────────────────
const IDEAS_RU = [
  { tag: 'AI · CFD',     featured: true,  title: 'Инфраструктура ИИ', sub: 'Корзина: NVDA · AMD · GOOGL. Чипы и облака для ИИ.', upside: '+12%', period: '30 дней', risk: 'Средний', accent: SC.lime, color: SC.ink1000 },
  { tag: 'KG · акции',                    title: 'Дивиденды KG',      sub: 'KCEL и KICB платят дивиденды дважды в год.',           upside: '+6%',  period: '6 мес',  risk: 'Низкий',  color: SC.greenWash, accent: SC.greenDeep },
  { tag: 'Крипто',                        title: 'Голубые фишки крипты', sub: 'BTC и ETH — лидеры рынка.',                          upside: '+18%', period: '90 дней', risk: 'Высокий', color: SC.ink1000, accent: SC.greenBright, dark: true },
  { tag: 'Валюта',                        title: 'Защита от инфляции',sub: 'Часть капитала в USD — стабильный курс.',              upside: '+3%',  period: '1 год',   risk: 'Низкий',  color: SC.paper, accent: SC.ink1000, border: true },
];
const IDEAS_EN = [
  { tag: 'AI · CFD',     featured: true,  title: 'AI infrastructure', sub: 'Basket: NVDA, AMD, GOOGL. Chips and clouds for AI.',  upside: '+12%', period: '30 days', risk: 'Medium', accent: SC.lime, color: SC.ink1000 },
  { tag: 'KG · stocks',                   title: 'KG dividends',      sub: 'KCEL and KICB pay dividends twice a year.',           upside: '+6%',  period: '6 mo',    risk: 'Low',    color: SC.greenWash, accent: SC.greenDeep },
  { tag: 'Crypto',                        title: 'Crypto blue chips', sub: 'BTC and ETH lead the market.',                        upside: '+18%', period: '90 days', risk: 'High',   color: SC.ink1000, accent: SC.greenBright, dark: true },
  { tag: 'Forex',                         title: 'Inflation hedge',   sub: 'Park part of your capital in USD — stable rate.',     upside: '+3%',  period: '1 yr',    risk: 'Low',    color: SC.paper, accent: SC.ink1000, border: true },
];

function WebInvestmentIdeas({ lang = 'ru', dark = false }) {
  const text = dark ? '#fff' : SC.ink1000;
  const sub = dark ? 'rgba(255,255,255,0.5)' : SC.ink500;
  const cardBg = dark ? SC.ink900 : SC.paper;
  const border = dark ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${SC.ink200}`;
  const ideas = lang === 'ru' ? IDEAS_RU : IDEAS_EN;
  const rest = ideas.slice(1); // featured idea no longer shown; balance hero replaces it
  const news = lang === 'ru' ? WEB_NEWS_RU : WEB_NEWS_EN;

  return (
    <div style={{ padding: '24px 32px 32px', height: '100%', overflow: 'auto', color: text, fontFamily: SC.fontDisplay }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 4 }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
          {lang === 'ru' ? 'Здравствуйте, Айгуль' : 'Hello, Aigul'}
        </h1>
        <span style={{ fontSize: 13, color: sub, whiteSpace: 'nowrap' }}>{lang === 'ru' ? 'Главная' : 'Home'}</span>
      </div>
      <p style={{ margin: '6px 0 22px', color: sub, fontSize: 14, letterSpacing: '-0.1px', maxWidth: 640 }}>
        {lang === 'ru'
          ? 'Краткий обзор и идеи на сегодня. Подробности — на вкладке «Портфель».'
          : 'Quick overview and today\u2019s ideas. Full breakdown is on the Portfolio tab.'}
      </p>

      {/* Balance hero (moved from Portfolio) */}
      <section style={{
        background: dark ? 'linear-gradient(135deg, #161D1B 0%, #0E1413 100%)' : SC.greenWash,
        color: dark ? '#fff' : SC.ink1000,
        borderRadius: 28, padding: '24px 28px',
        border: dark ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${SC.greenSoft}`,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center',
        position: 'relative', overflow: 'hidden', marginBottom: 22,
      }}>
        {dark && <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,184,107,0.18), rgba(0,184,107,0) 70%)' }}/>}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.55)' : SC.greenDeep, fontWeight: 500, letterSpacing: dark ? '0.06em' : 'normal', textTransform: dark ? 'uppercase' : 'none' }}>{t(lang, 'totalBalance')}</span>
            <Icon name="eye" size={14} color={dark ? 'rgba(255,255,255,0.45)' : SC.greenDeep}/>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 14 }}>
            <MoneyKGS value={PORTFOLIO.balance} size={64} weight={600} color={dark ? '#fff' : SC.ink1000}/>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            {dark ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 999, background: 'rgba(0,184,107,0.22)', color: SC.greenBright, fontFamily: SC.fontMono, fontWeight: 600, fontSize: 13 }}>
                <Icon name="arrUp" size={12} color={SC.greenBright} strokeWidth={2.4}/>
                +{PORTFOLIO.dayChangePct.toFixed(2)}%
              </span>
            ) : (
              <DeltaPill value={PORTFOLIO.dayChangePct} size="md"/>
            )}
            <span style={{ fontFamily: SC.fontMono, fontSize: 14, color: dark ? 'rgba(255,255,255,0.55)' : SC.ink500 }}>
              {fmtKGS(PORTFOLIO.dayChange, { sign: true })} {t(lang, 'soms')} · {t(lang, 'todayChange')}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Pill variant={dark ? 'primary' : 'dark'} size="md" arrow icon="plus">{t(lang, 'buy')}</Pill>
            <Pill variant={dark ? 'softDark' : 'outline'} size="md">{t(lang, 'sell')}</Pill>
            <Pill variant={dark ? 'softDark' : 'outline'} size="md" icon="upload">{t(lang, 'withdraw')}</Pill>
          </div>
        </div>
        {/* Chart */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginBottom: 8 }}>
            {(lang === 'ru' ? ['1Д','7Д','1М','3М','1Г'] : ['1D','7D','1M','3M','1Y']).map((p, i) => (
              <span key={p} style={{
                padding: '4px 10px', borderRadius: 999,
                background: i === 2 ? (dark ? '#fff' : SC.ink1000) : (dark ? 'rgba(255,255,255,0.06)' : 'transparent'),
                color: i === 2 ? (dark ? SC.ink1000 : '#fff') : (dark ? 'rgba(255,255,255,0.55)' : SC.ink500),
                fontSize: 11, fontWeight: 600, fontFamily: SC.fontMono, cursor: 'pointer',
              }}>{p}</span>
            ))}
          </div>
          <BigChart data={PORTFOLIO.series1m} width={500} height={180}
            color={dark ? SC.greenBright : SC.greenDeep}
            fillColor={dark ? SC.greenBright : SC.green}/>
        </div>
      </section>

      {/* Grid of more ideas + today's movers (right) */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
        <div>
          <div style={{ fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
            {lang === 'ru' ? 'Ещё идеи' : 'More ideas'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {rest.map((idea, i) => (
              <div key={i} style={{
                background: idea.color, color: idea.dark ? '#fff' : SC.ink1000,
                border: idea.border ? `1px solid ${SC.ink200}` : 'none',
                borderRadius: 22, padding: 18,
                display: 'flex', flexDirection: 'column', minHeight: 220, cursor: 'pointer',
              }}>
                <div style={{ display: 'inline-block', alignSelf: 'flex-start', padding: '4px 10px', borderRadius: 999, background: idea.dark ? 'rgba(255,255,255,0.12)' : (idea.color === SC.greenWash ? '#fff' : SC.ink100), color: idea.dark ? '#fff' : SC.ink500, fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{idea.tag}</div>
                <h3 style={{ margin: '12px 0 6px', fontSize: 20, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.15 }}>{idea.title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: idea.dark ? 'rgba(255,255,255,0.6)' : SC.ink500, lineHeight: 1.4, flex: 1 }}>{idea.sub}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTop: idea.dark ? '1px solid rgba(255,255,255,0.08)' : `1px solid ${SC.ink200}` }}>
                  <span style={{ fontFamily: SC.fontMono, fontSize: 18, fontWeight: 700, color: idea.dark ? SC.greenBright : SC.greenDeep, letterSpacing: '-0.03em' }}>{idea.upside}</span>
                  <span style={{ fontSize: 11, color: idea.dark ? 'rgba(255,255,255,0.5)' : SC.ink500 }}>{idea.period} · {idea.risk}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Education row */}
          <div style={{ marginTop: 22, background: dark ? SC.ink900 : SC.ink1000, color: '#fff', borderRadius: 22, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 999, background: SC.lime, color: SC.ink1000, display: 'grid', placeItems: 'center' }}>
              <Icon name="book" size={22} color={SC.ink1000} strokeWidth={2}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.2px' }}>{lang === 'ru' ? 'Не уверены, с чего начать?' : 'Not sure where to start?'}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{lang === 'ru' ? 'Пройдите 5-минутный тест и получите персональный план.' : 'Take a 5-minute test and get a personal plan.'}</div>
            </div>
            <Pill variant="primary" size="md" arrow>{lang === 'ru' ? 'Начать' : 'Start'}</Pill>
          </div>
        </div>
        {/* Right rail: live crypto prices + news */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Live crypto widget */}
          {typeof useBinancePrices === 'function' && (
            <LiveCryptoPrices lang={lang} dark={dark}/>
          )}
          <div>
            <div style={{ fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
              {t(lang, 'news')}
            </div>
            <div style={{ background: cardBg, borderRadius: 22, border, padding: '6px 18px' }}>
              {news.map((n, i, arr) => (
                <div key={i} style={{
                  padding: '14px 0',
                  borderBottom: i === arr.length - 1 ? 'none' : border,
                  cursor: 'pointer',
                }}>
                  <div style={{ display: 'inline-block', padding: '2px 7px', borderRadius: 999, background: dark ? 'rgba(255,255,255,0.07)' : SC.ink100, color: sub, fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>{n.tag}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: text, letterSpacing: '-0.2px', lineHeight: 1.35, marginBottom: 4 }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: sub, fontFamily: SC.fontMono }}>{n.meta}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LiveCryptoPrices — compact widget for home screen right rail
// ─────────────────────────────────────────────────────────────
const LIVE_CRYPTO_LIST = [
  { symbol: 'BTC',  name: 'Bitcoin',  binance: 'BTCUSDT' },
  { symbol: 'ETH',  name: 'Ethereum', binance: 'ETHUSDT' },
  { symbol: 'BNB',  name: 'BNB',      binance: 'BNBUSDT' },
  { symbol: 'SOL',  name: 'Solana',   binance: 'SOLUSDT' },
];

function LiveCryptoPrices({ lang = 'ru', dark = false }) {
  const { prices, loading, error } = useBinancePrices(LIVE_CRYPTO_LIST.map(a => a.binance));
  const text = dark ? '#fff' : SC.ink1000;
  const sub  = dark ? 'rgba(255,255,255,0.5)' : SC.ink500;
  const cardBg = dark ? SC.ink900 : SC.paper;
  const border = dark ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${SC.ink200}`;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: sub, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {lang === 'ru' ? 'Крипто · Binance' : 'Crypto · Binance'}
        </div>
        {typeof BinanceStatusBadge === 'function' && (
          <BinanceStatusBadge loading={loading} error={error} dark={dark}/>
        )}
      </div>
      <div style={{ background: cardBg, borderRadius: 22, border, padding: '6px 18px' }}>
        {LIVE_CRYPTO_LIST.map((asset, i) => {
          const live = prices[asset.binance];
          const price  = live ? live.price  : null;
          const change = live ? live.change : null;
          return (
            <div key={asset.symbol} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
              borderBottom: i === LIVE_CRYPTO_LIST.length - 1 ? 'none' : border,
            }}>
              <TickerLogo symbol={asset.symbol} size={32}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: text, letterSpacing: '-0.2px' }}>{asset.symbol}</div>
                <div style={{ fontSize: 11, color: sub }}>{asset.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: SC.fontMono, fontSize: 13, fontWeight: 600, color: text }}>
                  {price !== null
                    ? `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: price > 100 ? 2 : 4 })}`
                    : <span style={{ color: sub }}>…</span>}
                </div>
                <div style={{ marginTop: 2 }}>
                  {change !== null ? <DeltaPill value={change} size="sm"/> : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { WebMarketsView, WebAssetDetail, WebExchange, WebWithdraw, WebHistory, WebInvestmentIdeas });
