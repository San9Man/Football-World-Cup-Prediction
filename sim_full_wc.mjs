import { readFileSync, writeFileSync } from "node:fs";
import { matchProb, sampleMatch } from "./elo.mjs";

const { ratings } = JSON.parse(readFileSync("./data/elo-calibrated.json", "utf8"));

const GROUPS = {
  A: ["mexico", "south-korea", "czech-republic", "south-africa"],
  B: ["canada", "switzerland", "bosnia-and-herzegovina", "qatar"],
  C: ["brazil", "morocco", "scotland", "haiti"],
  D: ["usa", "australia", "turkey", "paraguay"],
  E: ["germany", "ivory-coast", "ecuador", "curacao"],
  F: ["netherlands", "japan", "sweden", "tunisia"],
  G: ["belgium", "egypt", "iran", "new-zealand"],
  H: ["spain", "uruguay", "saudi-arabia", "cape-verde"],
  I: ["france", "senegal", "norway", "iraq"],
  J: ["argentina", "austria", "algeria", "jordan"],
  K: ["portugal", "colombia", "dr-congo", "uzbekistan"],
  L: ["england", "croatia", "ghana", "panama"]
};

const HOSTS = new Set(["mexico", "usa", "canada"]);
const getHB = (t1, t2) => (HOSTS.has(t1) ? 75 : 0) - (HOSTS.has(t2) ? 75 : 0);

function simulateOneTournament() {
  const stats = {};
  for (const g in GROUPS) {
    const teams = GROUPS[g];
    const pts = { [teams[0]]: 0, [teams[1]]: 0, [teams[2]]: 0, [teams[3]]: 0 };
    const gd = { [teams[0]]: 0, [teams[1]]: 0, [teams[2]]: 0, [teams[3]]: 0 };
    const gf = { [teams[0]]: 0, [teams[1]]: 0, [teams[2]]: 0, [teams[3]]: 0 };

    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        const t1 = teams[i], t2 = teams[j];
        const r1 = ratings[t1] || 1500, r2 = ratings[t2] || 1500;
        const score = sampleMatch(r1, r2, getHB(t1, t2), true);
        gf[t1] += score.goalsA; gf[t2] += score.goalsB;
        gd[t1] += score.goalsA - score.goalsB; gd[t2] += score.goalsB - score.goalsA;
        if (score.goalsA > score.goalsB) pts[t1] += 3;
        else if (score.goalsA < score.goalsB) pts[t2] += 3;
        else { pts[t1] += 1; pts[t2] += 1; }
      }
    }

    const rank = [...teams].sort((a, b) => pts[b] - pts[a] || gd[b] - gd[a] || gf[b] - gf[a] || Math.random() - 0.5);
    stats[g] = rank;
  }
  return stats;
}

console.log("Simulating 1,000 tournaments test...");
const counts = {};
for (let i = 0; i < 1000; i++) {
  const res = simulateOneTournament();
  for (const g in res) {
    res[g].slice(0, 2).forEach(t => { counts[t] = (counts[t] || 0) + 1; });
  }
}

console.log("Top 10 teams advancing from group stage in simulation:");
Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 10).forEach(([t, cnt]) => {
  console.log(`- ${t.padEnd(16)} | ${(cnt / 1000 * 100).toFixed(1)}% group advance rate`);
});
