const QS = [
  { q: "Don't stop when you're tired. Stop when you're done.", a: "David Goggins" },
  { q: "Success isn't owned. It's rented. And rent is due every day.", a: "J.J. Watt" },
  { q: "Be so good they can't ignore you.", a: "Steve Martin" },
  { q: "Nobody cares. Work harder.", a: "Cameron Hanes" },
  { q: "Suffer the pain of discipline or suffer the pain of regret.", a: "Jim Rohn" },
  { q: "Your 9-to-5 builds someone else's dream. Your 6-to-midnight builds yours.", a: "Unknown" },
  { q: "Brick by brick. Commit by commit. You're building an empire.", a: "Unknown" },
  { q: "The harder you work, the luckier you get.", a: "Gary Player" },
];

const rq = QS[Math.floor(Math.random() * QS.length)];
document.getElementById("qt").textContent = '"' + rq.q + '"';
document.getElementById("qa").textContent = "— " + rq.a;

const mt = document.getElementById("mt");
const tg = document.getElementById("tg");
const tc = document.getElementById("tc");
const tp = document.getElementById("tp");
const sp = document.getElementById("sp");
const stx = document.getElementById("stx");

function upd(on) {
  sp.className = on ? "st on" : "st off";
  stx.textContent = on ? "Focus Mode Active" : "Focus Mode Off";
}

function save() {
  const cfg = {
    enabled: mt.checked,
    categories: { growth: tg.checked, coding: tc.checked, comptia: tp.checked },
  };
  chrome.storage.sync.set({ ytFocusConfig: cfg });
  upd(cfg.enabled);
}

chrome.storage.sync.get("ytFocusConfig", (data) => {
  const c = data.ytFocusConfig || { enabled: true, categories: { growth: true, coding: true, comptia: true } };
  mt.checked = c.enabled;
  tg.checked = c.categories.growth;
  tc.checked = c.categories.coding;
  tp.checked = c.categories.comptia;
  upd(c.enabled);
});

[mt, tg, tc, tp].forEach((el) => el.addEventListener("change", save));
