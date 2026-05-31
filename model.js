// ════════════════════════════════════════════════════════════════════
// Fundraising Engagement Model
// Coefficients from Benhoumane & Manthé (2025), N=18,257 fundraising tweets
// Negative Binomial regression — predicts Likes / Shares / Comments
// ════════════════════════════════════════════════════════════════════

(function() {

const COEFS = {
  Likes: {
    intercept: 4.087, Informativeness: -0.394, Positive_emotiveness: -0.523,
    Negative_emotiveness: 0.712, Urgency: -0.139, Inclusiveness: -0.068,
    Pos_x_Neg: -0.101, Inf_x_Pos: 0.476, Inf_x_Neg: -0.360,
    Urg_x_Pos: 0.131, Urg_x_Neg: 0.378, Urg_x_Inc: -0.114,
    Length_c: 0.001, Hashtags: -0.122, Emojis_lin: 0.258, Emojis_sq: -0.021,
    LogFollowers_c: 0.036, Type_Org: -0.196, Type_NotSure: 0.047, Verified: 1.085,
    DaysSinceStart_c: 0.002, Hour_c: -0.015, Weekend: 0.094,
    Q2: -0.475, Q3: 0.687, Q4: 0.364,
  },
  Shares: {
    intercept: 2.422, Informativeness: -0.300, Positive_emotiveness: -0.674,
    Negative_emotiveness: 0.613, Urgency: -0.122, Inclusiveness: 0.225,
    Pos_x_Neg: 0.050, Inf_x_Pos: 0.201, Inf_x_Neg: 0.029,
    Urg_x_Pos: 0.332, Urg_x_Neg: 0.421, Urg_x_Inc: -0.146,
    Length_c: 0.001, Hashtags: -0.093, Emojis_lin: 0.144, Emojis_sq: -0.025,
    LogFollowers_c: 0.040, Type_Org: -0.099, Type_NotSure: -0.031, Verified: 0.606,
    DaysSinceStart_c: 0.003, Hour_c: 0.000, Weekend: 0.182,
    Q2: 0.370, Q3: 1.762, Q4: 1.359,
  },
  Comments: {
    intercept: 0.874, Informativeness: 0.083, Positive_emotiveness: 0.084,
    Negative_emotiveness: 0.506, Urgency: -0.292, Inclusiveness: -0.297,
    Pos_x_Neg: -0.183, Inf_x_Pos: -0.153, Inf_x_Neg: 0.042,
    Urg_x_Pos: 0.024, Urg_x_Neg: 0.308, Urg_x_Inc: 0.228,
    Length_c: 0.002, Hashtags: -0.026, Emojis_lin: 0.656, Emojis_sq: -0.095,
    LogFollowers_c: 0.022, Type_Org: -0.261, Type_NotSure: 0.093, Verified: 1.069,
    DaysSinceStart_c: 0.001, Hour_c: -0.010, Weekend: 0.052,
    Q2: -0.285, Q3: 0.210, Q4: 0.201,
  }
};

const ALPHA = { Likes: 2.36, Shares: 2.56, Comments: 2.96 };
const SAMPLE = {
  meanLength: 217.76, meanEmojis: 0.106, meanLogFollowers: 5.336,
  meanDaysSinceStart: 1089.5, meanHour: 10.4
};

// Heuristic detectors for the 5 message signals
const URG_RE = [/\btoday\b/i, /\btonight\b/i, /\bright now\b/i, /\blast chance\b/i, /\bdeadline\b/i, /\bmidnight\b/i, /\bbefore\b.{0,20}\b(ends?|closes?|tomorrow)\b/i, /\burgent\b/i, /\bnow\b/i, /\baujourd'?hui\b/i, /\bce soir\b/i, /\bmaintenant\b/i, /\bderni\u00e8re chance\b/i, /\b\u00e9ch\u00e9ance\b/i, /\bminuit\b/i, /\bavant (la fin|minuit|demain|ce soir)\b/i, /\bd\u00e8s maintenant\b/i];
const NEG_RE = [/\bsuffering\b/i, /\bheartbroken\b/i, /\bdevastat\w*/i, /\bstarv\w*/i, /\bdying\b/i, /\bcancer\b/i, /\bcrisis\b/i, /\bhardship\b/i, /\bunimaginable\b/i, /\btragic\w*/i, /\blost\b/i, /\bpain\b/i, /\bdesperate\b/i, /\bsick\b/i, /\bsouffr\w*/i, /\bd\u00e9vast\w*/i, /\baffam\w*/i, /\bfamine\b/i, /\bmour\w*/i, /\bmeur\w*/i, /\bcrise\b/i, /\bd\u00e9tresse\b/i, /\btragiqu\w*/i, /\bdouleur\b/i, /\bd\u00e9sespoir\b/i, /\bd\u00e9sesp\u00e9r\w*/i, /\bmalade\b/i, /\bsans-?abri\b/i, /\bexpulsion\b/i];
const POS_RE = [/\bgrateful\b/i, /\bthank\b/i, /\bhope\b/i, /\blove\b/i, /\bamazing\b/i, /\bblessed\b/i, /\bjoy\b/i, /\bcelebrat\w*/i, /\binspir\w*/i, /\breconnaissant\w*/i, /\bmerci\b/i, /\bespoir\b/i, /\besp\u00e8r\w*/i, /\besper\w*/i, /\bamour\b/i, /\baime\b/i, /\bincroyable\b/i, /\bjoie\b/i, /\bc\u00e9l\u00e9br\w*/i, /\bb\u00e9ni\w*/i];
const INF_RE = [/\$\d+/, /\b\d+\s*\u20ac/, /\u20ac\s*\d+/, /\b\d+%\b/, /\b\d+\s*(children|families|people|kids|meals|homes|nights|enfants|familles|personnes|repas|foyers|nuits|b\u00e9n\u00e9voles)\b/i, /\b\d{2,}\b/];
const INC_RE = [/\bjoin (us|our|me)\b/i, /\bstand with (us|me)\b/i, /\btogether\b/i, /\bcommunity\b/i, /\bwe can\b/i, /\bour\b.{0,30}\b(mission|cause|family)\b/i, /\brejoignez(-| )(nous|moi)\b/i, /\bensemble\b/i, /\bcommunaut\u00e9\b/i, /\bnous pouvons\b/i, /\bsoutenez(-| )nous\b/i, /\bnotre\b.{0,30}\b(mission|cause|famille)\b/i];

function detect(t) {
  return {
    Inf: INF_RE.some(p => p.test(t)) ? 1 : 0,
    Pos: POS_RE.some(p => p.test(t)) ? 1 : 0,
    Neg: NEG_RE.some(p => p.test(t)) ? 1 : 0,
    Urg: URG_RE.some(p => p.test(t)) ? 1 : 0,
    Inc: INC_RE.some(p => p.test(t)) ? 1 : 0,
    len: t.length,
    hash: (t.match(/#\w+/g) || []).length,
    emoji: (t.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu) || []).length,
  };
}

function predictMu(f, ctx, out) {
  const c = COEFS[out];
  let eta = c.intercept
    + c.Informativeness * f.Inf + c.Positive_emotiveness * f.Pos
    + c.Negative_emotiveness * f.Neg + c.Urgency * f.Urg + c.Inclusiveness * f.Inc;
  eta += c.Pos_x_Neg * f.Pos * f.Neg + c.Inf_x_Pos * f.Inf * f.Pos
    + c.Inf_x_Neg * f.Inf * f.Neg + c.Urg_x_Pos * f.Urg * f.Pos
    + c.Urg_x_Neg * f.Urg * f.Neg + c.Urg_x_Inc * f.Urg * f.Inc;
  eta += c.Length_c * (f.len - SAMPLE.meanLength)
    + c.Hashtags * f.hash
    + c.Emojis_lin * (f.emoji - SAMPLE.meanEmojis)
    + c.Emojis_sq * Math.pow(f.emoji - SAMPLE.meanEmojis, 2);
  const lf = Math.log1p(Math.max(0, ctx.followers));
  eta += c.LogFollowers_c * (lf - SAMPLE.meanLogFollowers)
    + (ctx.userType === 'Organization' ? c.Type_Org : ctx.userType === 'Ambiguous' ? c.Type_NotSure : 0)
    + (ctx.verified ? c.Verified : 0)
    + c.DaysSinceStart_c * (ctx.daysSinceStart - SAMPLE.meanDaysSinceStart)
    + c.Hour_c * (ctx.hour - SAMPLE.meanHour)
    + (ctx.weekend ? c.Weekend : 0)
    + (ctx.quarter === 2 ? c.Q2 : ctx.quarter === 3 ? c.Q3 : ctx.quarter === 4 ? c.Q4 : 0);
  return Math.exp(eta);
}

function logGamma(x) {
  const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
  x -= 1;
  let a = c[0];
  const t = x + g + 0.5;
  for (let i = 1; i < 9; i++) a += c[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

function nbQ(target, mu, alpha) {
  if (mu <= 0) return 0;
  const r = 1 / alpha, p = r / (r + mu);
  let cdf = 0, k = 0;
  const mx = Math.max(1000, Math.ceil(mu * 50));
  while (k <= mx) {
    cdf += Math.exp(logGamma(k + r) - logGamma(k + 1) - logGamma(r) + r * Math.log(p) + k * Math.log(1 - p));
    if (cdf >= target) return k;
    k++;
  }
  return mx;
}

function predInterval(mu, alpha, conf) {
  if (mu <= 0) return { mu: 0, low: 0, med: 0, high: 0 };
  const lq = (1 - conf) / 2;
  return { mu, low: nbQ(lq, mu, alpha), med: nbQ(0.5, mu, alpha), high: nbQ(1 - lq, mu, alpha) };
}

// Compute per-factor multipliers (exp of contribution to eta) for the bar chart
function factorBreakdown(f, ctx, out) {
  const c = COEFS[out];
  const factors = [];
  const push = (label, sub, contrib, group) => {
    if (Math.abs(contrib) < 0.01) return;
    factors.push({ label, sub, contrib, mult: Math.exp(contrib), group });
  };

  // Message signals (with interactions absorbed into the main label)
  if (f.Neg) {
    let v = c.Negative_emotiveness + c.Pos_x_Neg * f.Pos + c.Inf_x_Neg * f.Inf + c.Urg_x_Neg * f.Urg;
    push('Hardship (negative emotion)', 'Strong emotional trigger', v, 'signal');
  }
  if (f.Pos) {
    let v = c.Positive_emotiveness + c.Pos_x_Neg * f.Neg + c.Inf_x_Pos * f.Inf + c.Urg_x_Pos * f.Urg;
    push('Hope (positive emotion)', 'Balances tone & connection', v, 'signal');
  }
  if (f.Inc) {
    let v = c.Inclusiveness + c.Urg_x_Inc * f.Urg;
    push('Collective action', 'Encourages sharing', v, 'signal');
  }
  if (f.Urg) push('Urgency', 'Time-bound call to act', c.Urgency, 'signal');
  if (f.Inf) push('Informational content', 'Specific facts & figures', c.Informativeness, 'signal');

  // Form factors
  if (f.hash > 0) push('Hashtags', `${f.hash} ${window.T('used')}`, c.Hashtags * f.hash, 'form');
  if (f.emoji > 0) {
    const v = c.Emojis_lin * (f.emoji - SAMPLE.meanEmojis) + c.Emojis_sq * Math.pow(f.emoji - SAMPLE.meanEmojis, 2);
    push('Emojis', `${f.emoji} ${window.T('used')}`, v, 'form');
  }
  const lenC = c.Length_c * (f.len - SAMPLE.meanLength);
  if (Math.abs(lenC) > 0.02) push('Message length', `${f.len} ${window.T('chars')}`, lenC, 'form');

  // Context
  if (ctx.verified) push('Verified account', 'Strong audience signal', c.Verified, 'context');
  if (ctx.userType === 'Organization') push('Organization account', 'vs individual baseline', c.Type_Org, 'context');
  const lf = Math.log1p(Math.max(0, ctx.followers));
  const fc = c.LogFollowers_c * (lf - SAMPLE.meanLogFollowers);
  if (Math.abs(fc) > 0.02) push('Audience size', `${ctx.followers.toLocaleString()} ${window.T('followers')}`, fc, 'context');
  if (ctx.weekend) push('Weekend timing', 'Posted Sat/Sun', c.Weekend, 'context');
  if (ctx.quarter === 3) push('Q3 (summer)', 'Peak fundraising season', c.Q3, 'context');
  else if (ctx.quarter === 4) push('Q4 (year-end)', 'Giving Tuesday window', c.Q4, 'context');
  else if (ctx.quarter === 2) push('Q2 (spring)', 'Below baseline', c.Q2, 'context');

  factors.sort((a, b) => Math.abs(b.contrib) - Math.abs(a.contrib));
  return factors;
}

function fullPredict(text, ctx, conf = 0.8) {
  const f = detect(text);
  if (!text || text.trim().length < 12) return { trivial: true, features: f };
  return {
    trivial: false, features: f,
    Likes: predInterval(predictMu(f, ctx, 'Likes'), ALPHA.Likes, conf),
    Shares: predInterval(predictMu(f, ctx, 'Shares'), ALPHA.Shares, conf),
    Comments: predInterval(predictMu(f, ctx, 'Comments'), ALPHA.Comments, conf),
    factors: {
      Likes: factorBreakdown(f, ctx, 'Likes'),
      Shares: factorBreakdown(f, ctx, 'Shares'),
      Comments: factorBreakdown(f, ctx, 'Comments'),
    },
  };
}

// Sample messages for quick-fill
const SAMPLE_MSGS = [
  {
    name: 'Hardship + collective',
    text: "Today, families in our community are facing unimaginable hardship. Your gift can provide warm meals, safe shelter, and hope when it's needed most.\n\nTogether, we can make sure no one is left behind. Donate today and be the reason someone finds light in a dark time.",
    textFr: "Aujourd'hui, des familles de notre communauté traversent une détresse inimaginable. Votre don peut offrir des repas chauds, un abri sûr et de l'espoir quand c'est le plus nécessaire.\n\nEnsemble, faisons en sorte que personne ne soit laissé de côté. Donnez aujourd'hui et soyez la raison pour laquelle quelqu'un retrouve la lumière dans un moment sombre.",
  },
  {
    name: 'Urgent year-end',
    text: "Last chance — our $50,000 match ends at midnight tonight. Every dollar you give before then is doubled. 1,200 kids are counting on us. Join us today.",
    textFr: "Dernière chance — notre fonds de contrepartie de 50 000 € se termine à minuit ce soir. Chaque euro donné avant est doublé. 1 200 enfants comptent sur nous. Rejoignez-nous aujourd'hui.",
  },
  {
    name: 'Hopeful update',
    text: "We did it! Thanks to 847 incredible donors, we hit our goal. Grateful beyond words for this community. The work continues — stay tuned for what's next.",
    textFr: "On l'a fait ! Grâce à 847 donateurs incroyables, nous avons atteint notre objectif. Reconnaissants au-delà des mots envers cette communauté. Le travail continue — restez à l'écoute pour la suite.",
  },
  {
    name: 'Dry / informational',
    text: "Our 2024 impact report is now available. The organization served 4,213 clients across 12 programs, with an 88% retention rate. Read the full report on our website.",
    textFr: "Notre rapport d'impact 2024 est disponible. L'organisation a accompagné 4 213 bénéficiaires dans 12 programmes, avec un taux de fidélisation de 88 %. Lisez le rapport complet sur notre site.",
  },
];

window.FundraisingModel = { fullPredict, detect, COEFS, ALPHA, SAMPLES: SAMPLE_MSGS, factorBreakdown, predictMu, predInterval };
})();
