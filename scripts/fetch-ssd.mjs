// Free auto pull from TTD official site. No key needed.
// Run: node scripts/fetch-ssd.mjs -> writes data/ssd.json
import { writeFile, mkdir } from "node:fs/promises";

const URLS = [
  "https://www.tirumala.org/",
  "https://www.tirumala.org/Current_Booking.aspx",
];

function pick(html, id) {
  const m = html.match(new RegExp(`id="${id}"[^>]*>([^<]*)<`, "i"));
  return m ? m[1].trim() : null;
}

function istDate(d = new Date()) {
  return new Date(d.getTime() + (d.getTimezoneOffset() + 330) * 60000).toISOString().slice(0, 10);
}

let found = null;
for (const u of URLS) {
  const r = await fetch(u, { headers: { "User-Agent": "Mozilla/5.0 SSDTokens-auto" } });
  if (!r.ok) continue;
  const html = await r.text();
  if (!html.includes("lblSlotName")) continue;
  found = {
    slot: pick(html, "cph_Home_lblSlotName"),
    slotDate: pick(html, "cph_Home_lblSlotDate"),
    balance: pick(html, "cph_Home_lblAvailableQuota"),
    note: pick(html, "cph_Home_lblNote"),
    source: u,
  };
  break;
}
if (!found) { console.error("SSD block not found"); process.exit(1); }

const balance = (found.balance || "").trim();
const status = balance === "0" ? "closed" : "issuing";
const now = new Date();

const out = {
  date: istDate(now),
  status,
  countersOpenAt: "05:00",
  slotDate: found.slotDate,
  runningSlot: found.slot,
  balance: found.balance,
  quotaNote: "Same-day only, ~10-15k/day till quota over",
  sources: URLS,
  verifiedAt: now.toISOString(),
  verifiedBy: "auto-TTD",
  note: found.note || ""
};

await mkdir("data", { recursive: true });
await writeFile("data/ssd.json", JSON.stringify(out, null, 2));
console.log("Wrote data/ssd.json:", JSON.stringify(out));
