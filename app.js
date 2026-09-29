// 100% free, no backend. All logic runs in browser on IST.
const counters = [
  { name: "Srinivasam Complex", area: "Opp. Tirupati Main Bus Stand", map: "https://www.google.com/maps/search/?api=1&query=Srinivasam+Complex+Tirupati" },
  { name: "Vishnu Nivasam", area: "Opp. Tirupati Railway Station", map: "https://www.google.com/maps/search/?api=1&query=Vishnu+Nivasam+Tirupati" },
  { name: "Bhudevi Complex", area: "Near Alipiri Bus Stand", map: "https://www.google.com/maps/search/?api=1&query=Bhudevi+Complex+Tirupati" },
];

function istNow() {
  const now = new Date();
  // IST = UTC+5:30
  const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
  return ist;
}

function todayStatus(d) {
  const h = d.getHours() + d.getMinutes() / 60;
  // Typical: open 5am, full by ~7:30am, closed evening
  if (h < 5) return { cls: "blue", label: "Not started yet", msg: "Counters usually open around 5:00 AM (midnight if heavy rush). Same-day tokens only." };
  if (h < 7.5) return { cls: "green", label: "Likely issuing", msg: "If you are near a counter now, join the line with Aadhaar. Quota often finishes by 7-8 AM." };
  if (h < 12) return { cls: "amber", label: "Likely full / closing", msg: "Quota (10-15k/day) usually exhausts by morning. Check counter, else go VQC-2." };
  return { cls: "red", label: "Closed for today", msg: "Offline SSD for today is over. Come early tomorrow. Alternative: Sarva Darshan at VQC-2." };
}

async function loadOfficial() {
  try {
    const r = await fetch("data/ssd.json", { cache: "no-store" });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

async function render() {
  const d = istNow();
  document.getElementById("todayDate").textContent = d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + " (IST)";
  const b = document.getElementById("todayBadge");
  const off = await loadOfficial();
  if (off && off.slotDate) {
    const statusMap = { issuing: "green", full: "amber", closed: "red", "not-started": "blue" };
    b.textContent = `${off.date}: ${off.status.toUpperCase()} - Slot ${off.runningSlot} on ${off.slotDate} - Balance ${off.balance}`;
    b.className = "badge " + (statusMap[off.status] || "blue");
    document.getElementById("todayMsg").textContent = `${off.note} Counters opened ${off.countersOpenAt} IST. Auto-updated at ${off.verifiedAt} by ${off.verifiedBy}. Sources: ${off.sources.join(", ")}`;
  } else {
    const s = todayStatus(d);
    b.textContent = s.label + " (auto update pending)";
    b.className = "badge " + s.cls;
    document.getElementById("todayMsg").textContent = s.msg;
  }

  document.getElementById("counterGrid").innerHTML = counters.map(c =>
    `<div class="counter"><h3>${c.name}</h3><p>${c.area}</p><p>Opens ~5:00 AM till quota over</p><a href="${c.map}" target="_blank" rel="noopener">Directions &rarr;</a></div>`
  ).join("");
}
render();
setInterval(render, 60000);
