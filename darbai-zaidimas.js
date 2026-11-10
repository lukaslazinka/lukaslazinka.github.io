(() => {
  'use strict';
  const root = document.querySelector('[data-employer-game]');
  if (!root) return;

  const copy = {
    lt: {
      eyebrow: 'ANTRAS ŽAIDIMAS · POKALBIS ATVIRKŠČIAI',
      title: 'O jeigu dabar darbuotojas rinktųsi jus?',
      intro: 'Darbo pokalbyje klausimus dažniausiai užduoda darbdavys. Šįkart apsikeiskime vietomis. Priimkite sprendimus devyniose situacijose, o aš pasakysiu, kokio darbo, vadovo ir komandos tikiuosi.',
      start: 'Priimti iššūkį', tag1: '9 situacijos', tag2: '3 pasirinkimai', tag3: 'Jokių neteisingų atsakymų',
      footer: 'Šį kartą renkasi abi pusės.',
      turn: 'Situacija', of: 'iš', back: 'Grįžti', choose: 'Ką pasirinktumėte?',
      reply: 'Mano atsakymas', expectation: 'Ko aš tikiuosi', experience: 'Ką atsinešu aš',
      next: 'Kita situacija', finish: 'Pamatyti rezultatą', yourChoice: 'Jūsų pasirinkimas',
      result: 'MŪSŲ DARBO SANTYKIŲ REPETICIJA',
      strong: 'Panašu, kad vienoje komandoje sutartume.',
      strongDesc: 'Dauguma Jūsų sprendimų dera su man svarbia darbo aplinka. Jeigu už šių atsakymų slypi tikra praktika, tikriausiai turėtume apie ką pasikalbėti.',
      medium: 'Pokalbio verta. Bet turėčiau kelis klausimus.',
      mediumDesc: 'Kai kurios nuostatos sutampa, o dėl kitų reikėtų susitarti iš anksto. Darbo santykiuose aiškumas geriau nei gražios prielaidos.',
      low: 'Skelbimą perskaityčiau. Bet tikriausiai du kartus.',
      lowDesc: 'Mūsų požiūriai į darbą gana skirtingi. Nieko asmeniško: geras bendradarbiavimas prasideda nuo supratimo, ko abi pusės tikisi.',
      score: 'Žaidimo suderinamumo taškai', scoreNote: 'Žaismingas pasirinkimų palyginimas, ne objektyvus darbdavio vertinimas.',
      expectations: 'Ko ieškau darbdavyje', matches: 'Kur labiausiai sutapome',
      noMatches: 'Šįkart bendrų pasirinkimų nedaug, bet dialogas vis tiek naudingas.',
      p1: 'Pasitikėjimo ir savarankiškumo', p2: 'Pagarbaus bendravimo ir grįžtamojo ryšio',
      p3: 'Aiškių atsakomybių ir teisingo vertinimo', p4: 'Galimybės augti ir prisidėti prie sprendimų',
      p5: 'Skaidrių darbo sąlygų ir atlygio',
      again: 'Žaisti iš naujo', contact: 'Aptarti galimybę dirbti kartu',
      note: 'Atsakymai lieka tik šioje naršyklėje iki puslapio uždarymo. Jie nėra registruojami ar siunčiami.',
      mailSubject: 'Po interaktyvaus žaidimo — dėl darbo galimybės'
    },
    en: {
      eyebrow: 'GAME TWO · THE REVERSE INTERVIEW',
      title: 'What if the candidate got to choose the employer?',
      intro: 'Employers usually ask the questions at interviews. This time, let us switch seats. Make decisions in nine workplace scenarios, and I will share what I expect from a role, a manager, and a team.',
      start: 'Take the challenge', tag1: '9 scenarios', tag2: '3 choices', tag3: 'No wrong answers',
      footer: 'Both sides get to choose.',
      turn: 'Scenario', of: 'of', back: 'Go back', choose: 'What would you choose?',
      reply: 'My response', expectation: 'What I am looking for', experience: 'What I bring',
      next: 'Next scenario', finish: 'See the result', yourChoice: 'Your choice',
      result: 'A REHEARSAL FOR WORKING TOGETHER',
      strong: 'It looks like we could work well together.',
      strongDesc: 'Most of your decisions align with the workplace I value. If those answers reflect how things really work, we should have plenty to discuss.',
      medium: 'Worth a conversation. I would have a few questions, though.',
      mediumDesc: 'Some expectations align; others would need an upfront discussion. Clarity beats assumptions in any working relationship.',
      low: 'I would read the job advert. Probably twice.',
      lowDesc: 'Our approaches to work are quite different. Nothing personal: a good working relationship begins with both sides understanding what they want.',
      score: 'Playful compatibility points', scoreNote: 'A light-hearted comparison of choices, not an objective assessment of an employer.',
      expectations: 'What I look for in an employer', matches: 'Where we aligned most',
      noMatches: 'Not many matching choices this time, but the conversation is still useful.',
      p1: 'Trust and autonomy', p2: 'Respectful communication and feedback',
      p3: 'Clear responsibilities and fair assessment', p4: 'Room to grow and contribute ideas',
      p5: 'Transparent working terms and compensation',
      again: 'Play again', contact: 'Discuss an opportunity',
      note: 'Your choices only exist in this browser while the page is open. They are not recorded or sent anywhere.',
      mailSubject: 'Following the interactive game — employment opportunity'
    }
  };

  const scenes = [
    {
      category: {lt:'Pozicija ir atsakomybė',en:'Role and responsibility'},
      title: {lt:'Turite laisvą vietą. Ką pasiūlytumėte?',en:'You have an opening. What would you offer?'},
      choices: [
        [{lt:'Vadovauti aptarnavimo komandai arba koordinuoti jos veiklą.',en:'Lead a support team or coordinate its operations.'},3,
         {lt:'Įdomu. Man patinka atsakomybė už komandą, procesus ir bendrą rezultatą.',en:'Interesting. I enjoy taking responsibility for a team, processes, and shared outcomes.'}],
        [{lt:'Prisidėti prie klientų aptarnavimo kokybės ir procesų.',en:'Work on customer service quality and processes.'},3,
         {lt:'Tai taip pat artima mano profesiniams interesams. Geresni procesai paprastai palengvina darbą visiems.',en:'That also fits my professional interests. Better processes tend to make everyone’s work easier.'}],
        [{lt:'Visą dieną tik priiminėti skambučius, be kitų atsakomybių.',en:'Answer calls all day with no other responsibilities.'},0,
         {lt:'Telefonas reikalingas, bet norėčiau daugiau erdvės savo sukauptai patirčiai pritaikyti.',en:'Calls have their place, but I would like more room to put my accumulated experience to use.'}]
      ],
      expect: {lt:'Ieškau prasmingų užduočių klientų aptarnavimo, koordinavimo, kokybės ar administravimo srityse, ypač kai galiu prisiimti atsakomybę.',en:'I am interested in meaningful work in support, coordination, quality, or administration, especially where I can take responsibility.'},
      fact: {lt:'Turiu daugiau kaip 3 metų klientų aptarnavimo ir 2 metų bei 3 mėnesių komandos vadovavimo patirtį. Vadovavau „ABOUT YOU“, „Enefit“, „Inbank“, „Vinted“ ir „Ignitis“ projektų komandoms.',en:'I have over 3 years in customer support and 2 years and 3 months of team leadership experience across ABOUT YOU, Enefit, Inbank, Vinted and Ignitis.'}
    },
    {
      category: {lt:'Pasitikėjimas',en:'Trust'},
      title: {lt:'Kaip vadovas domisi mano kasdieniu darbu?',en:'How does my manager follow my day-to-day work?'},
      choices: [
        [{lt:'Sutariame dėl tikslų, o užduotis organizuoju savarankiškai.',en:'We agree on goals, and I organise my work independently.'},3,
         {lt:'Puiku. Man svarbu žinoti, už ką atsakau, ir turėti erdvės tai atlikti.',en:'Excellent. I want to know what I am responsible for and have room to deliver it.'}],
        [{lt:'Reguliariai aptariame pažangą ir prireikus perskirstome darbus.',en:'We regularly review progress and redistribute tasks when needed.'},2,
         {lt:'Tai suprantama. Periodiniai aptarimai naudingi, kai jie padeda, o ne tampa savitiksliais.',en:'That makes sense. Check-ins are useful when they help rather than becoming an end in themselves.'}],
        [{lt:'Kasryt ir kasvakar reikalauju smulkios kiekvieno žingsnio ataskaitos.',en:'I demand a detailed report of every step, every morning and evening.'},0,
         {lt:'Man patinka tvarka, bet darbo diena neturėtų virsti nuolatiniu atsiskaitymo egzaminu.',en:'I appreciate structure, but the workday should not become a permanent reporting exam.'}]
      ],
      expect: {lt:'Tikiuosi pasitikėjimo, aiškių tikslų ir konstruktyvios atskaitomybės, o ne mikrovadybos.',en:'I expect trust, clear goals, and constructive accountability rather than micromanagement.'},
      fact: {lt:'„Inbank“ vadovavau 36 darbuotojams ir prisidėjau prie lizingo sutarčių sudarymo rodiklio augimo nuo 46 % iki 58 %, analizuodamas rezultatus ir organizuodamas mokymus.',en:'In Inbank, I led 36 employees and contributed to an increase in the leasing agreement completion rate from 46% to 58% by analysing results and organising training.'}
    },
    {
      category: {lt:'Darbo pobūdis',en:'Day-to-day work'},
      title: {lt:'Kaip atrodo didžioji mano darbo dienos dalis?',en:'What does most of my working day look like?'},
      choices: [
        [{lt:'Rašytinė komunikacija, užduočių sprendimas, koordinavimas.',en:'Written communication, problem-solving, and coordination.'},3,
         {lt:'Čia galėčiau gerai panaudoti sukauptą patirtį ir stipriąsias puses.',en:'This would let me make good use of my experience and strengths.'}],
        [{lt:'Įvairios užduotys, o skambučiai – viena iš jų.',en:'A mix of responsibilities, with calls as one part of the role.'},2,
         {lt:'Subalansuotas užduočių derinys man suprantamas. Svarbu, kad funkcijos būtų aiškios.',en:'A balanced mix of tasks makes sense to me. What matters is knowing the role clearly.'}],
        [{lt:'Vien tik nenutrūkstantys skambučiai ir kiekybinės normos.',en:'Back-to-back calls and volume targets, all day.'},0,
         {lt:'Po ilgesnės patirties aptarnavime ieškau platesnio darbo turinio nei vien skambučių srautas.',en:'After years in support, I am looking for a broader role than handling an endless call queue.'}]
      ],
      expect: {lt:'Man artimesnis rašytinis, analitinis ir organizacinis darbas, nors bendravimas su žmonėmis irgi yra jo dalis.',en:'I am particularly interested in written, analytical, and organisational work, while still valuing communication with people.'},
      fact: {lt:'„Vinted“ projekte vadovavau 10 specialistų komandai, klientus aptarnavusiai tik raštu. Taip pat rengiau darbuotojų dokumentus ir oficialius raštus.',en:'In Vinted, I led a team of 10 specialists handling customer issues exclusively in writing. I also prepared employee documentation and formal correspondence.'}
    },
    {
      category: {lt:'Komandos kultūra',en:'Team culture'},
      title: {lt:'Kokią atmosferą rasčiau Jūsų komandoje?',en:'What kind of team atmosphere would I walk into?'},
      choices: [
        [{lt:'Kolegišką: žmonės padeda vieni kitiems ir bendrauja pagarbiai.',en:'Collegial: people help each other and communicate respectfully.'},3,
         {lt:'Būtent tokioje komandoje norėčiau dirbti ir prisidėti prie bendro rezultato.',en:'That is exactly the kind of team I would like to join and contribute to.'}],
        [{lt:'Dalykišką ir gana savarankišką, su aiškiomis bendravimo taisyklėmis.',en:'Professional and fairly independent, with clear communication norms.'},2,
         {lt:'Tai irgi gali veikti. Man svarbiausia, kad profesionalumas nereišktų abejingumo.',en:'That can work too. What matters is that professionalism does not mean indifference.'}],
        [{lt:'Nuolatinį varžymąsi, viešą kritiką ir kaltųjų paiešką.',en:'Constant competition, public criticism, and finding someone to blame.'},0,
         {lt:'Tokioje aplinkoje talentai dažniau ieško išėjimo, o ne sprendimų. Aš irgi rinkčiausi atsargiai.',en:'In that environment, talented people often look for the exit instead of solutions. I would be cautious too.'}]
      ],
      expect: {lt:'Vertinu pagarbius kolegas, normalų žmogišką ryšį ir bendrą atsakomybę už rezultatą.',en:'I value respectful colleagues, genuine human connection, and shared responsibility for outcomes.'},
      fact: {lt:'Esu vadovavęs nuo 10 iki 36 darbuotojų komandoms, organizavau susirinkimus, teikiau individualų grįžtamąjį ryšį ir rūpinausi darbuotojų mokymais.',en:'I have managed teams ranging from 10 to 36 employees, organised meetings, provided individual feedback and coordinated employee training.'}
    },
    {
      category: {lt:'Grįžtamasis ryšys',en:'Feedback'},
      title: {lt:'Padarau klaidą. Kas vyksta toliau?',en:'I make a mistake. What happens next?'},
      choices: [
        [{lt:'Aptariame faktus, ištaisome klaidą ir pasimokome.',en:'We discuss the facts, fix the mistake, and learn from it.'},3,
         {lt:'Tai man atrodo brandus būdas spręsti problemas. Atsakomybė be žeminimo.',en:'That strikes me as a mature way to deal with problems: accountability without humiliation.'}],
        [{lt:'Vadovas nurodo, ką taisyti, ir vėliau patikrina.',en:'The manager explains what to fix and checks later.'},2,
         {lt:'Aiškumas naudingas. Dar geriau, kai kartu suprantame ir klaidos priežastį.',en:'Clear direction helps. Even better if we also understand the cause of the mistake.'}],
        [{lt:'Pastabos išsakomos garsiai prie visų, kad kiti žinotų.',en:'The mistake is called out in front of everyone as a warning.'},0,
         {lt:'Viešas sugėdinimas nėra tas pats, kas kokybės gerinimas. Čia mūsų požiūriai išsiskirtų.',en:'Public embarrassment is not the same as improving quality. We would see this differently.'}]
      ],
      expect: {lt:'Tikiuosi aiškaus, privataus ir pagarbaus grįžtamojo ryšio, kai vertinami veiksmai ir rezultatai.',en:'I expect clear, private, and respectful feedback focused on actions and results.'},
      fact: {lt:'„Vinted“ projekte rengiau kokybės kalibravimo sesijas, „Ignitis“ vertinau darbuotojų skambučius, o „ABOUT YOU“ analizavau pasikartojančias klaidas.',en:'I held quality calibration sessions in Vinted, reviewed employee calls in Ignitis and analysed recurring errors in ABOUT YOU.'}
    },
    {
      category: {lt:'Tobulėjimas',en:'Development'},
      title: {lt:'Po pusmečio dirbu gerai. Ką pasiūlote?',en:'I have been performing well for six months. What next?'},
      choices: [
        [{lt:'Aptariame augimo planą ir galimybę prisiimti daugiau atsakomybės.',en:'We discuss a growth plan and opportunities for more responsibility.'},3,
         {lt:'Tokį pokalbį vertinčiau. Geri rezultatai turėtų atverti bent jau galimybę augti.',en:'I would value that conversation. Strong results should at least open the door to growth.'}],
        [{lt:'Pasiūlome mokymų, jei atsiranda poreikis.',en:'We offer training when a need arises.'},2,
         {lt:'Mokymai naudingi, nors ilgalaikė kryptis man irgi būtų svarbi.',en:'Training helps, although a longer-term direction would matter to me too.'}],
        [{lt:'Nieko nekeičiu: gerai dirba, vadinasi, tegul daro tą patį.',en:'Nothing changes: good performance means doing the same thing indefinitely.'},0,
         {lt:'Stabilumas gerai, bet norėčiau, kad galimybė tobulėti nebūtų laikoma nereikalingu priedu.',en:'Stability is fine, but I would not want professional growth treated as an unnecessary extra.'}]
      ],
      expect: {lt:'Noriu mokytis, gilinti kompetencijas ir matyti realias augimo galimybes.',en:'I want to keep learning, strengthen my skills, and see realistic opportunities to grow.'},
      fact: {lt:'Derinu darbą su komunikacijos magistrantūros studijomis. „Inbank“ projekte prisidėjau prie komandos papildymo 10 specialistų ir koordinavau jų mokymus.',en:'Alongside my master’s studies in communication, I have leadership and training experience. In Inbank, I helped expand the team by 10 specialists and coordinated their training.'}
    },
    {
      category: {lt:'Iniciatyva',en:'Initiative'},
      title: {lt:'Pastebiu, kad procesą galima pagerinti. Kaip reaguojate?',en:'I notice a process could be improved. How do you respond?'},
      choices: [
        [{lt:'Išklausau pasiūlymą ir kartu įvertiname, ar jis veiktų.',en:'I listen to the idea and we assess together whether it would work.'},3,
         {lt:'Puiku. Iniciatyva prasminga tada, kai ją galima aptarti argumentais.',en:'Excellent. Initiative is meaningful when ideas can be discussed on their merits.'}],
        [{lt:'Pasiūlymus priimu, bet tik per nustatytą tvarką.',en:'I welcome ideas, but only through an established process.'},2,
         {lt:'Procesas procesui neprieštarauja, jei geros idėjos jame nepradingsta.',en:'A formal process is fine, as long as good ideas do not disappear into it.'}],
        [{lt:'Geriau tegul atlieka savo funkcijas ir nieko nekeičia.',en:'They should stick to their tasks and not try to change anything.'},0,
         {lt:'Tokiu atveju mano noras tobulinti darbą tikriausiai liktų neišnaudotas.',en:'In that case, my motivation to improve things would probably go unused.'}]
      ],
      expect: {lt:'Man svarbu, kad pasiūlymus būtų galima išsakyti, o argumentai būtų išgirsti.',en:'It matters to me that I can suggest improvements and that ideas are heard and considered.'},
      fact: {lt:'„Enefit“ projekte sumažinau eilėje laukiančių klientų rodiklį nuo 87 % iki 36 %, o verslo klientų pardavimų rodiklis išaugo nuo 6 % iki 17,6 %.',en:'In Enefit, I reduced the share of customers waiting in the queue from 87% to 36%, while the business customer sales metric increased from 6% to 17.6%.'}
    },
    {
      category: {lt:'Darbo aplinka',en:'Working environment'},
      title: {lt:'Kur ir kaip bendrautume kaip komanda?',en:'Where and how would we work together as a team?'},
      choices: [
        [{lt:'Biure, kur yra kolegų, gyvo bendravimo ir bendrų tikslų.',en:'In an office with colleagues, face-to-face interaction, and shared goals.'},3,
         {lt:'Man patinka gyvas komandos ritmas. Tai viena iš priežasčių, kodėl mane domina darbas biure.',en:'I enjoy the rhythm of a team in person. It is one reason office-based work appeals to me.'}],
        [{lt:'Mišriai: dalį laiko biure, dalį – savarankiškai.',en:'Hybrid: some time in the office, some working independently.'},3,
         {lt:'Lankstumas ir komandiškumas tikrai gali derėti. Man svarbu išlaikyti ryšį su kolegomis.',en:'Flexibility and teamwork can absolutely coexist. Staying connected with colleagues matters to me.'}],
        [{lt:'Visi dirba atskirai, komanda bendrauja tik jei iškyla problema.',en:'Everyone works in isolation and only talks when something goes wrong.'},1,
         {lt:'Dirbti savarankiškai moku, bet norėčiau ir tikro komandinio ryšio.',en:'I can work independently, but I also value genuine team connection.'}]
      ],
      expect: {lt:'Ieškau kolegiškos aplinkos; man patrauklus darbas biure arba mišrus modelis su tikru komandos bendravimu.',en:'I want a collegial environment; office-based or hybrid work with real team interaction appeals to me.'},
      fact: {lt:'Vadovaudamas „Inbank“ 36 darbuotojų komandai, bendradarbiavau su pardavimų lyderiais ir mokymų metu skatinau juos dalytis patirtimi su kolegomis.',en:'While leading a team of 36 in Inbank, I involved sales leaders in training sessions so they could share their practical knowledge with colleagues.'}
    },
    {
      category: {lt:'Darbo pasiūlymas',en:'The offer'},
      title: {lt:'Ateina laikas kalbėti apie sąlygas. Ką išgirstu?',en:'It is time to discuss the offer. What do I hear?'},
      choices: [
        [{lt:'Aiškios pareigos, atlygio rėžiai, lūkesčiai ir peržiūros tvarka.',en:'Clear duties, a salary range, expectations, and a review process.'},3,
         {lt:'Tai profesionalu. Man daug paprasčiau įsipareigoti, kai abi pusės žino sąlygas.',en:'That is professional. It is much easier to commit when both sides know the terms.'}],
        [{lt:'Sąlygos gana aiškios, o dalį detalių aptarsime pokalbyje.',en:'The main terms are clear; we will discuss some details in the interview.'},2,
         {lt:'Galima. Svarbiausia, kad svarbūs klausimai būtų atsakyti prieš priimant sprendimą.',en:'That can work. The important thing is to clarify key details before making a decision.'}],
        [{lt:'Atlygis „konkurencingas“, pareigos „įvairios“, visa kita paaiškės vėliau.',en:'The salary is “competitive”, duties are “varied”, and everything else comes later.'},0,
         {lt:'Skamba paslaptingai, bet darbo pasiūlymas nėra detektyvas. Norėčiau daugiau konkretumo.',en:'Intriguing, but a job offer should not be a mystery novel. I would prefer specifics.'}]
      ],
      expect: {lt:'Tikiuosi skaidriai aptartų pareigų, atlygio, darbo sąlygų ir abipusių įsipareigojimų.',en:'I expect transparent discussions of duties, compensation, working terms, and mutual commitments.'},
      fact: {lt:'Turiu 2 metų ir 3 mėnesių komandos vadovavimo patirtį keliuose BPO projektuose, taip pat dirbu administracinį darbą. Man svarbu, kad darbo sąlygos atitiktų atsakomybę.',en:'I bring 2 years and 3 months of leadership across several BPO projects as well as administrative experience. I value working terms that reflect the responsibilities.'}
    }
  ];

  const getLang = () => {
    const query = new URLSearchParams(location.search).get('lang');
    return query === 'lt' || query === 'en' ? query :
      (document.body.dataset.currentLanguage === 'en' || document.documentElement.lang === 'en' ? 'en' : 'lt');
  };
  const langText = value => value[getLang()];
  const ui = () => copy[getLang()];
  let state = 'intro';
  let index = 0;
  let answers = Array(scenes.length).fill(null);

  function show(html) {
    root.setAttribute('aria-label', getLang() === 'lt' ? 'Darbdavio žaidimas' : 'Employer game');
    root.innerHTML = '<div class="eg-frame"><div class="eg-content' + (state === 'intro' ? ' eg-center' : '') + '">' + html + '</div></div>';
  }
  function jump() {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.scrollIntoView({behavior: reduced ? 'auto' : 'smooth', block: 'start'});
  }
  function renderIntro() {
    const c = ui();
    show('<p class="eg-kicker">' + c.eyebrow + '</p>' +
      '<h2 class="eg-title">' + c.title + '</h2><p class="eg-lead">' + c.intro + '</p>' +
      '<div class="eg-tags"><span>' + c.tag1 + '</span><span>' + c.tag2 + '</span><span>' + c.tag3 + '</span></div>' +
      '<div class="eg-actions"><button type="button" class="eg-button eg-primary" data-eg-action="start">' + c.start + ' <span aria-hidden="true">→</span></button></div>' +
      '<p class="eg-footer">' + c.footer + '</p>');
  }
  function stepHead() {
    const c = ui(), number = index + 1;
    return '<div class="eg-top"><span>' + c.turn + ' ' + number + ' ' + c.of + ' ' + scenes.length + '</span>' +
      '<button type="button" class="eg-back" data-eg-action="back">' + c.back + '</button></div>' +
      '<div class="eg-meter" role="progressbar" aria-valuemin="0" aria-valuemax="' + scenes.length + '" aria-valuenow="' + number + '"><span style="width:' + (100 * number / scenes.length) + '%"></span></div>';
  }
  function renderChoice() {
    const c = ui(), s = scenes[index];
    show(stepHead() + '<p class="eg-kicker">' + langText(s.category) + '</p>' +
      '<h2 class="eg-question">' + langText(s.title) + '</h2>' +
      '<p class="eg-prompt">' + c.choose + '</p>' +
      '<div class="eg-choices">' + s.choices.map((option,i) =>
        '<button type="button" class="eg-option" data-eg-action="select" data-eg-choice="' + i + '">' +
        '<span class="eg-letter" aria-hidden="true">' + String.fromCharCode(65 + i) + '</span>' +
        '<span class="eg-option-copy">' + langText(option[0]) + '</span>' +
        '<span class="eg-arrow" aria-hidden="true">↗</span></button>').join('') + '</div>');
  }
  function renderReveal() {
    const c = ui(), s = scenes[index], option = s.choices[answers[index]];
    show(stepHead() +
      '<p class="eg-kicker">' + c.reply + '</p>' +
      '<h2 class="eg-reply-title">' + langText(option[2]) + '</h2>' +
      '<div class="eg-selected"><span>' + c.yourChoice + '</span><p>' + langText(option[0]) + '</p></div>' +
      '<div class="eg-insights"><div class="eg-insight"><h3>' + c.expectation + '</h3><p>' + langText(s.expect) + '</p></div>' +
      '<div class="eg-insight"><h3>' + c.experience + '</h3><p>' + langText(s.fact) + '</p></div></div>' +
      '<div class="eg-actions"><button type="button" class="eg-button eg-primary" data-eg-action="next">' +
      (index === scenes.length - 1 ? c.finish : c.next) + ' <span aria-hidden="true">→</span></button></div>');
  }
  function renderResult() {
    const c = ui();
    const score = scenes.reduce((sum,scene,i) => sum + scene.choices[answers[i]][1], 0);
    const maximum = scenes.length * 3;
    const ratio = score / maximum;
    const tone = ratio >= .75 ? 'strong' : ratio >= .42 ? 'medium' : 'low';
    const matching = scenes.filter((scene,i) => scene.choices[answers[i]][1] >= 2);
    const items = ['p1','p2','p3','p4','p5'];
    const mail = 'mailto:lukaslazinka@gmail.com?subject=' + encodeURIComponent(c.mailSubject);
    show('<p class="eg-kicker">' + c.result + '</p>' +
      '<h2 class="eg-title">' + c[tone] + '</h2><p class="eg-lead">' + c[tone + 'Desc'] + '</p>' +
      '<div class="eg-score"><div><span>' + c.score + '</span><strong>' + score + '<small> / ' + maximum + '</small></strong></div>' +
      '<div class="eg-score-track"><span style="width:' + (100 * ratio).toFixed(1) + '%"></span></div>' +
      '<p>' + c.scoreNote + '</p></div>' +
      '<div class="eg-results"><div class="eg-result-panel"><h3>' + c.expectations + '</h3><ul>' +
      items.map(key => '<li>' + c[key] + '</li>').join('') + '</ul></div>' +
      '<div class="eg-result-panel"><h3>' + c.matches + '</h3>' +
      (matching.length ? '<div class="eg-match-tags">' +
        matching.map(scene => '<span>' + langText(scene.category) + '</span>').join('') + '</div>' :
        '<p>' + c.noMatches + '</p>') + '</div></div>' +
      '<div class="eg-actions"><a class="eg-button eg-primary" href="' + mail + '">' + c.contact + ' <span aria-hidden="true">→</span></a>' +
      '<button type="button" class="eg-button" data-eg-action="restart">' + c.again + '</button></div>' +
      '<p class="eg-note">' + c.note + '</p>');
  }
  function render() {
    if (state === 'intro') renderIntro();
    else if (state === 'choice') renderChoice();
    else if (state === 'reveal') renderReveal();
    else renderResult();
  }
  root.addEventListener('click', event => {
    const b = event.target.closest('[data-eg-action]');
    if (!b || !root.contains(b)) return;
    const action = b.dataset.egAction;
    if (action === 'start') {
      index = 0; answers = Array(scenes.length).fill(null); state = 'choice'; render(); jump();
    } else if (action === 'select' && state === 'choice') {
      const chosen = Number(b.dataset.egChoice);
      if (!Number.isInteger(chosen) || chosen < 0 || chosen >= scenes[index].choices.length) return;
      answers[index] = chosen; state = 'reveal'; render();
    } else if (action === 'next' && state === 'reveal') {
      if (index + 1 === scenes.length) {
        state = 'result';
      } else {
        index++; state = 'choice';
      }
      render();
    } else if (action === 'back') {
      if (state === 'reveal') {
        state = 'choice';
      } else if (state === 'choice') {
        if (index === 0) state = 'intro';
        else index--;
      }
      render();
    } else if (action === 'restart' && state === 'result') {
      index = 0; answers = Array(scenes.length).fill(null); state = 'intro'; render(); jump();
    }
  });

  new MutationObserver(mutations => {
    if (mutations.some(mutation => mutation.attributeName === 'data-current-language')) render();
  }).observe(document.body, {attributes:true, attributeFilter:['data-current-language']});
  render();
})();
