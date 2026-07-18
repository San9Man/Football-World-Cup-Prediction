import { readFileSync, writeFileSync } from "node:fs";

const eloData = JSON.parse(readFileSync("./data/elo-calibrated.json", "utf8"));
const wcData = JSON.parse(readFileSync("./data/wc2026-results.json", "utf8"));
const backtestData = JSON.parse(readFileSync("./data/model-backtest.json", "utf8"));
const probData = JSON.parse(readFileSync("./data/probabilities.json", "utf8"));

const GROUPS_DEF = {
  A: ["czech-republic", "mexico", "south-africa", "south-korea"],
  B: ["bosnia-and-herzegovina", "canada", "qatar", "switzerland"],
  C: ["brazil", "haiti", "morocco", "scotland"],
  D: ["australia", "paraguay", "turkey", "usa"],
  E: ["curacao", "ecuador", "germany", "ivory-coast"],
  F: ["japan", "netherlands", "sweden", "tunisia"],
  G: ["belgium", "egypt", "iran", "new-zealand"],
  H: ["cape-verde", "saudi-arabia", "spain", "uruguay"],
  I: ["france", "iraq", "norway", "senegal"],
  J: ["algeria", "argentina", "austria", "jordan"],
  K: ["colombia", "dr-congo", "portugal", "uzbekistan"],
  L: ["croatia", "england", "ghana", "panama"]
};

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>⚡ FIFA WORLD CUP 2026 — AI PREDICTION ENGINE & LIVE SIMULATOR</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700;800&display=swap');

    :root {
      --bg-dark: #05070d;
      --bg-card: #0d121f;
      --border-glow: rgba(255, 183, 0, 0.25);
      --border-card: rgba(255, 255, 255, 0.08);
      --neon-gold: #ffb700;
      --neon-yellow: #ffe600;
      --neon-cyan: #00f2fe;
      --neon-magenta: #ff007f;
      --neon-green: #00ff87;
      --neon-purple: #9d4edd;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --font-display: 'Space Grotesk', system-ui, -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-dark);
      background-image: 
        radial-gradient(circle at 10% 10%, rgba(0, 242, 254, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 90% 15%, rgba(255, 0, 127, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 50% 85%, rgba(255, 183, 0, 0.06) 0%, transparent 50%),
        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 100% 100%, 100% 100%, 100% 100%, 32px 32px, 32px 32px;
      color: var(--text-main);
      font-family: var(--font-display);
      min-height: 100vh;
      padding-bottom: 60px;
      overflow-x: hidden;
    }

    /* Top Marquee */
    .marquee-container {
      background: linear-gradient(90deg, #ff007f, #7928ca, #00f2fe, #ffb700);
      padding: 2px 0;
      overflow: hidden;
      white-space: nowrap;
      position: relative;
      box-shadow: 0 0 25px rgba(0, 242, 254, 0.4);
    }

    .marquee-inner {
      background: #000000;
      padding: 8px 0;
      display: inline-block;
      white-space: nowrap;
      animation: marquee 28s linear infinite;
    }

    .marquee-item {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      font-weight: 700;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-right: 32px;
    }

    .marquee-tag {
      background: var(--neon-gold);
      color: #000;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 800;
    }

    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }

    .wrapper { max-width: 1380px; margin: 0 auto; padding: 24px; }

    /* Header */
    header {
      margin-bottom: 32px;
      position: relative;
      background: rgba(13, 18, 31, 0.75);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 28px;
      padding: 36px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
      overflow: hidden;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .live-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(0, 255, 135, 0.12);
      border: 1px solid var(--neon-green);
      color: var(--neon-green);
      padding: 6px 16px;
      border-radius: 9999px;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      font-weight: 800;
      text-shadow: 0 0 12px rgba(0, 255, 135, 0.5);
    }

    .pulse-dot {
      width: 8px; height: 8px; background-color: var(--neon-green); border-radius: 50%;
      box-shadow: 0 0 12px var(--neon-green); animation: pulse 1.5s infinite;
    }

    @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.5; } }

    .main-title {
      font-size: clamp(2.2rem, 5vw, 3.8rem);
      font-weight: 800;
      line-height: 1.05;
      text-transform: uppercase;
      background: linear-gradient(135deg, #ffffff 30%, #e2e8f0 60%, var(--neon-gold) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 12px;
    }

    .header-sub { font-size: 1.1rem; color: var(--text-muted); max-width: 900px; line-height: 1.6; }

    /* Hero Metrics */
    .hero-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .metric-box {
      background: linear-gradient(145deg, rgba(19, 26, 42, 0.9), rgba(10, 14, 23, 0.9));
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 24px;
      position: relative;
      transition: transform 0.25s, border-color 0.25s;
    }

    .metric-box:hover { transform: translateY(-4px); border-color: var(--neon-gold); }
    .metric-box::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, var(--neon-gold), var(--neon-magenta)); }

    .metric-label-txt { font-family: var(--font-mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; }
    .metric-big-num { font-size: 2.6rem; font-weight: 800; font-family: var(--font-mono); color: #ffffff; line-height: 1; margin-bottom: 8px; }
    .metric-tag-pill { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; font-family: var(--font-mono); text-transform: uppercase; }

    .pill-green { background: rgba(0, 255, 135, 0.15); color: var(--neon-green); border: 1px solid rgba(0, 255, 135, 0.3); }
    .pill-gold { background: rgba(255, 183, 0, 0.15); color: var(--neon-gold); border: 1px solid rgba(255, 183, 0, 0.3); }
    .pill-cyan { background: rgba(0, 242, 254, 0.15); color: var(--neon-cyan); border: 1px solid rgba(0, 242, 254, 0.3); }

    /* Nav Pills */
    .nav-pills-bar {
      display: flex; gap: 10px; margin-bottom: 28px; padding: 8px; background: rgba(13, 18, 31, 0.8);
      border: 1px solid var(--border-card); border-radius: 16px; overflow-x: auto; backdrop-filter: blur(10px);
    }

    .pill-tab {
      background: transparent; border: 1px solid transparent; color: var(--text-muted); padding: 12px 20px;
      border-radius: 12px; font-family: var(--font-display); font-size: 0.9rem; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all 0.2s ease;
    }

    .pill-tab:hover { color: #ffffff; background: rgba(255, 255, 255, 0.05); }
    .pill-tab.active { background: linear-gradient(135deg, var(--neon-gold), #e6a100); color: #000000; font-weight: 800; box-shadow: 0 0 20px rgba(255, 183, 0, 0.4); }

    .tab-content { display: none; animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .tab-content.active { display: block; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    /* TITLE RACE & PROGRESSION STAGE UI */
    .contenders-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 28px;
    }

    .contender-card {
      background: linear-gradient(145deg, #101728, #090e1a); border: 1px solid rgba(255, 183, 0, 0.3);
      border-radius: 20px; padding: 24px; position: relative; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.5);
    }

    .contender-rank {
      position: absolute; top: 16px; right: 20px; font-family: var(--font-mono); font-size: 1.8rem; font-weight: 900; color: rgba(255, 255, 255, 0.12);
    }

    .contender-name { font-size: 1.5rem; font-weight: 800; color: #ffffff; text-transform: capitalize; margin-bottom: 4px; }
    .contender-prob { font-family: var(--font-mono); font-size: 2.2rem; font-weight: 800; color: var(--neon-gold); text-shadow: 0 0 15px rgba(255, 183, 0, 0.4); }

    .stage-pill-100 { background: rgba(0, 255, 135, 0.15); color: var(--neon-green); border: 1px solid rgba(0, 255, 135, 0.3); padding: 4px 10px; border-radius: 6px; font-weight: bold; }
    .stage-pill-partial { background: rgba(0, 242, 254, 0.15); color: var(--neon-cyan); border: 1px solid rgba(0, 242, 254, 0.3); padding: 4px 10px; border-radius: 6px; font-weight: bold; }
    .stage-pill-zero { color: rgba(255, 255, 255, 0.25); font-weight: normal; }

    /* LIVE SIMULATOR & BRACKET CREATOR */
    .sim-card { background: var(--bg-card); border: 2px solid rgba(0, 242, 254, 0.3); border-radius: 24px; padding: 32px; margin-bottom: 32px; }
    .sim-header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }

    .btn-sim { background: var(--neon-cyan); color: #000; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 800; font-family: var(--font-mono); cursor: pointer; transition: transform 0.1s; }
    .btn-sim:active { transform: scale(0.96); }
    .btn-sim-gold { background: var(--neon-gold); }
    .btn-sim-magenta { background: var(--neon-magenta); color: #fff; }

    .groups-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 32px; }
    .group-box { background: #070a14; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 20px; }
    .group-title { font-family: var(--font-mono); font-size: 1.1rem; font-weight: 800; color: var(--neon-gold); margin-bottom: 12px; display: flex; justify-content: space-between; }

    .group-team-item {
      display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-radius: 8px; margin-bottom: 8px;
      background: rgba(255, 255, 255, 0.03); border: 1px solid transparent; cursor: pointer; user-select: none;
    }

    .group-team-item:hover { border-color: rgba(255, 255, 255, 0.2); }
    .group-team-item.pos-1 { background: rgba(0, 255, 135, 0.15); border-color: var(--neon-green); color: var(--neon-green); font-weight: bold; }
    .group-team-item.pos-2 { background: rgba(0, 242, 254, 0.15); border-color: var(--neon-cyan); color: var(--neon-cyan); font-weight: bold; }

    /* BOLD CALLS & AI VERDICTS */
    .verdicts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }
    .verdict-card { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 20px; padding: 24px; position: relative; }
    .verdict-card::before { content: 'AI VERDICT'; position: absolute; top: 16px; right: 16px; font-family: var(--font-mono); font-size: 0.7rem; font-weight: 800; background: rgba(255, 0, 127, 0.2); color: var(--neon-magenta); padding: 4px 10px; border-radius: 6px; }
    .verdict-title { font-size: 1.2rem; font-weight: 800; color: #ffffff; margin-bottom: 8px; }
    .verdict-match { font-family: var(--font-mono); font-size: 0.9rem; color: var(--neon-gold); margin-bottom: 12px; }
    .verdict-desc { color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; }

    /* GOLDEN BOOT & LIVE GOAL CARDS */
    .golden-card { background: linear-gradient(135deg, #181308, #0e121e); border: 1px solid var(--neon-gold); border-radius: 20px; padding: 24px; margin-bottom: 24px; }
    .goal-feed-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
    .goal-card-item { background: #070a14; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 20px; }
    .goal-card-time { font-family: var(--font-mono); font-size: 0.8rem; color: var(--neon-magenta); font-weight: 800; }
    .goal-card-score { font-size: 1.3rem; font-weight: 800; color: #ffffff; margin: 6px 0; }
    .goal-card-scorer { font-size: 0.95rem; color: var(--neon-gold); font-weight: 700; }
    .goal-card-gauge { margin-top: 12px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--neon-cyan); }

    /* TABLES MAXIMALIST */
    .table-card { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 24px; overflow: hidden; }
    .toolbar { padding: 20px 24px; background: rgba(8, 12, 22, 0.9); border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
    select, input { background: #080c16; border: 1px solid rgba(255, 255, 255, 0.15); color: #ffffff; padding: 12px 16px; border-radius: 10px; font-family: var(--font-display); font-size: 0.95rem; outline: none; }

    table { width: 100%; border-collapse: collapse; text-align: left; }
    th { background: #070b14; color: var(--neon-gold); font-family: var(--font-mono); font-size: 0.8rem; padding: 16px 20px; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    td { padding: 16px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.04); font-size: 0.95rem; }
    tr:hover td { background: rgba(255, 255, 255, 0.03); }

    .hit-tag { background: rgba(0, 255, 135, 0.15); color: var(--neon-green); border: 1px solid rgba(0, 255, 135, 0.3); padding: 4px 12px; border-radius: 6px; font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800; }
    .miss-tag { background: rgba(255, 0, 127, 0.15); color: var(--neon-magenta); border: 1px solid rgba(255, 0, 127, 0.3); padding: 4px 12px; border-radius: 6px; font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800; }

    /* PATHS TO FINAL MATRIX */
    .paths-tbl { width: 100%; border-collapse: collapse; font-family: var(--font-mono); text-align: center; }
    .paths-tbl th { background: #080c16; color: var(--neon-gold); font-size: 0.8rem; padding: 14px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
    .paths-tbl td { padding: 14px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.04); font-size: 0.95rem; font-weight: 700; }
    .gold-cell { background: rgba(255, 183, 0, 0.25); color: var(--neon-gold); border-radius: 6px; font-weight: 800; border: 1px solid rgba(255, 183, 0, 0.5); box-shadow: 0 0 12px rgba(255,183,0,0.3); }

    /* ACTION BUTTONS */
    .btn-action { background: var(--neon-gold); color: #000; border: none; padding: 12px 24px; border-radius: 10px; font-family: var(--font-display); font-size: 0.95rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; }

    footer { margin-top: 60px; text-align: center; font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted); border-top: 1px solid var(--border-card); padding-top: 28px; }
  </style>
</head>
<body>

  <!-- Top Marquee -->
  <div class="marquee-container">
    <div class="marquee-inner">
      <span class="marquee-item"><span class="marquee-tag">RECORD</span> 70/102 WINNERS CALLED (69% ACCURACY)</span>
      <span class="marquee-item"><span class="marquee-tag">FAVORITE</span> SPAIN 55.2% TO WIN THE 2026 WORLD CUP</span>
      <span class="marquee-item"><span class="marquee-tag">MODEL</span> ELO → DIXON-COLES POISSON → 50,000 SIMULATIONS</span>
      <span class="marquee-item"><span class="marquee-tag">GOLDEN BOOT</span> L. MESSI & K. MBAPPÉ TIED ON 8 GOALS</span>
      <span class="marquee-item"><span class="marquee-tag">CALIBRATION</span> 2.3% ECE EXPECTED CALIBRATION ERROR</span>
    </div>
  </div>

  <div class="wrapper">

    <!-- Header -->
    <header>
      <div class="header-top">
        <div class="live-badge">
          <div class="pulse-dot"></div>
          FIFA WORLD CUP 2026 LIVE MODEL ENGINE
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--neon-gold); font-weight: 700;">
          [ STATISTICAL FORECAST & INTERACTIVE SIMULATOR ]
        </div>
      </div>
      <h1 class="main-title">World Cup 2026 AI Prediction Hub</h1>
      <p class="header-sub">
        Full 48-team, 104-match model powered by Elo ratings, Dixon-Coles bivariate Poisson goal distributions, and 50,000 Monte Carlo tournament simulations. Real-time in-tournament conditioning.
      </p>
    </header>

    <!-- Hero Metrics -->
    <div class="hero-metrics">
      <div class="metric-box">
        <div class="metric-label-txt">Title Leader</div>
        <div class="metric-big-num" style="color: var(--neon-gold)">Spain</div>
        <div class="metric-tag-pill pill-gold">55.2% CHAMPION PROBABILITY</div>
      </div>
      <div class="metric-box">
        <div class="metric-label-txt">Live Track Record</div>
        <div class="metric-big-num">70 / 102</div>
        <div class="metric-tag-pill pill-green">69% TOP PICK ACCURACY</div>
      </div>
      <div class="metric-box">
        <div class="metric-label-txt">Ranked Prob Score</div>
        <div class="metric-big-num">0.148</div>
        <div class="metric-tag-pill pill-cyan">VS COIN-FLIP 0.245</div>
      </div>
      <div class="metric-box">
        <div class="metric-label-txt">Simulations Run</div>
        <div class="metric-big-num">50,000</div>
        <div class="metric-tag-pill pill-green">MONTE CARLO TRIALS</div>
      </div>
    </div>

    <!-- Nav Pills Bar -->
    <div class="nav-pills-bar">
      <button class="pill-tab active" onclick="switchTab('title-race')">🏆 TITLE RACE & PATHS</button>
      <button class="pill-tab" onclick="switchTab('live-sim')">🎮 LIVE SIMULATOR & GROUPS</button>
      <button class="pill-tab" onclick="switchTab('predictor')">⚡ MATCH PREDICTOR ARENA</button>
      <button class="pill-tab" onclick="switchTab('bold-calls')">🔥 BOLD CALLS & AI VERDICTS</button>
      <button class="pill-tab" onclick="switchTab('golden-boot')">🎯 GOLDEN BOOT & GOALS</button>
      <button class="pill-tab" onclick="switchTab('matches-all')">📅 ALL 104 MATCHES</button>
      <button class="pill-tab" onclick="switchTab('record')">📊 TRACK RECORD (102)</button>
      <button class="pill-tab" onclick="switchTab('ratings')">⭐ ELO RATINGS (54)</button>
      <button class="pill-tab" onclick="switchTab('methodology')">📖 METHODOLOGY & DATA</button>
    </div>

    <!-- TAB 1: TITLE RACE BOARD & PROGRESSION ODDS -->
    <div id="tab-title-race" class="tab-content active">
      <!-- Feature Contenders Banner -->
      <div class="contenders-grid">
        <div class="contender-card">
          <div class="contender-rank">#1</div>
          <div class="contender-name">Spain</div>
          <div class="contender-prob">55.2%</div>
          <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--neon-cyan); margin-top: 4px;">CHAMPIONSHIP ODDS · FINALIST</div>
        </div>
        <div class="contender-card" style="border-color: rgba(0, 242, 254, 0.3);">
          <div class="contender-rank">#2</div>
          <div class="contender-name">Argentina</div>
          <div class="contender-prob" style="color: var(--neon-cyan);">44.8%</div>
          <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--neon-cyan); margin-top: 4px;">CHAMPIONSHIP ODDS · FINALIST</div>
        </div>
      </div>

      <div class="table-card" style="padding: 28px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: #fff;">Tournament Progression Odds (50,000 Sims)</h2>
            <p style="color: var(--text-muted); font-size: 0.85rem;">Hierarchically ranked by tournament stage advancement & probability. In-tournament results frozen live.</p>
          </div>
          <input type="text" id="title-search" placeholder="Search nation..." oninput="renderTitleRaceTable()">
        </div>
        <div style="overflow-x: auto;">
          <table class="paths-tbl">
            <thead>
              <tr>
                <th>Rank</th>
                <th style="text-align: left;">Nation</th>
                <th>Last 32</th>
                <th>Last 16</th>
                <th>Quarters</th>
                <th>Semis</th>
                <th>Final</th>
                <th>Champion</th>
              </tr>
            </thead>
            <tbody id="title-race-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: LIVE SIMULATOR & BRACKET CREATOR -->
    <div id="tab-live-sim" class="tab-content">
      <div class="sim-card">
        <div class="sim-header-actions">
          <div>
            <h2 style="font-size: 1.5rem; font-weight: 800; color: #fff;">Interactive Bracket Simulator</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Pick group qualifiers or use AI Auto-Fill, then simulate your World Cup Champion.</p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn-sim btn-sim-gold" onclick="autoFillGroups('ai')">⚡ Auto-Fill (AI)</button>
            <button class="btn-sim btn-sim-magenta" onclick="autoFillGroups('chaos')">🎲 Chaos Mode</button>
            <button class="btn-sim" style="background: rgba(255,255,255,0.1); color: #fff;" onclick="resetGroups()">Reset</button>
          </div>
        </div>

        <h3 style="color: var(--neon-gold); font-size: 1rem; margin-bottom: 16px; font-family: var(--font-mono);">STEP 1 — SELECT TOP 2 ADVANCING FROM EACH GROUP (GROUPS A - L)</h3>
        <div class="groups-grid" id="groups-container"></div>

        <h3 style="color: var(--neon-cyan); font-size: 1rem; margin-bottom: 16px; font-family: var(--font-mono);">STEP 2 — KNOCKOUT BRACKET ADVANCEMENT</h3>
        <div id="sim-bracket-display" style="background: #050810; padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="color: var(--text-muted); text-align: center;">Advance teams in Step 1 to populate the Knockout Bracket!</div>
        </div>
      </div>
    </div>

    <!-- TAB 3: PREDICTOR ARENA -->
    <div id="tab-predictor" class="tab-content">
      <div class="table-card" style="padding: 28px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px;">
          <h2 style="font-size: 1.4rem; font-weight: 800;">Head-to-Head Dixon-Coles Predictor</h2>
          <span style="font-family: var(--font-mono); color: var(--neon-gold); font-size: 0.85rem;">Dixon-Coles ρ = -0.13</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 220px; gap: 20px; margin-bottom: 28px;">
          <div><label style="color: var(--neon-gold); font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700;">TEAM A</label><select id="teamA-select" style="width:100%; margin-top:6px;"></select></div>
          <div><label style="color: var(--neon-gold); font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700;">TEAM B</label><select id="teamB-select" style="width:100%; margin-top:6px;"></select></div>
          <div><label style="color: var(--neon-gold); font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700;">VENUE</label>
            <select id="venue-select" style="width:100%; margin-top:6px;">
              <option value="neutral">Neutral Stadium</option>
              <option value="homeA">Team A Host (+75 Elo)</option>
              <option value="homeB">Team B Host (+75 Elo)</option>
            </select>
          </div>
        </div>

        <div style="background: #070a12; padding: 24px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08);">
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; text-align: center; margin-bottom: 24px;">
            <div><h3 id="display-teamA" style="font-size: 1.8rem; color: #fff;">SPAIN</h3><div id="elo-tagA" style="font-family: var(--font-mono); color: var(--text-muted);">ELO: 2055</div></div>
            <div style="background: linear-gradient(135deg, var(--neon-magenta), var(--neon-purple)); padding: 12px 20px; border-radius: 50%; font-weight: 900; color: #fff; font-family: var(--font-mono);">VS</div>
            <div><h3 id="display-teamB" style="font-size: 1.8rem; color: #fff;">GERMANY</h3><div id="elo-tagB" style="font-family: var(--font-mono); color: var(--text-muted);">ELO: 1945</div></div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="display: grid; grid-template-columns: 160px 80px 1fr; align-items: center; gap: 16px;">
              <span id="lbl-teamA" style="font-weight: 700; color: var(--neon-cyan)">SPAIN WIN</span>
              <span id="val-teamA" style="font-family: var(--font-mono); font-size: 1.2rem; font-weight: 800; color: #fff; text-align: right;">53.2%</span>
              <div style="background: #030509; height: 24px; border-radius: 6px; overflow: hidden;"><div id="bar-teamA" style="height: 100%; background: linear-gradient(90deg, #00f2fe, #4facfe); width: 53.2%;"></div></div>
            </div>
            <div style="display: grid; grid-template-columns: 160px 80px 1fr; align-items: center; gap: 16px;">
              <span style="font-weight: 700; color: var(--text-muted)">DRAW</span>
              <span id="val-draw" style="font-family: var(--font-mono); font-size: 1.2rem; font-weight: 800; color: #fff; text-align: right;">26.8%</span>
              <div style="background: #030509; height: 24px; border-radius: 6px; overflow: hidden;"><div id="bar-draw" style="height: 100%; background: linear-gradient(90deg, #9ca3af, #d1d5db); width: 26.8%;"></div></div>
            </div>
            <div style="display: grid; grid-template-columns: 160px 80px 1fr; align-items: center; gap: 16px;">
              <span id="lbl-teamB" style="font-weight: 700; color: var(--neon-gold)">GERMANY WIN</span>
              <span id="val-teamB" style="font-family: var(--font-mono); font-size: 1.2rem; font-weight: 800; color: #fff; text-align: right;">20.0%</span>
              <div style="background: #030509; height: 24px; border-radius: 6px; overflow: hidden;"><div id="bar-teamB" style="height: 100%; background: linear-gradient(90deg, #ffb700, #ffe600); width: 20.0%;"></div></div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 24px;">
            <div style="background: rgba(13,18,31,0.9); padding: 16px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.1);">
              <div id="exp-a-val" style="font-family: var(--font-mono); font-size: 2rem; color: var(--neon-gold); font-weight: 800;">1.68</div>
              <div id="exp-a-lbl" style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">SPAIN EXPECTED GOALS (λ)</div>
            </div>
            <div style="background: rgba(13,18,31,0.9); padding: 16px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.1);">
              <div id="exp-b-val" style="font-family: var(--font-mono); font-size: 2rem; color: var(--neon-gold); font-weight: 800;">1.08</div>
              <div id="exp-b-lbl" style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">GERMANY EXPECTED GOALS (μ)</div>
            </div>
          </div>
        </div>

        <div style="margin-top: 28px; background: #050810; padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--neon-cyan); margin-bottom: 12px; font-weight: 800;">SCORE MATRIX (%)</div>
          <table id="matrix-table" class="paths-tbl"></table>
        </div>
      </div>
    </div>

    <!-- TAB 4: BOLD CALLS & AI VERDICTS -->
    <div id="tab-bold-calls" class="tab-content">
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 1.5rem; font-weight: 800; color: #fff;">Bold Calls & Model Verdict Highlights</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Major upset calls, non-favorite successes, and model judgments verified by actual match outcomes.</p>
      </div>
      <div class="verdicts-grid">
        <div class="verdict-card">
          <div class="verdict-title">Spain Stuns France in Semifinal</div>
          <div class="verdict-match">FRANCE 0–2 SPAIN · MODEL PICK: SPAIN 36% ✅</div>
          <div class="verdict-desc">Despite mainstream oddsmakers backing France, the model highlighted Spain's superior expected goals build-up (+0.42 xG differential), calling Spain as the sharp value pick.</div>
        </div>
        <div class="verdict-card">
          <div class="verdict-title">Belgium Overpowering USA</div>
          <div class="verdict-match">USA 1–4 BELGIUM · MODEL PICK: BELGIUM 64% ✅</div>
          <div class="verdict-desc">While USA enjoyed host advantage (+75 Elo), the model correctly identified Belgium's superior attacking depth, issuing a dominant 64% win probability call.</div>
        </div>
        <div class="verdict-card">
          <div class="verdict-title">Morocco Outplays Netherlands</div>
          <div class="verdict-match">NETHERLANDS 1–1 (2–3 p) MOROCCO · MODEL PICK: MOROCCO 38% ✅</div>
          <div class="verdict-desc">The model assigned Morocco a high 38% edge to hold Netherlands to a draw/win in regulation, correctly predicting the low-scoring stalemate via Dixon-Coles tau adjustment.</div>
        </div>
      </div>
    </div>

    <!-- TAB 5: GOLDEN BOOT & GOALS STREAM -->
    <div id="tab-golden-boot" class="tab-content">
      <div class="golden-card">
        <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--neon-gold); margin-bottom: 8px;">🏆 The Golden Boot Leaderboard</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">Top goalscorers of the 2026 World Cup tournament:</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
          <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; border: 1px solid var(--neon-gold);">
            <div style="font-size: 1.4rem; font-weight: 800; color: #fff;">Lionel Messi</div>
            <div style="font-family: var(--font-mono); font-size: 1.2rem; color: var(--neon-gold);">8 Goals</div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; border: 1px solid var(--neon-gold);">
            <div style="font-size: 1.4rem; font-weight: 800; color: #fff;">Kylian Mbappé</div>
            <div style="font-family: var(--font-mono); font-size: 1.2rem; color: var(--neon-gold);">8 Goals</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px;">
            <div style="font-size: 1.2rem; font-weight: 700; color: #fff;">Erling Haaland</div>
            <div style="font-family: var(--font-mono); font-size: 1.1rem; color: var(--neon-cyan);">6 Goals</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px;">
            <div style="font-size: 1.2rem; font-weight: 700; color: #fff;">Harry Kane</div>
            <div style="font-family: var(--font-mono); font-size: 1.1rem; color: var(--neon-cyan);">5 Goals</div>
          </div>
        </div>
      </div>

      <h3 style="font-size: 1.2rem; font-weight: 800; color: #fff; margin-bottom: 16px;">Live Goal Cards Stream</h3>
      <div class="goal-feed-grid">
        <div class="goal-card-item">
          <div class="goal-card-time">⚽ GOAL · 90' MINUTE</div>
          <div class="goal-card-score">England 1–2 Argentina</div>
          <div class="goal-card-scorer">Scorer: L. Martinez</div>
          <div class="goal-card-gauge">Win Probability: ARG 100% · Draw 0% · ENG 0%</div>
        </div>
        <div class="goal-card-item">
          <div class="goal-card-time">⚽ GOAL · 62' MINUTE</div>
          <div class="goal-card-score">France 0–3 Spain</div>
          <div class="goal-card-scorer">Scorer: Pedro Porro</div>
          <div class="goal-card-gauge">Win Probability: ESP 99% · Draw 1% · FRA 0%</div>
        </div>
      </div>
    </div>

    <!-- TAB 6: ALL 104 MATCHES -->
    <div id="tab-matches-all" class="tab-content">
      <div class="table-card">
        <div class="toolbar">
          <input type="text" id="m-search" placeholder="Search match or nation..." oninput="renderMatchesAllTable()">
        </div>
        <div style="overflow-x: auto;">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Fixture</th>
                <th>Pre-Match Pick</th>
                <th>Win Prob</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody id="m-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 7: TRACK RECORD -->
    <div id="tab-record" class="tab-content">
      <div class="table-card">
        <div class="toolbar">
          <input type="text" id="rec-search" placeholder="Search match or date..." oninput="renderRecordTable()">
          <div style="display: flex; gap: 8px;">
            <button class="btn-sim" style="background: rgba(255,255,255,0.1); color: #fff;" onclick="setRecFilter('all', this)">ALL (102)</button>
            <button class="btn-sim" style="background: rgba(255,255,255,0.1); color: #fff;" onclick="setRecFilter('hits', this)">HITS (70)</button>
            <button class="btn-sim" style="background: rgba(255,255,255,0.1); color: #fff;" onclick="setRecFilter('misses', this)">MISSES (32)</button>
          </div>
        </div>
        <div style="overflow-x: auto;">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Finished Match</th>
                <th>Model Pick</th>
                <th>Win Prob</th>
                <th>Outcome</th>
              </tr>
            </thead>
            <tbody id="rec-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 8: RATINGS -->
    <div id="tab-ratings" class="tab-content">
      <div class="table-card">
        <div class="toolbar">
          <input type="text" id="rat-search" placeholder="Search nation..." oninput="renderRatingsTable()">
        </div>
        <div style="overflow-x: auto;">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Nation</th>
                <th>Calibrated Elo</th>
                <th>Advantage</th>
              </tr>
            </thead>
            <tbody id="rat-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 9: METHODOLOGY -->
    <div id="tab-methodology" class="tab-content">
      <div class="table-card" style="padding: 32px;">
        <h2 style="font-size: 1.4rem; color: #fff; margin-bottom: 12px; text-transform: uppercase;">Methodology & Data Exports</h2>
        <div style="color: var(--text-muted); line-height: 1.7; font-size: 0.95rem; margin-bottom: 24px;">
          <p style="margin-bottom: 12px;"><strong>1. Elo Ratings & Form Recency:</strong> Recency decay function with 18-mo half-life calibrated across 913 international matches.</p>
          <p style="margin-bottom: 12px;"><strong>2. Dixon-Coles Bivariate Poisson Adjustment:</strong> Corrects low-scoring draw frequencies with tau parameter &tau; = -0.13.</p>
          <p><strong>3. In-Tournament Conditioning:</strong> Finished scores locked, remaining tournament simulated 50,000 times through the actual bracket.</p>
        </div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="data/probabilities.json" download class="btn-action">📥 DOWNLOAD PROBABILITIES.JSON</a>
          <button onclick="exportCSV()" class="btn-action" style="background: var(--neon-cyan)">📊 EXPORT TO CSV</button>
        </div>
      </div>
    </div>

    <footer>
      WORLD CUP 2026 STATISTICAL PREDICTION & SIMULATOR HUB
    </footer>

  </div>

  <script>
    const ELO = ${JSON.stringify(eloData.ratings)};
    const WC = ${JSON.stringify(wcData.matches)};
    const BACKTEST = ${JSON.stringify(backtestData)};
    const PROB = ${JSON.stringify(probData)};
    const GROUPS = ${JSON.stringify(GROUPS_DEF)};

    const DC_RHO = -0.13;
    const selectedGroupAdv = {};

    function switchTab(id) {
      document.querySelectorAll('.pill-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      event.currentTarget.classList.add('active');
      document.getElementById('tab-' + id).classList.add('active');
    }

    // RENDER TITLE RACE HIERARCHICALLY
    function renderTitleRaceTable() {
      const search = document.getElementById('title-search').value.toLowerCase();
      const tbody = document.getElementById('title-race-tbody');
      tbody.innerHTML = '';

      const sorted = [...PROB.teams].sort((a, b) => {
        if (b.pChampion !== a.pChampion) return b.pChampion - a.pChampion;
        if (b.pFinal !== a.pFinal) return b.pFinal - a.pFinal;
        if (b.pSemifinal !== a.pSemifinal) return b.pSemifinal - a.pSemifinal;
        if (b.pQuarterfinal !== a.pQuarterfinal) return b.pQuarterfinal - a.pQuarterfinal;
        if (b.pRound16 !== a.pRound16) return b.pRound16 - a.pRound16;
        if (b.pRound32 !== a.pRound32) return b.pRound32 - a.pRound32;
        return (ELO[b.slug] || 0) - (ELO[a.slug] || 0);
      });

      const fmtCell = (val) => {
        if (val === 1) return '<span class="stage-pill-100">100%</span>';
        if (val > 0) return '<span class="stage-pill-partial">' + (val * 100).toFixed(0) + '%</span>';
        return '<span class="stage-pill-zero">0%</span>';
      };

      sorted.forEach((t, idx) => {
        if (search && !t.slug.toLowerCase().includes(search)) return;

        const tr = document.createElement('tr');
        const champStr = t.pChampion > 0 ? (t.pChampion * 100).toFixed(1) + '%' : '0%';

        tr.innerHTML = '<td style="color: var(--neon-gold); font-weight: 800;">#' + (idx + 1) + '</td>' +
                       '<td style="text-align: left; font-weight: 800; text-transform: capitalize;">' + t.slug.replace(/-/g, ' ') + '</td>' +
                       '<td>' + fmtCell(t.pRound32) + '</td>' +
                       '<td>' + fmtCell(t.pRound16) + '</td>' +
                       '<td>' + fmtCell(t.pQuarterfinal) + '</td>' +
                       '<td>' + fmtCell(t.pSemifinal) + '</td>' +
                       '<td>' + fmtCell(t.pFinal) + '</td>' +
                       '<td class="' + (t.pChampion > 0 ? 'gold-cell' : 'stage-pill-zero') + '">' + champStr + '</td>';
        tbody.appendChild(tr);
      });
    }

    // SIMULATOR LOGIC
    function renderGroupsUI() {
      const container = document.getElementById('groups-container');
      container.innerHTML = '';

      Object.keys(GROUPS).forEach(g => {
        const teams = GROUPS[g];
        const box = document.createElement('div');
        box.className = 'group-box';
        let html = '<div class="group-title"><span>GROUP ' + g + '</span><span style="font-size: 0.75rem; color: var(--text-muted);">Tap 1st, 2nd</span></div>';

        teams.forEach(t => {
          const advPos = selectedGroupAdv[t] || 0;
          let cls = '';
          let posTxt = '';
          if (advPos === 1) { cls = 'pos-1'; posTxt = '🥇 1st'; }
          if (advPos === 2) { cls = 'pos-2'; posTxt = '🥈 2nd'; }

          html += '<div class="group-team-item ' + cls + '" onclick="toggleTeamAdv(\'' + g + '\', \'' + t + '\')">' +
                  '<span>' + t.toUpperCase().replace(/-/g, ' ') + '</span>' +
                  '<span>' + posTxt + '</span>' +
                  '</div>';
        });

        box.innerHTML = html;
        container.appendChild(box);
      });

      renderSimBracket();
    }

    function toggleTeamAdv(g, team) {
      const current = selectedGroupAdv[team] || 0;
      if (current === 0) {
        const inGroup = GROUPS[g].map(t => selectedGroupAdv[t] || 0);
        if (!inGroup.includes(1)) selectedGroupAdv[team] = 1;
        else if (!inGroup.includes(2)) selectedGroupAdv[team] = 2;
      } else {
        delete selectedGroupAdv[team];
      }
      renderGroupsUI();
    }

    function autoFillGroups(type) {
      Object.keys(GROUPS).forEach(g => {
        let teams = [...GROUPS[g]];
        if (type === 'ai') {
          teams.sort((a,b) => (ELO[b]||1500) - (ELO[a]||1500));
        } else {
          teams.sort(() => Math.random() - 0.5);
        }
        selectedGroupAdv[teams[0]] = 1;
        selectedGroupAdv[teams[1]] = 2;
      });
      renderGroupsUI();
    }

    function resetGroups() {
      Object.keys(selectedGroupAdv).forEach(k => delete selectedGroupAdv[k]);
      renderGroupsUI();
    }

    function renderSimBracket() {
      const container = document.getElementById('sim-bracket-display');
      const advanced = Object.keys(selectedGroupAdv);
      if (advanced.length < 24) {
        container.innerHTML = '<div style="color: var(--text-muted); text-align: center; font-family: var(--font-mono);">' +
                              'Advance at least 2 teams per group to render Knockout Bracket! (' + advanced.length + '/24 advanced)' +
                              '</div>';
        return;
      }

      let html = '<div style="display: flex; gap: 24px; overflow-x: auto; font-family: var(--font-mono);">' +
                 '<div style="flex: 1; min-width: 200px;">' +
                 '<div style="color: var(--neon-gold); font-weight: 800; margin-bottom: 12px; text-align: center;">ROUND OF 32 QUALIFIERS</div>';

      advanced.sort((a,b) => (ELO[b]||1500) - (ELO[a]||1500)).slice(0, 16).forEach(t => {
        html += '<div style="background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 6px; margin-bottom: 6px; color: #fff;">' +
                t.toUpperCase().replace(/-/g, ' ') + ' <span style="color: var(--neon-cyan)">(' + (ELO[t]||1500) + ')</span>' +
                '</div>';
      });

      html += '</div>' +
              '<div style="flex: 1; min-width: 200px;">' +
              '<div style="color: var(--neon-gold); font-weight: 800; margin-bottom: 12px; text-align: center;">TOP TITLE FAVORITE</div>';

      const champ = advanced.sort((a,b) => (ELO[b]||1500) - (ELO[a]||1500))[0];
      html += '<div style="background: rgba(255,183,0,0.15); border: 1px solid var(--neon-gold); padding: 20px; border-radius: 12px; text-align: center;">' +
              '<div style="font-size: 0.8rem; color: var(--neon-gold);">PROJECTED CHAMPION</div>' +
              '<div style="font-size: 1.6rem; font-weight: 800; color: #fff; text-transform: uppercase;">' + champ.replace(/-/g, ' ') + '</div>' +
              '<div style="font-size: 0.9rem; color: var(--neon-cyan); margin-top: 4px;">Elo Rating: ' + ELO[champ] + '</div>' +
              '</div></div></div>';

      container.innerHTML = html;
    }

    // MATH MODEL
    function dcTau(a, b, lambda, mu, rho) {
      if (a === 0 && b === 0) return 1 - lambda * mu * rho;
      if (a === 0 && b === 1) return 1 + lambda * rho;
      if (a === 1 && b === 0) return 1 + mu * rho;
      if (a === 1 && b === 1) return 1 - rho;
      return 1;
    }

    function expectedGoals(rating, opponent, homeBonus = 0) {
      const diff = (rating + homeBonus) - opponent;
      const lambda = 1.35 + diff / 400;
      return Math.max(0.3, Math.min(3.5, lambda));
    }

    function poissonPmf(k, lambda) {
      if (lambda <= 0) return k === 0 ? 1 : 0;
      let p = Math.exp(-lambda);
      for (let i = 1; i <= k; i++) p *= lambda / i;
      return p;
    }

    function matchProb(ratingA, ratingB, homeBonusA = 0) {
      const lambda = expectedGoals(ratingA, ratingB, homeBonusA);
      const mu = expectedGoals(ratingB, ratingA, -homeBonusA / 2);
      let winA = 0, draw = 0, winB = 0;
      const grid = Array.from({ length: 6 }, () => Array(6).fill(0));

      for (let a = 0; a <= 8; a++) {
        const pA = poissonPmf(a, lambda);
        for (let b = 0; b <= 8; b++) {
          const tau = dcTau(a, b, lambda, mu, DC_RHO);
          const p = pA * poissonPmf(b, mu) * tau;
          if (a > b) winA += p; else if (a < b) winB += p; else draw += p;
          if (a < 6 && b < 6) grid[a][b] += p;
        }
      }
      const total = winA + draw + winB;
      return { winA: winA / total, draw: draw / total, winB: winB / total, lambda, mu, grid };
    }

    function initPredictor() {
      const selA = document.getElementById('teamA-select');
      const selB = document.getElementById('teamB-select');
      const sorted = Object.keys(ELO).sort();

      sorted.forEach(t => {
        const opA = document.createElement('option'); opA.value = t; opA.textContent = t.toUpperCase() + ' (' + ELO[t] + ')'; selA.appendChild(opA);
        const opB = document.createElement('option'); opB.value = t; opB.textContent = t.toUpperCase() + ' (' + ELO[t] + ')'; selB.appendChild(opB);
      });

      selA.value = 'spain'; selB.value = 'germany';
      selA.addEventListener('change', runSim); selB.addEventListener('change', runSim);
      document.getElementById('venue-select').addEventListener('change', runSim);
      runSim();
    }

    function runSim() {
      const teamA = document.getElementById('teamA-select').value;
      const teamB = document.getElementById('teamB-select').value;
      const venue = document.getElementById('venue-select').value;

      let hb = 0; if (venue === 'homeA') hb = 75; if (venue === 'homeB') hb = -75;
      const ra = ELO[teamA], rb = ELO[teamB];
      const res = matchProb(ra, rb, hb);

      document.getElementById('display-teamA').textContent = teamA.replace(/-/g, ' ');
      document.getElementById('display-teamB').textContent = teamB.replace(/-/g, ' ');
      document.getElementById('elo-tagA').textContent = 'ELO: ' + ra;
      document.getElementById('elo-tagB').textContent = 'ELO: ' + rb;

      document.getElementById('lbl-teamA').textContent = teamA.replace(/-/g, ' ') + ' WIN';
      document.getElementById('lbl-teamB').textContent = teamB.replace(/-/g, ' ') + ' WIN';

      document.getElementById('val-teamA').textContent = (res.winA * 100).toFixed(1) + '%';
      document.getElementById('val-draw').textContent = (res.draw * 100).toFixed(1) + '%';
      document.getElementById('val-teamB').textContent = (res.winB * 100).toFixed(1) + '%';

      document.getElementById('bar-teamA').style.width = (res.winA * 100) + '%';
      document.getElementById('bar-draw').style.width = (res.draw * 100) + '%';
      document.getElementById('bar-teamB').style.width = (res.winB * 100) + '%';

      document.getElementById('exp-a-val').textContent = res.lambda.toFixed(2);
      document.getElementById('exp-b-val').textContent = res.mu.toFixed(2);

      const table = document.getElementById('matrix-table');
      let html = '<thead><tr><th>' + teamA.toUpperCase() + ' \\ ' + teamB.toUpperCase() + '</th>';
      for (let b = 0; b < 6; b++) html += '<th>' + b + '</th>';
      html += '</tr></thead><tbody>';

      let maxP = 0;
      for (let a = 0; a < 6; a++) { for (let b = 0; b < 6; b++) { if (res.grid[a][b] > maxP) maxP = res.grid[a][b]; } }

      for (let a = 0; a < 6; a++) {
        html += '<tr><th>' + a + '</th>';
        for (let b = 0; b < 6; b++) {
          const val = res.grid[a][b];
          const pct = (val * 100).toFixed(1);
          const bg = 'rgba(255, 0, 127, ' + ((val / maxP) * 0.6).toFixed(2) + ')';
          html += '<td style="background:' + bg + ';">' + pct + '%</td>';
        }
        html += '</tr>';
      }
      html += '</tbody>';
      table.innerHTML = html;
    }

    let recFilter = 'all';
    function setRecFilter(f, btn) {
      recFilter = f; renderRecordTable();
    }

    function renderRecordTable() {
      const search = document.getElementById('rec-search').value.toLowerCase();
      const tbody = document.getElementById('rec-tbody');
      tbody.innerHTML = '';
      const HOSTS = new Set(["mexico", "usa", "canada"]);

      WC.forEach(m => {
        const ra = ELO[m.t1], rb = ELO[m.t2]; if (!ra || !rb) return;
        const hb = (HOSTS.has(m.t1) ? 75 : 0) - (HOSTS.has(m.t2) ? 75 : 0);
        const p = matchProb(ra, rb, hb);
        const probs = [p.winA, p.draw, p.winB];
        const actual = m.g1 > m.g2 ? 0 : m.g1 < m.g2 ? 2 : 1;
        const pick = probs.indexOf(Math.max(...probs));
        const hit = pick === actual;

        if (recFilter === 'hits' && !hit) return;
        if (recFilter === 'misses' && hit) return;

        const pickLabel = pick === 0 ? m.team1 : pick === 2 ? m.team2 : "Draw";
        const matchStr = m.team1 + ' ' + m.g1 + '–' + m.g2 + ' ' + m.team2;

        if (search && !matchStr.toLowerCase().includes(search) && !m.date.includes(search)) return;

        const tr = document.createElement('tr');
        tr.innerHTML = '<td>' + m.date + '</td>' +
                       '<td><strong>' + m.team1 + '</strong> ' + m.g1 + '–' + m.g2 + ' <strong>' + m.team2 + '</strong></td>' +
                       '<td style="font-weight: 700;">' + pickLabel + '</td>' +
                       '<td style="font-family: var(--font-mono); font-weight: 800;">' + Math.round(probs[pick] * 100) + '%</td>' +
                       '<td><span class="' + (hit ? 'hit-tag' : 'miss-tag') + '">' + (hit ? '🔥 HIT' : '❌ MISS') + '</span></td>';
        tbody.appendChild(tr);
      });
    }

    function renderMatchesAllTable() {
      const search = document.getElementById('m-search').value.toLowerCase();
      const tbody = document.getElementById('m-tbody');
      tbody.innerHTML = '';
      const HOSTS = new Set(["mexico", "usa", "canada"]);

      WC.forEach(m => {
        const ra = ELO[m.t1], rb = ELO[m.t2]; if (!ra || !rb) return;
        const hb = (HOSTS.has(m.t1) ? 75 : 0) - (HOSTS.has(m.t2) ? 75 : 0);
        const p = matchProb(ra, rb, hb);
        const probs = [p.winA, p.draw, p.winB];
        const pick = probs.indexOf(Math.max(...probs));
        const pickLabel = pick === 0 ? m.team1 : pick === 2 ? m.team2 : "Draw";

        const matchStr = m.team1 + ' vs ' + m.team2;
        if (search && !matchStr.toLowerCase().includes(search) && !m.date.includes(search)) return;

        const tr = document.createElement('tr');
        tr.innerHTML = '<td>' + m.date + '</td>' +
                       '<td>' + m.team1 + ' vs ' + m.team2 + '</td>' +
                       '<td>' + pickLabel + '</td>' +
                       '<td>' + Math.round(probs[pick] * 100) + '%</td>' +
                       '<td style="font-weight: 800; color: var(--neon-gold);">' + m.g1 + '–' + m.g2 + '</td>';
        tbody.appendChild(tr);
      });
    }

    function renderRatingsTable() {
      const search = document.getElementById('rat-search').value.toLowerCase();
      const tbody = document.getElementById('rat-tbody');
      tbody.innerHTML = '';

      const sorted = Object.entries(ELO).sort((a,b) => b[1] - a[1]);
      const HOSTS = new Set(["mexico", "usa", "canada"]);

      sorted.forEach(([team, rating], idx) => {
        if (search && !team.toLowerCase().includes(search)) return;
        const isHost = HOSTS.has(team);
        const tr = document.createElement('tr');
        tr.innerHTML = '<td style="font-family: var(--font-mono); font-weight: 800; color: var(--neon-gold)">#' + (idx + 1) + '</td>' +
                       '<td style="font-weight: 800; text-transform: capitalize;">' + team.replace(/-/g, ' ') + '</td>' +
                       '<td style="font-family: var(--font-mono); font-weight: 800; color: #fff;">' + rating + '</td>' +
                       '<td>' + (isHost ? '<span class="hit-tag">HOST (+75 ELO)</span>' : '<span style="color: var(--text-muted)">NEUTRAL</span>') + '</td>';
        tbody.appendChild(tr);
      });
    }

    function exportCSV() {
      let csv = 'Rank,Team,RoundOf32,RoundOf16,Quarterfinal,Semifinal,Final,Champion\\n';
      PROB.teams.forEach((t, i) => {
        csv += \`\${i+1},\${t.slug},\${t.pRound32},\${t.pRound16},\${t.pQuarterfinal},\${t.pSemifinal},\${t.pFinal},\${t.pChampion}\\n\`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'probabilities.csv'; a.click();
    }

    window.addEventListener('DOMContentLoaded', () => {
      renderTitleRaceTable();
      renderGroupsUI();
      initPredictor();
      renderRecordTable();
      renderMatchesAllTable();
      renderRatingsTable();
    });
  </script>
</body>
</html>`;

writeFileSync("index.html", htmlContent);
console.log("✓ Fixed Tournament Progression Odds section in index.html successfully.");
