(() => {
  'use strict';

  const root = document.querySelector('[data-jobs-quiz]');
  if (!root) return;

  const texts = {
    lt: {
      eyebrow: 'INTERAKTYVUS TESTAS DARBDAVIUI',
      introTitle: 'Jūs ieškote darbuotojo. O gal – manęs?',
      introText: 'Dvidešimt trumpų klausimų apie Jūsų poreikius ir mano patirtį. Atsakymai nesukurs darbo sutarties, bet gali tapti visai nebloga pokalbio pradžia.',
      tagOne: '20 klausimų', tagTwo: 'Taip / Ne', tagThree: 'Apie 3–4 minutes',
      start: 'Pradėti testą', footer: 'Susipažinkime ne vien per CV',
      progress: 'Klausimas', from: 'iš', back: 'Grįžti', yes: 'Taip', no: 'Ne',
      labelRoles: 'KO IEŠKOTE?', labelSkills: 'KAS JUMS SVARBU?', labelClose: 'PASKUTINIS KLAUSIMAS',
      didYouKnow: 'Trumpai apie mane', noTitle: 'Na, įdomus pasirinkimas.',
      continue: 'Tęsti testą', summary: 'REZULTATAS',
      perfectTitle: 'Mūsų profesinės kortos krenta visai neblogai.',
      perfectDesc: 'Ieškomos darbo sritys sutampa su mano patirtimi, o keli svarbūs kriterijai taip pat pasirodė artimi. Gal vertėtų persikelti iš testo į tikrą pokalbį?',
      maybeTitle: 'Tarp mūsų yra bent viena bendra profesinė tema.',
      maybeDesc: 'Ne visur sutapome, tačiau vienas ar keli Jūsų poreikiai atitinka mano patirtį. Visa kita geriausiai paaiškėtų pokalbio metu.',
      noneTitle: 'Panašu, šiandien ieškome skirtingų dalykų.',
      noneDesc: 'Tinkamos darbo krypties šiame teste neradome. Bet bent jau atrankos procesas buvo trumpesnis nei dar vienas trijų etapų pokalbis.',
      rolesHeading: 'Jus dominančios sritys', skillsHeading: 'Kiek privalumų Jums aktualu?',
      noRoles: 'Šįkart nė viena iš pateiktų sričių.', countSkills: 'iš',
      contact: 'Parašyti dėl pokalbio', retry: 'Atlikti testą dar kartą',
      note: 'Testas pramoginis ir informacinis. Atsakymai neišsaugomi ir niekur nesiunčiami.',
      yesNotice: 'Puiku. Dar viena detalė apie mane:',
      linkSubject: 'Dėl galimybės bendradarbiauti — Luko Lazinkos testas',
      resultIntro: 'Ačiū, kad skyrėte laiko.'
    },
    en: {
      eyebrow: 'AN INTERACTIVE QUIZ FOR EMPLOYERS',
      introTitle: 'You are hiring. Could I be the one?',
      introText: 'Twenty quick questions about what you need and what I can offer. The answers will not sign a contract, but they might start a worthwhile conversation.',
      tagOne: '20 questions', tagTwo: 'Yes / No', tagThree: 'About 3–4 minutes',
      start: 'Start the quiz', footer: 'There is more to me than a CV',
      progress: 'Question', from: 'of', back: 'Go back', yes: 'Yes', no: 'No',
      labelRoles: 'WHAT ARE YOU LOOKING FOR?', labelSkills: 'WHAT MATTERS TO YOU?', labelClose: 'ONE LAST QUESTION',
      didYouKnow: 'A little about me', noTitle: 'Well, that is a plot twist.',
      continue: 'Continue the quiz', summary: 'YOUR RESULT',
      perfectTitle: 'Our professional stars may be aligning.',
      perfectDesc: 'The roles you are hiring for overlap with my experience, and several important criteria are a match. Perhaps it is time to take this conversation beyond the quiz?',
      maybeTitle: 'We have at least one professional interest in common.',
      maybeDesc: 'Not everything matched, but some of your needs align with my experience. A real conversation would tell us much more.',
      noneTitle: 'It looks like we are after different things today.',
      noneDesc: 'We did not find a matching role this time. On the bright side, this was shorter than yet another three-stage hiring process.',
      rolesHeading: 'Areas you are hiring for', skillsHeading: 'Experience factors that matter to you',
      noRoles: 'None of these areas this time.', countSkills: 'out of',
      contact: 'Get in touch about an opportunity', retry: 'Take the quiz again',
      note: 'This quiz is for information and a little fun. Your answers are not saved or sent anywhere.',
      yesNotice: 'Great. One more thing about me:',
      linkSubject: 'Opportunity to connect — Lukas Lazinka employer quiz',
      resultIntro: 'Thanks for taking the time.'
    }
  };

  const questions = [
    {
      section: 'roles', role: 'support',
      title: {lt:'Ar ieškote darbuotojo klientų aptarnavimo srityje?', en:'Are you hiring for a customer support role?'},
      no: {lt:'Nieko tokio. Pirmas klausimas dar nelemia visos mūsų profesinės istorijos.', en:'No problem. The first question does not have to decide our entire professional story.'},
      fact: {lt:'Turiu daugiau kaip 3 metų klientų aptarnavimo patirtį.', en:'I have over three years of experience in customer support.'},
      roleName: {lt:'Klientų aptarnavimas', en:'Customer support'}
    },
    {
      section: 'roles', role: 'lead',
      title: {lt:'Ar ieškote komandos vadovo?', en:'Are you looking for a team leader?'},
      no: {lt:'Supratau. Vadovo kėdės į kiekvieną darbo pokalbį nesinešioju.', en:'Understood. I do not bring a manager’s chair to every interview.'},
      fact: {lt:'Komandoms vadovavau 2 metus ir 3 mėnesius. Dirbau su „ABOUT YOU“, „Enefit“, „Inbank“, „Vinted“ ir „Ignitis“ projektais; didžiausia komanda – 36 darbuotojai.', en:'I have 2 years and 3 months of team leadership experience across ABOUT YOU, Enefit, Inbank, Vinted and Ignitis, managing teams of up to 36 employees.'},
      roleName: {lt:'Komandos valdymas', en:'Team leadership'}
    },
    {
      section: 'roles', role: 'quality',
      title: {lt:'Ar ieškote žmogaus aptarnavimo kokybei ir procesams gerinti?', en:'Are you hiring someone to improve service quality and processes?'},
      no: {lt:'Šįkart kokybės rodikliai gali ramiai išgerti kavos. Judėkime toliau.', en:'The quality metrics can enjoy a quiet coffee break this time. Moving on.'},
      fact: {lt:'„Vinted“ projekte vertinau rašytinio aptarnavimo kokybę ir organizavau kokybės kalibravimo sesijas, o „ABOUT YOU“ analizavau klaidas bei pakartotines užklausas.', en:'In Vinted, I reviewed written support quality and organised calibration sessions; in ABOUT YOU, I analysed recurring errors and reopened customer inquiries.'},
      roleName: {lt:'Kokybė ir procesai', en:'Quality and processes'}
    },
    {
      section: 'roles', role: 'admin',
      title: {lt:'Ar ieškote administravimo arba veiklos koordinavimo specialisto?', en:'Are you hiring for administration or operations coordination?'},
      no: {lt:'Vadinasi, segtuvai šiandien lieka stalčiuje. Dar turime kitų temų.', en:'Then the folders can stay in the drawer today. We still have other things to discuss.'},
      fact: {lt:'Dirbu progimnazijos administracijoje: tvarkau dokumentus, korespondenciją ir organizacines užduotis.', en:'I work in school administration, handling documents, correspondence, and organisational tasks.'},
      roleName: {lt:'Administravimas ir koordinavimas', en:'Administration and coordination'}
    },
    {"section":"roles","role":"coordination","title":{"lt":"Ar ieškote klientų aptarnavimo veiklos koordinatoriaus?","en":"Are you looking for a customer support operations coordinator?"},"no":{"lt":"Vadinasi, šį kartą procesai koordinuosis be mano pagalbos. Gal turite kitą kryptį?","en":"Looks like the processes will coordinate themselves without me this time. Another role, perhaps?"},"fact":{"lt":"Dirbau vyresniuoju klientų aptarnavimo specialistu ir 2 metus bei 3 mėnesius vadovavau komandoms skirtinguose BPO projektuose.","en":"I worked as a senior customer support specialist and led teams across multiple BPO projects for 2 years and 3 months."},"roleName":{"lt":"Aptarnavimo koordinavimas","en":"Support coordination"}},
    {"section":"roles","role":"communications","title":{"lt":"Ar ieškote darbuotojo dalykinei komunikacijai ir informacijos valdymui?","en":"Are you hiring for business communication and information management?"},"no":{"lt":"Gerai, šiandien tekstams ir korespondencijai skelbiama laisva diena.","en":"All right, written communication and correspondence can take the day off."},"fact":{"lt":"Kasdien dirbu su korespondencija ir dokumentais, taip pat studijuoju komunikacijos magistrantūroje.","en":"I work with correspondence and documents daily, and I am pursuing a master’s degree in communication."},"roleName":{"lt":"Dalykinė komunikacija","en":"Business communication"}},
    {"section":"roles","role":"education","title":{"lt":"Ar Jūsų organizacijai praverstų žmogus mokymų ar edukacinių veiklų organizavimui?","en":"Could your organisation use someone to coordinate training or educational activities?"},"no":{"lt":"Supratau. Mokymų kalendorių šįkart užverčiame, bet klausimų dar liko.","en":"Understood. We can close the training calendar for now, but there are more questions."},"fact":{"lt":"Dirbu muzikos mokytoju ir mokyklos administracijoje. „Inbank“ projekte taip pat koordinavau 10 naujų specialistų mokymus ir įvedimą į darbą.","en":"I work as a music teacher and in school administration. In Inbank, I also coordinated the training and onboarding of 10 new specialists."},"roleName":{"lt":"Mokymai ir edukacija","en":"Training and education"}},
    {
      section: 'skills',
      title: {lt:'Ar Jūsų komandai būtų vertinga daugiau kaip 3 metų klientų aptarnavimo patirtis?', en:'Would over three years of customer support experience be valuable to your team?'},
      no: {lt:'Oops, šiandien kortos ne visai sukrito. Jei atrankos kriterijai kada nors pasikeis, šis testas niekur nedings.', en:'Oops, the cards are not quite falling into place. If your hiring criteria change, this quiz will still be here.'},
      fact: {lt:'Daugiau kaip 3 metus sprendžiau klientų klausimus ir dirbau aptarnavimo srityje.', en:'I have spent over three years resolving customer enquiries and working in customer support.'}
    },
    {
      section: 'skills',
      title: {lt:'Ar vertinate patirtį vyresniojo specialisto pozicijoje?', en:'Do you value experience in a senior specialist role?'},
      no: {lt:'Pareigų pavadinimai, matyt, ne viską pasako. Bent dėl to sutariame.', en:'Job titles do not tell the whole story. At least we agree on that.'},
      fact: {lt:'Esu dirbęs vyresniuoju klientų aptarnavimo specialistu (Senior Customer Support Specialist).', en:'I have worked as a Senior Customer Support Specialist.'}
    },
    {
      section: 'skills',
      title: {lt:'Ar praverstų darbuotojas, turintis daugiau kaip 2 metų vadovavimo patirtį?', en:'Would over two years of team leadership experience be useful in this role?'},
      no: {lt:'Supratau. Šįkart vadovavimo patirtį paliksiu kaip nedidelę premiją CV apačioje.', en:'Fair enough. I will leave my leadership experience as a small bonus at the bottom of my CV.'},
      fact: {lt:'Komandos vadovo pareigas ėjau 2 metus ir 3 mėnesius, dirbau su 10–36 darbuotojų komandomis ir buvau atsakingas už jų rezultatus, kokybę bei darbo organizavimą.', en:'I spent 2 years and 3 months as a Team Leader, managing teams of 10–36 employees and overseeing their performance, service quality and daily operations.'}
    },
    {
      section: 'skills',
      title: {lt:'Ar Jums svarbus tikslumas, dokumentų valdymas ir organizuotumas?', en:'Are accuracy, document management, and organisation important to you?'},
      no: {lt:'Netikėta, bet gerai. Dokumentų segtuvai šios atrankos bent jau neužgoš.', en:'Unexpected, but fair enough. At least the paperwork will not steal the spotlight.'},
      fact: {lt:'Administraciniame darbe kasdien tenka derinti tikslumą, dokumentų tvarkymą ir atsakomybę.', en:'My administrative work involves accuracy, document handling, and responsibility every day.'}
    },
    {
      section: 'skills',
      title: {lt:'Ar vertinate gebėjimą aiškiai komunikuoti ir mokytis naujų dalykų?', en:'Do you value clear communication and a willingness to learn?'},
      no: {lt:'Gana originalus personalo atrankos kriterijus. Bet komunikacijos magistrantūra man vis tiek pravers.', en:'That is quite an original hiring criterion. My master’s studies in communication may still come in handy.'},
      fact: {lt:'Studijuoju komunikacijos magistrantūroje ir nuolat derinu profesinę praktiką su studijomis.', en:'I am pursuing a master’s degree in communication while combining my studies with professional work.'}
    },
    {"section":"skills","title":{"lt":"Ar Jums svarbu, kad darbuotojas suprastų ir specialisto, ir vadovo požiūrį?","en":"Is it important that an employee understands both the specialist’s and the manager’s perspective?"},"no":{"lt":"Teisinga, požiūrių kartais ir vieno pakanka. Aš tiesiog turiu abu.","en":"Fair enough, one perspective can be enough. I just happen to have both."},"fact":{"lt":"Esu dirbęs klientų aptarnavimo specialistu, vyresniuoju specialistu ir 2 metus bei 3 mėnesius komandos vadovu penkiuose BPO projektuose.","en":"My background includes customer support, senior specialist and 2 years and 3 months of team leadership roles across five BPO projects."}},
    {"section":"skills","title":{"lt":"Ar vertinate gebėjimą spręsti klientų problemas, o ne tik perduoti jų klausimus kitiems?","en":"Do you value someone who can solve customer problems rather than simply forward them?"},"no":{"lt":"Na, persiųsti laišką irgi menas. Bet kartais norisi problemą išspręsti.","en":"Well, forwarding an email is an art of its own. Sometimes solving the issue is even better."},"fact":{"lt":"Klientų aptarnavimo srityje daugiau kaip 3 metus teko nagrinėti įvairius klientų klausimus ir ieškoti sprendimų.","en":"For over three years in customer support, I have handled customer enquiries and worked towards solutions."}},
    {"section":"skills","title":{"lt":"Ar Jūsų darbe svarbi aiški, taisyklinga rašytinė komunikacija?","en":"Does your team need clear, professional written communication?"},"no":{"lt":"Tada mano redaktoriaus akis galės trumpam pailsėti. Tik trumpam.","en":"Then my inner editor can take a brief break. A very brief one."},"fact":{"lt":"Administracinės užduotys ir komunikacijos studijos reikalauja dėmesio tekstams bei jų tikslumui.","en":"Administrative work and communication studies call for attention to written detail and accuracy."}},
    {"section":"skills","title":{"lt":"Ar vertinate patirtį skirtingose darbo aplinkose?","en":"Do you value experience across different working environments?"},"no":{"lt":"Suprantama. Viena aplinka – mažiau slaptažodžių, kuriuos reikia prisiminti.","en":"Understandable. One workplace environment means fewer passwords to remember."},"fact":{"lt":"Vadovavau „ABOUT YOU“, „Enefit“, „Inbank“, „Vinted“ ir „Ignitis“ komandoms, o šiuo metu dirbu mokyklos administracijoje ir mokau muzikos.","en":"I led teams in the ABOUT YOU, Enefit, Inbank, Vinted and Ignitis projects and currently work in school administration and music education."}},
    {"section":"skills","title":{"lt":"Ar Jums praverstų kūrybiškas darbuotojo požiūris į užduotis?","en":"Would a creative approach to work be useful to your team?"},"no":{"lt":"Jokių staigmenų – supratau. Mano kūrybiškumą kol kas paliksime užkulisiuose.","en":"No surprises, understood. I will keep my creativity backstage for now."},"fact":{"lt":"Be pagrindinio darbo kuriu muziką ir mokomąją medžiagą, tad kūrybinis mąstymas yra svarbi mano veiklos dalis.","en":"Alongside my main job, I compose music and create educational materials, so creative thinking is an important part of my work."}},
    {"section":"skills","title":{"lt":"Ar vertinate dėmesį klientų aptarnavimo kokybei ir darbo standartams?","en":"Do you value attention to customer service quality and working standards?"},"no":{"lt":"Drąsus sprendimas. Kokybės kriterijai šiandien lieka už posėdžių salės durų.","en":"A bold choice. Quality standards can wait outside the meeting room today."},"fact":{"lt":"„Vinted“ projekte organizavau kokybės kalibravimus, „Ignitis“ vertinau darbuotojų skambučius, o „ABOUT YOU“ stebėjau aptarnavimo kokybę ir teikiau grįžtamąjį ryšį.","en":"I organised quality calibrations in Vinted, reviewed employee calls in Ignitis and monitored service quality and provided feedback in ABOUT YOU."}},
    {"section":"skills","title":{"lt":"Ar Jums svarbu, kad darbuotojas nuolat mokytųsi ir tobulėtų?","en":"Is continuous learning and professional development important to you?"},"no":{"lt":"Supratau. Tobulėjimo planą padėsime į stalčių – bent jau iki kito klausimo.","en":"Noted. We will put the development plan in a drawer — at least until the next question."},"fact":{"lt":"Dirbu ir studijuoju komunikacijos magistrantūroje, todėl naujų žinių nuolat įgyju ir akademinėje, ir darbo aplinkoje.","en":"I work while pursuing a master’s degree in communication, developing my knowledge in both academic and professional settings."}},
    {
      section: 'close',
      title: {lt:'Ar norėtumėte apie galimą bendradarbiavimą pasikalbėti gyvai?', en:'Would you like to discuss a possible opportunity in person?'},
      no: {lt:'Gerai, pokalbio rezervacijos kol kas nedarome. Užtat visą klausimyną jau įveikėte.', en:'Fair enough, no interview invitation just yet. But you have made it through the whole quiz.'},
      fact: {lt:'Esu atviras galimybėms klientų aptarnavimo, komandos valdymo, kokybės ir administravimo srityse.', en:'I am open to opportunities in customer support, team leadership, quality, and administration.'}
    }
  ];

  let step = -1;
  let mode = 'intro';
  let answers = new Array(questions.length).fill(null);

  function language() {
    const selected = new URLSearchParams(window.location.search).get('lang');
    if (selected === 'lt' || selected === 'en') return selected;
    return document.body.dataset.currentLanguage === 'en' || document.documentElement.lang === 'en' ? 'en' : 'lt';
  }

  function t() { return texts[language()]; }
  function tr(pair) { return pair[language()]; }

  function frame(body) {
    root.setAttribute('aria-label', language() === 'en' ? 'Interactive employer quiz' : 'Interaktyvus testas darbdaviui');
    root.innerHTML = '<div class="jq-frame"><div class="jq-content' + (mode === 'intro' ? ' jq-intro' : '') + '">' + body + '</div></div>';
  }

  function scrollIntoViewOnStart() {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.scrollIntoView({behavior: reduced ? 'auto' : 'smooth', block: 'start'});
  }

  function progress() {
    const l = t();
    const number = Math.min(step + 1, questions.length);
    return '<div class="jq-topline"><span class="jq-count">' + l.progress + ' ' + number + ' ' + l.from + ' ' + questions.length + '</span>' +
      '<button type="button" class="jq-back" data-jq-action="back">' + l.back + '</button></div>' +
      '<div class="jq-progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + questions.length + '" aria-valuenow="' + number + '">' +
      '<div class="jq-progress-bar" style="width:' + (number / questions.length * 100) + '%"></div></div>';
  }

  function renderIntro() {
    const l = t();
    frame('<p class="jq-overline">' + l.eyebrow + '</p>' +
      '<h2 class="jq-title">' + l.introTitle + '</h2>' +
      '<p class="jq-desc">' + l.introText + '</p>' +
      '<div class="jq-intro-lines"><span>' + l.tagOne + '</span><span>' + l.tagTwo + '</span><span>' + l.tagThree + '</span></div>' +
      '<div class="jq-actions"><button type="button" class="jq-btn jq-btn-primary" data-jq-action="start">' + l.start + ' <span aria-hidden="true">→</span></button></div>' +
      '<div class="jq-bottom-rule">' + l.footer + '</div>');
  }

  function renderQuestion() {
    const l = t();
    const q = questions[step];
    let notice = '';
    if (step > 0 && answers[step - 1] === 'yes') {
      notice = '<div class="jq-fact"><strong>' + l.yesNotice + '</strong> ' + tr(questions[step - 1].fact) + '</div>';
    }
    const phase = q.section === 'roles' ? l.labelRoles : q.section === 'skills' ? l.labelSkills : l.labelClose;
    frame(progress() + notice +
      '<p class="jq-prompt-label">' + phase + '</p>' +
      '<h2 class="jq-question">' + tr(q.title) + '</h2>' +
      '<div class="jq-actions"><button type="button" class="jq-btn jq-btn-primary jq-answer" data-jq-action="yes">' +
      '<span class="jq-answer-mark" aria-hidden="true">✓</span> ' + l.yes + '</button>' +
      '<button type="button" class="jq-btn jq-answer" data-jq-action="no">' +
      '<span class="jq-answer-mark" aria-hidden="true">×</span> ' + l.no + '</button></div>');
  }

  function renderReaction() {
    const l = t();
    const q = questions[step];
    frame(progress() +
      '<p class="jq-overline">' + l.noTitle + '</p>' +
      '<h2 class="jq-question">' + tr(q.no) + '</h2>' +
      '<div class="jq-fact jq-reaction-note"><strong>' + l.didYouKnow + ':</strong> ' + tr(q.fact) + '</div>' +
      '<div class="jq-actions"><button type="button" class="jq-btn jq-btn-primary" data-jq-action="continue">' +
      l.continue + ' <span aria-hidden="true">→</span></button></div>');
  }

  function resultCopy(roleCount, skillCount) {
    const l = t();
    if (roleCount === 0) return {title:l.noneTitle, desc:l.noneDesc};
    if (skillCount >= Math.ceil(questions.filter(q => q.section === 'skills').length / 2)) return {title:l.perfectTitle, desc:l.perfectDesc};
    return {title:l.maybeTitle, desc:l.maybeDesc};
  }

  function renderResult() {
    const l = t();
    const roles = questions.filter((q, i) => q.role && answers[i] === 'yes');
    const skillCount = questions.reduce((total, q, index) => total + (q.section === 'skills' && answers[index] === 'yes' ? 1 : 0), 0);
    const skillTotal = questions.filter(q => q.section === 'skills').length;
    const copy = resultCopy(roles.length, skillCount);
    const pills = roles.length
      ? '<div class="jq-pills">' + roles.map(q => '<span>' + tr(q.roleName) + '</span>').join('') + '</div>'
      : '<p>' + l.noRoles + '</p>';
    const mail = 'mailto:lukaslazinka@gmail.com?subject=' + encodeURIComponent(l.linkSubject);
    frame('<p class="jq-overline">' + l.summary + '</p>' +
      '<p class="jq-prompt-label">' + l.resultIntro + '</p>' +
      '<h2 class="jq-title jq-result-heading">' + copy.title + '</h2>' +
      '<p class="jq-desc">' + copy.desc + '</p>' +
      '<div class="jq-results-grid"><div class="jq-result-panel"><h3>' + l.rolesHeading + '</h3>' + pills + '</div>' +
      '<div class="jq-result-panel"><h3>' + l.skillsHeading + '</h3><p><strong>' + skillCount + ' ' + l.countSkills + ' ' + skillTotal + '</strong></p></div></div>' +
      '<div class="jq-actions"><a class="jq-btn jq-btn-primary" href="' + mail + '">' +
      l.contact + ' <span aria-hidden="true">→</span></a>' +
      '<button type="button" class="jq-btn" data-jq-action="restart">' + l.retry + '</button></div>' +
      '<p class="jq-endnote">' + l.note + '</p>');
  }

  function render() {
    if (mode === 'intro') renderIntro();
    else if (mode === 'question') renderQuestion();
    else if (mode === 'reaction') renderReaction();
    else renderResult();
  }

  root.addEventListener('click', function (event) {
    const button = event.target.closest('[data-jq-action]');
    if (!button || !root.contains(button)) return;

    const action = button.dataset.jqAction;
    if (action === 'start') {
      answers = new Array(questions.length).fill(null);
      step = 0;
      mode = 'question';
      render();
      scrollIntoViewOnStart();
      return;
    }
    if (action === 'yes' || action === 'no') {
      if (mode !== 'question' || step < 0 || step >= questions.length) return;
      answers[step] = action;
      if (action === 'no') {
        mode = 'reaction';
      } else {
        step += 1;
        mode = step === questions.length ? 'result' : 'question';
      }
      render();
      return;
    }
    if (action === 'continue' && mode === 'reaction') {
      step += 1;
      mode = step === questions.length ? 'result' : 'question';
      render();
      return;
    }
    if (action === 'back') {
      if (mode === 'reaction') {
        answers[step] = null;
        mode = 'question';
      } else if (step > 0) {
        step -= 1;
        mode = 'question';
      } else {
        step = -1;
        mode = 'intro';
      }
      render();
      return;
    }
    if (action === 'restart') {
      answers = new Array(questions.length).fill(null);
      step = -1;
      mode = 'intro';
      render();
      scrollIntoViewOnStart();
    }
  });

  // Keep this component in sync with the site's existing language switch.
  new MutationObserver(function (entries) {
    if (entries.some(entry => entry.attributeName === 'data-current-language')) render();
  }).observe(document.body, {attributes:true, attributeFilter:['data-current-language']});

  render();
})();
