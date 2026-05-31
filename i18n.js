// ════════════════════════════════════════════════════════════════════
// i18n — English / French. Source-as-key: T("English") → French or English.
// ════════════════════════════════════════════════════════════════════
(function () {
  let LANG = 'en';
  try { LANG = localStorage.getItem('fes_lang') || 'en'; } catch (e) {}

  const FR = {
    // ── Navbar / brand ─────────────────────────────
    "Fundraising Engagement Lab": "Laboratoire d’Engagement en Collecte de Fonds",
    "Social Impact Science": "Science de l’Impact Social",
    "Home": "Accueil",
    "Test a Post": "Tester un post",
    "Campaign Mode": "Mode campagne",
    "About": "À propos",
    "Help": "Aide",
    "Citation & Data": "Citation & données",

    // ── Hero / simulator ───────────────────────────
    "← Change setup": "← Modifier la configuration",
    "Engagement Simulator": "Simulateur d’engagement",
    "A rough sense of how your fundraising message might land. Treat the numbers as orientations, not promises.": "Une estimation de l’effet possible de votre message de collecte. Les chiffres sont des repères, pas des promesses.",
    "Your message": "Votre message",
    "Prediction": "Prédiction",
    "95% range": "Intervalle 95 %",
    "Try a sample:": "Essayez un exemple :",
    "characters": "caractères",
    "Tip: include": "Astuce : précisez",
    "who": "qui",
    "needs help,": "a besoin d’aide,",
    "why": "pourquoi",
    "it matters, and the": "c’est important, et l’",
    "action": "action",
    "you want people to take.": "que vous attendez des gens.",
    "Start writing": "Commencez à écrire",
    "Predictions appear once your message reaches 12+ characters. Or try a sample chip on the left.": "Les prédictions apparaissent dès que votre message atteint 12 caractères. Ou essayez un exemple à gauche.",
    "A rough 95% guess — orientation, not a forecast.": "Une estimation 95 % approximative — un repère, pas une prévision.",
    "See suggestions": "Voir les suggestions",
    "Account & posting context": "Contexte du compte et de publication",
    "Edit": "Modifier",
    "Step 2": "Étape 2",
    "The control variables from the published model. Set them to match your real situation — predictions update live.": "Les variables de contrôle du modèle publié. Réglez-les selon votre situation réelle — les prédictions se mettent à jour en direct.",
    "Done": "Terminé",
    "Paste or write your fundraising message here...": "Collez ou écrivez votre message de collecte ici...",
    "chars": "car.",
    "Hashtag": "Hashtag",
    "Mention": "Mention",
    "Em-dash": "Tiret cadratin",
    "Ellipsis": "Points de suspension",
    "Open quote": "Guillemet",
    "Insert emoji": "Insérer un emoji",
    "Add emoji": "Ajouter un emoji",

    // ── Context editor ─────────────────────────────
    "These mirror the": "Elles reprennent les",
    "control variables": "variables de contrôle",
    "used in the published model — audience size, account type, verification, posting hour, weekend, and quarter. Set them to match your real situation.": "utilisées dans le modèle publié — taille de l’audience, type de compte, vérification, heure de publication, week-end et trimestre. Réglez-les selon votre situation réelle.",
    "Followers": "Abonnés",
    "Account type": "Type de compte",
    "Organization": "Organisation",
    "Individual": "Particulier",
    "Ambiguous": "Ambigu",
    "Verified account": "Compte vérifié",
    "Yes": "Oui",
    "No": "Non",
    "Hour of day": "Heure de la journée",
    "Weekend?": "Week-end ?",
    "Quarter": "Trimestre",

    // ── Factors panel ──────────────────────────────
    "What's driving this prediction?": "Qu’est-ce qui détermine cette prédiction ?",
    "Showing impact on": "Impact sur",
    "No strong drivers detected. Your message and context are near the average — predictions reflect the baseline.": "Aucun facteur fort détecté. Votre message et votre contexte sont proches de la moyenne — les prédictions reflètent la base de référence.",
    "Bars show the relative magnitude of each driver's contribution. Percentages are multiplicative effects on predicted": "Les barres montrent l’ampleur relative de chaque facteur. Les pourcentages sont des effets multiplicatifs sur",

    // ── Recommendations (advice) ───────────────────
    "Recommendations": "Recommandations",
    "Do / Don't rewrites": "Réécritures À faire / À éviter",
    "Do": "À faire",
    "Don't": "À éviter",
    "Wrap the numbers in a feeling": "Enveloppez les chiffres dans une émotion",
    "Data alone underperforms. Figures land when they carry an emotion — relief, hope, even awe at what a gift makes possible (the Inf×Hope interaction is strongly positive).": "Les données seules sont peu performantes. Les chiffres portent quand ils transmettent une émotion — soulagement, espoir, voire émerveillement face à ce qu’un don rend possible (l’interaction Info×Espoir est fortement positive).",
    "Your €10 gift provides 3 warm meals — and the relief of one family knowing tonight is taken care of.": "Votre don de 10 € offre 3 repas chauds — et le soulagement d’une famille qui sait que ce soir est assuré.",
    "€10 = 3 meals. Donate now.": "10 € = 3 repas. Faites un don maintenant.",
    "Give urgency an emotion to ride on": "Donnez à l’urgence une émotion sur laquelle s’appuyer",
    "Urgency on its own reads as pressure and slightly suppresses engagement. It works when it carries a real feeling — worry, compassion, the fear of being too late for someone specific.": "L’urgence seule est perçue comme de la pression et réduit légèrement l’engagement. Elle fonctionne quand elle porte une vraie émotion — inquiétude, compassion, la peur d’arriver trop tard pour quelqu’un de précis.",
    "Donate before midnight — so no child waits outside in the cold tonight.": "Faites un don avant minuit — pour qu’aucun enfant n’attende dehors dans le froid ce soir.",
    "Urgent! Donate now before it’s too late!": "Urgent ! Donnez maintenant avant qu’il ne soit trop tard !",
    "Pair urgency with a felt emotion": "Associez l’urgence à une émotion ressentie",
    "Urgency and emotion compound well (Urg×Neg is positive across all three outcomes) — but it has to be felt, not shouted. Anchor it in sadness or compassion for one person, not blanket alarm.": "L’urgence et l’émotion se renforcent (Urg×Nég est positif pour les trois résultats) — mais cela doit être ressenti, pas crié. Ancrez-la dans la tristesse ou la compassion pour une personne, pas dans une alarme générale.",
    "Tonight, 40 families are frightened of sleeping outside. Your gift is the relief of a safe bed.": "Ce soir, 40 familles ont peur de dormir dehors. Votre don, c’est le soulagement d’un lit sûr.",
    "A terrible crisis is happening. Everything is urgent. Please help immediately.": "Une crise terrible se déroule. Tout est urgent. Aidez immédiatement, s’il vous plaît.",
    "Lift the sadness with hope or awe": "Soulevez la tristesse par l’espoir ou l’émerveillement",
    "Sadness draws people in, but a purely heavy message can feel hopeless. Pairing distress with hope — or a moment of awe at what changes — is the highest-converting emotional blend in the data.": "La tristesse capte l’attention, mais un message purement lourd peut sembler désespéré. Associer la détresse à l’espoir — ou à un moment d’émerveillement devant ce qui change — est le mélange émotionnel le plus performant dans les données.",
    "She arrived with nothing. Three months on, she’s back in school and dreaming again — that’s what your gift makes possible.": "Elle est arrivée sans rien. Trois mois plus tard, elle est de retour à l’école et rêve à nouveau — voilà ce que votre don rend possible.",
    "Everything is bleak and nothing is working. It only gets worse from here.": "Tout est sombre et rien ne fonctionne. Ça ne fera qu’empirer.",
    "Use the collective frame to spread": "Utilisez le cadre collectif pour diffuser",
    "Collective language lifts shares specifically — the metric that carries a message into new networks. Keep the requested action simple.": "Le langage collectif augmente spécifiquement les partages — la mesure qui porte un message vers de nouveaux réseaux. Gardez l’action demandée simple.",
    "Stand with us: share this, or give to help one more family today.": "Soutenez-nous : partagez ceci, ou donnez pour aider une famille de plus aujourd’hui.",
    "Together we can do everything — support all our actions and follow every campaign.": "Ensemble nous pouvons tout faire — soutenez toutes nos actions et suivez chaque campagne.",
    "Make people feel something": "Faites ressentir quelque chose",
    "Emotional language — sadness, worry, compassion, even a touch of guilt — is the single largest engagement driver in the data. Don’t just describe the situation; make the reader feel the stakes for one real person.": "Le langage émotionnel — tristesse, inquiétude, compassion, voire une pointe de culpabilité — est le plus grand moteur d’engagement dans les données. Ne décrivez pas seulement la situation ; faites ressentir l’enjeu pour une personne réelle.",
    "It’s heartbreaking: 2,300 families in our city face eviction this winter — and tonight they’re scared.": "C’est déchirant : 2 300 familles de notre ville risquent l’expulsion cet hiver — et ce soir, elles ont peur.",
    "Many people are going through a difficult time.": "Beaucoup de gens traversent une période difficile.",
    "Make the organization sound human": "Donnez une voix humaine à l’organisation",
    "Organizational accounts saw lower engagement than individuals in the model. Add a frontline, volunteer, or beneficiary voice.": "Les comptes d’organisations ont eu moins d’engagement que les particuliers dans le modèle. Ajoutez la voix d’un acteur de terrain, d’un bénévole ou d’un bénéficiaire.",
    "Our volunteers met families arriving without winter coats today. Your gift helps us respond tonight.": "Nos bénévoles ont rencontré aujourd’hui des familles arrivées sans manteaux d’hiver. Votre don nous aide à agir ce soir.",
    "Our organization is implementing emergency assistance operations.": "Notre organisation met en œuvre des opérations d’assistance d’urgence.",
    "Compensate for lower structural credibility": "Compensez une crédibilité structurelle plus faible",
    "Verification is a strong credibility control in the paper. Unverified? Make the source feel concrete and trustworthy.": "La vérification est un fort signal de crédibilité dans l’étude. Non vérifié ? Rendez la source concrète et digne de confiance.",
    "Add a named team, a location, or a specific field detail people can trust.": "Ajoutez une équipe nommée, un lieu, ou un détail de terrain précis et crédible.",
    "Lean only on generic institutional claims.": "Ne vous appuyez pas uniquement sur des affirmations institutionnelles génériques.",
    "Reduce hashtag clutter": "Réduisez l’encombrement de hashtags",
    "Each hashtag carries a small negative coefficient. Too many make a post feel optimized rather than sincere.": "Chaque hashtag porte un petit coefficient négatif. Trop nombreux, ils font paraître un post optimisé plutôt que sincère.",
    "Use one or two clear tags: #Donate #Community": "Utilisez un ou deux tags clairs : #Don #Communauté",
    "#Donate #Help #Urgent #Charity #Fundraising #Impact #Hope": "#Don #Aide #Urgent #Charité #Collecte #Impact #Espoir",
    "Use emojis sparingly": "Utilisez les emojis avec parcimonie",
    "The model shows diminishing — then negative — returns as emojis accumulate (positive linear, negative squared term).": "Le modèle montre des rendements décroissants — puis négatifs — à mesure que les emojis s’accumulent (terme linéaire positif, terme quadratique négatif).",
    "Your gift can help a family find shelter tonight. 🙏": "Votre don peut aider une famille à trouver un abri ce soir. 🙏",
    "Your gift can help a family tonight 🙏❤️✨📣🏠💙": "Votre don peut aider une famille ce soir 🙏❤️✨📣🏠💙",
    "The draft is directionally strong": "Le brouillon va dans la bonne direction",
    "It already combines a clear need, a human frame, and an action. The next gain is precision.": "Il combine déjà un besoin clair, un cadre humain et une action. Le prochain gain, c’est la précision.",
    "Name the concrete outcome of one donation, and keep the final call to action short.": "Nommez le résultat concret d’un don, et gardez l’appel à l’action final court.",
    "Add more claims, hashtags, or emotional pressure just to make it louder.": "Ajouter plus d’affirmations, de hashtags ou de pression émotionnelle juste pour faire du bruit.",

    // ── Bottom bar ─────────────────────────────────
    "Improve your message": "Améliorez votre message",
    "Use the recommendations to strengthen your post and maximize the impact of your appeal — small wording changes can multiply reach.": "Utilisez les recommandations pour renforcer votre post et maximiser l’impact de votre appel — de petits changements de formulation peuvent multiplier la portée.",
    "Writing tips & examples": "Conseils d’écriture & exemples",

    // ── Metric card ────────────────────────────────
    "maybe around": "peut-être environ",
    "likes": "j’aime",
    "shares": "partages",
    "comments": "commentaires",
    "like": "j’aime",
    "share": "partage",
    "comment": "commentaire",
    "Likes": "J’aime",
    "Shares": "Partages",
    "Comments": "Commentaires",

    // ── Signals ────────────────────────────────────
    "Data": "Données",
    "Hope": "Espoir",
    "Hardship": "Détresse",
    "Urgency": "Urgence",
    "Collective": "Collectif",
    "Detected": "Détecté",
    "Not detected": "Non détecté",
    "Specific figures, %s, or counts": "Chiffres précis, %, ou décomptes",
    "Positive emotional language": "Langage émotionnel positif",
    "Suffering, crisis, devastation": "Souffrance, crise, dévastation",
    "Time-bound calls to action": "Appels à l’action limités dans le temps",
    "Join us, together, community": "Rejoignez-nous, ensemble, communauté"
  };

  function T(s) {
    if (LANG === 'fr' && Object.prototype.hasOwnProperty.call(FR, s)) return FR[s];
    return s;
  }
  function getLang() { return LANG; }
  function setLangGlobal(l) {
    LANG = l;
    try { localStorage.setItem('fes_lang', l); } catch (e) {}
    try { document.documentElement.lang = l; } catch (e) {}
  }
  // expose for adding more entries from other files
  window.__FR = FR;
  window.T = T;
  window.getLang = getLang;
  window.setLangGlobal = setLangGlobal;
})();
