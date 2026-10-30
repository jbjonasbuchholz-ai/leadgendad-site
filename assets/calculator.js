/* Lead Gen Dad — income goal calculator.
   All math runs in the browser. Nothing is saved or sent anywhere. */
(function () {
  const $ = id => document.getElementById(id);
  const PRESETS = {
    cold:     { contact: 40, appt: 25, close: 25 },
    warm:     { contact: 60, appt: 40, close: 35 },
    referral: { contact: 90, appt: 60, close: 50 },
  };
  const money = n => "$" + Math.round(n).toLocaleString("en-US");
  const num = (n, d = 0) => Number.isFinite(n)
    ? n.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: 0 })
    : "–";
  const val = id => parseFloat($(id).value);

  function calc() {
    const goal = val("goal"), exp = val("expenses") || 0, price = val("price");
    const comm = val("commission"), split = val("split"), sellers = val("sellers");
    const c = val("contact") / 100, a = val("appt") / 100, k = val("close") / 100;

    $("sellers-out").textContent = `${sellers}% sellers · ${100 - sellers}% buyers`;

    const err = $("calc-error");
    const problems = [];
    if (!(goal > 0)) problems.push("Enter a monthly goal above $0.");
    if (!(price > 0) || !(comm > 0) || !(split > 0)) problems.push("Sale price, commission, and split all need to be above 0.");
    if (!(exp >= 0 && exp < 100)) problems.push("Business expenses must be between 0% and 99%.");
    if (!(c > 0 && a > 0 && k > 0) || c > 1 || a > 1 || k > 1) problems.push("Funnel rates must be between 1% and 100%.");
    if (problems.length) {
      err.textContent = problems.join(" ");
      err.hidden = false;
      return;
    }
    err.hidden = true;

    const annual = (goal * 12) / (1 - exp / 100);
    const perClose = price * (comm / 100) * (split / 100);
    const closings = Math.ceil(annual / perClose);
    const sellerDeals = Math.round(closings * sellers / 100);
    const lpc = 1 / (c * a * k);
    const appts = closings / k;
    const convs = appts / a;
    const leads = convs / c;

    $("r-goal").textContent = money(goal);
    $("r-closings").textContent = num(closings);
    $("r-annual").textContent = money(annual);
    $("r-per").textContent = money(perClose);
    $("r-mix").textContent = `${sellerDeals} / ${closings - sellerDeals}`;
    $("r-lpc").textContent = num(lpc, 1);

    const rows = { leads, conv: convs, appt: appts, close: closings };
    for (const [key, yearly] of Object.entries(rows)) {
      $("y-" + key).textContent = num(Math.ceil(yearly));
      $("m-" + key).textContent = num(yearly / 12, 1);
      $("w-" + key).textContent = num(yearly / 52, 1);
    }

    // Which single 10-point improvement saves the most leads per year?
    const options = [
      ["talk to 10% more of your leads", Math.min(c + 0.1, 1), a, k, "the missed-call text-back and speed-to-lead playbooks"],
      ["book 10% more of your conversations", c, Math.min(a + 0.1, 1), k, "tighter call scripts"],
      ["close 10% more of your appointments", c, a, Math.min(k + 0.1, 1), "better follow-up after appointments"],
    ].map(([label, c2, a2, k2, fix]) => ({ label, fix, saved: leads - closings / (c2 * a2 * k2) }));
    const best = options.sort((x, y) => y.saved - x.saved)[0];
    $("leak-text").textContent = best.saved > 0.5
      ? `If you ${best.label}, you'd need about ${num(Math.round(best.saved))} fewer leads a year (${num(best.saved / 12, 0)} fewer a month) for the same income. Start with ${best.fix}.`
      : "Your funnel is already tight. More leads is the main lever now.";
  }

  function setPreset(name) {
    const p = PRESETS[name];
    for (const k of ["contact", "appt", "close"]) $(k).value = p[k];
    document.querySelectorAll("[data-preset]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.preset === name)));
    calc();
  }

  document.querySelectorAll("[data-preset]").forEach(b => b.addEventListener("click", () => setPreset(b.dataset.preset)));
  ["contact", "appt", "close"].forEach(id => $(id).addEventListener("input", () =>
    document.querySelectorAll("[data-preset]").forEach(b => b.setAttribute("aria-pressed", "false"))));
  $("calc-form").addEventListener("input", calc);
  $("calc-form").addEventListener("submit", e => e.preventDefault());
  calc();
})();
