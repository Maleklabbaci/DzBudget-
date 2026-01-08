
import { Question, Language } from './types';

export const TRANSLATIONS = {
  fr: {
    appTitle: "DzBudget",
    appSubtitle: "Conseiller financier Algérie",
    loginTitle: "Connexion",
    loginEmail: "Email",
    loginPass: "Mot de passe",
    loginBtn: "Se connecter",
    loginError: "Identifiants invalides",
    loginHint: "Admin: admin@dz.dz / admin. User: user@dz.dz / user. Les comptes expirés ou suspendus bloquent l'accès.",
    adminTitle: "Gestion des Abonnements",
    adminStats: "Statistiques Globales",
    adminUsers: "Utilisateurs",
    adminTotalVolume: "Volume Géré",
    adminAvgSalary: "Moyenne Salaires",
    adminActionPause: "Suspendre",
    adminActionActivate: "Activer",
    adminSimulateTime: "Simuler +1 Mois",
    statusActive: "Actif",
    statusPaused: "Suspendu",
    statusExpired: "Expiré",
    expiryDate: "Expire le",
    logout: "Déconnexion",
    pausedTitle: "Accès Suspendu",
    pausedMessage: "Votre abonnement à DzBudget est actuellement suspendu ou expiré. Veuillez renouveler votre accès mensuel pour continuer.",
    pausedContact: "Support technique : support@dzbudget.dz",
    renewBtn: "Renouveler (Simuler Paiement)",
    introTitle: "Maitrisez votre salaire en DZD",
    introDesc: "Je vais te poser quelques questions rapides pour comprendre ta situation. Ensuite je te proposerai un plan de budget adapté et on pourra suivre tes dépenses ensemble.",
    startBtn: "1) Oui, on commence",
    laterBtn: "2) Non, plus tard",
    stepQuestionnaire: "Étape 2: Questionnaire",
    questionProgress: "Question",
    valider: "Valider",
    suivant: "Suivant",
    planTitle: "Votre Plan de Budget",
    planSubtitle: "Répartition optimisée pour votre situation en Algérie.",
    resetBtn: "Réinitialiser",
    income: "Revenu Total",
    spent: "Total Dépensé",
    remaining: "Reste disponible",
    addExpense: "Ajouter une dépense",
    amount: "Montant (DZD)",
    category: "Catégorie",
    save: "Enregistrer",
    visualSummary: "Résumé Visuel",
    seePlan: "Voir Plan",
    tableCat: "Catégorie",
    tablePrev: "Prévu (DZD)",
    tableDep: "Dépensé (DZD)",
    tableRest: "Reste (DZD)",
    total: "TOTAL",
    adviceTitle: "Conseil de votre expert",
    mobileScroll: "Faites défiler pour ajouter vos dépenses",
    notifWarning: "Attention ! Vous avez utilisé plus de 80% de votre budget ",
    notifExceeded: "Alerte ! Vous avez dépassé votre budget ",
    notifications: "Alertes Budget",
    seeBilan: "Générer Bilan du Mois",
    bilanTitle: "Rapport de Fin de Mois",
    bilanSubtitle: "Analyse de votre performance financière",
    plannedSavings: "Épargne Prévue",
    realSavings: "Épargne Réelle",
    savingsGoalRatio: "Objectif atteint",
    globalScore: "Score Global",
    gradeExcellent: "Excellent",
    gradeGood: "Correct",
    gradeAverage: "Moyen",
    gradePoor: "Insuffisant",
    advicePattern: "Analyse des dépenses",
    backToTracker: "Retour au Suivi",
    gap: "Écart",
    usage: "Usage",
    aiCoachTitle: "Coach IA DzAdvisor",
    aiCoachSubtitle: "Pose-moi une question sur ton argent",
    aiPlaceholder: "Ex: Comment réduire mon budget nourriture ?",
    aiSuggest1: "Analyse mon budget",
    aiSuggest2: "Astuce épargne Algérie",
    aiSuggest3: "Gérer un imprévu",
    aiThinking: "Analyse en cours..."
  },
  ar: {
    appTitle: "ميزانيتي",
    appSubtitle: "مستشارك المالي في الجزائر",
    loginTitle: "تسجيل الدخول",
    loginEmail: "البريد الإلكتروني",
    loginPass: "كلمة المرور",
    loginBtn: "دخول",
    loginError: "بيانات الدخول غير صحيحة",
    loginHint: "المسؤول: admin@dz.dz / admin. المستخدم: user@dz.dz / user. الحسابات المعطلة تمنع الدخول.",
    adminTitle: "تسيير الاشتراكات",
    adminStats: "الإحصائيات العامة",
    adminUsers: "المستخدمين",
    adminTotalVolume: "إجمالي المبالغ",
    adminAvgSalary: "متوسط الرواتب",
    adminActionPause: "تعطيل",
    adminActionActivate: "تفعيل",
    adminSimulateTime: "محاكاة +1 شهر",
    statusActive: "نشط",
    statusPaused: "معطل",
    statusExpired: "منتهي",
    expiryDate: "تنتهي في",
    logout: "خروج",
    pausedTitle: "الحساب معطل",
    pausedMessage: "اشتراكك in تطبيق 'ميزانيتي' معطل حاليًا أو انتهت صلاحيته. يرجى تجديد اشتراكك الشهري للمتابعة.",
    pausedContact: "الدعم الفني: support@dzbudget.dz",
    renewBtn: "تجديد (محاكاة الدفع)",
    introTitle: "تحكم في راتبك بالدينار الجزائري",
    introDesc: "سأطرح عليك بعض الأسئلة السريعة لفهم وضعك. بعد ذلك، سأقترح عليك خطة ميزانية مناسبة ويمكننا تتبع نفقاتك معًا.",
    startBtn: "1) نعم، لنبدأ",
    laterBtn: "2) ليس الآن",
    stepQuestionnaire: "المرحلة 2: الاستبيان",
    questionProgress: "سؤال",
    valider: "تأكيد",
    suivant: "التالي",
    planTitle: "خطة ميزانيتك",
    planSubtitle: "توزيع مثالي حسب وضعك في الجزائر.",
    resetBtn: "إعادة ضبط",
    income: "إجمالي الدخل",
    spent: "إجمالي المصاريف",
    remaining: "المبلغ المتبقي",
    addExpense: "إضافة مصاريف",
    amount: "المبلغ (دج)",
    category: "الفئة",
    save: "حفظ",
    visualSummary: "ملخص بصري",
    seePlan: "رؤية الخطة",
    tableCat: "الفئة",
    tablePrev: "المتوقع (دج)",
    tableDep: "المصروف (دج)",
    tableRest: "الباقي (دج)",
    total: "المجموع",
    adviceTitle: "نصيحة الخبير",
    mobileScroll: "قم بالتمرير لإضافة مصاريفك",
    notifWarning: "انتباه! لقد استهلكت أكثر من 80% من ميزانية ",
    notifExceeded: "تحذير! لقد تجاوزت ميزانية ",
    notifications: "تنبيهات الميزانية",
    seeBilan: "عرض حصيلة الشهر",
    bilanTitle: "تقرير نهاية الشهر",
    bilanSubtitle: "تحليل أدائك المالي لهذا الشهر",
    plannedSavings: "الادخار المتوقع",
    realSavings: "الادخار الحقيقي",
    savingsGoalRatio: "تحقيق الهدف",
    globalScore: "النتيجة الإجمالية",
    gradeExcellent: "ممتاز",
    gradeGood: "جيد",
    gradeAverage: "متوسط",
    gradePoor: "ضعيف",
    advicePattern: "تحليل المصاريف",
    backToTracker: "العودة للمتابعة",
    gap: "الفارق",
    usage: "الاستهلاك",
    aiCoachTitle: "المستشار الذكي DzAdvisor",
    aiCoachSubtitle: "اسألني أي سؤال عن أموالك",
    aiPlaceholder: "مثال: كيف أقلل مصاريف الأكل؟",
    aiSuggest1: "حلل ميزانيتي",
    aiSuggest2: "نصيحة ادخار في الجزائر",
    aiSuggest3: "تسيير طارئ",
    aiThinking: "جاري التحليل..."
  }
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: { fr: "Dans quelle zone tu vis principalement ?", ar: "في أي منطقة تسكن حاليا؟" },
    type: 'choice',
    options: [
      { label: { fr: "Alger / Blida / Boumerdès (grande ville, coût élevé)", ar: "الجزائر / البليدة / بومرداس (مدينة كبيرة، تكلفة عالية)" }, value: 1 },
      { label: { fr: "Oran / Constantine / Annaba / Sétif (grande ville)", ar: "وهران / قسنطينة / عنابة / سطيف (مدينة كبيرة)" }, value: 2 },
      { label: { fr: "Autre grande ville", ar: "مدينة كبيرة أخرى" }, value: 3 },
      { label: { fr: "Petite ville ou campagne", ar: "مدينة صغيرة أو ريف" }, value: 4 }
    ]
  },
  {
    id: 2,
    text: { fr: "Quelle est ta situation familiale actuelle ?", ar: "ما هي وضعيتك العائلية الحالية؟" },
    type: 'choice',
    options: [
      { label: { fr: "Seul(e)", ar: "أعزب" }, value: 1 },
      { label: { fr: "En couple, sans enfant", ar: "متزوج بدون أطفال" }, value: 2 },
      { label: { fr: "En couple, avec enfant(s)", ar: "متزوج مع أطفال" }, value: 3 },
      { label: { fr: "Je vis avec mes parents / ma famille", ar: "أعيش مع والديّ / عائلتي" }, value: 4 },
      { label: { fr: "Autre", ar: "أخرى" }, value: 5 }
    ]
  },
  {
    id: 3,
    text: { fr: "Combien d'enfants as-tu à charge ?", ar: "كم عدد الأطفال الذين تعيلهم؟" },
    type: 'choice',
    condition: (answers) => answers[2] === 3,
    options: [
      { label: { fr: "0", ar: "0" }, value: 1 },
      { label: { fr: "1", ar: "1" }, value: 2 },
      { label: { fr: "2–3", ar: "2–3" }, value: 3 },
      { label: { fr: "4 ou plus", ar: "4 أو أكثر" }, value: 4 }
    ]
  },
  {
    id: 4,
    text: { fr: "Ta situation de logement :", ar: "وضعية السكن الخاصة بك:" },
    type: 'choice',
    options: [
      { label: { fr: "Je paie un loyer", ar: "أدفع الإيجار (الكراء)" }, value: 1 },
      { label: { fr: "Je rembourse un crédit immobilier", ar: "أسدد قرضا عقاريا" }, value: 2 },
      { label: { fr: "Je vis dans un logement familial (pas de loyer)", ar: "أسكن في سكن عائلي (بدون كراء)" }, value: 3 },
      { label: { fr: "Autre", ar: "أخرى" }, value: 4 }
    ]
  },
  {
    id: 5,
    text: { fr: "Montant mensuel approximatif de ton loyer/crédit :", ar: "المبلغ الشهري التقريبي للكراء أو القرض:" },
    type: 'choice',
    condition: (answers) => answers[4] === 1 || answers[4] === 2,
    options: [
      { label: { fr: "Moins de 20 000 DZD", ar: "أقل من 20,000 دج" }, value: 1 },
      { label: { fr: "20 000 – 40 000 DZD", ar: "20,000 – 40,000 دج" }, value: 2 },
      { label: { fr: "40 000 – 70 000 DZD", ar: "40,000 – 70,000 دج" }, value: 3 },
      { label: { fr: "Plus de 70 000 DZD", ar: "أكثر من 70,000 دج" }, value: 4 }
    ]
  },
  {
    id: 6,
    text: { fr: "Ton moyen de transport principal :", ar: "وسيلة النقل الرئيسية الخاصة بك:" },
    type: 'choice',
    options: [
      { label: { fr: "Voiture personnelle", ar: "سيارة شخصية" }, value: 1 },
      { label: { fr: "Transports en commun (bus, métro, tramway)", ar: "النقل العام (حافلة، مترو، ترامواي)" }, value: 2 },
      { label: { fr: "Taxi / VTC principalement", ar: "سيارات الأجرة / ياسر (Yassir) غالباً" }, value: 3 },
      { label: { fr: "Mix de plusieurs", ar: "مزيج من عدة وسائل" }, value: 4 },
      { label: { fr: "Je me déplace très peu", ar: "أتنقل قليلاً جداً" }, value: 5 }
    ]
  },
  {
    id: 7,
    text: { fr: "Ton statut professionnel principal :", ar: "وضعك المهني الرئيسي:" },
    type: 'choice',
    options: [
      { label: { fr: "Salarié (CDI / CDD / fonctionnaire)", ar: "موظف (قطاع عام أو خاص)" }, value: 1 },
      { label: { fr: "Indépendant / freelance / commerce", ar: "عمل حر / تاجر" }, value: 2 },
      { label: { fr: "Étudiant avec petit revenu", ar: "طالب مع دخل بسيط" }, value: 3 },
      { label: { fr: "Sans emploi avec revenus occasionnels", ar: "بدون عمل مع دخل متقطع" }, value: 4 },
      { label: { fr: "Autre", ar: "أخرى" }, value: 5 }
    ]
  },
  {
    id: 8,
    text: { fr: "Quel est ton salaire NET MOYEN par mois (en DZD) ?", ar: "ما هو متوسط راتبك الشهري الصافي (بالدينار)؟" },
    type: 'number'
  },
  {
    id: 9,
    text: { fr: "En plus de ton salaire, quel est le montant des autres revenus ?", ar: "بالإضافة إلى راتبك، ما هو مبلغ المداخيل الأخرى؟" },
    type: 'number'
  },
  {
    id: 10,
    text: { fr: "As-tu des crédits ou dettes à rembourser ?", ar: "هل لديك قروض أو ديون يجب سدادها؟" },
    type: 'choice',
    options: [
      { label: { fr: "Non", ar: "لا" }, value: 1 },
      { label: { fr: "Oui, mais c'est léger", ar: "نعم، ولكنها بسيطة" }, value: 2 },
      { label: { fr: "Oui, c'est important", ar: "نعم، وهي مهمة" }, value: 3 }
    ]
  },
  {
    id: 11,
    text: { fr: "Tes mensualités représentent environ :", ar: "أقساطك الشهرية تمثل حوالي:" },
    type: 'choice',
    condition: (answers) => answers[10] === 2 || answers[10] === 3,
    options: [
      { label: { fr: "Moins de 10 %", ar: "أقل من 10%" }, value: 1 },
      { label: { fr: "Entre 10 % et 30 %", ar: "بين 10% و 30%" }, value: 2 },
      { label: { fr: "Plus de 30 %", ar: "أكثر من 30%" }, value: 3 }
    ]
  },
  {
    id: 12,
    text: { fr: "Lesquelles te concernent régulièrement ?", ar: "أي من هذه المصاريف تخصك بانتظام؟" },
    type: 'multi',
    options: [
      { label: { fr: "École privée / frais de scolarité", ar: "مدرسة خاصة / رسوم دراسية" }, value: 1 },
      { label: { fr: "Soutien scolaire", ar: "دروس خصوصية" }, value: 2 },
      { label: { fr: "Santé régulière", ar: "صحة دورية (علاج دائم)" }, value: 3 },
      { label: { fr: "Aide à la famille", ar: "مساعدة العائلة" }, value: 4 },
      { label: { fr: "Abonnements (internet, mobile...)", ar: "اشتراكات (إنترنت، هاتف...)" }, value: 5 },
      { label: { fr: "Aucune dépense spéciale", ar: "لا توجد مصاريف خاصة" }, value: 6 }
    ]
  },
  {
    id: 13,
    text: { fr: "Ta priorité principale cette année :", ar: "أولويتك المالية الرئيسية هذا العام:" },
    type: 'choice',
    options: [
      { label: { fr: "Construire une épargne de sécurité", ar: "بناء ادخار للأمان" }, value: 1 },
      { label: { fr: "Rembourser mes dettes", ar: "تسديد ديوني" }, value: 2 },
      { label: { fr: "Préparer un projet", ar: "التحضير لمشروع (زواج، سيارة...)" }, value: 3 },
      { label: { fr: "Améliorer mon confort", ar: "تحسين مستوى المعيشة اليومي" }, value: 4 }
    ]
  },
  {
    id: 14,
    text: { fr: "Quel style de gestion tu préfères ?", ar: "أي أسلوب تسيير تفضل؟" },
    type: 'choice',
    options: [
      { label: { fr: "Très strict (maximiser l'épargne)", ar: "صارم جداً (زيادة الادخار)" }, value: 1 },
      { label: { fr: "Équilibré", ar: "متوازن" }, value: 2 },
      { label: { fr: "Confortable (plus de loisirs)", ar: "مريح (ميزانية أكبر للترفيه)" }, value: 3 }
    ]
  },
  {
    id: 15,
    text: { fr: "Fréquence du salaire :", ar: "تواتر الراتب:" },
    type: 'choice',
    options: [
      { label: { fr: "Mensuel", ar: "شهري" }, value: 1 },
      { label: { fr: "Deux fois par mois", ar: "مرتين في الشهر" }, value: 2 },
      { label: { fr: "Autre", ar: "أخرى" }, value: 3 }
    ]
  }
];

export const formatCurrency = (amount: number, lang: Language = 'fr') => {
  const formatted = new Intl.NumberFormat('fr-DZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return lang === 'fr' ? `${formatted} DZD` : `${formatted} دج`;
};
