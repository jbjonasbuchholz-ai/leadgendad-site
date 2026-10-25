/* Lead Gen Dad — shared script for every page.
   PLAYBOOKS and TOOLS below feed the cards on Home, Playbooks and Tools.
   To publish a playbook: build its page in /playbooks/<slug>/index.html, then set live:true here. */

const PLAYBOOKS = [
  {slug:"missed-call-text-back", live:true, feature:true, topic:"Automation",
   title:"Missed-call text-back: the automation every business needs",
   blurb:"Never lose a caller again. An instant text goes out when you can't pick up.",
   time:"45 min", cost:"$0 on HighLevel"},
  {slug:"speed-to-lead", topic:"Lead Gen",
   title:"The 5-minute speed-to-lead system that books more appointments",
   blurb:"New lead comes in, they get a text in under a minute and a booking link.",
   time:"45 min", cost:"$0 on HighLevel"},
  {slug:"database-reactivation", topic:"Lead Gen",
   title:"Wake up your old database with 3 texts",
   blurb:"A short reactivation campaign that gets past clients and cold leads replying again.",
   time:"30 min", cost:"$0"},
  {slug:"claude-follow-up-writer", topic:"AI Tools",
   title:"Build a Claude assistant that writes your follow-ups",
   blurb:"Give it your voice and offers once, then get ready-to-send messages in seconds.",
   time:"40 min", cost:"$20/mo"},
  {slug:"one-question-week-of-content", topic:"Content",
   title:"Turn one buyer question into a week of posts",
   blurb:"One real question from a client becomes a short, a carousel, an email, and a blog post.",
   time:"60 min", cost:"$0"},
  {slug:"heygen-avatar-videos", topic:"AI Tools",
   title:"Make videos without filming every day using HeyGen",
   blurb:"Record your avatar once, then turn scripts into short videos for the week.",
   time:"90 min", cost:"Free plan"},
  {slug:"local-newsletter", topic:"Email",
   title:"Start a local newsletter that sends you referrals",
   blurb:"A weekly 5-item update for your town that keeps your sphere thinking of you.",
   time:"2 hrs", cost:"Free plan"},
  {slug:"google-maps-lead-list", topic:"Lead Gen",
   title:"Build a Google Maps lead list in 20 minutes",
   blurb:"Find local businesses to partner with or pitch, then load them into your CRM.",
   time:"20 min", cost:"$0"},
  {slug:"one-page-funnel", topic:"Automation",
   title:"The one-page funnel: offer, form, follow-up",
   blurb:"A single page with one offer, a short form, and an automatic follow-up sequence.",
   time:"2 hrs", cost:"$0–$97/mo"},
];

/* Replace each link:"#" with your affiliate link when you have it. */
const TOOLS = [
  {name:"HighLevel", use:"CRM + automation", link:"#",
   desc:"Your CRM, text and email follow-up, funnels, booking calendar, and missed-call text-back in one account.",
   replaces:"CRM, funnel builder, scheduler", start:"Missed-call text-back"},
  {name:"Claude", use:"AI assistant", link:"#",
   desc:"Writes follow-ups, listing copy, scripts, and research. Set it up once with your voice and offers.",
   replaces:"Hours of writing each week", start:"A follow-up writer project"},
  {name:"HeyGen", use:"AI video", link:"#",
   desc:"Record your avatar once, then make short videos from a script without filming every time.",
   replaces:"Daily filming", start:"3 market-update shorts"},
  {name:"Beehiiv", use:"Newsletter", link:"#",
   desc:"A local newsletter keeps your name in front of your sphere every week and turns readers into referrals.",
   replaces:"Random email blasts", start:"A weekly 5-item local update"},
  {name:"Systeme.io", use:"Funnels + courses", link:"#",
   desc:"A budget option for landing pages, a simple funnel, and selling a guide or mini-course.",
   replaces:"Separate page + checkout tools", start:"A one-page lead magnet"},
  {name:"Notion", use:"Ops hub", link:"#",
   desc:"One place for your scripts, SOPs, content calendar, and the checklists your team follows.",
   replaces:"Scattered docs + sticky notes", start:"A weekly content calendar"},
];

const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function playbookCard(p, feature){
  const inner = `
    <div class="card-top"><span class="label">${esc(p.topic)}</span>${p.live ? "" : '<span class="soon">Coming soon</span>'}</div>
    <h3>${esc(p.title)}</h3><p>${esc(p.blurb)}</p>
    <div class="meta"><span>Build <b>${esc(p.time)}</b></span><span>Cost <b>${esc(p.cost)}</b></span></div>`;
  const cls = "card" + (feature ? " feature" : "") + (p.live ? "" : " is-soon");
  return p.live
    ? `<a class="${cls}" href="/playbooks/${p.slug}/">${inner}</a>`
    : `<div class="${cls}">${inner}</div>`;
}

function toolCard(t){
  const ext = t.link && t.link !== "#";
  return `<article class="tool">
    <div class="tool-top"><h3>${esc(t.name)}</h3><span class="use">${esc(t.use)}</span></div>
    <p>${esc(t.desc)}</p>
    <dl><dt>Replaces</dt><dd>${esc(t.replaces)}</dd><dt>Start with</dt><dd>${esc(t.start)}</dd></dl>
    <a href="${esc(t.link)}"${ext ? ' target="_blank" rel="sponsored noopener"' : ""}>Try ${esc(t.name)} →</a>
  </article>`;
}

const $ = id => document.getElementById(id);

/* Home: 3 latest playbooks (live ones first) + top 3 tools */
if ($("home-grid")){
  const sorted = [...PLAYBOOKS].sort((a,b) => (b.live?1:0) - (a.live?1:0));
  $("home-grid").innerHTML = sorted.slice(0,3).map(p => playbookCard(p,false)).join("");
}
if ($("home-tools")) $("home-tools").innerHTML = TOOLS.slice(0,3).map(toolCard).join("");
if ($("tools-grid")) $("tools-grid").innerHTML = TOOLS.map(toolCard).join("");

/* Playbooks page: topic filter */
if ($("grid") && $("chips")){
  const cats = ["All", ...new Set(PLAYBOOKS.map(p => p.topic))];
  let active = "All";
  const render = () => {
    $("chips").innerHTML = cats.map(c => {
      const n = c === "All" ? PLAYBOOKS.length : PLAYBOOKS.filter(p => p.topic === c).length;
      return `<button class="chip" type="button" aria-pressed="${c===active}" data-c="${esc(c)}">${esc(c)}<small>${n}</small></button>`;
    }).join("");
    $("grid").innerHTML = PLAYBOOKS
      .filter(p => active === "All" || p.topic === active)
      .map(p => playbookCard(p, p.feature && active === "All")).join("");
  };
  $("chips").addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    active = b.dataset.c; render();
  });
  render();
}

/* Mobile menu */
const menu = $("menu"), menuBtn = $("menu-btn");
if (menu && menuBtn){
  menuBtn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
}

/* Copy buttons on playbook scripts */
document.querySelectorAll("[data-copy]").forEach(btn => {
  btn.addEventListener("click", async () => {
    const text = document.getElementById(btn.dataset.copy).innerText;
    try { await navigator.clipboard.writeText(text); btn.textContent = "Copied"; }
    catch(e){ btn.textContent = "Select + copy"; }
    setTimeout(() => btn.textContent = "Copy", 1800);
  });
});

/* Forms: preview only until the HighLevel forms are embedded */
const valid = v => /^\S+@\S+\.\S+$/.test(v.trim());
document.querySelectorAll(".nl-form").forEach(f => f.addEventListener("submit", e => {
  e.preventDefault();
  const n = f.nextElementSibling;
  n.textContent = valid(f.querySelector("input").value)
    ? "Preview only: this form isn't connected yet."
    : "Enter a valid email address.";
}));
const cf = $("contact-form");
if (cf) cf.addEventListener("submit", e => {
  e.preventDefault();
  const n = $("c-note");
  if (!$("c-name").value.trim()) n.textContent = "Add your name.";
  else if (!valid($("c-email").value)) n.textContent = "Enter a valid email address.";
  else if (!$("c-msg").value.trim()) n.textContent = "Add a message.";
  else n.textContent = "Preview only: this form isn't connected yet.";
});
