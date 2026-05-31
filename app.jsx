// ════════════════════════════════════════════════════════════════════
// Engagement Simulator — Main App
// ════════════════════════════════════════════════════════════════════

const { useState, useMemo, useEffect, useRef, useCallback } = React;
const { fullPredict, SAMPLES } = window.FundraisingModel;
const T = window.T;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "instrument",
  "chroma": "glacier",
  "pace": "calm"
}/*EDITMODE-END*/;

const METRICS = [
  { key: 'Likes', label: 'Likes', icon: 'heart', color: '#D67A85', unit: 'likes' },
  { key: 'Shares', label: 'Shares', icon: 'repeat', color: '#8FB298', unit: 'shares' },
  { key: 'Comments', label: 'Comments', icon: 'chat', color: '#A89BD1', unit: 'comments' },
];

const SIGNALS = [
  { key: 'Inf', name: 'Data', icon: 'chart', color: '#7BD3FF', hint: 'Specific figures, %s, or counts' },
  { key: 'Pos', name: 'Hope', icon: 'sparkle', color: '#E5BFD9', hint: 'Positive emotional language' },
  { key: 'Neg', name: 'Hardship', icon: 'shield', color: '#FF7A8E', hint: 'Suffering, crisis, devastation' },
  { key: 'Urg', name: 'Urgency', icon: 'clock', color: '#FFA552', hint: 'Time-bound calls to action' },
  { key: 'Inc', name: 'Collective', icon: 'users', color: '#5BE3B7', hint: 'Join us, together, community' },
];

const DEFAULT_TEXT = "Today, families in our community are facing unimaginable hardship. Your gift can provide warm meals, safe shelter, and hope when it's needed most.\n\nTogether, we can make sure no one is left behind. Donate today and be the reason someone finds light in a dark time.";

function EngagementSimulator() {
  const [screen, setScreen] = useState('landing'); // landing | test-flow | test-sim | campaign-flow | about | research
  const [text, setText] = useState(DEFAULT_TEXT);
  const [conf, setConf] = useState(0.95);
  const [activeMetric, setActiveMetric] = useState('Likes');
  const [showCitation, setShowCitation] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [contextOpen, setContextOpen] = useState(true);
  const [lang, setLang] = useState(window.getLang());
  const changeLang = (l) => { window.setLangGlobal(l); setLang(l); };
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [ctx, setCtx] = useState({
    followers: 5000,
    userType: 'Organization',
    verified: false,
    hour: 14,
    weekend: true,
    daysSinceStart: 1400,
    quarter: 2,
  });

  const pred = useMemo(() => fullPredict(text, ctx, conf), [text, ctx, conf]);

  const handleReset = () => {
    setText(DEFAULT_TEXT);
    setConf(0.95);
  };
  const handleOpenSimulator = (initCtx) => {
    setCtx({ ...ctx, ...initCtx });
    setText('');
    setScreen('test-sim');
  };

  return (
    <div className="app" data-mode={t.mode} data-chroma={t.chroma} data-pace={t.pace}>
      <Navbar screen={screen} setScreen={setScreen} onCite={() => setShowCitation(true)} onHelp={() => setShowHelp(true)} lang={lang} changeLang={changeLang} />

      {screen === 'landing' && (
        <LandingView
          onChoose={(kind) => setScreen(kind === 'test' ? 'test-flow' : 'campaign-flow')}
          onAbout={() => setScreen('about')}
          onCite={() => setShowCitation(true)}
          onResearch={() => setScreen('research')}
        />
      )}
      {screen === 'test-flow' && (
        <TestFlow lang={lang} onExit={() => setScreen('landing')} openSimulator={handleOpenSimulator} onCampaign={() => setScreen('campaign-flow')} />
      )}
      {screen === 'test-sim' && (
        <SimulatorView
          text={text} setText={setText}
          ctx={ctx} setCtx={setCtx}
          conf={conf} setConf={setConf}
          pred={pred}
          activeMetric={activeMetric} setActiveMetric={setActiveMetric}
          contextOpen={contextOpen} setContextOpen={setContextOpen}
          onReset={handleReset}
          onBack={() => setScreen('test-flow')}
          setScreen={setScreen}
          onCite={() => setShowCitation(true)}
        />
      )}
      {screen === 'campaign-flow' && (
        <CampaignFlow onExit={() => setScreen('landing')} />
      )}
      {screen === 'about' && <AboutView setScreen={setScreen} />}
      {screen === 'research' && <ResearchView />}

      {showCitation && <CitationModal onClose={() => setShowCitation(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Mode" />
        <TweakRadio
          label="Aesthetic"
          value={t.mode}
          options={[
            { value: 'instrument', label: 'Instrument' },
            { value: 'notes',      label: 'Field notes' },
            { value: 'console',    label: 'Console' },
          ]}
          onChange={v => setTweak('mode', v)}
        />
        <div style={{ fontSize: 10.5, opacity: 0.55, lineHeight: 1.4, marginTop: -2 }}>
          {t.mode === 'instrument' && 'Dark lab glass — current baseline.'}
          {t.mode === 'notes'      && 'Warm cream paper. Serif-led, hand-feel.'}
          {t.mode === 'console'    && 'Pure black terminal. Mono-led, phosphor accent.'}
        </div>

        <TweakSection label="Chroma" />
        <TweakRadio
          label="Palette family"
          value={t.chroma}
          options={[
            { value: 'glacier', label: 'Glacier' },
            { value: 'solar',   label: 'Solar' },
            { value: 'botanic', label: 'Botanic' },
          ]}
          onChange={v => setTweak('chroma', v)}
        />
        <div style={{ fontSize: 10.5, opacity: 0.55, lineHeight: 1.4, marginTop: -2 }}>
          {t.chroma === 'glacier' && 'Cyan · coral · mint · violet — cool, analytical.'}
          {t.chroma === 'solar'   && 'Amber · rose · plum · ember — warm, urgent.'}
          {t.chroma === 'botanic' && 'Sage · terracotta · moss · ochre — earthy, grounded.'}
        </div>

        <TweakSection label="Pace" />
        <TweakRadio
          label="Density"
          value={t.pace}
          options={[
            { value: 'calm',  label: 'Calm' },
            { value: 'tight', label: 'Tight' },
          ]}
          onChange={v => setTweak('pace', v)}
        />
        <div style={{ fontSize: 10.5, opacity: 0.55, lineHeight: 1.4, marginTop: -2 }}>
          {t.pace === 'calm'  && 'Generous breathing room.'}
          {t.pace === 'tight' && 'Dense instrument-panel feel.'}
        </div>
      </TweaksPanel>
    </div>
  );
}

// ─── Language flag toggle ──────────────────────────────
function LangToggle({ lang, changeLang }) {
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        className={`lang-btn ${lang === 'en' ? 'on' : ''}`}
        onClick={() => changeLang('en')}
        title="English" aria-pressed={lang === 'en'}
      >
        <svg className="flag" viewBox="0 0 60 30" width="22" height="11" aria-hidden="true">
          <clipPath id="uk-c"><rect width="60" height="30" rx="2" /></clipPath>
          <g clipPath="url(#uk-c)">
            <rect width="60" height="30" fill="#012169" />
            <path d="M0,0 60,30 M60,0 0,30" stroke="#fff" strokeWidth="6" />
            <path d="M0,0 60,30 M60,0 0,30" stroke="#C8102E" strokeWidth="4" />
            <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
            <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
          </g>
        </svg>
        EN
      </button>
      <button
        className={`lang-btn ${lang === 'fr' ? 'on' : ''}`}
        onClick={() => changeLang('fr')}
        title="Français" aria-pressed={lang === 'fr'}
      >
        <svg className="flag" viewBox="0 0 3 2" width="22" height="11" aria-hidden="true">
          <rect width="1" height="2" x="0" fill="#0055A4" />
          <rect width="1" height="2" x="1" fill="#fff" />
          <rect width="1" height="2" x="2" fill="#EF4135" />
        </svg>
        FR
      </button>
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────
function Navbar({ screen, setScreen, onCite, onHelp, lang, changeLang }) {
  const tabs = [
    { id: 'landing', label: 'Home' },
    { id: 'test-flow', label: 'Test a Post' },
    { id: 'campaign-flow', label: 'Campaign Mode' },
    { id: 'about', label: 'About' },
  ];
  const activeTab = screen === 'test-sim' ? 'test-flow' : screen;
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="brand" onClick={() => setScreen('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <BrandMark />
          <div className="brand-text">
            <div className="brand-title">{T("Fundraising Engagement Lab")}</div>
          </div>
        </button>
        <div className="nav-tabs">
          {tabs.map(t => (
            <button key={t.id} className={`nav-tab ${activeTab === t.id ? 'on' : ''}`} onClick={() => setScreen(t.id)}>
              {T(t.label)}
            </button>
          ))}
        </div>
      </div>
      <div className="navbar-right">
        <LangToggle lang={lang} changeLang={changeLang} />
        <button className="icon-btn" title={T("Help")} onClick={onHelp}><Icon name="help" /></button>
        <button className="pill-btn accent nav-cite" onClick={onCite}>
          <Icon name="book" size={14} /> <span className="nav-cite-label">{T("Citation & Data")}</span>
        </button>
      </div>
    </nav>
  );
}

// ─── Hero Header ───────────────────────────────────────
function Hero({ conf, setConf, onReset, onBack }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="hero">
      <div className="hero-left">
        <div className="hero-icon"><Icon name="flask" size={26} /></div>
        <div>
          {onBack && (
            <button className="bottom-link" onClick={onBack} style={{ padding: '0 0 4px', marginTop: -4 }}>
              {T("← Change setup")}
            </button>
          )}
          <h1 className="hero-title">{T("Engagement Simulator")}</h1>
          <p className="hero-sub">{T("A rough sense of how your fundraising message might land. Treat the numbers as orientations, not promises.")}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Simulator View ────────────────────────────────────
function SimulatorView({ text, setText, ctx, setCtx, conf, setConf, pred, activeMetric, setActiveMetric, contextOpen, setContextOpen, onReset, onBack, setScreen, onCite }) {
  const advRef = useRef(null);
  const [showContext, setShowContext] = useState(false);
  const scrollToAdvice = () => {
    const el = advRef.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 24;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const ctxSummary = `${T(ctx.userType)} · ${ctx.followers >= 1000000 ? (ctx.followers / 1000000).toFixed(ctx.followers >= 10000000 ? 0 : 1) + 'M' : ctx.followers >= 1000 ? (ctx.followers / 1000).toFixed(ctx.followers >= 10000 ? 0 : 1) + 'K' : ctx.followers} ${T('followers')}${ctx.verified ? ' · ' + T('Verified') : ''}`;

  return (
    <>
      <Hero conf={conf} setConf={setConf} onReset={onReset} onBack={onBack} />

      <div className="sim-squares">
        {/* SQUARE 1 — the post */}
        <div className="panel sim-square">
          <div className="panel-head">
            <StepPill n="1">{T("Your message")}</StepPill>
            <span className="metric-median" style={{ margin: 0 }}>{text.length} / 2,800 {T("characters")}</span>
          </div>
          <Editor text={text} setText={setText} />
          <div className="samples-row">
            <span style={{ fontSize: 12, color: 'var(--ink-3)', alignSelf: 'center', marginRight: 4 }}>{T("Try a sample:")}</span>
            {SAMPLES.map(s => (
              <button key={s.name} className="sample-chip" onClick={() => setText(window.getLang() === 'fr' && s.textFr ? s.textFr : s.text)}>
                <Icon name="edit" size={11} /> {T(s.name)}
              </button>
            ))}
          </div>
          <div className="hint-row">
            <Icon name="sparkle" size={13} />
            <span>{T("Tip: include")} <strong style={{ color: 'var(--ink-2)' }}>{T("who")}</strong> {T("needs help,")} <strong style={{ color: 'var(--ink-2)' }}>{T("why")}</strong> {T("it matters, and the")} <strong style={{ color: 'var(--ink-2)' }}>{T("action")}</strong> {T("you want people to take.")}</span>
          </div>
          <button className="context-trigger" onClick={() => setShowContext(true)}>
            <span className="ct-left">
              <Icon name="users" size={14} />
              <span>
                <span className="ct-title">{T("Account & posting context")}</span>
                <span className="ct-sub">{ctxSummary}</span>
              </span>
            </span>
            <span className="ct-edit">{T("Edit")} <Icon name="arrowRight" size={12} /></span>
          </button>
        </div>

        {/* SQUARE 2 — prediction */}
        <div className="panel sim-square pred-square">
          <div className="panel-head">
            <StepPill n="2">{T("Prediction")}</StepPill>
            <span className="metric-median" style={{ margin: 0 }}>{T("95% range")}</span>
          </div>
          {pred.trivial ? (
            <div className="pred-empty">
              <Icon name="edit" size={36} color="var(--ink-4)" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, margin: '16px 0 6px' }}>{T("Start writing")}</h3>
              <p style={{ color: 'var(--ink-3)', fontSize: 13, margin: 0 }}>{T("Predictions appear once your message reaches 12+ characters. Or try a sample chip on the left.")}</p>
            </div>
          ) : (
            <>
              <div className="metrics-row">
                {METRICS.map(m => (
                  <MetricCard
                    key={m.key} icon={m.icon} label={m.label} color={m.color}
                    low={pred[m.key].low} high={pred[m.key].high} med={pred[m.key].med} unit={m.unit}
                    mu={pred[m.key].mu} alpha={window.FundraisingModel.ALPHA?.[m.key] || 2.5}
                    active={activeMetric === m.key}
                    onClick={() => setActiveMetric(m.key)}
                  />
                ))}
              </div>
              <div className="metrics-foot" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="info" size={13} color="var(--ink-4)" />
                  <span>{T("A rough 95% guess — orientation, not a forecast.")}</span>
                </div>
                <button className="bottom-link" onClick={scrollToAdvice} style={{ padding: 0 }}>
                  {T("See suggestions")} <Icon name="arrowDown" size={12} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {!pred.trivial && (
        <div className="sim-below">
          <div ref={advRef}>
            <AdvicePanel pred={pred} ctx={ctx} />
          </div>
        </div>
      )}

      {showContext && (
        <div className="modal-backdrop" onClick={() => setShowContext(false)}>
          <div className="modal context-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowContext(false)}><Icon name="x" /></button>
            <span className="tag">{T("Step 2")}</span>
            <h2 style={{ marginTop: 8 }}>{T("Account & posting context")}</h2>
            <p style={{ color: 'var(--ink-3)', margin: '4px 0 18px', fontSize: 13.5 }}>{T("The control variables from the published model. Set them to match your real situation — predictions update live.")}</p>
            <ContextEditor ctx={ctx} setCtx={setCtx} />
            <div style={{ marginTop: 22, display: 'flex', justifyContent: 'flex-end' }}>
              <button className="pill-btn primary" onClick={() => setShowContext(false)}>
                <Icon name="check" size={14} /> {T("Done")}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomBar
        onResearch={() => { window.scrollTo({ top: 0 }); setScreen && setScreen('research'); }}
        onAbout={() => { window.scrollTo({ top: 0 }); setScreen && setScreen('about'); }}
        onCite={onCite}
      />
    </>
  );
}

// ─── Editor ────────────────────────────────────────────
function Editor({ text, setText }) {
  const ref = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const insert = (s) => {
    const el = ref.current;
    if (!el) { setText(text + s); return; }
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const next = text.slice(0, start) + s + text.slice(end);
    setText(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + s.length, start + s.length);
    }, 0);
  };
  return (
    <div className="editor" style={{ position: 'relative' }}>
      <textarea
        ref={ref} value={text} onChange={e => setText(e.target.value)}
        placeholder={T("Paste or write your fundraising message here...")}
        maxLength={2800}
      />
      <div className="editor-toolbar">
        <span className="count">{text.length} {T("chars")}</span>
        <div className="right">
          <button className="toolbar-btn" onClick={() => insert('#')} title={T("Hashtag")}>#</button>
          <button className="toolbar-btn" onClick={() => insert('@')} title={T("Mention")}>@</button>
          <button className="toolbar-btn mono" onClick={() => insert('—')} title={T("Em-dash")}>—</button>
          <button className="toolbar-btn mono" onClick={() => insert('…')} title={T("Ellipsis")}>…</button>
          <button className="toolbar-btn mono" onClick={() => insert('"')} title={T("Open quote")}>"</button>
          <button className="toolbar-btn emoji-btn-main" onClick={() => setShowEmoji(v => !v)} title={T("Insert emoji")}>
            <span style={{ fontSize: 14 }}>😊</span> {T("Add emoji")}
          </button>
        </div>
      </div>
      {showEmoji && (
        <div style={{ position: 'absolute', right: 10, bottom: 50, zIndex: 30 }}>
          <EmojiPicker onPick={(e) => { insert(e); }} onClose={() => setShowEmoji(false)} />
        </div>
      )}
    </div>
  );
}

// ─── Context Editor ────────────────────────────────────
function ContextEditor({ ctx, setCtx }) {
  const formatHour = (h) => {
    if (h === 0) return '12 AM';
    if (h < 12) return `${h} AM`;
    if (h === 12) return '12 PM';
    return `${h - 12} PM`;
  };
  const followersLabel = ctx.followers >= 1000000 ? `${(ctx.followers / 1000000).toFixed(ctx.followers >= 10000000 ? 0 : 1)}M` : ctx.followers >= 1000 ? `${(ctx.followers / 1000).toFixed(ctx.followers >= 10000 ? 0 : 1)}K` : ctx.followers;
  return (
    <div className="context-grid">
      <div className="context-note">
        <Icon name="flask" size={13} />
        <span>{T("These mirror the")} <strong style={{ color: 'var(--ink-2)' }}>{T("control variables")}</strong> {T("used in the published model — audience size, account type, verification, posting hour, weekend, and quarter. Set them to match your real situation.")}</span>
      </div>
      <div className="field" style={{ gridColumn: 'span 1' }}>
        <div className="field-label">{T("Followers")} <Icon name="info" size={11} className="info" /></div>
        <div className="field-row">
          <Icon name="users" size={14} color="var(--ink-3)" />
          <input className="field-input" type="number" value={ctx.followers}
            onChange={e => setCtx({ ...ctx, followers: Math.max(0, parseInt(e.target.value) || 0) })} />
        </div>
        <Slider value={ctx.followers} onChange={v => setCtx({ ...ctx, followers: v })}
          min={100} max={10000000} step={100} leftLabel="100" rightLabel="10M+" />
      </div>

      <div className="field">
        <div className="field-label">{T("Account type")}</div>
        <Segment
          value={ctx.userType}
          onChange={v => setCtx({ ...ctx, userType: v })}
          options={[
            { value: 'Organization', label: T('Organization') },
            { value: 'Individual', label: T('Individual') },
            { value: 'Ambiguous', label: T('Ambiguous') },
          ]}
        />
        <div style={{ marginTop: 14 }}>
          <div className="field-label">{T("Verified account")}</div>
          <Segment
            value={ctx.verified ? 'yes' : 'no'}
            onChange={v => setCtx({ ...ctx, verified: v === 'yes' })}
            options={[{ value: 'yes', label: T('Yes') }, { value: 'no', label: T('No') }]}
          />
        </div>
      </div>

      <div className="field">
        <div className="field-label">{T("Hour of day")}</div>
        <div className="field-row">
          <Icon name="calendar" size={14} color="var(--ink-3)" />
          <div className="field-input" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{formatHour(ctx.hour)}</span>
            <span style={{ color: 'var(--ink-4)', fontSize: 11 }}>{String(ctx.hour).padStart(2, '0')}:00</span>
          </div>
        </div>
        <Slider value={ctx.hour} onChange={v => setCtx({ ...ctx, hour: v })}
          min={0} max={23} step={1} leftLabel="0" rightLabel="23" />
      </div>

      <div className="field">
        <div className="field-label">{T("Weekend?")}</div>
        <Segment
          value={ctx.weekend ? 'yes' : 'no'}
          onChange={v => setCtx({ ...ctx, weekend: v === 'yes' })}
          options={[{ value: 'yes', label: T('Yes') }, { value: 'no', label: T('No') }]}
        />
        <div style={{ marginTop: 14 }}>
          <div className="field-label">{T("Quarter")}</div>
          <Segment
            value={String(ctx.quarter)}
            onChange={v => setCtx({ ...ctx, quarter: parseInt(v) })}
            options={[
              { value: '1', label: 'Q1' }, { value: '2', label: 'Q2' },
              { value: '3', label: 'Q3' }, { value: '4', label: 'Q4' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Factors Panel ─────────────────────────────────────
function FactorsPanel({ pred, activeMetric, setActiveMetric }) {
  const factors = pred.factors[activeMetric] || [];
  const maxAbs = Math.max(...factors.map(f => Math.abs(f.contrib)), 0.5);
  const activeColor = METRICS.find(m => m.key === activeMetric).color;

  return (
    <div className="panel factors-panel">
      <div className="factors-head">
        <div>
          <h2>{T("What's driving this prediction?")}</h2>
          <div className="factors-sub">
            <span style={{ color: 'var(--ink-3)' }}>{T("Showing impact on")}</span>
            <span style={{ color: activeColor, fontWeight: 600 }}>{T(activeMetric)}</span>
            <Icon name="info" size={12} color="var(--ink-4)" />
          </div>
        </div>
      </div>

      <div className="factor-tabs">
        {METRICS.map(m => (
          <button key={m.key} className={`factor-tab ${activeMetric === m.key ? 'on' : ''}`}
            style={{ color: activeMetric === m.key ? m.color : 'var(--ink-3)', borderBottomColor: activeMetric === m.key ? m.color : 'transparent' }}
            onClick={() => setActiveMetric(m.key)}>
            <Icon name={m.icon} size={12} /> {T(m.key)}
          </button>
        ))}
      </div>

      {factors.length === 0 ? (
        <div className="factors-empty">{T("No strong drivers detected. Your message and context are near the average — predictions reflect the baseline.")}</div>
      ) : (
        <div>
          {factors.slice(0, 7).map((f, i) => (
            <FactorBar key={i} f={f} maxAbs={maxAbs} />
          ))}
        </div>
      )}
      <div className="factors-foot">{T("Bars show the relative magnitude of each driver's contribution. Percentages are multiplicative effects on predicted")} {T(activeMetric).toLowerCase()}.</div>
    </div>
  );
}

// ─── Advice Panel — concrete Do / Don't rewrites ───────
function buildRecommendations(pred, ctx) {
  const f = pred.features;
  const recs = [];

  if (f.Inf && !f.Pos) {
    recs.push({
      title: 'Wrap the numbers in a feeling',
      why: 'Data alone underperforms. Figures land when they carry an emotion — relief, hope, even awe at what a gift makes possible (the Inf×Hope interaction is strongly positive).',
      doText: 'Your €10 gift provides 3 warm meals — and the relief of one family knowing tonight is taken care of.',
      dontText: '€10 = 3 meals. Donate now.',
    });
  }
  if (f.Urg && !f.Neg && !f.Pos) {
    recs.push({
      title: 'Give urgency an emotion to ride on',
      why: 'Urgency on its own reads as pressure and slightly suppresses engagement. It works when it carries a real feeling — worry, compassion, the fear of being too late for someone specific.',
      doText: 'Donate before midnight — so no child waits outside in the cold tonight.',
      dontText: 'Urgent! Donate now before it’s too late!',
    });
  }
  if (f.Urg && f.Neg) {
    recs.push({
      title: 'Pair urgency with a felt emotion',
      why: 'Urgency and emotion compound well (Urg×Neg is positive across all three outcomes) — but it has to be felt, not shouted. Anchor it in sadness or compassion for one person, not blanket alarm.',
      doText: 'Tonight, 40 families are frightened of sleeping outside. Your gift is the relief of a safe bed.',
      dontText: 'A terrible crisis is happening. Everything is urgent. Please help immediately.',
    });
  }
  if (f.Neg && !f.Pos) {
    recs.push({
      title: 'Lift the sadness with hope or awe',
      why: 'Sadness draws people in, but a purely heavy message can feel hopeless. Pairing distress with hope — or a moment of awe at what changes — is the highest-converting emotional blend in the data.',
      doText: 'She arrived with nothing. Three months on, she’s back in school and dreaming again — that’s what your gift makes possible.',
      dontText: 'Everything is bleak and nothing is working. It only gets worse from here.',
    });
  }
  if (f.Inc) {
    recs.push({
      title: 'Use the collective frame to spread',
      why: 'Collective language lifts shares specifically — the metric that carries a message into new networks. Keep the requested action simple.',
      doText: 'Stand with us: share this, or give to help one more family today.',
      dontText: 'Together we can do everything — support all our actions and follow every campaign.',
    });
  }
  if (!f.Neg) {
    recs.push({
      title: 'Make people feel something',
      why: 'Emotional language — sadness, worry, compassion, even a touch of guilt — is the single largest engagement driver in the data. Don’t just describe the situation; make the reader feel the stakes for one real person.',
      doText: 'It’s heartbreaking: 2,300 families in our city face eviction this winter — and tonight they’re scared.',
      dontText: 'Many people are going through a difficult time.',
    });
  }
  if (ctx.userType === 'Organization') {
    recs.push({
      title: 'Make the organization sound human',
      why: 'Organizational accounts saw lower engagement than individuals in the model. Add a frontline, volunteer, or beneficiary voice.',
      doText: 'Our volunteers met families arriving without winter coats today. Your gift helps us respond tonight.',
      dontText: 'Our organization is implementing emergency assistance operations.',
    });
  }
  if (!ctx.verified) {
    recs.push({
      title: 'Compensate for lower structural credibility',
      why: 'Verification is a strong credibility control in the paper. Unverified? Make the source feel concrete and trustworthy.',
      doText: 'Add a named team, a location, or a specific field detail people can trust.',
      dontText: 'Lean only on generic institutional claims.',
    });
  }
  if (f.hash > 2) {
    recs.push({
      title: 'Reduce hashtag clutter',
      why: 'Each hashtag carries a small negative coefficient. Too many make a post feel optimized rather than sincere.',
      doText: 'Use one or two clear tags: #Donate #Community',
      dontText: '#Donate #Help #Urgent #Charity #Fundraising #Impact #Hope',
    });
  }
  if (f.emoji > 2) {
    recs.push({
      title: 'Use emojis sparingly',
      why: 'The model shows diminishing — then negative — returns as emojis accumulate (positive linear, negative squared term).',
      doText: 'Your gift can help a family find shelter tonight. 🙏',
      dontText: 'Your gift can help a family tonight 🙏❤️✨📣🏠💙',
    });
  }

  if (recs.length === 0) {
    recs.push({
      title: 'The draft is directionally strong',
      why: 'It already combines a clear need, a human frame, and an action. The next gain is precision.',
      doText: 'Name the concrete outcome of one donation, and keep the final call to action short.',
      dontText: 'Add more claims, hashtags, or emotional pressure just to make it louder.',
    });
  }
  return recs.slice(0, 4);
}

function AdvicePanel({ pred, ctx }) {
  const recs = useMemo(() => buildRecommendations(pred, ctx), [pred, ctx]);
  return (
    <div className="panel">
      <div className="panel-head">
        <div className="step-pill">
          <div className="step-n" style={{ background: 'rgba(91,227,183,0.14)', color: 'var(--pos)' }}>
            <Icon name="check" size={12} strokeWidth={2.5} />
          </div>
          <h3>{T("Recommendations")}</h3>
        </div>
        <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{T("Do / Don't rewrites")}</span>
      </div>
      <div className="rec-list">
        {recs.map((r, i) => (
          <div key={i} className="rec-card">
            <h4 className="rec-title">{T(r.title)}</h4>
            <p className="rec-why">{T(r.why)}</p>
            <div className="rec-examples">
              <div className="rec-ex do">
                <div className="rec-ex-label"><Icon name="check" size={11} strokeWidth={2.6} /> {T("Do")}</div>
                <p>{T(r.doText)}</p>
              </div>
              <div className="rec-ex dont">
                <div className="rec-ex-label"><Icon name="x" size={11} strokeWidth={2.6} /> {T("Don't")}</div>
                <p>{T(r.dontText)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Bottom Bar ────────────────────────────────────────
function BottomBar({ onResearch, onAbout, onCite }) {
  return (
    <div className="bottom-bar">
      <div className="bottom-block">
        <div className="bottom-head"><div className="ic"><Icon name="book" size={14} /></div> {T("Where these numbers come from")}</div>
        <p>{T("Every estimate traces back to a peer-reviewed model of 18,257 real fundraising appeals. Go deeper into what drives engagement — and how far to trust the figures.")}</p>
      </div>
      <div className="bottom-actions">
        <button className="pill-btn" onClick={onResearch}><Icon name="flask" size={13} /> {T("Research findings")}</button>
        <button className="pill-btn" onClick={onAbout}><Icon name="info" size={13} /> {T("How accurate is this?")}</button>
        <button className="pill-btn accent" onClick={onCite}><Icon name="book" size={13} /> {T("Citation & data")}</button>
      </div>
    </div>
  );
}

// ─── Citation Modal ────────────────────────────────────
function CitationModal({ onClose }) {
  const apa = "Benhoumane, A., & Manthé, R. (forthcoming). What drives engagement with fundraising messages on social media? Insights from an LLM-assisted approach. Journal of Philanthropy. https://doi.org/10.1002/nvsm.70067";
  const bibtex = `@article{benhoumane2025engagement,
  author  = {Benhoumane, Ahmed and Manth\\'e, Romain},
  title   = {What Drives Engagement with Fundraising Messages on Social Media? Insights from an LLM-Assisted Approach},
  journal = {Journal of Philanthropy},
  note    = {Forthcoming},
  doi     = {10.1002/nvsm.70067}
}`;

  const [fmt, setFmt] = React.useState('apa');
  const [copied, setCopied] = React.useState(false);

  const current = fmt === 'apa' ? apa : bibtex;
  const copy = async () => {
    try { await navigator.clipboard.writeText(current); } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = current; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><Icon name="x" /></button>
        <span className="tag">{T("Source")}</span>
        <h2 style={{ marginTop: 8 }}>{T("Citation & Data")}</h2>
        <p style={{ color: 'var(--ink-3)', margin: '4px 0 18px' }}>{T("Cite this work, or get in touch to request the dataset.")}</p>

        <div className="cite-ref">
          <div className="cite-ref-title">{T("What Drives Engagement with Fundraising Messages on Social Media? Insights from an LLM-Assisted Approach")}</div>
          <div className="cite-ref-meta">
            <span className="cite-badge">{T("Forthcoming")}</span>
            <span>Journal of Philanthropy</span>
            <a href="https://doi.org/10.1002/nvsm.70067" target="_blank" rel="noopener noreferrer" className="cite-doi">DOI: 10.1002/nvsm.70067</a>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 10px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, margin: 0 }}>{T("Citation")}</h3>
          <div className="segment" role="tablist" aria-label="Citation format">
            <button className={fmt === 'apa' ? 'on' : ''} onClick={() => setFmt('apa')}>APA</button>
            <button className={fmt === 'bibtex' ? 'on' : ''} onClick={() => setFmt('bibtex')}>BibTeX</button>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <pre style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '16px 18px',
            paddingRight: 110,
            fontFamily: 'var(--font-mono)',
            fontSize: 12.5,
            color: 'var(--ink-2)',
            lineHeight: 1.65,
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: 220,
            overflow: 'auto',
          }}>{current}</pre>
          <button
            className="pill-btn"
            onClick={copy}
            style={{
              position: 'absolute', top: 10, right: 10,
              padding: '6px 10px', fontSize: 12,
              background: copied ? 'rgba(143,178,152,0.14)' : 'rgba(255,255,255,0.04)',
              borderColor: copied ? 'rgba(143,178,152,0.35)' : 'var(--border-strong)',
              color: copied ? 'var(--pos)' : 'var(--ink-2)',
            }}
          >
            <Icon name={copied ? 'check' : 'copy'} size={13} />
            {copied ? T('Copied') : T('Copy')}
          </button>
        </div>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, margin: '24px 0 8px' }}>{T("Request the dataset")}</h3>
        <p style={{ color: 'var(--ink-3)', fontSize: 13, margin: '0 0 12px' }}>
          {T("The full cleaned dataset (18,257 appeals, 773 accounts) and coefficient tables are available on request for academic and nonprofit use. Reach out directly:")}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a
            href="https://www.linkedin.com/in/ahmed-benhoumane/"
            target="_blank"
            rel="noopener noreferrer"
            className="pill-btn primary"
            style={{ textDecoration: 'none' }}
          >
            <Icon name="linkedin" size={14} /> {T("Contact for data")}
          </a>
          <a
            href="https://www.linkedin.com/in/ahmed-benhoumane/"
            target="_blank"
            rel="noopener noreferrer"
            className="pill-btn"
            style={{ textDecoration: 'none' }}
          >
            <Icon name="arrowRight" size={13} /> linkedin.com/in/ahmed-benhoumane
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Help Modal ────────────────────────────────────────
function HelpModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <button className="modal-close" onClick={onClose}><Icon name="x" /></button>
        <h2>{T("How to use this")}</h2>
        <ol style={{ color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.7, paddingLeft: 20 }}>
          <li><strong>{T("Paste your draft")}</strong> {T("into the message box on the left. Predictions update live as you type.")}</li>
          <li><strong>{T("Check detected signals")}</strong> {T("— 5 message archetypes the research identifies as drivers.")}</li>
          <li><strong>{T("Set your context")}</strong> {T("— followers, timing, account type. Each shifts the prediction.")}</li>
          <li><strong>{T("Read the drivers")}</strong> {T("— bars show which features are pulling each metric up or down.")}</li>
          <li><strong>{T("Iterate")}</strong> {T("— try the suggestions, watch metrics respond.")}</li>
        </ol>
      </div>
    </div>
  );
}

// ─── Research / About ─────────────────────────────────
function ResearchView() {
  const findings = [
    { color: 'var(--neg)', label: 'Hardship beats hope', d: 'Negative-emotion language is the single largest driver of engagement across all outcomes — 2.04× for likes, 1.85× for shares.' },
    { color: 'var(--shares)', label: 'Shares > likes for spread', d: 'If reach is the goal, optimize for shares. The features that maximize likes are not the same ones that maximize shares.' },
    { color: 'var(--accent)', label: 'Authenticity wins', d: 'Individual voices beat organizational accounts by ~22%. Personal language is more shareable than press-release prose.' },
    { color: 'var(--warn)', label: 'Seasonality is huge', d: 'Q3 (summer) sees a 4.8× lift in shares vs. Q1 — but Q4 (year-end giving) drives the highest comment volume.' },
    { color: 'var(--comments)', label: 'Emojis spark talk', d: 'Adding 1–2 emojis increases comment volume by 65%. More than 5 emojis backfires sharply (-9% per additional).' },
    { color: 'var(--pos)', label: 'Hashtags hurt — slightly', d: 'Each hashtag costs ~9-12% engagement. Use 0-2 max, and only for genuinely searchable terms.' },
  ];
  return (
    <div style={{ padding: '40px', maxWidth: 1100, margin: '0 auto' }}>
      <span className="tag">{T("Findings")}</span>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 600, letterSpacing: '-0.02em', margin: '12px 0 8px' }}>{T("What we learned from 18,257 appeals")}</h1>
      <p style={{ color: 'var(--ink-3)', fontSize: 15, margin: '0 0 32px', maxWidth: 700 }}>{T("Six findings most worth keeping in mind when you draft your next fundraising message.")}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {findings.map((f, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 22, borderLeft: `3px solid ${f.color}` }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: f.color, marginBottom: 4 }}>{T("FINDING")} {String(i + 1).padStart(2, '0')}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, margin: '0 0 8px', letterSpacing: '-0.01em' }}>{T(f.label)}</h3>
            <p style={{ fontSize: 13.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>{T(f.d)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Info Table (structured, for About) ───────────────
function InfoTable({ title, caption, headers, rows }) {
  return (
    <div className="info-table-wrap">
      <h2 className="info-table-title">{T(title)}</h2>
      {caption && <p className="info-table-caption">{T(caption)}</p>}
      <div className="info-table-scroll">
        <table className="info-table">
          <thead>
            <tr>
              {headers.map((h, i) => <th key={i}>{T(h)}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className={j === 0 ? 'first' : ''}>{T(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── About (science vulgarization) ────────────────────
function AboutView({ setScreen }) {
  return (
    <div className="about-page">
      <div className="about-hero">
        <span className="tag">{T("About")}</span>
        <h1>{T("Why some appeals spread — and others don't")}</h1>
        <p>
          {T("We started with a simple obsession:")} <strong>{T("how can we help people raise more funds online, not by guessing, but by understanding what actually makes people react, share, and join a cause?")}</strong> {T("Fundraising on social media often looks like a race for attention: more hashtags, more urgency, more emotion, more noise. But our study shows something more subtle. After analyzing")} <strong>{T("18,257 fundraising posts on X")}</strong>{T(", we found that online generosity is not triggered by one magic formula. People do not engage the same way when they like, share, or comment. A message that gets visibility may not create dialogue; a message that informs may not move people unless it also carries hope; urgency alone can even push people away.")}
        </p>
        <p>
          {T('So the story is not "post more." The story is:')} <strong>{T("post smarter, with a clear intention.")}</strong> {T('If the goal is to be shared, inclusive language matters because it makes people feel part of the mission. If the goal is to create reaction, emotion matters, especially when the situation feels human and real. If the goal is trust, information must be wrapped in positive meaning, not delivered like a cold report. Our obsession is exactly there: turning research into practical tools that help nonprofits design better fundraising messages online — messages that stay authentic, avoid manipulation, and give good causes a better chance to be seen, shared, and supported.')}
        </p>
      </div>

      <div className="about-grid-2">
        <div className="about-card">
          <div className="ac-icon" style={{ background: 'rgba(255,122,142,0.15)', color: 'var(--likes)' }}><Icon name="shield" size={18} /></div>
          <h3>{T("Hardship moves people")}</h3>
          <p>{T("Naming a real struggle — by name, by number — is the single biggest engagement driver in the data. Vague problems don't spread; specific ones do.")}</p>
        </div>

        <div className="about-card">
          <div className="ac-icon" style={{ background: 'rgba(91,227,183,0.15)', color: 'var(--shares)' }}><Icon name="users" size={18} /></div>
          <h3>{T('"Together" beats "you"')}</h3>
          <p>{T("Posts that frame the ask as collective —")} <em>{T("join us,")}</em> <em>{T("together we can")}</em> {T("— get shared at meaningfully higher rates. Shares are how a message escapes its original audience.")}</p>
        </div>

        <div className="about-card">
          <div className="ac-icon" style={{ background: 'rgba(123,155,201,0.18)', color: 'var(--accent)' }}><Icon name="sparkle" size={18} /></div>
          <h3>{T("People listen to people")}</h3>
          <p>{T("Individual voices outperform official organization accounts. A real human writing in their own words spreads further than the same words from a logo.")}</p>
        </div>

        <div className="about-card">
          <div className="ac-icon" style={{ background: 'rgba(232,160,116,0.18)', color: 'var(--warn)' }}><Icon name="clock" size={18} /></div>
          <h3>{T("When you post matters")}</h3>
          <p>{T("Weekends bump engagement. Summer (Q3) is the biggest seasonal lift for shares. Year-end (Q4) is when people talk back — comments peak in December.")}</p>
        </div>
      </div>

      <div className="about-callout">
        <h3>{T("The short version")}</h3>
        <p>
          {T("Tell a real story. Use a name and a number. Invite people to act")} <em>{T("with")}</em> {T("you, not")} <em>{T("for")}</em> {T("you. Skip the hashtag stack. Don't write the same way an organization would — write the way a person does. And if you're going to publish anyway, post it on a Saturday in July.")}
        </p>
      </div>

      <div className="about-tables">
        <InfoTable
          title="What the model considers"
          caption="Four layers feed the prediction — message content, format, context, and the behavior being measured."
          headers={['Layer', 'Variables', 'Why it matters']}
          rows={[
            ['Message content', 'Data, hope, hardship, urgency, collective language', 'What the appeal actually says'],
            ['Format', 'Length, hashtags, emojis', 'How the appeal is packaged'],
            ['Context', 'Followers, account type, verification, hour, weekend, quarter', 'Who posts, and when — the paper\'s control variables'],
            ['Outcomes', 'Likes, shares, comments', 'Three distinct behaviors, modeled separately — not one score'],
          ]}
        />
        <InfoTable
          title="How findings become advice"
          caption="Each recommendation in the simulator traces back to a coefficient in the published model."
          headers={['Finding', 'Practical rule', 'What it means for your draft']}
          rows={[
            ['Informativeness', 'Pair facts with hope', 'Numbers alone underperform; a hopeful frame makes them land.'],
            ['Urgency', 'Use selectively', 'Urgency alone reads as pressure; it works when the need is emotionally clear.'],
            ['Collective language', 'Best for diffusion', '"Join us" / "together" matters most when the goal is sharing.'],
            ['Hashtags', 'Use sparingly', 'Each tag carries a small penalty; 0–2 specific ones is the sweet spot.'],
            ['Emojis', 'Moderate use', '1–2 add warmth; more than a handful reduces credibility.'],
          ]}
        />
      </div>

      <div className="about-meta">
        <div>
          <h4>{T("Where this came from")}</h4>
          <p>
            Benhoumane &amp; Manthé ({T("forthcoming")}). <em>{T("What Drives Engagement with Fundraising Messages on Social Media? Insights from an LLM-Assisted Approach")}.</em> Journal of Philanthropy. DOI: 10.1002/nvsm.70067. {T("Full coefficient table available via the Citation & Data link in the navbar.")}
          </p>
        </div>
        <div>
          <h4>{T("How accurate is this?")}</h4>
          <p>
            {T("The model explains roughly two-thirds of the variation in how appeals perform — better than most predictive tools, but not magic. Your audience, visuals, follow-up, and the day's news all affect outcomes the model can't see. Think of it as a well-informed second opinion, not a fortune-teller.")}
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <button className="pill-btn primary" onClick={() => setScreen('landing')}>
          {T("Try the simulator")} <Icon name="arrowRight" size={14} />
        </button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<EngagementSimulator />);
