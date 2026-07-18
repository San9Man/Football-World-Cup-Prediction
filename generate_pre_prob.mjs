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

function simulateMatch(t1, t2) {
  const r1 = ratings[t1] || 1500, r2 = ratings[t2] || 1500;
  const score = sampleMatch(r1, r2, getHB(t1, t2), false);
  return score.goalsA > score.goalsB ? t1 : t2;
}

const TRIALS = 50000;
const counts = {};

for (const t in ratings) {
  counts[t] = { r32: 0, r16: 0, qf: 0, sf: 0, final: 0, champ: 0 };
}

console.log(`Running ${TRIALS} Monte Carlo simulations...`);

for (let trial = 0; trial < TRIALS; trial++) {
  const r32Teams = [];
  const thirdPlaceCandidates = [];

  // Group Stage
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
    r32Teams.push(rank[0], rank[1]);
    thirdPlaceCandidates.push({ team: rank[2], pts: pts[rank[2]], gd: gd[rank[2]], gf: gf[rank[2]] });
  }

  // Top 8 best 3rd place teams
  thirdPlaceCandidates.sort((a,b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || Math.random() - 0.5);
  for (let i = 0; i < 8; i++) {
    r32Teams.push(thirdPlaceCandidates[i].team);
  }

  r32Teams.forEach(t => { if (counts[t]) counts[t].r32++; });

  // R32 -> R16
  const r16Teams = [];
  for (let i = 0; i < 32; i += 2) {
    const winner = simulateMatch(r32Teams[i], r32Teams[i+1]);
    r16Teams.push(winner);
    if (counts[winner]) counts[winner].r16++;
  }

  // R16 -> QF
  const qfTeams = [];
  for (let i = 0; i < 16; i += 2) {
    const winner = simulateMatch(r16Teams[i], r16Teams[i+1]);
    qfTeams.push(winner);
    if (counts[winner]) counts[winner].qf++;
  }

  // QF -> SF
  const sfTeams = [];
  for (let i = 0; i < 8; i += 2) {
    const winner = simulateMatch(qfTeams[i], qfTeams[i+1]);
    sfTeams.push(winner);
    if (counts[winner]) counts[winner].sf++;
  }

  // SF -> Final
  const finalTeams = [];
  for (let i = 0; i < 4; i += 2) {
    const winner = simulateMatch(sfTeams[i], sfTeams[i+1]);
    finalTeams.push(winner);
    if (counts[winner]) counts[winner].final++;
  }

  // Final -> Champ
  const champion = simulateMatch(finalTeams[0], finalTeams[1]);
  if (counts[champion]) counts[champion].champ++;
}

const teamsOut = Object.keys(counts).map(slug => ({
  slug,
  pRound32: +(counts[slug].r32 / TRIALS).toFixed(4),
  pRound16: +(counts[slug].r16 / TRIALS).toFixed(4),
  pQuarterfinal: +(counts[slug].qf / TRIALS).toFixed(4),
  pSemifinal: +(counts[slug].sf / TRIALS).toFixed(4),
  pFinal: +(counts[slug].final / TRIALS).toFixed(4),
  pChampion: +(counts[slug].champ / TRIALS).toFixed(4)
})).sort((a, b) => b.pChampion - a.pChampion || b.pFinal - a.pFinal || b.pSemifinal - a.pSemifinal || (ratings[b.slug] - ratings[a.slug]));

writeFileSync("./data/probabilities-pre.json", JSON.stringify({ generatedAt: new Date().toISOString(), trials: TRIALS, teams: teamsOut }, null, 2));
console.log("✓ Pre-tournament probabilities generated!");
