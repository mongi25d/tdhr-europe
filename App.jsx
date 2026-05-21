import { useState } from "react";

const GOOGLE_FORM_URL = "https://docs.google.com/forms/u/0/d/14bjz-7aWmYmrVaOMpVZTpd3eHt8sIuO9JQgZxcpDd_M/formResponse";
const ENTRY = {
  firstName:        "entry.1333404663",
  lastName:         "entry.280973178",
  email:            "entry.294959001",
  phone:            "entry.996018444",
  country:          "entry.944858004",
  city:             "entry.911173324",
  languages:        "entry.449630269",
  skills:           "entry.1766991995",
  involvement:      "entry.1636831638",
  tier1Contacts:    "entry.810959082",
  tier2Contacts:    "entry.1973805074",
  tier3Contacts:    "entry.162867890",
  nationalParliament: "entry.1255839478",
};

const EU_COUNTRIES = [
  "Austria","Belgium","Bulgaria","Croatia","Cyprus","Czech Republic",
  "Denmark","Estonia","Finland","France","Germany","Greece","Hungary",
  "Ireland","Italy","Latvia","Lithuania","Luxembourg","Malta",
  "Netherlands","Poland","Portugal","Romania","Slovakia","Slovenia",
  "Spain","Sweden"
];

const SKILLS = [
  "Translation / Interpretation","Legal expertise","Academic / Research",
  "Journalism / Media","Social media / Communications","Event organizing",
  "Fundraising","Political / Diplomatic experience","Civil society / NGO work","Other"
];

const INVOLVEMENT = [
  "Attend meetings and events","Write letters to MEPs",
  "Speak publicly / give testimony","Help with social media campaigns",
  "Translate documents","Help organize events in my city",
  "Financial contribution","Connect with local civil society"
];

// Tier system:
// tier: 1 = DROI + AFET + DMAG (triple overlap - highest priority)
// tier: 2 = DROI + AFET, or DROI + DMAG, or AFET + DMAG (double overlap)
// tier: 3 = Single body only
// bodies: array of which bodies they belong to

const REPS = {
  "France": {
    meps: [
      { name:"Mounir Satouri", bodies:["DROI"], role:"Chair, DROI", group:"Greens/EFA", email:"mounir.satouri@europarl.europa.eu", note:"Chairs the Human Rights subcommittee — top priority contact" },
      { name:"Bernard Guetta", bodies:["DROI","AFET"], role:"Member, DROI & AFET", group:"Renew Europe", email:"bernard.guetta@europarl.europa.eu", note:"On both AFET and DROI — double leverage" },
      { name:"Rima Hassan", bodies:["DROI","AFET"], role:"Member, DROI & AFET", group:"The Left (GUE/NGL)", email:"rima.hassan@europarl.europa.eu", note:"Vocal on Arab world human rights; on both bodies" },
      { name:"Chloé Ridel", bodies:["DROI","AFET"], role:"Member, DROI & AFET", group:"S&D", email:"chloe.ridel@europarl.europa.eu", note:"Rapporteur on human rights & democracy report; on both bodies" },
      { name:"Pierre Jouvet", bodies:["DMAG"], role:"2nd Vice-Chair, DMAG (Maghreb delegation)", group:"S&D", email:"pierre.jouvet@europarl.europa.eu", note:"Direct Tunisia remit as DMAG Vice-Chair" },
      { name:"France Jamet", bodies:["DMAG"], role:"Member, DMAG", group:"Patriots for Europe (RN)", email:"france.jamet@europarl.europa.eu", note:"" },
      { name:"Sarah Knafo", bodies:["DMAG"], role:"Member, DMAG", group:"ESN (RN)", email:"sarah.knafo@europarl.europa.eu", note:"" },
      { name:"Grégory Allione", bodies:["DMAG"], role:"Member, DMAG", group:"Renew Europe", email:"gregory.allione@europarl.europa.eu", note:"" },
      { name:"Matthieu Valet", bodies:["DROI"], role:"Member, DROI", group:"Patriots for Europe (RN)", email:"matthieu.valet@europarl.europa.eu", note:"" },
      { name:"Thierry Mariani", bodies:["DROI"], role:"Substitute, DROI", group:"Patriots for Europe (RN)", email:"thierry.mariani@europarl.europa.eu", note:"Substitute member" },
    ],
    national: { body:"Assemblée Nationale & Sénat", url:"https://www.assemblee-nationale.fr", tip:"Contact your local député via the Assemblée Nationale website using your postal code." }
  },
  "Italy": {
    meps: [
      { name:"Ruggero Razza", bodies:["DMAG"], role:"Chair, DMAG (Maghreb delegation)", group:"ECR (FdI)", email:"ruggero.razza@europarl.europa.eu", note:"Chair of the Maghreb delegation — direct Tunisia remit; has already met with Tunisia's EU ambassador" },
      { name:"Marco Tarquinio", bodies:["DROI","AFET"], role:"Member, DROI & AFET", group:"S&D (PD)", email:"marco.tarquinio@europarl.europa.eu", note:"Active on human rights & Mediterranean issues; on both bodies" },
      { name:"Silvia Sardone", bodies:["DROI"], role:"Member, DROI", group:"Patriots for Europe (Lega)", email:"silvia.sardone@europarl.europa.eu", note:"" },
      { name:"Marco Falcone", bodies:["DMAG"], role:"Member, DMAG", group:"EPP (FI)", email:"marco.falcone@europarl.europa.eu", note:"" },
      { name:"Giorgio Gori", bodies:["DMAG"], role:"Member, DMAG", group:"S&D (PD)", email:"giorgio.gori@europarl.europa.eu", note:"" },
      { name:"Denis Nesci", bodies:["DMAG"], role:"Member, DMAG", group:"ECR (FdI)", email:"denis.nesci@europarl.europa.eu", note:"" },
      { name:"Danilo Della Valle", bodies:["DROI","AFET"], role:"Substitute, DROI & AFET member", group:"The Left (M5S)", email:"danilo.dellavalle@europarl.europa.eu", note:"On both AFET and DROI" },
      { name:"Ilaria Salis", bodies:["DROI"], role:"Substitute, DROI", group:"The Left (AVS)", email:"ilaria.salis@europarl.europa.eu", note:"Prominent human rights profile" },
    ],
    national: { body:"Camera dei Deputati & Senato", url:"https://www.camera.it", tip:"Find your MP via camera.it. The Foreign Affairs Committee (Commissione Affari Esteri) is the relevant body." }
  },
  "Spain": {
    meps: [
      { name:"Juan Ignacio Zoido Álvarez", bodies:["DMAG"], role:"1st Vice-Chair, DMAG", group:"EPP (PP)", email:"juanignacio.zoidoalvarez@europarl.europa.eu", note:"1st Vice-Chair of the Maghreb delegation — direct Tunisia remit" },
      { name:"Isabel Serra Sánchez", bodies:["DROI"], role:"3rd Vice-Chair, DROI", group:"The Left (Podemos)", email:"isabel.serrasanchez@europarl.europa.eu", note:"Vice-Chair of DROI" },
      { name:"Nacho Sánchez Amor", bodies:["DROI","AFET"], role:"Member, DROI & AFET", group:"S&D (PSOE)", email:"nacho.sanchezamor@europarl.europa.eu", note:"Very active on democracy and human rights; on both bodies" },
      { name:"Antonio López-Istúriz White", bodies:["DROI","AFET"], role:"Member, DROI & AFET", group:"EPP (PP)", email:"antonio.lopezisturizwhite@europarl.europa.eu", note:"On both bodies" },
      { name:"Jorge Martín Frías", bodies:["DROI"], role:"Member, DROI", group:"Patriots for Europe (VOX)", email:"jorge.martinFrías@europarl.europa.eu", note:"" },
      { name:"Jorge Buxadé Villalba", bodies:["DMAG"], role:"Member, DMAG", group:"Patriots for Europe (VOX)", email:"jorge.buxadevillalba@europarl.europa.eu", note:"" },
      { name:"Estrella Galán", bodies:["DMAG"], role:"Member, DMAG", group:"The Left", email:"estrella.galan@europarl.europa.eu", note:"" },
      { name:"Vicent Marzà Ibáñez", bodies:["DMAG"], role:"Member, DMAG", group:"Greens/EFA", email:"vicent.marzaibanez@europarl.europa.eu", note:"" },
      { name:"Sandra Gómez López", bodies:["DROI","AFET"], role:"Substitute, DROI & AFET member", group:"S&D (PSOE)", email:"sandra.gomezlopez@europarl.europa.eu", note:"On both bodies" },
      { name:"Hana Jalloul Muro", bodies:["DROI","AFET"], role:"Substitute DROI; 1st VP AFET", group:"S&D (PSOE)", email:"hana.jalloulMuro@europarl.europa.eu", note:"1st Vice-Chair of AFET — high-leverage contact" },
    ],
    national: { body:"Congreso de los Diputados", url:"https://www.congreso.es", tip:"Find your MP at congreso.es. The Foreign Affairs Committee (Comisión de Asuntos Exteriores) is the key body." }
  },
  "Germany": {
    meps: [
      { name:"David McAllister", bodies:["AFET"], role:"Chair, AFET", group:"EPP (CDU)", email:"david.mcallister@europarl.europa.eu", note:"Chair of the full Foreign Affairs Committee — most senior AFET contact" },
      { name:"Christian Ehler", bodies:["DMAG"], role:"Member, DMAG", group:"EPP (CDU)", email:"christian.ehler@europarl.europa.eu", note:"On the Maghreb delegation" },
      { name:"Tomasz Froelich", bodies:["DROI"], role:"Member, DROI", group:"ESN (AfD)", email:"tomasz.froelich@europarl.europa.eu", note:"" },
      { name:"Hannah Neumann", bodies:["DROI","AFET"], role:"Substitute DROI; AFET member", group:"Greens/EFA", email:"hannah.neumann@europarl.europa.eu", note:"Strong human rights focus; on both bodies" },
      { name:"Marie-Agnes Strack-Zimmermann", bodies:["AFET"], role:"Member, AFET", group:"Renew Europe (FDP)", email:"marie-agnes.strack-zimmermann@europarl.europa.eu", note:"High-profile AFET member" },
      { name:"Maria Noichl", bodies:["DROI"], role:"Substitute, DROI", group:"S&D (SPD)", email:"maria.noichl@europarl.europa.eu", note:"Substitute member" },
      { name:"Jan-Christoph Oetjen", bodies:["DROI"], role:"Substitute, DROI", group:"Renew Europe (FDP)", email:"jan-christoph.oetjen@europarl.europa.eu", note:"Substitute member" },
    ],
    national: { body:"Bundestag", url:"https://www.bundestag.de/en", tip:"Find your local Bundestag member (MdB) at bundestag.de using your postal code. The Foreign Affairs Committee (Auswärtiger Ausschuss) is the key national body." }
  },
  "Belgium": {
    meps: [
      { name:"Elio Di Rupo", bodies:["AFET","DMAG"], role:"Member, AFET & DMAG", group:"S&D (PS)", email:"elio.dirupo@europarl.europa.eu", note:"Former Belgian Prime Minister; on both AFET and DMAG — high-value contact" },
      { name:"Benoit Cassart", bodies:["DMAG"], role:"Member, DMAG", group:"Renew Europe (MR)", email:"benoit.cassart@europarl.europa.eu", note:"" },
      { name:"Wouter Beke", bodies:["AFET"], role:"Member, AFET", group:"EPP (CD&V)", email:"wouter.beke@europarl.europa.eu", note:"" },
    ],
    national: { body:"Belgian Federal Parliament", url:"https://www.dekamer.be/en", tip:"Contact MPs at dekamer.be. Given Brussels hosts EU institutions, Belgian MPs often have strong connections to EU policy." }
  },
  "Portugal": {
    meps: [
      { name:"Marta Temido", bodies:["DROI","AFET"], role:"1st Vice-Chair DROI; AFET member", group:"S&D (PS)", email:"marta.temido@europarl.europa.eu", note:"1st Vice-Chair of DROI and AFET member — double leverage, top contact" },
      { name:"Francisco Assis", bodies:["DROI","AFET"], role:"Member, DROI & AFET", group:"S&D (PS)", email:"francisco.assis@europarl.europa.eu", note:"On both bodies" },
      { name:"Sebastião Bugalho", bodies:["DROI","AFET"], role:"Substitute DROI; AFET member", group:"EPP (PSD)", email:"sebastiao.bugalho@europarl.europa.eu", note:"On both bodies" },
    ],
    national: { body:"Assembleia da República", url:"https://www.parlamento.pt/en", tip:"Find your MP at parlamento.pt. The Foreign Affairs Committee is the relevant body." }
  },
  "Poland": {
    meps: [
      { name:"Łukasz Kohut", bodies:["DROI","AFET"], role:"2nd Vice-Chair DROI; AFET member", group:"EPP (Ind.)", email:"lukasz.kohut@europarl.europa.eu", note:"On both bodies" },
      { name:"Arkadiusz Mularczyk", bodies:["DROI"], role:"4th Vice-Chair, DROI", group:"ECR (PiS)", email:"arkadiusz.mularczyk@europarl.europa.eu", note:"Vice-Chair of DROI" },
      { name:"Robert Biedroń", bodies:["DROI","AFET"], role:"Member, DROI & AFET", group:"S&D (Nowa Lewica)", email:"robert.biedron@europarl.europa.eu", note:"Active on human rights; on both bodies" },
      { name:"Bartłomiej Sienkiewicz", bodies:["DMAG"], role:"Member, DMAG", group:"EPP (KO)", email:"bartlomiej.sienkiewicz@europarl.europa.eu", note:"" },
      { name:"Małgorzata Gosiewska", bodies:["DROI"], role:"Member, DROI", group:"ECR (PiS)", email:"malgorzata.gosiewska@europarl.europa.eu", note:"" },
    ],
    national: { body:"Sejm & Senat", url:"https://www.sejm.gov.pl/en", tip:"Find your MP at sejm.gov.pl. The Foreign Affairs Committee is the relevant body." }
  },
  "Netherlands": {
    meps: [
      { name:"Catarina Vieira", bodies:["DROI"], role:"Member, DROI", group:"Greens/EFA (GL-PvdA)", email:"catarina.vieira@europarl.europa.eu", note:"Active on human rights" },
      { name:"Malik Azmani", bodies:["AFET","DMAG"], role:"Member AFET; Substitute, DMAG", group:"Renew Europe (VVD)", email:"malik.azmani@europarl.europa.eu", note:"On both AFET and DMAG — double leverage" },
      { name:"Mieke Andriese", bodies:["DROI","AFET"], role:"Substitute DROI; AFET member", group:"Patriots for Europe (PVV)", email:"mieke.andriese@europarl.europa.eu", note:"On both bodies" },
    ],
    national: { body:"Tweede Kamer (House of Representatives)", url:"https://www.tweedekamer.nl/en", tip:"Find your MP via tweedekamer.nl. The Foreign Affairs Committee is the key contact." }
  },
  "Romania": {
    meps: [
      { name:"Mircea-Gheorghe Hava", bodies:["DROI","AFET"], role:"Member, DROI & AFET", group:"EPP (PNL)", email:"mircea-gheorghe.hava@europarl.europa.eu", note:"On both bodies" },
      { name:"Şerban Dimitrie Sturdza", bodies:["AFET","DMAG"], role:"Member AFET & DMAG", group:"ECR (AUR)", email:"serban-dimitrie.sturdza@europarl.europa.eu", note:"On both AFET and DMAG — double leverage" },
    ],
    national: { body:"Camera Deputaților & Senat", url:"https://www.cdep.ro", tip:"Find your MP at cdep.ro. The Foreign Affairs Committee is the relevant body." }
  },
  "Austria": {
    meps: [
      { name:"Reinhold Lopatka", bodies:["DROI","AFET"], role:"Member, DROI & AFET", group:"EPP (ÖVP)", email:"reinhold.lopatka@europarl.europa.eu", note:"Former Austrian foreign minister; on both bodies — high-value contact" },
    ],
    national: { body:"Nationalrat", url:"https://www.parlament.gv.at/en", tip:"Find your MP at parlament.gv.at." }
  },
  "Luxembourg": {
    meps: [
      { name:"Isabel Wiseler-Lima", bodies:["DROI"], role:"Member, DROI", group:"EPP (CSV)", email:"isabel.wiseler-lima@europarl.europa.eu", note:"Active DROI member" },
    ],
    national: { body:"Chambre des Députés", url:"https://www.chd.lu/en", tip:"Contact MPs at chd.lu. Luxembourg's small size means direct contact with MPs is relatively accessible." }
  },
  "Estonia": {
    meps: [
      { name:"Urmas Paet", bodies:["DROI","AFET"], role:"Member DROI; 2nd VP AFET", group:"Renew Europe (RE)", email:"urmas.paet@europarl.europa.eu", note:"2nd Vice-Chair of AFET and DROI member — double leverage" },
    ],
    national: { body:"Riigikogu", url:"https://www.riigikogu.ee/en", tip:"Find your MP at riigikogu.ee." }
  },
  "Czech Republic": {
    meps: [
      { name:"Ondřej Kolář", bodies:["DROI","AFET"], role:"Member, DROI & AFET", group:"EPP (TOP 09)", email:"ondrej.kolar@europarl.europa.eu", note:"On both bodies" },
    ],
    national: { body:"Poslanecká sněmovna (Chamber of Deputies)", url:"https://www.psp.cz/en/", tip:"Find your MP at psp.cz." }
  },
  "Hungary": {
    meps: [
      { name:"András László", bodies:["DROI"], role:"Member, DROI", group:"Patriots for Europe (Fidesz)", email:"andras.laszlo@europarl.europa.eu", note:"" },
    ],
    national: { body:"Országgyűlés (National Assembly)", url:"https://www.parlament.hu/en", tip:"Find your MP at parlament.hu." }
  },
  "Slovakia": {
    meps: [
      { name:"Ľuboš Blaha", bodies:["DROI","AFET"], role:"Member, DROI & AFET", group:"Non-attached (SMER-SD)", email:"lubos.blaha@europarl.europa.eu", note:"On both bodies" },
    ],
    national: { body:"Národná rada (National Council)", url:"https://www.nrsr.sk/web/", tip:"Find your MP at nrsr.sk." }
  },
  "Greece": {
    meps: [
      { name:"Emmanouil Fragkos", bodies:["DROI"], role:"Member, DROI", group:"ECR (Greek Solution)", email:"emmanouil.fragkos@europarl.europa.eu", note:"" },
      { name:"Yannis Maniatis", bodies:["AFET"], role:"Member, AFET", group:"S&D (PASOK)", email:"yannis.maniatis@europarl.europa.eu", note:"" },
    ],
    national: { body:"Hellenic Parliament (Βουλή)", url:"https://www.hellenicparliament.gr/en/", tip:"Find your MP at hellenicparliament.gr." }
  },
  "Ireland": {
    meps: [
      { name:"Barry Andrews", bodies:["DROI","AFET"], role:"Substitute DROI; AFET member", group:"Renew Europe (FF)", email:"barry.andrews@europarl.europa.eu", note:"Former development minister; on both bodies" },
      { name:"Aodhán Ó Ríordáin", bodies:["DROI"], role:"Substitute, DROI", group:"S&D (Labour)", email:"aodhan.oriordain@europarl.europa.eu", note:"Substitute member" },
    ],
    national: { body:"Oireachtas (Dáil & Seanad)", url:"https://www.oireachtas.ie/en/", tip:"Find your TD at oireachtas.ie. The Foreign Affairs Committee is the relevant body." }
  },
  "Sweden": {
    meps: [
      { name:"Alice Teodorescu Måwe", bodies:["DROI"], role:"Substitute, DROI", group:"EPP (KD)", email:"alice.teodorescu-mawe@europarl.europa.eu", note:"Substitute member" },
    ],
    national: { body:"Riksdag", url:"https://www.riksdagen.se/en", tip:"Find your MP at riksdagen.se." }
  },
  "Lithuania": {
    meps: [
      { name:"Petras Auštrevičius", bodies:["DROI","AFET"], role:"Member, DROI & AFET", group:"Renew Europe (LS)", email:"petras.austrevicius@europarl.europa.eu", note:"On both bodies; active on democracy" },
      { name:"Rasa Juknevičienė", bodies:["DROI","AFET"], role:"Member, DROI & AFET", group:"EPP (TS-LKD)", email:"rasa.jukneviciene@europarl.europa.eu", note:"Strong human rights focus; on both bodies" },
      { name:"Liudas Mažylis", bodies:["DROI"], role:"Member, DROI", group:"EPP (TS-LKD)", email:"liudas.mazylis@europarl.europa.eu", note:"" },
    ],
    national: { body:"Seimas", url:"https://www.lrs.lt/sip/portal.show?p_r=37&p_k=2", tip:"Find your MP at lrs.lt." }
  },
};

const getTier = (bodies) => {
  const has = (b) => bodies.includes(b);
  if (has("DROI") && has("AFET") && has("DMAG")) return 1;
  if ((has("DROI") && has("AFET")) || (has("DROI") && has("DMAG")) || (has("AFET") && has("DMAG"))) return 2;
  return 3;
};

const TIER_CONFIG = {
  1: { label:"⭐ Highest Priority", color:"#7a1a2e", bg:"#fff0f3", border:"#c8102e", desc:"On DROI + AFET + DMAG" },
  2: { label:"🔶 High Priority", color:"#7a4a00", bg:"#fff8f0", border:"#d4820a", desc:"On two bodies" },
  3: { label:"Contact", color:"#1a4a8a", bg:"#f4f7ff", border:"#1a4a8a", desc:"" },
};

const BODY_BADGE = {
  DROI: { label:"DROI", title:"Human Rights Subcommittee", color:"#c8102e", url:"https://www.europarl.europa.eu/committees/en/droi/home/members" },
  AFET: { label:"AFET", title:"Foreign Affairs Committee", color:"#1a4a8a", url:"https://www.europarl.europa.eu/committees/en/afet/home/members" },
  DMAG: { label:"DMAG", title:"Maghreb Delegation (incl. Tunisia)", color:"#2a7a3a", url:"https://www.europarl.europa.eu/delegations/en/dmag/members" },
};

export default function TDHRForm() {
  const [form, setForm] = useState({
    firstName:"", lastName:"", email:"", phone:"",
    country:"", city:"", languages:"",
    skills:[], involvement:[], consent:false
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const reps = REPS[form.country] || null;
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const toggleArr = (f, v) => setForm(p => ({ ...p, [f]: p[f].includes(v) ? p[f].filter(x => x !== v) : [...p[f], v] }));
  const canSubmit = form.firstName && form.lastName && form.email && form.country && form.city && form.consent;

  const groupedMeps = reps ? [1,2,3].reduce((acc, tier) => {
    const list = reps.meps.filter(m => getTier(m.bodies) === tier);
    if (list.length) acc.push({ tier, list });
    return acc;
  }, []) : [];

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const tier1 = reps ? reps.meps.filter(m => getTier(m.bodies) === 1).map(m => m.name) : [];
      const tier2 = reps ? reps.meps.filter(m => getTier(m.bodies) === 2).map(m => m.name) : [];
      const tier3 = reps ? reps.meps.filter(m => getTier(m.bodies) === 3).map(m => m.name) : [];
      const nationalParliament = reps ? reps.national.body : "";
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        country: form.country,
        city: form.city,
        languages: form.languages,
        skills: form.skills,
        involvement: form.involvement,
        tier1Contacts: tier1,
        tier2Contacts: tier2,
        tier3Contacts: tier3,
        nationalParliament,
      };
      // Submit via hidden form POST to Google Form endpoint — bypasses all CORS issues
      const formEl = document.createElement("form");
      formEl.method = "POST";
      formEl.action = GOOGLE_FORM_URL;
      formEl.target = "hidden_tdhr_iframe";
      formEl.style.display = "none";

      const fields = {
        [ENTRY.firstName]:         payload.firstName,
        [ENTRY.lastName]:          payload.lastName,
        [ENTRY.email]:             payload.email,
        [ENTRY.phone]:             payload.phone,
        [ENTRY.country]:           payload.country,
        [ENTRY.city]:              payload.city,
        [ENTRY.languages]:         payload.languages,
        [ENTRY.skills]:            payload.skills.join(", "),
        [ENTRY.involvement]:       payload.involvement.join(", "),
        [ENTRY.tier1Contacts]:     payload.tier1Contacts.join(", "),
        [ENTRY.tier2Contacts]:     payload.tier2Contacts.join(", "),
        [ENTRY.tier3Contacts]:     payload.tier3Contacts.join(", "),
        [ENTRY.nationalParliament]: payload.nationalParliament,
      };

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value || "";
        formEl.appendChild(input);
      });

      // Create hidden iframe to receive the response silently
      let iframe = document.getElementById("hidden_tdhr_iframe");
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.name = "hidden_tdhr_iframe";
        iframe.id = "hidden_tdhr_iframe";
        iframe.style.display = "none";
        document.body.appendChild(iframe);
      }

      document.body.appendChild(formEl);
      formEl.submit();
      document.body.removeChild(formEl);

      // Give it a moment to send then proceed
      await new Promise(r => setTimeout(r, 1500));
      setSubmitted(true);
    } catch (err) {
      // Fire-and-forget — proceed to success even if capture fails
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    const successGrouped = reps ? [1,2,3].reduce((acc, tier) => {
      const list = reps.meps.filter(m => getTier(m.bodies) === tier);
      if (list.length) acc.push({ tier, list });
      return acc;
    }, []) : [];

    return (
      <div style={s.page}>
        <div style={s.header}>
          <div style={s.headerInner}>
            <div style={s.logoMark}>✦</div>
            <div>
              <h1 style={s.title}>TDHR Europe</h1>
              <p style={s.subtitle}>Tunisian Diaspora for Democracy & Human Rights</p>
            </div>
          </div>
        </div>

        <div style={s.successWrapper}>
          <div style={s.successBanner}>
            <div style={s.successIcon}>✦</div>
            <h2 style={s.successTitle}>Welcome to TDHR, {form.firstName}!</h2>
            <p style={s.successText}>
              Your registration has been received. We will be in touch soon with next steps for advocates in <strong>{form.country}</strong>.
              Below is your complete list of EU contacts to engage, organized by priority.
            </p>
            <div style={s.bodyLegend}>
              {Object.entries(BODY_BADGE).map(([k,v]) => (
                <a key={k} href={v.url} target="_blank" rel="noopener noreferrer"
                   style={{ ...s.legendBadge, borderColor: v.color, color: v.color, textDecoration:"none", cursor:"pointer" }}>
                  <strong>{v.label}</strong> {v.title} ↗
                </a>
              ))}
            </div>
          </div>

          {reps && (
            <div style={s.successContactsCard}>
              <h3 style={s.successContactsTitle}>Your EU Contacts in {form.country}</h3>
              {successGrouped.map(({ tier, list }) => {
                const cfg = TIER_CONFIG[tier];
                return (
                  <div key={tier} style={{ ...s.tierSection, borderLeftColor: cfg.border, marginBottom:"24px" }}>
                    <div style={{ ...s.tierHeader, color: cfg.color }}>
                      {cfg.label}{cfg.desc && <span style={s.tierDesc}> — {cfg.desc}</span>}
                    </div>
                    <div style={s.successRepGrid}>
                      {list.map((m, i) => (
                        <div key={i} style={{ ...s.successRepCard, background: cfg.bg, borderColor: cfg.border + "44" }}>
                          <div style={s.repTop}>
                            <strong style={s.repName}>{m.name}</strong>
                            <span style={s.repGroup}>{m.group}</span>
                          </div>
                          <div style={s.repRole}>{m.role}</div>
                          <div style={s.bodyBadges}>
                            {m.bodies.map(b => (
                              <a key={b} href={BODY_BADGE[b].url} target="_blank" rel="noopener noreferrer"
                                 title={"View full " + BODY_BADGE[b].title + " members list"}
                                 style={{ ...s.bodyBadge, color: BODY_BADGE[b].color, borderColor: BODY_BADGE[b].color, textDecoration:"none", cursor:"pointer" }}>
                                {b} ↗
                              </a>
                            ))}
                          </div>
                          {m.note && <div style={s.repNote}>💡 {m.note}</div>}
                          {m.email && (
                            <div style={s.repEmail}>
                              ✉ <a href={`mailto:${m.email}`} style={s.emailLink}>{m.email}</a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div style={s.nationalBox}>
                <strong style={s.nationalTitle}>🏛 National Parliament: {reps.national.body}</strong>
                <p style={s.nationalTip}>{reps.national.tip}</p>
                <a href={reps.national.url} target="_blank" rel="noopener noreferrer" style={s.repLinkA}>{reps.national.url} ↗</a>
              </div>
              <div style={{ ...s.epFinder, marginTop:"12px" }}>
                <a href="https://www.europarl.europa.eu/meps/en/home" target="_blank" rel="noopener noreferrer" style={s.repLinkA}>
                  🔍 Find all MEPs from {form.country} → europarl.europa.eu/meps
                </a>
              </div>
            </div>
          )}

          <div style={{ textAlign:"center", marginTop:"24px" }}>
            <button style={s.resetBtn} onClick={() => { setSubmitted(false); setForm({ firstName:"",lastName:"",email:"",phone:"",country:"",city:"",languages:"",skills:[],involvement:[],consent:false }); }}>
              ← Register Another Member
            </button>
          </div>
        </div>

        <div style={s.footer}>
          <p style={s.footerText}><em>"A democracy defended from abroad is not an act of abandonment — it is a bridge kept open until the road home is safe to travel."</em></p>
          <p style={s.footerSub}>TDHR — Tunisian Diaspora for Democracy & Human Rights · Europe</p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logoMark}>✦</div>
          <div>
            <h1 style={s.title}>TDHR Europe</h1>
            <p style={s.subtitle}>Tunisian Diaspora for Democracy & Human Rights</p>
          </div>
        </div>
        <p style={s.tagline}>Join advocates across Europe defending Tunisia's democratic future</p>
        <div style={s.bodyLegend}>
          {Object.entries(BODY_BADGE).map(([k,v]) => (
            <a key={k} href={v.url} target="_blank" rel="noopener noreferrer"
               style={{ ...s.legendBadge, borderColor: v.color, color: v.color, textDecoration:"none", cursor:"pointer" }}>
              <strong>{v.label}</strong> {v.title} ↗
            </a>
          ))}
        </div>
      </div>

      {/* FORM CARD */}
      <div style={s.card}>
        <div style={s.formGrid}>

          {/* LEFT COLUMN: Personal info + optional */}
          <div style={s.leftCol}>
            <h2 style={s.sectionTitle}>Your Information</h2>
            <p style={s.sectionDesc}>Tell us about yourself so we can connect you with the right advocates and representatives in your area.</p>

            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>First Name *</label>
                <input style={s.input} value={form.firstName} onChange={e => update("firstName", e.target.value)} placeholder="Yasmine" />
              </div>
              <div style={s.field}>
                <label style={s.label}>Last Name *</label>
                <input style={s.input} value={form.lastName} onChange={e => update("lastName", e.target.value)} placeholder="Ben Ali" />
              </div>
            </div>

            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>Email Address *</label>
                <input style={s.input} type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="your@email.com" />
              </div>
              <div style={s.field}>
                <label style={s.label}>Phone (optional)</label>
                <input style={s.input} value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+49 123 456 789" />
              </div>
            </div>

            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>Country of Residence *</label>
                <select style={s.select} value={form.country} onChange={e => update("country", e.target.value)}>
                  <option value="">Select your country...</option>
                  {EU_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>City *</label>
                <input style={s.input} value={form.city} onChange={e => update("city", e.target.value)} placeholder="Berlin" />
              </div>
            </div>

            <div style={s.fieldFull}>
              <label style={s.label}>Languages Spoken (optional)</label>
              <input style={s.input} value={form.languages} onChange={e => update("languages", e.target.value)} placeholder="Arabic, French, German, English..." />
            </div>

            <div style={s.divider} />
            <h2 style={s.sectionTitle}>Skills & Involvement <span style={s.optional}>(optional)</span></h2>

            <div style={s.fieldFull}>
              <label style={s.label}>Skills you can bring</label>
              <div style={s.checkGrid}>
                {SKILLS.map(sk => (
                  <div key={sk} style={{ ...s.checkItem, ...(form.skills.includes(sk) ? s.checkActive : {}) }} onClick={() => toggleArr("skills", sk)}>
                    <span style={s.checkMark}>{form.skills.includes(sk) ? "✦" : "○"}</span>{sk}
                  </div>
                ))}
              </div>
            </div>

            <div style={s.fieldFull}>
              <label style={s.label}>How you'd like to get involved</label>
              <div style={s.checkGrid}>
                {INVOLVEMENT.map(iv => (
                  <div key={iv} style={{ ...s.checkItem, ...(form.involvement.includes(iv) ? s.checkActive : {}) }} onClick={() => toggleArr("involvement", iv)}>
                    <span style={s.checkMark}>{form.involvement.includes(iv) ? "✦" : "○"}</span>{iv}
                  </div>
                ))}
              </div>
            </div>

            <div style={s.divider} />

            {/* CONSENT + SUBMIT */}
            <div style={s.consentBox} onClick={() => update("consent", !form.consent)}>
              <div style={{ ...s.consentCheck, ...(form.consent ? s.consentChecked : {}) }}>{form.consent && "✓"}</div>
              <p style={s.consentText}>I agree to TDHR's guiding principles — non-partisan, diaspora-led, evidence-based, constructive — and consent to my information being used for advocacy coordination. My data will not be shared with third parties without my permission. *</p>
            </div>

            {submitError && <div style={s.errorMsg}>{submitError}</div>}
            <button style={{ ...s.btn, ...(!canSubmit || submitting ? s.btnDisabled : {}) }} onClick={handleSubmit} disabled={!canSubmit || submitting}>
              {submitting ? "Submitting..." : "Join TDHR ✦"}
            </button>
          </div>

          {/* RIGHT COLUMN: EU Representatives */}
          <div style={s.rightCol}>
            <h2 style={s.sectionTitle}>Your EU Contacts</h2>
            <p style={s.sectionDesc}>
              {form.country
                ? `Key MEPs to contact as an advocate based in ${form.country}, organized by priority.`
                : "Select your country to see your relevant EU representatives across all three bodies."}
            </p>

            {!form.country && (
              <div style={s.noCountry}>
                <div style={s.noCountryIcon}>🇪🇺</div>
                <p style={s.noCountryText}>Your personalized list of DROI, AFET, and DMAG contacts will appear here once you select your country of residence.</p>
              </div>
            )}

            {form.country && !reps && (
              <div style={s.noRepsBox}>
                <p style={s.noRepsText}>No DROI/AFET/DMAG members currently mapped for {form.country}. Use the EP MEP finder to locate your representatives.</p>
                <a href="https://www.europarl.europa.eu/meps/en/home" target="_blank" rel="noopener noreferrer" style={s.linkBtn}>
                  🔍 Find MEPs from {form.country} →
                </a>
              </div>
            )}

            {reps && groupedMeps.map(({ tier, list }) => {
              const cfg = TIER_CONFIG[tier];
              return (
                <div key={tier} style={{ ...s.tierSection, borderLeftColor: cfg.border }}>
                  <div style={{ ...s.tierHeader, color: cfg.color }}>
                    {cfg.label}{cfg.desc && <span style={s.tierDesc}> — {cfg.desc}</span>}
                  </div>
                  {list.map((m, i) => (
                    <div key={i} style={{ ...s.repCard, background: cfg.bg, borderColor: cfg.border + "44" }}>
                      <div style={s.repTop}>
                        <strong style={s.repName}>{m.name}</strong>
                        <span style={s.repGroup}>{m.group}</span>
                      </div>
                      <div style={s.repRole}>{m.role}</div>
                      <div style={s.bodyBadges}>
                        {m.bodies.map(b => (
                          <a key={b} href={BODY_BADGE[b].url} target="_blank" rel="noopener noreferrer"
                             title={"View full " + BODY_BADGE[b].title + " members list"}
                             style={{ ...s.bodyBadge, color: BODY_BADGE[b].color, borderColor: BODY_BADGE[b].color, textDecoration:"none", cursor:"pointer" }}>
                            {b} ↗
                          </a>
                        ))}
                      </div>
                      {m.note && <div style={s.repNote}>💡 {m.note}</div>}
                      {m.email && <div style={s.repEmail}>✉ <a href={`mailto:${m.email}`} style={s.emailLink}>{m.email}</a></div>}
                    </div>
                  ))}
                </div>
              );
            })}

            {reps && (
              <>
                <div style={s.nationalBox}>
                  <strong style={s.nationalTitle}>🏛 National Parliament: {reps.national.body}</strong>
                  <p style={s.nationalTip}>{reps.national.tip}</p>
                  <a href={reps.national.url} target="_blank" rel="noopener noreferrer" style={s.repLinkA}>{reps.national.url} ↗</a>
                </div>
                <div style={s.epFinder}>
                  <a href="https://www.europarl.europa.eu/meps/en/home" target="_blank" rel="noopener noreferrer" style={s.repLinkA}>
                    🔍 Find all MEPs from {form.country} → europarl.europa.eu/meps
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={s.footer}>
        <p style={s.footerText}><em>"A democracy defended from abroad is not an act of abandonment — it is a bridge kept open until the road home is safe to travel."</em></p>
        <p style={s.footerSub}>TDHR — Tunisian Diaspora for Democracy & Human Rights · Europe</p>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight:"100vh", background:"#f7f5f0", fontFamily:"'Georgia','Times New Roman',serif", padding:"0 0 60px 0", color:"#1a1a1a" },
  header: { background:"#fff", borderBottom:"4px solid #c8102e", borderTop:"3px solid #1a4a8a", padding:"28px 32px 20px", textAlign:"center" },
  headerInner: { display:"flex", alignItems:"center", justifyContent:"center", gap:"14px", marginBottom:"8px" },
  logoMark: { fontSize:"26px", color:"#c8102e" },
  title: { margin:0, fontSize:"clamp(22px,4vw,36px)", fontWeight:"700", color:"#1a1a1a", letterSpacing:"0.04em", textTransform:"uppercase" },
  subtitle: { margin:"4px 0 0", fontSize:"12px", color:"#1a4a8a", letterSpacing:"0.14em", textTransform:"uppercase" },
  tagline: { margin:"8px auto 14px", fontSize:"14px", color:"#1a1a1a", fontStyle:"italic", maxWidth:"520px", fontWeight:"600" },
  bodyLegend: { display:"flex", justifyContent:"center", gap:"12px", flexWrap:"wrap", marginTop:"4px" },
  legendBadge: { fontSize:"11px", padding:"3px 10px", border:"1px solid", borderRadius:"3px", letterSpacing:"0.05em" },
  card: { maxWidth:"1100px", margin:"24px auto 0", background:"#fff", border:"1px solid #e0ddd8", borderTop:"3px solid #1a4a8a", borderRadius:"4px", boxShadow:"0 2px 12px rgba(0,0,0,0.07)", overflow:"hidden" },
  formGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0", alignItems:"start" },
  leftCol: { padding:"36px 36px 40px", borderRight:"1px solid #e8e5e0" },
  rightCol: { padding:"36px 36px 40px", background:"#fafaf8" },
  sectionTitle: { margin:"0 0 6px", fontSize:"18px", fontWeight:"700", color:"#1a1a1a", borderBottom:"2px solid #c8102e", paddingBottom:"8px" },
  sectionDesc: { margin:"0 0 22px", fontSize:"13px", color:"#1a1a1a", lineHeight:"1.7", fontWeight:"500" },
  optional: { fontSize:"12px", fontWeight:"normal", color:"#888", fontStyle:"italic" },
  divider: { borderTop:"1px solid #e8e5e0", margin:"24px 0" },
  row: { display:"flex", gap:"14px", marginBottom:"14px", flexWrap:"wrap" },
  field: { flex:1, minWidth:"160px", display:"flex", flexDirection:"column", gap:"5px" },
  fieldFull: { display:"flex", flexDirection:"column", gap:"6px", marginBottom:"18px" },
  label: { fontSize:"11px", color:"#c8102e", textTransform:"uppercase", letterSpacing:"0.12em", fontWeight:"700" },
  input: { background:"#fafafa", border:"1px solid #ddd", borderRadius:"3px", padding:"10px 12px", color:"#1a1a1a", fontSize:"14px", outline:"none", fontFamily:"inherit" },
  select: { background:"#fafafa", border:"1px solid #ddd", borderRadius:"3px", padding:"10px 12px", color:"#1a1a1a", fontSize:"14px", outline:"none", fontFamily:"inherit" },
  checkGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"7px", marginTop:"6px" },
  checkItem: { background:"#fafafa", border:"1px solid #ddd", borderRadius:"3px", padding:"8px 10px", cursor:"pointer", fontSize:"12px", color:"#555", display:"flex", alignItems:"center", gap:"7px", transition:"all 0.15s" },
  checkActive: { background:"#fff0f2", border:"1px solid #c8102e", color:"#1a1a1a" },
  checkMark: { color:"#c8102e", fontSize:"12px", minWidth:"12px", fontWeight:"bold" },
  consentBox: { display:"flex", gap:"12px", alignItems:"flex-start", background:"#fafafa", border:"1px solid #ddd", borderRadius:"3px", padding:"14px", cursor:"pointer", marginBottom:"20px" },
  consentCheck: { width:"20px", height:"20px", minWidth:"20px", border:"2px solid #ccc", borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", color:"#c8102e", background:"#fff", transition:"all 0.2s" },
  consentChecked: { background:"#fff0f2", border:"2px solid #c8102e" },
  consentText: { margin:0, fontSize:"12px", color:"#555", lineHeight:"1.6" },
  btn: { width:"100%", background:"#c8102e", border:"none", borderRadius:"3px", padding:"14px", color:"#fff", fontSize:"14px", fontWeight:"700", cursor:"pointer", letterSpacing:"0.06em", textTransform:"uppercase", fontFamily:"inherit" },
  btnDisabled: { opacity:0.35, cursor:"not-allowed" },
  noCountry: { textAlign:"center", padding:"48px 20px", border:"1px dashed #ccc", borderRadius:"4px", background:"#fafafa" },
  noCountryIcon: { fontSize:"36px", marginBottom:"12px" },
  noCountryText: { fontSize:"13px", color:"#666", lineHeight:"1.7" },
  noRepsBox: { padding:"20px", background:"#f4f7ff", border:"1px solid #c8d8f0", borderRadius:"4px" },
  noRepsText: { fontSize:"13px", color:"#444", lineHeight:"1.6", marginBottom:"12px" },
  linkBtn: { display:"inline-block", fontSize:"12px", color:"#1a4a8a", textDecoration:"underline" },
  tierSection: { borderLeft:"4px solid #ccc", paddingLeft:"14px", marginBottom:"20px" },
  tierHeader: { fontSize:"11px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"10px" },
  tierDesc: { fontWeight:"normal", fontStyle:"italic", textTransform:"none", letterSpacing:"0" },
  repCard: { border:"1px solid #eee", borderRadius:"3px", padding:"12px 14px", marginBottom:"8px" },
  repTop: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"8px", marginBottom:"3px", flexWrap:"wrap" },
  repName: { color:"#1a1a1a", fontSize:"14px" },
  repGroup: { fontSize:"11px", color:"#888", background:"#f5f5f5", padding:"2px 7px", borderRadius:"2px", whiteSpace:"nowrap" },
  repRole: { fontSize:"11px", color:"#666", marginBottom:"6px" },
  bodyBadges: { display:"flex", gap:"5px", marginBottom:"6px", flexWrap:"wrap" },
  bodyBadge: { fontSize:"10px", fontWeight:"700", border:"1px solid", padding:"1px 6px", borderRadius:"2px", letterSpacing:"0.05em" },
  repNote: { fontSize:"11px", color:"#2a7a3a", fontStyle:"italic", marginBottom:"4px" },
  repEmail: { fontSize:"11px", color:"#1a4a8a" },
  emailLink: { color:"#1a4a8a" },
  nationalBox: { background:"#f4f7ff", border:"1px solid #c8d8f0", borderLeft:"4px solid #1a4a8a", borderRadius:"3px", padding:"14px 16px", marginTop:"16px" },
  nationalTitle: { fontSize:"13px", color:"#1a4a8a", display:"block", marginBottom:"6px" },
  nationalTip: { fontSize:"12px", color:"#666", lineHeight:"1.6", margin:"0 0 6px", fontStyle:"italic" },
  epFinder: { marginTop:"10px", textAlign:"center", padding:"10px", background:"#f9f7f4", border:"1px solid #e0ddd8", borderRadius:"3px" },
  repLinkA: { color:"#1a4a8a", fontSize:"12px", textDecoration:"underline" },
  successCard: { maxWidth:"640px", margin:"80px auto 0", background:"#fff", border:"1px solid #e0ddd8", borderTop:"4px solid #c8102e", borderRadius:"3px", padding:"48px 40px", textAlign:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.07)" },
  successIcon: { fontSize:"36px", color:"#c8102e", marginBottom:"16px" },
  successTitle: { margin:"0 0 10px", fontSize:"24px", color:"#1a1a1a", fontWeight:"700" },
  successText: { fontSize:"14px", color:"#555", lineHeight:"1.7", marginBottom:"24px" },
  successReps: { background:"#fff8f8", border:"1px solid #f0c0c8", borderRadius:"3px", padding:"18px", marginBottom:"24px", textAlign:"left" },
  successRepTitle: { margin:"0 0 12px", fontSize:"11px", color:"#c8102e", textTransform:"uppercase", letterSpacing:"0.12em", fontWeight:"700" },
  successRepItem: { marginBottom:"10px" },
  repNameS: { color:"#1a1a1a", fontWeight:"bold", fontSize:"13px" },
  repRoleS: { color:"#666", fontSize:"12px" },
  repEmailS: { color:"#1a4a8a", fontSize:"12px", marginTop:"2px" },
  resetBtn: { background:"transparent", border:"1px solid #ccc", borderRadius:"3px", padding:"10px 22px", color:"#555", fontSize:"13px", cursor:"pointer", fontFamily:"inherit" },
  errorMsg: { background:"#fff0f0", border:"1px solid #f0c0c0", borderRadius:"3px", padding:"10px 14px", color:"#c8102e", fontSize:"13px", marginBottom:"12px", textAlign:"center" },
  successWrapper: { maxWidth:"900px", margin:"28px auto 0", padding:"0 16px" },
  successBanner: { background:"#fff", border:"1px solid #e0ddd8", borderTop:"4px solid #c8102e", borderRadius:"3px", padding:"36px 40px 28px", textAlign:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.07)", marginBottom:"24px" },
  successContactsCard: { background:"#fff", border:"1px solid #e0ddd8", borderTop:"3px solid #1a4a8a", borderRadius:"3px", padding:"32px 36px", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" },
  successContactsTitle: { margin:"0 0 24px", fontSize:"18px", fontWeight:"700", color:"#1a1a1a", borderBottom:"2px solid #c8102e", paddingBottom:"10px" },
  successRepGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:"12px", marginBottom:"4px" },
  successRepCard: { border:"1px solid #eee", borderRadius:"3px", padding:"13px 15px" },
  footer: { textAlign:"center", padding:"40px 24px 0", maxWidth:"600px", margin:"0 auto" },
  footerText: { fontSize:"14px", color:"#888", fontStyle:"italic", lineHeight:"1.9", margin:"0 0 8px", borderTop:"1px solid #ddd", paddingTop:"24px" },
  footerSub: { fontSize:"11px", color:"#aaa", textTransform:"uppercase", letterSpacing:"0.14em", margin:0 },
};
