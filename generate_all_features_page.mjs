import { readFileSync, writeFileSync } from "node:fs";

const eloData = JSON.parse(readFileSync("./data/elo-calibrated.json", "utf8"));
const wcData = JSON.parse(readFileSync("./data/wc2026-results.json", "utf8"));
const backtestData = JSON.parse(readFileSync("./data/model-backtest.json", "utf8"));
const probData = JSON.parse(readFileSync("./data/probabilities.json", "utf8"));

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>⚡ FIFA WORLD CUP 2026 — AI PREDICTION ENGINE</title>
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

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

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

    .wrapper {
      max-width: 1360px;
      margin: 0 auto;
      padding: 24px;
    }

    /* Header */
    header {
      margin-bottom: 32px;
      position: relative;
      background: rgba(13, 18, 31, 0.75);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 28px;
      padding: 36px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15);
      overflow: hidden;
    }

    header::before {
      content: '';
      position: absolute;
      top: -40%;
      right: -10%;
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(255, 183, 0, 0.25) 0%, transparent 70%);
      filter: blur(50px);
      pointer-events: none;
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
      letter-spacing: 0.05em;
      text-shadow: 0 0 12px rgba(0, 255, 135, 0.5);
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background-color: var(--neon-green);
      border-radius: 50%;
      box-shadow: 0 0 12px var(--neon-green);
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.5; }
    }

    .main-title {
      font-size: clamp(2.2rem, 5vw, 3.8rem);
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.03em;
      text-transform: uppercase;
      background: linear-gradient(135deg, #ffffff 30%, #e2e8f0 60%, var(--neon-gold) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 12px;
    }

    .header-sub {
      font-size: 1.1rem;
      color: var(--text-muted);
      max-width: 900px;
      line-height: 1.6;
    }

    /* Next Match Strip Banner */
    .next-match-banner {
      background: linear-gradient(90deg, #131a2a, #1d152a, #131a2a);
      border: 1px solid var(--neon-gold);
      border-radius: 16px;
      padding: 16px 24px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 0 25px rgba(255, 183, 0, 0.15);
      flex-wrap: wrap;
      gap: 16px;
    }

    .next-match-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .next-match-title {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      text-transform: uppercase;
      color: var(--neon-gold);
      font-weight: 800;
    }

    .next-match-teams {
      font-size: 1.2rem;
      font-weight: 800;
      color: #ffffff;
    }

    .next-match-prob {
      font-family: var(--font-mono);
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--neon-cyan);
      background: rgba(0, 242, 254, 0.1);
      border: 1px solid var(--neon-cyan);
      padding: 6px 14px;
      border-radius: 8px;
    }

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
      overflow: hidden;
      transition: transform 0.25s, border-color 0.25s;
    }

    .metric-box:hover {
      transform: translateY(-4px);
      border-color: var(--neon-gold);
      box-shadow: 0 15px 35px rgba(255, 183, 0, 0.2);
    }

    .metric-box::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, var(--neon-gold), var(--neon-magenta));
    }

    .metric-label-txt {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      text-transform: uppercase;
      color: var(--text-muted);
      letter-spacing: 0.08em;
      margin-bottom: 8px;
    }

    .metric-big-num {
      font-size: 2.6rem;
      font-weight: 800;
      font-family: var(--font-mono);
      color: #ffffff;
      line-height: 1;
      margin-bottom: 8px;
    }

    .metric-tag-pill {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      font-family: var(--font-mono);
      text-transform: uppercase;
    }

    .pill-green { background: rgba(0, 255, 135, 0.15); color: var(--neon-green); border: 1px solid rgba(0, 255, 135, 0.3); }
    .pill-gold { background: rgba(255, 183, 0, 0.15); color: var(--neon-gold); border: 1px solid rgba(255, 183, 0, 0.3); }
    .pill-cyan { background: rgba(0, 242, 254, 0.15); color: var(--neon-cyan); border: 1px solid rgba(0, 242, 254, 0.3); }

    /* Nav Pills */
    .nav-pills-bar {
      display: flex;
      gap: 12px;
      margin-bottom: 28px;
      padding: 8px;
      background: rgba(13, 18, 31, 0.8);
      border: 1px solid var(--border-card);
      border-radius: 16px;
      overflow-x: auto;
      backdrop-filter: blur(10px);
    }

    .pill-tab {
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-muted);
      padding: 12px 20px;
      border-radius: 12px;
      font-family: var(--font-display);
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    .pill-tab:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.05);
    }

    .pill-tab.active {
      background: linear-gradient(135deg, var(--neon-gold), #e6a100);
      color: #000000;
      font-weight: 800;
      box-shadow: 0 0 20px rgba(255, 183, 0, 0.4);
    }

    .tab-content {
      display: none;
      animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .tab-content.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* TITLE RACE BOARD */
    .title-race-card {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 24px;
      padding: 32px;
      margin-bottom: 32px;
    }

    .title-race-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .title-race-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: #ffffff;
      text-transform: uppercase;
    }

    /* PATHS TO FINAL MATRIX */
    .paths-tbl {
      width: 100%;
      border-collapse: collapse;
      font-family: var(--font-mono);
      text-align: center;
    }

    .paths-tbl th {
      background: #080c16;
      color: var(--neon-gold);
      font-size: 0.8rem;
      padding: 14px 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .paths-tbl td {
      padding: 14px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 0.95rem;
      font-weight: 700;
    }

    .gold-cell {
      background: rgba(255, 183, 0, 0.2);
      color: var(--neon-gold);
      border-radius: 6px;
      font-weight: 800;
      border: 1px solid rgba(255, 183, 0, 0.4);
    }

    /* MATCH ARENA SIMULATOR CARD */
    .arena-card {
      background: var(--bg-card);
      border: 2px solid rgba(255, 183, 0, 0.3);
      border-radius: 28px;
      padding: 36px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
      margin-bottom: 32px;
    }

    .controls-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 220px;
      gap: 20px;
      margin-bottom: 32px;
    }

    @media (max-width: 900px) {
      .controls-grid { grid-template-columns: 1fr; }
    }

    .form-ctrl {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-ctrl label {
      font-family: var(--font-mono);
      font-size: 0.82rem;
      text-transform: uppercase;
      color: var(--neon-gold);
      font-weight: 700;
    }

    select, input {
      background: #080c16;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #ffffff;
      padding: 14px 18px;
      border-radius: 12px;
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 700;
      outline: none;
    }

    /* Matchup Visualizer */
    .matchup-arena {
      background: #070a12;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 28px;
      margin-bottom: 32px;
    }

    .matchup-teams-display {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 24px;
      margin-bottom: 28px;
      text-align: center;
    }

    .team-display-side h3 {
      font-size: clamp(1.4rem, 3vw, 2.2rem);
      font-weight: 800;
      text-transform: capitalize;
      color: #ffffff;
    }

    .vs-badge {
      background: linear-gradient(135deg, var(--neon-magenta), var(--neon-purple));
      color: #ffffff;
      font-family: var(--font-mono);
      font-size: 1.1rem;
      font-weight: 900;
      padding: 12px 20px;
      border-radius: 50%;
      box-shadow: 0 0 20px rgba(255, 0, 127, 0.5);
      border: 2px solid #ffffff;
    }

    /* Bars */
    .deluxe-prob-stack {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .deluxe-bar-row {
      display: grid;
      grid-template-columns: 160px 80px 1fr;
      align-items: center;
      gap: 20px;
    }

    .row-lbl { font-weight: 700; font-size: 1.05rem; text-transform: capitalize; }
    .row-val { font-family: var(--font-mono); font-size: 1.3rem; font-weight: 800; color: #ffffff; text-align: right; }

    .bar-outer {
      background: #030509;
      height: 28px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .bar-inner { height: 100%; border-radius: 6px; transition: width 0.5s ease; }
    .bar-inner-a { background: linear-gradient(90deg, #00f2fe, #4facfe); }
    .bar-inner-draw { background: linear-gradient(90deg, #9ca3af, #d1d5db); }
    .bar-inner-b { background: linear-gradient(90deg, #ffb700, #ffe600); }

    /* HUD */
    .hud-stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 28px;
    }

    .hud-box {
      background: rgba(13, 18, 31, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 20px;
      text-align: center;
    }

    .hud-box .val-txt {
      font-family: var(--font-mono);
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--neon-gold);
    }

    .hud-box .sub-txt {
      font-size: 0.85rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 4px;
    }

    /* Heatmap Grid */
    .heatmap-wrap {
      margin-top: 32px;
      background: #050810;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 24px;
    }

    .matrix-tbl {
      width: 100%;
      border-collapse: separate;
      border-spacing: 6px;
      text-align: center;
      font-family: var(--font-mono);
    }

    .matrix-tbl th { color: var(--text-muted); font-size: 0.85rem; padding: 8px; }
    .matrix-tbl td {
      padding: 14px 8px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 0.95rem;
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    /* BRACKET TREE SIMULATOR */
    .bracket-container {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 24px;
      padding: 32px;
      overflow-x: auto;
    }

    .bracket-tree {
      display: flex;
      gap: 32px;
      min-width: 900px;
      justify-content: space-between;
    }

    .bracket-round {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      gap: 20px;
      flex: 1;
    }

    .bracket-round-title {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: var(--neon-gold);
      text-transform: uppercase;
      font-weight: 800;
      margin-bottom: 12px;
      text-align: center;
    }

    .bracket-match-card {
      background: #070a14;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      position: relative;
    }

    .bracket-team-line {
      display: flex;
      justify-content: space-between;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .winner-highlight {
      color: var(--neon-gold);
    }

    /* TABLES MAXIMALIST */
    .table-card {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 24px;
      overflow: hidden;
    }

    .toolbar {
      padding: 20px 24px;
      background: rgba(8, 12, 22, 0.9);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    table { width: 100%; border-collapse: collapse; text-align: left; }
    th {
      background: #070b14;
      color: var(--neon-gold);
      font-family: var(--font-mono);
      font-size: 0.8rem;
      padding: 16px 20px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    td { padding: 16px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.04); font-size: 0.95rem; }
    tr:hover td { background: rgba(255, 255, 255, 0.03); }

    .hit-tag {
      background: rgba(0, 255, 135, 0.15); color: var(--neon-green); border: 1px solid rgba(0, 255, 135, 0.3);
      padding: 4px 12px; border-radius: 6px; font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800;
    }

    .miss-tag {
      background: rgba(255, 0, 127, 0.15); color: var(--neon-magenta); border: 1px solid rgba(255, 0, 127, 0.3);
      padding: 4px 12px; border-radius: 6px; font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800;
    }

    /* EXPORT BOX */
    .embed-card {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 24px;
      padding: 32px;
      margin-top: 24px;
    }

    .btn-action {
      background: var(--neon-gold);
      color: #000;
      border: none;
      padding: 12px 24px;
      border-radius: 10px;
      font-family: var(--font-display);
      font-size: 0.95rem;
      font-weight: 800;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      text-decoration: none;
    }

    footer {
      margin-top: 60px;
      text-align: center;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: var(--text-muted);
      border-top: 1px solid var(--border-card);
      padding-top: 28px;
    }

    footer a { color: var(--neon-gold); text-decoration: none; font-weight: 700; }
  </style>
</head>
<body>

  <!-- Top Marquee -->
  <div class="marquee-container">
    <div class="marquee-inner">
      <span class="marquee-item"><span class="marquee-tag">RECORD</span> 70/102 WINNERS CALLED (69% ACCURACY)</span>
      <span class="marquee-item"><span class="marquee-tag">FAVORITE</span> SPAIN 55.2% TO WIN THE 2026 WORLD CUP</span>
      <span class="marquee-item"><span class="marquee-tag">MODEL</span> ELO → DIXON-COLES POISSON → 50,000 SIMULATIONS</span>
      <span class="marquee-item"><span class="marquee-tag">LAST MATCH</span> ENGLAND 1–2 ARGENTINA (MODEL PICK: 37% ENG) ❌</span>
      <span class="marquee-item"><span class="marquee-tag">MATCH</span> FRANCE 0–2 SPAIN (MODEL PICK: 36% ESP) ✅</span>
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
          [ STATISTICAL FORECAST ARENA ]
        </div>
      </div>
      <h1 class="main-title">FIFA World Cup 2026 Prediction Center</h1>
      <p class="header-sub">
        Full 48-team, 104-match model powered by Elo ratings, Dixon-Coles bivariate Poisson goal distributions, and 50,000 Monte Carlo tournament simulations. Conditioned live on real results.
      </p>
    </header>

    <!-- Next Match Strip Banner -->
    <div class="next-match-banner">
      <div class="next-match-info">
        <span class="next-match-title">⚽ SEMIFINAL HIGHLIGHT</span>
        <span class="next-match-teams">France vs. Spain</span>
      </div>
      <div class="next-match-prob">
        Spain 36.0% Win Prob (Model Pick ✅ Result: Spain 2-0)
      </div>
    </div>

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

    <!-- Nav Pills -->
    <div class="nav-pills-bar">
      <button class="pill-tab active" onclick="switchTab('title-race')">🏆 TITLE RACE & PATHS TO FINAL</button>
      <button class="pill-tab" onclick="switchTab('simulator')">⚡ MATCH PREDICTOR ARENA</button>
      <button class="pill-tab" onclick="switchTab('bracket')">🌲 KNOCKOUT BRACKET SIMULATOR</button>
      <button class="pill-tab" onclick="switchTab('record')">📊 LIVE TRACK RECORD (102 MATCHES)</button>
      <button class="pill-tab" onclick="switchTab('ratings')">⭐ TEAM ELO RATINGS (54 TEAMS)</button>
      <button class="pill-tab" onclick="switchTab('methodology')">📖 METHODOLOGY & OPEN DATA</button>
    </div>

    <!-- TAB 1: TITLE RACE BOARD -->
    <div id="tab-title-race" class="tab-content active">
      <div class="title-race-card">
        <div class="title-race-header">
          <h2 class="title-race-title">Paths to the Final & Championship Odds (50,000 Sims)</h2>
          <input type="text" id="title-search" class="search-input" placeholder="Search team..." oninput="renderTitleRaceTable()">
        </div>
        <div style="overflow-x: auto;">
          <table class="paths-tbl">
            <thead>
              <tr>
                <th>Rank</th>
                <th style="text-align: left;">Nation</th>
                <th>Round of 32</th>
                <th>Round of 16</th>
                <th>Quarterfinal</th>
                <th>Semifinal</th>
                <th>Final</th>
                <th>Champion</th>
              </tr>
            </thead>
            <tbody id="title-race-tbody">
              <!-- JS Populated -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: SIMULATOR ARENA -->
    <div id="tab-simulator" class="tab-content">
      <div class="arena-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px;">
          <h2 style="font-size: 1.4rem; font-weight: 800; text-transform: uppercase;">Head-to-Head Dixon-Coles Predictor</h2>
          <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--neon-gold);">Dixon-Coles ρ = -0.13</span>
        </div>

        <div class="controls-grid">
          <div class="form-ctrl">
            <label for="teamA-select">Team A (Left)</label>
            <select id="teamA-select"></select>
          </div>
          <div class="form-ctrl">
            <label for="teamB-select">Team B (Right)</label>
            <select id="teamB-select"></select>
          </div>
          <div class="form-ctrl">
            <label for="venue-select">Venue Advantage</label>
            <select id="venue-select">
              <option value="neutral">Neutral Venue</option>
              <option value="homeA">Team A Host (+75 Elo)</option>
              <option value="homeB">Team B Host (+75 Elo)</option>
            </select>
          </div>
        </div>

        <div class="matchup-arena">
          <div class="matchup-teams-display">
            <div>
              <h3 id="display-teamA">SPAIN</h3>
              <div id="elo-tagA" style="font-family: var(--font-mono); color: var(--text-muted); font-size: 0.9rem;">ELO: 2055</div>
            </div>
            <div class="vs-badge">VS</div>
            <div>
              <h3 id="display-teamB">GERMANY</h3>
              <div id="elo-tagB" style="font-family: var(--font-mono); color: var(--text-muted); font-size: 0.9rem;">ELO: 1945</div>
            </div>
          </div>

          <div class="deluxe-prob-stack">
            <div class="deluxe-bar-row">
              <div class="row-lbl" id="lbl-teamA" style="color: var(--neon-cyan)">SPAIN WIN</div>
              <div class="row-val" id="val-teamA">53.2%</div>
              <div class="bar-outer"><div class="bar-inner bar-inner-a" id="bar-teamA" style="width: 53.2%"></div></div>
            </div>
            <div class="deluxe-bar-row">
              <div class="row-lbl" style="color: var(--text-muted)">DRAW</div>
              <div class="row-val" id="val-draw">26.8%</div>
              <div class="bar-outer"><div class="bar-inner bar-inner-draw" id="bar-draw" style="width: 26.8%"></div></div>
            </div>
            <div class="deluxe-bar-row">
              <div class="row-lbl" id="lbl-teamB" style="color: var(--neon-gold)">GERMANY WIN</div>
              <div class="row-val" id="val-teamB">20.0%</div>
              <div class="bar-outer"><div class="bar-inner bar-inner-b" id="bar-teamB" style="width: 20.0%"></div></div>
            </div>
          </div>

          <div class="hud-stats-grid">
            <div class="hud-box">
              <div class="val-txt" id="exp-a-val">1.68</div>
              <div class="sub-txt" id="exp-a-lbl">SPAIN EXPECTED GOALS (λ)</div>
            </div>
            <div class="hud-box">
              <div class="val-txt" id="exp-b-val">1.08</div>
              <div class="sub-txt" id="exp-b-lbl">GERMANY EXPECTED GOALS (μ)</div>
            </div>
          </div>
        </div>

        <div class="heatmap-wrap">
          <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--neon-cyan); margin-bottom: 16px; font-weight: 800;">
            SCORELINE PROBABILITY HEATMAP MATRIX (%)
          </div>
          <table class="matrix-tbl" id="matrix-table"></table>
        </div>
      </div>
    </div>

    <!-- TAB 3: BRACKET SIMULATOR -->
    <div id="tab-bracket" class="tab-content">
      <div class="bracket-container">
        <h2 style="font-size: 1.4rem; color: #fff; margin-bottom: 20px; text-transform: uppercase;">
          Knockout Bracket Progression (Conditioned on Live Results)
        </h2>
        <div class="bracket-tree">
          <div class="bracket-round">
            <div class="bracket-round-title">Quarterfinals</div>
            <div class="bracket-match-card">
              <div class="bracket-team-line winner-highlight"><span>Spain</span> <span>2</span></div>
              <div class="bracket-team-line"><span>Belgium</span> <span>1</span></div>
            </div>
            <div class="bracket-match-card">
              <div class="bracket-team-line winner-highlight"><span>France</span> <span>2</span></div>
              <div class="bracket-team-line"><span>Morocco</span> <span>0</span></div>
            </div>
            <div class="bracket-match-card">
              <div class="bracket-team-line winner-highlight"><span>Argentina</span> <span>3</span></div>
              <div class="bracket-team-line"><span>Egypt</span> <span>2</span></div>
            </div>
            <div class="bracket-match-card">
              <div class="bracket-team-line winner-highlight"><span>England</span> <span>2</span></div>
              <div class="bracket-team-line"><span>Norway</span> <span>1</span></div>
            </div>
          </div>

          <div class="bracket-round">
            <div class="bracket-round-title">Semifinals</div>
            <div class="bracket-match-card" style="border-color: var(--neon-gold)">
              <div class="bracket-team-line winner-highlight"><span>Spain</span> <span>2</span></div>
              <div class="bracket-team-line"><span>France</span> <span>0</span></div>
            </div>
            <div class="bracket-match-card" style="border-color: var(--neon-gold)">
              <div class="bracket-team-line winner-highlight"><span>Argentina</span> <span>2</span></div>
              <div class="bracket-team-line"><span>England</span> <span>1</span></div>
            </div>
          </div>

          <div class="bracket-round">
            <div class="bracket-round-title">Final</div>
            <div class="bracket-match-card" style="border-color: var(--neon-cyan); box-shadow: 0 0 20px rgba(0,242,254,0.3)">
              <div class="bracket-team-line winner-highlight"><span>Spain</span> <span>55.2%</span></div>
              <div class="bracket-team-line"><span>Argentina</span> <span>44.8%</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: TRACK RECORD -->
    <div id="tab-record" class="tab-content">
      <div class="table-card">
        <div class="toolbar">
          <input type="text" id="rec-search" class="search-input" placeholder="Search match or date..." oninput="renderRecordTable()">
          <div style="display: flex; gap: 8px;">
            <button class="f-btn active" onclick="setRecFilter('all', this)">ALL (102)</button>
            <button class="f-btn" onclick="setRecFilter('hits', this)">HITS (70)</button>
            <button class="f-btn" onclick="setRecFilter('misses', this)">MISSES (32)</button>
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

    <!-- TAB 5: RATINGS -->
    <div id="tab-ratings" class="tab-content">
      <div class="table-card">
        <div class="toolbar">
          <input type="text" id="rat-search" class="search-input" placeholder="Search nation..." oninput="renderRatingsTable()">
        </div>
        <div style="overflow-x: auto;">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Nation</th>
                <th>Calibrated Elo</th>
                <th>Tournament Advantage</th>
              </tr>
            </thead>
            <tbody id="rat-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 6: METHODOLOGY & OPEN DATA -->
    <div id="tab-methodology" class="tab-content">
      <div class="embed-card">
        <h2 style="font-size: 1.4rem; color: #fff; margin-bottom: 12px; text-transform: uppercase;">
          Methodology & How The Engine Works
        </h2>
        <div style="color: var(--text-muted); line-height: 1.7; font-size: 0.95rem; margin-bottom: 24px;">
          <p style="margin-bottom: 12px;"><strong>1. Long-Run Elo Priors & Form Recency Calibration:</strong> Each nation starts from historical strength priors and is calibrated using an 18-month half-life recency-weighted decay function across 913 recent internationals.</p>
          <p style="margin-bottom: 12px;"><strong>2. Dixon-Coles Bivariate Poisson Adjustment (&tau; = -0.13):</strong> Match goal expectancy is modeled through Poisson distributions, corrected with Dixon-Coles tau parameters to account for real football draw dynamics.</p>
          <p><strong>3. Monte Carlo In-Tournament Conditioning:</strong> The tournament is simulated 50,000 times through the actual bracket, freezing finished match scores and updating remaining advancement probabilities in real time.</p>
        </div>

        <div style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="data/probabilities.json" download class="btn-action">📥 DOWNLOAD PROBABILITIES.JSON</a>
          <button onclick="exportCSV()" class="btn-action" style="background: var(--neon-cyan)">📊 EXPORT TO CSV</button>
        </div>
      </div>
    </div>

    <footer>
      WORLD CUP 2026 STATISTICAL PREDICTION MODEL ENGINE
    </footer>

  </div>

  <script>
    const ELO = ${JSON.stringify(eloData.ratings)};
    const WC = ${JSON.stringify(wcData.matches)};
    const BACKTEST = ${JSON.stringify(backtestData)};
    const PROB = ${JSON.stringify(probData)};

    const DC_RHO = -0.13;

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

    function switchTab(id) {
      document.querySelectorAll('.pill-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      event.currentTarget.classList.add('active');
      document.getElementById('tab-' + id).classList.add('active');
    }

    function renderTitleRaceTable() {
      const search = document.getElementById('title-search').value.toLowerCase();
      const tbody = document.getElementById('title-race-tbody');
      tbody.innerHTML = '';

      PROB.teams.forEach((t, idx) => {
        if (search && !t.slug.toLowerCase().includes(search)) return;

        const tr = document.createElement('tr');
        const pR32 = (t.pRound32 * 100).toFixed(0) + '%';
        const pR16 = (t.pRound16 * 100).toFixed(0) + '%';
        const pQF = (t.pQuarterfinal * 100).toFixed(0) + '%';
        const pSF = (t.pSemifinal * 100).toFixed(0) + '%';
        const pF = (t.pFinal * 100).toFixed(0) + '%';
        const pChamp = (t.pChampion * 100).toFixed(1) + '%';

        tr.innerHTML = '<td style="font-family: var(--font-mono); font-weight: 800; color: var(--neon-gold)">#' + (idx + 1) + '</td>' +
                       '<td style="text-align: left; font-weight: 800; text-transform: capitalize;">' + t.slug.replace(/-/g, ' ') + '</td>' +
                       '<td>' + pR32 + '</td>' +
                       '<td>' + pR16 + '</td>' +
                       '<td>' + pQF + '</td>' +
                       '<td>' + pSF + '</td>' +
                       '<td>' + pF + '</td>' +
                       '<td class="' + (t.pChampion > 0 ? 'gold-cell' : '') + '">' + pChamp + '</td>';
        tbody.appendChild(tr);
      });
    }

    function initSimulator() {
      const selA = document.getElementById('teamA-select');
      const selB = document.getElementById('teamB-select');
      const sorted = Object.keys(ELO).sort();

      sorted.forEach(t => {
        const opA = document.createElement('option');
        opA.value = t; opA.textContent = t.toUpperCase() + ' (ELO ' + ELO[t] + ')';
        selA.appendChild(opA);

        const opB = document.createElement('option');
        opB.value = t; opB.textContent = t.toUpperCase() + ' (ELO ' + ELO[t] + ')';
        selB.appendChild(opB);
      });

      selA.value = 'spain';
      selB.value = 'germany';

      selA.addEventListener('change', runSim);
      selB.addEventListener('change', runSim);
      document.getElementById('venue-select').addEventListener('change', runSim);

      runSim();
    }

    function runSim() {
      const teamA = document.getElementById('teamA-select').value;
      const teamB = document.getElementById('teamB-select').value;
      const venue = document.getElementById('venue-select').value;

      let hb = 0;
      if (venue === 'homeA') hb = 75;
      if (venue === 'homeB') hb = -75;

      const ra = ELO[teamA];
      const rb = ELO[teamB];

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

      document.getElementById('exp-a-lbl').textContent = teamA.toUpperCase().replace(/-/g, ' ') + ' EXPECTED GOALS (λ)';
      document.getElementById('exp-b-lbl').textContent = teamB.toUpperCase().replace(/-/g, ' ') + ' EXPECTED GOALS (μ)';

      const table = document.getElementById('matrix-table');
      let html = '<thead><tr><th>' + teamA.toUpperCase() + ' \\ ' + teamB.toUpperCase() + '</th>';
      for (let b = 0; b < 6; b++) html += '<th>' + b + '</th>';
      html += '</tr></thead><tbody>';

      let maxP = 0;
      for (let a = 0; a < 6; a++) {
        for (let b = 0; b < 6; b++) {
          if (res.grid[a][b] > maxP) maxP = res.grid[a][b];
        }
      }

      for (let a = 0; a < 6; a++) {
        html += '<tr><th>' + a + '</th>';
        for (let b = 0; b < 6; b++) {
          const val = res.grid[a][b];
          const pct = (val * 100).toFixed(1);
          const intensity = Math.min(1, val / maxP);
          const bg = 'rgba(255, 0, 127, ' + (intensity * 0.6).toFixed(2) + ')';
          html += '<td style="background:' + bg + ';">' + pct + '%</td>';
        }
        html += '</tr>';
      }
      html += '</tbody>';
      table.innerHTML = html;
    }

    let recFilter = 'all';
    function setRecFilter(f, btn) {
      recFilter = f;
      document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderRecordTable();
    }

    function renderRecordTable() {
      const search = document.getElementById('rec-search').value.toLowerCase();
      const tbody = document.getElementById('rec-tbody');
      tbody.innerHTML = '';

      const HOSTS = new Set(["mexico", "usa", "canada"]);

      WC.forEach(m => {
        const ra = ELO[m.t1];
        const rb = ELO[m.t2];
        if (!ra || !rb) return;

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
                       '<td style="font-family: var(--font-mono); font-weight: 800; font-size: 1.1rem; color: #fff;">' + rating + '</td>' +
                       '<td>' + (isHost ? '<span class="hit-tag">HOST ADVANTAGE (+75 ELO)</span>' : '<span style="color: var(--text-muted)">NEUTRAL</span>') + '</td>';
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
      const a = document.createElement('a');
      a.href = url;
      a.download = 'probabilities.csv';
      a.click();
    }

    window.addEventListener('DOMContentLoaded', () => {
      renderTitleRaceTable();
      initSimulator();
      renderRecordTable();
      renderRatingsTable();
    });
  </script>
</body>
</html>`;

writeFileSync("index.html", htmlContent);
console.log("✓ Updated index.html with cup26matches.com and embeddable widget section removed.");
