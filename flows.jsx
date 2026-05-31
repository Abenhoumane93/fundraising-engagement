// ════════════════════════════════════════════════════════════════════
// Flows — Landing, Test-a-Post flow, Campaign Mode flow, Emoji picker
// ════════════════════════════════════════════════════════════════════

const { useState: useStateF, useMemo: useMemoF, useEffect: useEffectF, useRef: useRefF } = React;
const { fullPredict: _fullPredict } = window.FundraisingModel;
const fullPredict = _fullPredict;
const T = window.T;

// ─── Date helpers ────────────────────────────────────────
const _DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const _DOW_FR = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const _MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const _MON_FR = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
function fmtDate(d) {
  if (window.getLang() === 'fr') return `${d.getDate()} ${_MON_FR[d.getMonth()]} ${d.getFullYear()}`;
  return `${_MON[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
function dowName(d) { return (window.getLang() === 'fr' ? _DOW_FR : _DOW)[d.getDay()]; }
function addDays(d, n) {const x = new Date(d);x.setDate(x.getDate() + n);return x;}
function daysUntilNext(d, dow) {
  const cur = d.getDay();
  let diff = (dow - cur + 7) % 7;
  if (diff === 0) diff = 7;
  return diff;
}

function buildDateOptions() {
  const today = new Date();
  const sat = addDays(today, daysUntilNext(today, 6));

  return [
  {
    id: 'today', label: 'Today',
    sub: `${dowName(today)}, ${fmtDate(today)}`,
    hint: 'Right now, in the current moment',
    weekend: today.getDay() === 0 || today.getDay() === 6,
    quarter: Math.floor(today.getMonth() / 3) + 1,
    hour: today.getHours()
  },
  {
    id: 'weekend', label: 'This weekend',
    sub: `${dowName(sat)}, ${fmtDate(sat)}`,
    hint: 'Weekend boost — +9% engagement',
    weekend: true,
    quarter: Math.floor(sat.getMonth() / 3) + 1,
    hour: 10
  }];

}

// ─── Emoji & special characters picker ────────────────────
const EMOJI_GROUPS = {
  'Faces': '🙂 😊 😢 😔 🥺 😍 🤗 😇 🥹 🥲 ❤️ 💔 💛 💙 💚 🧡 💜 🤍',
  'Hands': '🙏 👐 🤝 ✊ 👏 🙌 🫶 💪 ✌️ 👍 ✋ 🤲',
  'Symbols': '⭐ ✨ 🌟 💫 🔥 ⚡ 💧 🌱 🌳 🕯️ 🎗️ ♥ ☀ ❄',
  'Cause': '🍞 🏠 📚 💊 🩺 🎒 🧸 🍼 🎓 🏥 ⛺ 🌍 🤱 👶 🧑‍🎓 🧓',
  'Action': '🤲 💝 🎁 📣 📢 📅 ⏰ 🆘 ⚠️ ❗ ❓ ➡️',
  'Flags': '🇺🇸 🇬🇧 🇨🇦 🇫🇷 🇩🇪 🇪🇸 🇮🇹 🇪🇺 🇺🇦 🇵🇸 🇸🇩 🇨🇩 🇸🇾 🇾🇪 🇸🇴 🇪🇹 🇰🇪 🇳🇬 🇮🇳 🇧🇷 🇲🇽 🇯🇵 🏳️ 🏴 🏁 🏳️‍🌈',
  'Punctuation': '— … " " \' \' • → ← ↑ ↓ ★ ✓ ✕ §'
};

function EmojiPicker({ onPick, onClose }) {
  const [group, setGroup] = useStateF('Faces');
  const ref = useRefF(null);
  useEffectF(() => {
    const h = (e) => {if (ref.current && !ref.current.contains(e.target)) onClose();};
    setTimeout(() => document.addEventListener('mousedown', h), 0);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);
  return (
    <div ref={ref} className="emoji-picker">
      <div className="emoji-tabs">
        {Object.keys(EMOJI_GROUPS).map((g) =>
        <button key={g} className={`emoji-tab ${group === g ? 'on' : ''}`} onClick={() => setGroup(g)}>{g}</button>
        )}
      </div>
      <div className="emoji-grid">
        {EMOJI_GROUPS[group].split(' ').map((e, i) =>
        <button key={i} className="emoji-btn" onClick={() => onPick(e)} title={e}>{e}</button>
        )}
      </div>
    </div>);

}

// ─── Landing Page ────────────────────────────────────────
function LandingView({ onChoose, onAbout, onCite, onResearch }) {
  const metrics = [
    { icon: 'heart',  color: 'var(--likes)',    label: T('Likes'),    role: T('Visibility'), d: T('low-friction public reaction') },
    { icon: 'repeat', color: 'var(--shares)',   label: T('Shares'),   role: T('Diffusion'),  d: T('reach beyond your audience') },
    { icon: 'chat',   color: 'var(--comments)', label: T('Comments'), role: T('Dialogue'),   d: T('deeper supporter involvement') },
  ];
  const stats = [
    { n: '18,257', l: T('appeals analyzed') },
    { n: '773',    l: T('nonprofit accounts') },
    { n: '71%',    l: T('variance explained') },
    { n: '3',      l: T('outcomes, modeled apart') },
  ];
  return (
    <div className="landing">
      <div className="landing-bg" aria-hidden="true" />
      <div className="landing-inner">
        <div className="lp-hero">
          <div className="lp-hero-text">
            <h1 className={"landing-title" + (window.getLang() === 'fr' ? ' landing-title--fr' : '')}>
              {window.getLang() === 'fr' ? (
                <React.Fragment>Un deuxième avis <em>fondé sur la</em><br /><em>science</em> avant de publier.</React.Fragment>
              ) : (
                <React.Fragment>A <em>science-backed</em> second opinion<br />before you hit publish.</React.Fragment>
              )}
            </h1>

            <p className="lp-lead">
              {T("Paste a fundraising draft and get a research-backed read on how it's likely to land — before it goes live. The model weighs likes, shares, and comments separately, shows which words drive each, and hands back concrete rewrites.")}
            </p>

            <div className="ls-ctas">
              <button className="pill-btn primary" onClick={() => onChoose('test')}>
                <Icon name="edit" size={14} /> {T("Test a post")}
              </button>
              <button className="pill-btn" onClick={() => onChoose('campaign')}>
                <Icon name="chart" size={14} /> {T("Campaign mode")}
              </button>
              <button className="lp-tertiary" onClick={onAbout}>
                {T("How it works")} <Icon name="arrowRight" size={13} />
              </button>
            </div>
          </div>

          <div className="lp-hero-visual" aria-hidden="true">
            <img src="assets/hero-curves.png" alt="" />
          </div>
        </div>

        <div className="lp-metrics">
          <div className="lp-metrics-label">{T("It reads three behaviors, not one score")}</div>
          <div className="lp-metrics-row">
            {metrics.map((m, i) => (
              <div key={i} className="lp-metric">
                <span className="lp-metric-ic" style={{ color: m.color }}><Icon name={m.icon} size={16} /></span>
                <div className="lp-metric-txt">
                  <span className="lp-metric-top"><strong>{m.label}</strong> · {m.role}</span>
                  <span className="lp-metric-d">{m.d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lp-stats">
          {stats.map((s, i) => (
            <button key={i} className="lp-stat" onClick={onResearch}>
              <span className="lp-stat-n">{s.n}</span>
              <span className="lp-stat-l">{s.l}</span>
            </button>
          ))}
        </div>
      </div>

      <footer className="home-footer">
        <div className="hf-inner">
          <div className="hf-left">
            <div className="hf-mark">
              <img className="hf-logo" src="logo-icon.png" alt="Fundraising Engagement Lab" />
              <span className="hf-name">{T("Fundraising Engagement Simulator")}</span>
            </div>
          </div>
          <nav className="hf-links">
            <button className="hf-link" onClick={() => onChoose('test')}>{T("Test a post")}</button>
            <button className="hf-link" onClick={() => onChoose('campaign')}>{T("Campaign mode")}</button>
            <button className="hf-link" onClick={onAbout}>{T("About the model")}</button>
            <button className="hf-link" onClick={onCite}>{T("Citation & data")}</button>
            <a className="hf-link" href="https://www.linkedin.com/in/ahmed-benhoumane/" target="_blank" rel="noopener noreferrer">{T("Contact")}</a>
          </nav>
        </div>
        <div className="hf-bottom">
          <span>© {new Date().getFullYear()} Benhoumane &amp; Manthé. {T("All rights reserved.")}</span>
          <span className="hf-disc">{T("Predictions are statistical estimates, not guarantees.")}</span>
        </div>
      </footer>
    </div>);

}

// ─── Site Footer ─────────────────────────────────────────
function SiteFooter({ onAbout, onCite, onChoose, onResearch }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="sf-inner">
        <div className="sf-col sf-brand">
          <div className="sf-mark">
            <img className="sf-mark-logo" src="logo-icon.png" alt="Fundraising Engagement Lab" />
            <span className="sf-mark-text">
              <span className="sf-mark-title">Fundraising Engagement Simulator</span>
              <span className="sf-mark-sub">Fundraising Engagement Lab · Est. 2025</span>
            </span>
          </div>
          <p>
            A research-grounded sandbox for nonprofit communicators. Built on a peer-reviewed statistical model of <strong>18,257</strong> real fundraising appeals across <strong>773</strong> accounts.
          </p>
          <div className="sf-stats">
            <div><span className="n">18,257</span><span className="l">appeals analyzed</span></div>
            <div><span className="n">773</span><span className="l">nonprofit accounts</span></div>
            <div><span className="n">71%</span><span className="l">variance explained</span></div>
          </div>
        </div>

        <div className="sf-col">
          <div className="sf-h">Explore</div>
          <button className="sf-link" onClick={() => onChoose('test')}><Icon name="edit" size={13} /> Test a post</button>
          <button className="sf-link" onClick={() => onChoose('campaign')}><Icon name="chart" size={13} /> Campaign mode</button>
          <button className="sf-link" onClick={onResearch}><Icon name="flask" size={13} /> Research findings</button>
          <button className="sf-link" onClick={onAbout}><Icon name="info" size={13} /> About the model</button>
        </div>

        <div className="sf-col">
          <div className="sf-h">Source &amp; data</div>
          <button className="sf-link" onClick={onCite}><Icon name="book" size={13} /> Citation</button>
          <a className="sf-link" href="https://www.linkedin.com/in/ahmed-benhoumane/" target="_blank" rel="noopener noreferrer">
            <Icon name="linkedin" size={13} /> Contact for data
          </a>
          <div className="sf-meta">
            <span className="sf-pill"><span className="sf-pill-dot" /> Peer-reviewed</span>
            <span className="sf-pill">Open methodology</span>
          </div>
        </div>

        <div className="sf-col sf-cta-col">
          <div className="sf-h">Try it</div>
          <p className="sf-cta-p">Paste a draft. Get a research-backed read in seconds.</p>
          <button className="pill-btn primary" onClick={() => onChoose('test')}>
            <Icon name="sparkle" size={14} /> Start with a post
          </button>
          <button className="pill-btn" onClick={() => onChoose('campaign')} style={{ marginTop: 8 }}>
            <Icon name="chart" size={14} /> Or plan a campaign
          </button>
        </div>
      </div>

      <div className="sf-bottom">
        <div className="sf-bottom-left">
          © {year} Benhoumane &amp; Manthé · Fundraising Engagement Simulator. Predictions are statistical estimates, not guarantees.
        </div>
        <div className="sf-bottom-right">
          <button className="sf-mini" onClick={onCite}>Citation &amp; data</button>
          <span className="sf-mini-sep">·</span>
          <button className="sf-mini" onClick={onAbout}>About</button>
          <span className="sf-mini-sep">·</span>
          <a className="sf-mini" href="https://www.linkedin.com/in/ahmed-benhoumane/" target="_blank" rel="noopener noreferrer">Contact</a>
        </div>
      </div>
    </footer>);

}

// ════════════════════════════════════════════════════════════════════
// TEST-A-POST FLOW
// ════════════════════════════════════════════════════════════════════

function TestFlow({ onExit, openSimulator, onCampaign, lang }) {
  const [userType, setUserType] = useStateF('Individual');
  const [followers, setFollowers] = useStateF(5000);
  const [verified, setVerified] = useStateF(false);
  const [dateChoice, setDateChoice] = useStateF('today');
  const [orgNudge, setOrgNudge] = useStateF(false);

  const dateOptions = useMemoF(() => buildDateOptions(), [lang]);

  const pickWho = (value) => {
    setUserType(value);
    if (value === 'Organization') { setOrgNudge(true); }
  };

  const goSim = () => {
    const date = dateOptions.find((d) => d.id === dateChoice) || dateOptions[0];
    openSimulator({
      userType, followers, verified,
      hour: date.hour, weekend: date.weekend, quarter: date.quarter, daysSinceStart: 1400
    });
  };

  const whoOpts = [
  { value: 'Individual', icon: 'users', title: 'Individual', tag: 'Travels further' },
  { value: 'Organization', icon: 'shield', title: 'Organization', tag: 'Trusted, quieter' },
  { value: 'Ambiguous', icon: 'info', title: 'In between', tag: 'Neutral baseline' }];

  return (
    <FlowShell
      title={T("Set the context")}
      sub={T("The study's four control variables — who posts, and when. Set each, then open the simulator.")}
      onBack={onExit} backLabel={T("← Back to home")}>

      <div className="ctx-row">
        {/* 1 · Who's posting */}
        <div className="ctx-square">
          <div className="ctx-head"><Icon name="users" size={15} color="var(--accent)" /> {T("Who's posting")}</div>
          <div className="ctx-who-opts">
            {whoOpts.map((o) =>
            <button key={o.value} className={`ctx-who ${userType === o.value ? 'on' : ''}`} onClick={() => pickWho(o.value)}>
                <div className="ctx-who-ic"><Icon name={o.icon} size={16} /></div>
                <div className="ctx-who-txt">
                  <span className="ctx-who-title">{T(o.title)}</span>
                  <span className="ctx-who-tag">{T(o.tag)}</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* 2 · Audience size */}
        <div className="ctx-square">
          <div className="ctx-head"><Icon name="chart" size={15} color="var(--accent)" /> {T("Audience size")}</div>
          <div className="ctx-square-body">
            <input
              className="ctx-bignum-input"
              type="text"
              inputMode="numeric"
              aria-label="Audience size"
              value={followers.toLocaleString()}
              onChange={(e) => {
                const n = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
                setFollowers(isNaN(n) ? 0 : Math.min(10000000, n));
              }}
              onBlur={(e) => {
                if (followers < 100) setFollowers(100);
              }}
            />
            <div className="ctx-sub">{T("followers (or supporters) — type or drag")}</div>
            <Slider value={followers} onChange={setFollowers} min={100} max={10000000} step={100} leftLabel="100" rightLabel="10M+" />
          </div>
        </div>

        {/* 3 · Verified */}
        <div className="ctx-square">
          <div className="ctx-head"><Icon name="star" size={15} color="var(--accent)" /> {T("Verified account")}</div>
          <div className="ctx-square-body">
            <p className="ctx-note">{T("Verified accounts see ~3× the reach of unverified ones — a strong audience-trust signal.")}</p>
            <div className="ctx-stack-seg">
              <Segment value={verified ? 'yes' : 'no'} onChange={(v) => setVerified(v === 'yes')} options={[{ value: 'yes', label: T('Yes, verified') }, { value: 'no', label: T('Not verified') }]} />
            </div>
          </div>
        </div>

        {/* 4 · Timing */}
        <div className="ctx-square">
          <div className="ctx-head"><Icon name="calendar" size={15} color="var(--accent)" /> {T("When publishing")}</div>
          <div className="ctx-square-body">
            <div className="ctx-dates">
              {dateOptions.map((d) =>
              <button key={d.id} className={`date-option compact ${dateChoice === d.id ? 'on' : ''}`} onClick={() => setDateChoice(d.id)}>
                  <div className="date-label">{T(d.label)}</div>
                  <div className="date-sub">{d.sub}</div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="ctx-actions">
        <span className="ctx-summary">
          {T("Posting as")} <strong>{T(userType)}</strong> · {verified ? T('verified') : T('unverified')} · {T((dateOptions.find((d) => d.id === dateChoice) || {}).label || '')}
        </span>
        <button className="pill-btn primary" onClick={goSim}>
          {T("Open simulator")} <Icon name="arrowRight" size={14} />
        </button>
      </div>

      {orgNudge &&
      <OrgNudgeModal
        onClose={() => setOrgNudge(false)}
        onCampaign={() => { setOrgNudge(false); onCampaign && onCampaign(); }}
        onContinue={() => setOrgNudge(false)} />
      }
    </FlowShell>);

}

// ─── Flow shell with side rail step indicator ────────────
function FlowShell({ title, sub, onBack, backLabel, children, breadcrumb }) {
  return (
    <div className="flow-shell">
      <div className="flow-head">
        <div className="flow-back-row">
          <button className="flow-back" onClick={onBack}>{backLabel || T('← Back')}</button>
          {breadcrumb && breadcrumb.length > 0 &&
          <div className="flow-breadcrumb">
              {breadcrumb.map((b, i) =>
            <span key={i} className="fb-pill">
                  <span className="fb-label">{b.label}:</span>
                  <span className="fb-value">{b.value}</span>
                </span>
            )}
            </div>
          }
        </div>
        <h1 className="flow-title">{title}</h1>
        {sub && <p className="flow-sub">{sub}</p>}
      </div>
      <div className="flow-body">{children}</div>
    </div>);

}

// ─── Organization → campaign nudge ───────────────────────
function OrgNudgeModal({ onClose, onCampaign, onContinue }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <button className="modal-close" onClick={onClose}><Icon name="x" /></button>
        <div className="org-nudge-ic"><Icon name="chart" size={20} /></div>
        <span className="tag">{T("Posting as an organization")}</span>
        <h2 style={{ marginTop: 8 }}>{T("Campaign mode may fit better")}</h2>
        <p style={{ color: 'var(--ink-3)', fontSize: 14, lineHeight: 1.6, margin: '8px 0 22px' }}>
          {T("Account type is a control variable in the study, and organizational accounts behave differently from individuals. When you're posting as an org, comparing several drafts around one objective is usually more useful than testing a single post.")}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="pill-btn primary" onClick={onCampaign}>
            <Icon name="chart" size={14} /> {T("Try campaign mode")}
          </button>
          <button className="pill-btn" onClick={onContinue}>
            <Icon name="edit" size={14} /> {T("Test one post anyway")}
          </button>
        </div>
      </div>
    </div>);

}

// ════════════════════════════════════════════════════════════════════
// CAMPAIGN MODE FLOW
// ════════════════════════════════════════════════════════════════════

const CAMPAIGN_SEEDS = {
  shares: [
  "Together, we can change this. Today, 2,300 families in our city face eviction. Our community has done it before — share this and someone you know will step up.",
  "One photo. One story. One child's name. That's all it took last year — and 4,200 of you shared it. Help us do it again. Share if you believe everyone deserves a safe home.",
  "We're not asking for money this time. We're asking you to share. Every retweet reaches an average of 287 new people — your share is the campaign."],

  engagement: [
  "Meet Amara — 8 years old, top of her class, and the first in her family to dream of college. Your support gets her there. Tap the link to learn how.",
  "Three meals. One safe bed. A chance to start over. That's what $25 provides today. We're $8,400 away from our weekend goal — help us close the gap.",
  "From all of us at the shelter — thank you. Your kindness this month fed 1,200 people and kept 47 families warm. Here's what's next."],

  comments: [
  "What does 'home' mean to you? Tell us in the comments — we'll read every one, and your words will shape next year's program.",
  "We need your advice. We have $50,000 to invest in either after-school programs or weekend meals. Which do you think matters more, and why?",
  "Honest question for our community: what's the biggest barrier you've seen to people getting help? Drop your thoughts below — we're listening."]

};

const CAMPAIGN_SEEDS_FR = {
  shares: [
  "Ensemble, nous pouvons changer cela. Aujourd'hui, 2 300 familles de notre ville risquent l'expulsion. Notre communauté l'a déjà fait — partagez ceci et quelqu'un que vous connaissez se mobilisera.",
  "Une photo. Une histoire. Le prénom d'un enfant. C'est tout ce qu'il a fallu l'an dernier — et 4 200 d'entre vous l'ont partagé. Aidez-nous à recommencer. Partagez si vous croyez que chacun mérite un foyer sûr.",
  "Cette fois, nous ne demandons pas d'argent. Nous vous demandons de partager. Chaque repartage touche en moyenne 287 nouvelles personnes — votre partage, c'est la campagne."],

  engagement: [
  "Voici Amara — 8 ans, première de sa classe, et la première de sa famille à rêver d'université. Votre soutien l'y conduit. Cliquez sur le lien pour découvrir comment.",
  "Trois repas. Un lit sûr. Une chance de repartir. Voilà ce que 25 € offrent aujourd'hui. Il nous manque 8 400 € pour atteindre notre objectif du week-end — aidez-nous à combler l'écart.",
  "De la part de toute l'équipe du refuge — merci. Votre générosité ce mois-ci a nourri 1 200 personnes et gardé 47 familles au chaud. Voici la suite."],

  comments: [
  "Que signifie « chez soi » pour vous ? Dites-le en commentaire — nous lirons chacun d'eux, et vos mots façonneront le programme de l'an prochain.",
  "Nous avons besoin de votre avis. Nous avons 50 000 € à investir dans les programmes périscolaires ou les repas du week-end. Lequel compte le plus selon vous, et pourquoi ?",
  "Question sincère à notre communauté : quel est le plus grand obstacle que vous ayez vu à l'accès à l'aide ? Partagez vos pensées ci-dessous — nous vous écoutons."]

};

function CampaignFlow({ onExit, openSimulator }) {
  const [step, setStep] = useStateF('goal');
  const [goal, setGoal] = useStateF(null);
  const [messages, setMessages] = useStateF([]);
  const [showObjectives, setShowObjectives] = useStateF(false);

  if (step === 'goal') {
    return (
      <FlowShell title={T("What's the campaign goal?")} sub={T("Review the engagement funnel, then choose the objective that matches where your campaign is. Campaign mode is for organizations.")} onBack={onExit} backLabel={T("← Back to home")}>
        <button className="objective-cta" onClick={() => setShowObjectives(true)}>
          <span className="oc-left">
            <span className="oc-ic"><Icon name="chart" size={16} /></span>
            <span className="oc-txt">
              <span className="oc-title">{T("Choose an objective")}</span>
              <span className="oc-sub">{T("Shares, engagement, or conversation — pick where to aim")}</span>
            </span>
          </span>
          <span className="oc-go">{T("Open")} <Icon name="arrowRight" size={13} /></span>
        </button>

        <div className="funnel">
          <div className="funnel-head">
            <div className="funnel-head-ic"><Icon name="flask" size={15} /></div>
            <div>
              <h3>{T("The engagement funnel")}</h3>
              <p>{T("Each goal maps to a distinct engagement behavior in the study. They aren't interchangeable — pick the one that matches where your campaign is.")}</p>
            </div>
          </div>
          <div className="funnel-steps">
            {[
            { n: '1', metric: 'Likes', title: 'Visibility', body: 'Low-friction public reaction and social proof.', flow: ['Seen', 'Noticed', 'Liked'], color: 'var(--likes)' },
            { n: '2', metric: 'Shares', title: 'Diffusion', body: 'The appeal travels beyond your existing audience.', flow: ['Noticed', 'Shared', 'New reach'], color: 'var(--shares)', strong: true },
            { n: '3', metric: 'Comments', title: 'Dialogue', body: 'Deeper involvement and supporter expression.', flow: ['Involved', 'Commented', 'Conversation'], color: 'var(--comments)' }].
            map((s, i, arr) =>
            <React.Fragment key={s.n}>
                <div className={`funnel-step ${s.strong ? 'strong' : ''}`} style={{ '--c': s.color }}>
                  <div className="fs-top">
                    <span className="fs-n">{s.n}</span>
                    <span className="fs-metric">{T(s.metric)}</span>
                  </div>
                  <div className="fs-title">{T(s.title)}</div>
                  <p className="fs-body">{T(s.body)}</p>
                  <div className="fs-flow">
                    {s.flow.map((step, j) =>
                  <React.Fragment key={j}>
                        <span className="fs-chip">{T(step)}</span>
                        {j < s.flow.length - 1 && <span className="fs-arrow">→</span>}
                      </React.Fragment>
                  )}
                  </div>
                </div>
                {i < arr.length - 1 && <div className="funnel-connect"><Icon name="arrowRight" size={14} /></div>}
              </React.Fragment>
            )}
          </div>
          <div className="funnel-note">
            <Icon name="info" size={13} />
            <span>{T("The study measures")} <strong>{T("engagement, not donations")}</strong>{T(". When the goal is fundraising reach, diffusion (shares) is usually the most strategic target — it's what carries an appeal into new networks.")}</span>
          </div>
        </div>

        {showObjectives && (
          <div className="modal-backdrop" onClick={() => setShowObjectives(false)}>
            <div className="modal objectives-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowObjectives(false)}><Icon name="x" /></button>
              <span className="tag">{T("Choose an objective")}</span>
              <h2 style={{ marginTop: 8 }}>{T("Where should this campaign aim?")}</h2>
              <p style={{ color: 'var(--ink-3)', margin: '4px 0 20px', fontSize: 13.5 }}>{T("Each maps to a distinct engagement behavior in the study. Pick the one that matches where your campaign is.")}</p>
              <div className="goal-grid">
                {[
                { id: 'shares', icon: 'repeat', color: 'var(--shares)', title: 'Maximise shares', desc: 'Build network reach. Often the most useful goal for campaigns trying to grow beyond their existing audience.', recommended: true },
                { id: 'engagement', icon: 'heart', color: 'var(--likes)', title: 'Drive engagement', desc: 'Likes, shares, and comments combined. Good when you have an existing audience to activate.', recommended: false },
                { id: 'comments', icon: 'chat', color: 'var(--comments)', title: 'Spark conversation', desc: 'Build dialogue. Best when your goal is shifting opinion, gathering input, or community-building.', recommended: false }].
                map((g) =>
                <button key={g.id} className="goal-card clickable" style={{ '--c': g.color }} onClick={() => {
                  const seeds = (window.getLang() === 'fr' ? CAMPAIGN_SEEDS_FR : CAMPAIGN_SEEDS)[g.id];
                  setGoal(g.id);
                  setMessages(seeds.map((t, i) => ({ id: i + 1, text: t })));
                  setShowObjectives(false);
                  setStep('builder');
                }}>
                    {g.recommended && <div className="goal-rec">{T("Recommended")}</div>}
                    <div className="goal-icon" style={{ color: g.color }}><Icon name={g.icon} size={22} /></div>
                    <h3>{T(g.title)}</h3>
                    <p>{T(g.desc)}</p>
                    <div className="goal-cta" style={{ color: g.color }}>{T("Start the campaign")} <Icon name="arrowRight" size={12} /></div>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </FlowShell>);

  }

  if (step === 'builder') {
    return <CampaignBuilder goal={goal} messages={messages} setMessages={setMessages} onBack={() => setStep('goal')} />;
  }

  return null;
}

// ─── Campaign Builder ─────────────────────────────────────
function CampaignBuilder({ goal, messages, setMessages, onBack }) {
  const [ctx, setCtx] = useStateF({ userType: 'Organization', followers: 25000, verified: true, hour: 10, weekend: false, quarter: 3, daysSinceStart: 1400 });
  const goalKey = goal === 'shares' ? 'Shares' : goal === 'comments' ? 'Comments' : 'Likes';
  const goalColor = goal === 'shares' ? 'var(--shares)' : goal === 'comments' ? 'var(--comments)' : 'var(--likes)';

  const fmtFollowers = (n) => n >= 1000000 ? `${(n / 1000000).toFixed(n >= 10000000 ? 0 : 1)}M` : n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : n;
  const QUARTERS = [
  { v: 1, label: 'Q1', sub: 'Baseline' },
  { v: 2, label: 'Q2', sub: 'Spring' },
  { v: 3, label: 'Q3', sub: 'Summer · peak' },
  { v: 4, label: 'Q4', sub: 'Year-end' }];
  const preds = messages.map((m) => fullPredict(m.text, ctx, 0.95));
  const maxVal = Math.max(...preds.map((p) => p.trivial ? 0 : p[goalKey].high), 1);
  const bestIdx = preds.reduce((bi, p, i) => !p.trivial && (preds[bi].trivial || p[goalKey].high > preds[bi][goalKey].high) ? i : bi, 0);

  const updateMsg = (i, text) => {
    const next = [...messages];next[i] = { ...next[i], text };setMessages(next);
  };
  const removeMsg = (i) => setMessages(messages.filter((_, j) => j !== i));
  const addMsg = () => setMessages([...messages, { id: Date.now(), text: '' }]);

  return (
    <div className="flow-shell">
      <div className="flow-head campaign-head">
        <button className="bottom-link" onClick={onBack}>{T("← Change goal")}</button>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <h1 className="flow-title">{T("Campaign:")} <span style={{ color: goalColor }}>{goal === 'shares' ? T('Maximize shares') : goal === 'comments' ? T('Spark conversation') : T('Drive engagement')}</span></h1>
          <span className="tag">{T("Comparing")} {messages.length} {T("drafts")}</span>
        </div>
        <p className="flow-sub">{T("Edit each draft. The chart at the bottom compares predicted")} {T(goalKey).toLowerCase()} {T("side by side — your best draft is highlighted in real time.")}</p>
      </div>

      <div className="campaign-context">
        <div className="cc-org"><span className="cc-org-ic"><Icon name="shield" size={14} /></span> {T("Posting as an")} <strong>{T("organization")}</strong></div>
        <div className="cc-fields">
          <div className="cc-field cc-field-wide">
            <div className="cc-label"><Icon name="users" size={13} color="var(--accent)" /> {T("Audience size")}
              <input
                className="cc-readout cc-readout-input"
                type="text"
                inputMode="numeric"
                aria-label={T("Audience size")}
                value={ctx.followers.toLocaleString()}
                onChange={(e) => {
                  const n = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
                  setCtx({ ...ctx, followers: isNaN(n) ? 0 : Math.min(10000000, n) });
                }}
                onBlur={() => { if (ctx.followers < 100) setCtx({ ...ctx, followers: 100 }); }}
              />
            </div>
            <Slider value={ctx.followers} onChange={(v) => setCtx({ ...ctx, followers: v })} min={100} max={10000000} step={100} leftLabel="100" rightLabel="10M+" />
          </div>
          <div className="cc-field">
            <div className="cc-label"><Icon name="star" size={13} color="var(--accent)" /> {T("Verified")}</div>
            <Segment value={ctx.verified ? 'yes' : 'no'} onChange={(v) => setCtx({ ...ctx, verified: v === 'yes' })} options={[{ value: 'yes', label: T('Verified') }, { value: 'no', label: T('Not verified') }]} />
          </div>
          <div className="cc-field">
            <div className="cc-label"><Icon name="calendar" size={13} color="var(--accent)" /> {T("Season")}</div>
            <div className="cc-quarters">
              {QUARTERS.map((q) =>
              <button key={q.v} className={`cc-quarter ${ctx.quarter === q.v ? 'on' : ''}`} onClick={() => setCtx({ ...ctx, quarter: q.v })} title={q.sub}>
                  {q.label}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <CampaignGuidance goal={goal} />

      <div className="campaign-grid">
        {messages.map((m, i) =>
        <CampaignDraftCard
          key={m.id}
          idx={i + 1}
          isBest={i === bestIdx && !preds[i].trivial}
          text={m.text}
          onChange={(t) => updateMsg(i, t)}
          onRemove={messages.length > 1 ? () => removeMsg(i) : null}
          pred={preds[i]}
          goalKey={goalKey}
          goalColor={goalColor} />

        )}
        <button className="campaign-add" onClick={addMsg} disabled={messages.length >= 6}>
          <Icon name="edit" size={18} />
          <span>{messages.length >= 6 ? T('Max 6 drafts') : T('Add another draft')}</span>
        </button>
      </div>

      <div className="compare-panel">
        <div className="compare-head">
          <h3>{T("Predicted")} {T(goalKey).toLowerCase()} {T("· side by side")}</h3>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{T("95% confidence interval")}</div>
        </div>
        <div className="compare-bars">
          {messages.map((m, i) => {
            const p = preds[i];
            if (p.trivial) return (
              <div key={m.id} className="compare-bar empty">
                <div className="cb-label">{T("Draft")} {i + 1}</div>
                <div className="cb-empty">{T("empty")}</div>
              </div>);

            const lowPct = p[goalKey].low / maxVal;
            const highPct = p[goalKey].high / maxVal;
            return (
              <div key={m.id} className={`compare-bar ${i === bestIdx ? 'best' : ''}`}>
                <div className="cb-label">
                  {T("Draft")} {i + 1} {i === bestIdx && <span className="cb-best">{T("★ best")}</span>}
                </div>
                <div className="cb-track">
                  <div className="cb-fill range" style={{ left: `${lowPct * 100}%`, width: `${(highPct - lowPct) * 100}%`, background: goalColor }} />
                </div>
                <div className="cb-num" style={{ color: goalColor }}>
                  <span className="cb-range-big">{Math.round(p[goalKey].low).toLocaleString()}–{Math.round(p[goalKey].high).toLocaleString()}</span>
                </div>
              </div>);

          })}
        </div>
      </div>
    </div>);

}

// ─── Per-draft, research-driven recommendations ──────────
// Reads the draft's detected signals and tailors advice to the active goal,
// using the direction of the Benhoumane & Manthé (2025) coefficients.
function draftRecos(f, goalKey, text) {
  const hasQ = /\?/.test(text || '');
  const recs = [];
  const add = (kind, t) => recs.push({ kind, t });

  if (goalKey === 'Shares') {
    if (!f.Neg) add('add', 'Name a specific hardship. Negative, emotionally-charged stories are the strongest driver of shares.');
    else add('good', 'Hardship detected — the single biggest lift for shares.');
    if (!f.Inc) add('add', 'Open with “Together” or “Join us.” Collective framing is what uniquely makes people share (≈ +25%).');
    else add('good', 'Collective framing present — encourages re-sharing.');
    if (f.Neg && !f.Urg) add('add', 'Add a time peg (“before midnight”). Urgency compounds with hardship to push shares higher.');
    if (f.Pos && !f.Neg) add('avoid', 'Pure positivity underperforms for shares — anchor the hope to the problem it solves.');
    if (f.Inf && !f.Neg) add('avoid', 'Dry facts dampen sharing. Lead with feeling; keep stats to one line.');
    if (f.hash > 2) add('avoid', window.getLang() === 'fr' ? `R\u00e9duisez les hashtags (${f.hash} actuellement) \u2014 chacun abaisse l\u00e9g\u00e8rement la port\u00e9e.` : `Trim hashtags (${f.hash} now) — each one slightly lowers reach.`);
  } else if (goalKey === 'Comments') {
    if (f.emoji === 0) add('add', 'Add 1–2 emojis — they lift comments by ~65%. Keep it under five.');
    else if (f.emoji > 5) add('avoid', window.getLang() === 'fr' ? `Trop d'emojis (${f.emoji}). Au-del\u00e0 de cinq, ils r\u00e9duisent fortement les commentaires.` : `Too many emojis (${f.emoji}). Past five they sharply suppress comments.`);
    else add('good', window.getLang() === 'fr' ? `${f.emoji} emoji${f.emoji > 1 ? 's' : ''} \u2014 pile dans la zone id\u00e9ale pour les commentaires.` : `${f.emoji} emoji${f.emoji > 1 ? 's' : ''} — right in the sweet spot for comments.`);
    if (!hasQ) add('add', 'Ask a question tied to feeling — “what breaks your heart about this?” draws far more replies than a statement.');
    else add('good', 'You’re asking a question — invites dialogue.');
    if (!f.Neg) add('add', 'Lead with an emotional hook. Hardship is the strongest content driver of comments.');
    if (f.Urg && !f.Neg) add('avoid', 'Urgency without emotion suppresses comments — pair the deadline with a human story.');
    if (f.Inc && !hasQ) add('avoid', 'Collective framing alone slightly lowers comments — combine it with a direct question.');
  } else { // Likes / engagement
    if (!f.Neg) add('add', 'Add a real hardship. Negative emotion is the single biggest lift for overall engagement.');
    else add('good', 'Hardship detected — strongest driver of engagement.');
    if (f.Pos && !f.Inf) add('add', 'Pair your hopeful note with a concrete number — hope + facts together lift likes.');
    if (f.Pos && !f.Neg && !f.Inf) add('avoid', 'Pure positivity underperforms — ground it in the problem or a stat.');
    if (f.Inf && !f.Pos && !f.Neg) add('avoid', 'Numbers on their own depress likes — wrap them in emotion.');
    if (f.Urg && !f.Neg) add('avoid', 'Urgency works best beside hardship; alone it slightly lowers likes.');
    if (f.emoji === 0) add('add', 'A couple of emojis nudge engagement up.');
  }

  // surface the most useful items: improvements first, then up to one confirmation
  const improves = recs.filter((r) => r.kind !== 'good');
  const goods = recs.filter((r) => r.kind === 'good');
  return [...improves, ...goods].slice(0, 3);
}

function CampaignDraftCard({ idx, isBest, text, onChange, onRemove, pred, goalKey, goalColor }) {
  return (
    <div className={`draft-card ${isBest ? 'best' : ''}`}>
      <div className="draft-head">
        <div className="draft-idx">{T("Draft")} {idx}</div>
        {isBest && <span className="draft-best">{T("★ Best")}</span>}
        {onRemove && <button className="draft-x" onClick={onRemove} title={T("Remove draft")}><Icon name="x" size={14} /></button>}
      </div>
      <textarea value={text} onChange={(e) => onChange(e.target.value)} placeholder={T("Write or paste this draft...")} />
      <div className="draft-foot">
        {pred.trivial ?
        <div className="draft-pending">{T("Write to see prediction")}</div> :

        <>
            <div className="draft-pred">
              <div className="dp-label">{T("Likely")} {T(goalKey).toLowerCase()}</div>
              <div className="dp-val" style={{ color: goalColor }}>
                {Math.round(pred[goalKey].low).toLocaleString()}<span className="dp-dash">–</span>{Math.round(pred[goalKey].high).toLocaleString()}
              </div>
              <div className="dp-range">{T("around")} {Math.round(pred[goalKey].med).toLocaleString()}</div>
            </div>
            <div className="draft-signals">
              {['Neg', 'Inc', 'Urg', 'Pos', 'Inf'].map((k) =>
            <div key={k} className={`mini-signal ${pred.features[k] ? 'on' : ''}`} title={k}>{k.charAt(0)}</div>
            )}
            </div>
          </>
        }
      </div>
      {!pred.trivial && (() => {
        const recs = draftRecos(pred.features, goalKey, text);
        if (!recs.length) return null;
        const ic = { add: 'plus', avoid: 'alert', good: 'check' };
        return (
          <div className="draft-recos">
            <div className="dr-head"><Icon name="sparkle" size={12} /> {T("Tailored to this draft")}</div>
            {recs.map((r, i) =>
              <div key={i} className={`dr-item dr-${r.kind}`}>
                <span className="dr-ic"><Icon name={ic[r.kind]} size={12} /></span>
                <span className="dr-t">{T(r.t)}</span>
              </div>
            )}
          </div>
        );
      })()}
    </div>);

}

function CampaignGuidance({ goal }) {
  const tips = {
    shares: [
    { icon: 'users', t: 'Open with "Together" or "Join us"', d: 'Collective framing uniquely boosts shares (+25%). Lead with it.' },
    { icon: 'heart', t: 'Make the emotion specific', d: 'Vague feelings don\'t spread. "A mother\'s fear of an empty fridge" travels further than "many people are struggling."' },
    { icon: 'bolt', t: 'One ask per post', d: 'Multiple asks split attention. Pick the share-able one and run with it.' }],

    engagement: [
    { icon: 'sparkle', t: 'Move between emotions', d: 'The highest-converting blend is sadness or worry resolved by hope — or a moment of awe at what a gift changes.' },
    { icon: 'heart', t: 'Use a name and a number', d: 'Specifics make feelings real. "Amara, 8" makes people care; "a child" doesn\'t.' },
    { icon: 'clock', t: 'Vary the feeling across drafts', d: 'Lead one draft with compassion, one with hope, one with a gentle pang of guilt — different feelings reach different people.' }],

    comments: [
    { icon: 'chat', t: 'Ask a question that stirs feeling', d: 'Questions tied to an emotion — "what breaks your heart about this?" — draw far more comments than neutral ones.' },
    { icon: 'users', t: 'Invite dialogue, not validation', d: 'Avoid yes/no framings. "What does X mean to you?" works better than "Do you agree?"' },
    { icon: 'sparkle', t: 'Add 1–2 emojis', d: 'Emojis lift comments by 65% — but more than 5 backfires sharply.' }]

  };
  return (
    <div className="guidance">
      <div className="guidance-head"><Icon name="book" size={14} /> {T("Research-led tips for this goal")}</div>
      <div className="guidance-grid">
        {tips[goal].map((tip, i) =>
        <div key={i} className="guidance-card">
            <div className="g-icon"><Icon name={tip.icon} size={14} /></div>
            <div>
              <div className="g-t">{T(tip.t)}</div>
              <div className="g-d">{T(tip.d)}</div>
            </div>
          </div>
        )}
      </div>
    </div>);

}

Object.assign(window, {
  LandingView, TestFlow, CampaignFlow, EmojiPicker, FlowShell, OrgNudgeModal, buildDateOptions
});