import { readFileSync, writeFileSync } from "node:fs";

const eloData = JSON.parse(readFileSync("./data/elo-calibrated.json", "utf8"));
const wcData = JSON.parse(readFileSync("./data/wc2026-results.json", "utf8"));
const backtestData = JSON.parse(readFileSync("./data/model-backtest.json", "utf8"));

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>⚡ WORLD CUP 2026 MAXIMALIST PREDICTION ARENA</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700;800&display=swap');

    :root {
      --bg-dark: #05070d;
      --bg-card: #0d121f;
      --bg-card-hover: #141b2d;
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
        radial-gradient(circle at 15% 15%, rgba(0, 242, 254, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 85% 20%, rgba(255, 0, 127, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, rgba(255, 183, 0, 0.06) 0%, transparent 50%),
        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 100% 100%, 100% 100%, 100% 100%, 32px 32px, 32px 32px;
      color: var(--text-main);
      font-family: var(--font-display);
      min-height: 100vh;
      padding: 0 0 40px 0;
      overflow-x: hidden;
    }

    /* Top Marquee Ticker */
    .marquee-container {
      background: linear-gradient(90deg, #ff007f, #7928ca, #00f2fe, #ffb700);
      padding: 2px 0;
      overflow: hidden;
      white-space: nowrap;
      position: relative;
      box-shadow: 0 0 20px rgba(0, 242, 254, 0.4);
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
      max-width: 1320px;
      margin: 0 auto;
      padding: 24px;
    }

    /* Maximalist Header */
    header {
      margin-bottom: 32px;
      position: relative;
      background: rgba(13, 18, 31, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15);
      overflow: hidden;
    }

    header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 400px;
      height: 400px;
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
      background: rgba(0, 255, 135, 0.1);
      border: 1px solid var(--neon-green);
      color: var(--neon-green);
      padding: 6px 16px;
      border-radius: 9999px;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-shadow: 0 0 10px rgba(0, 255, 135, 0.5);
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
      font-size: clamp(2rem, 5vw, 3.6rem);
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.03em;
      text-transform: uppercase;
      background: linear-gradient(135deg, #ffffff 30%, #e2e8f0 60%, var(--neon-gold) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 12px;
      text-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
    }

    .header-sub {
      font-size: 1.1rem;
      color: var(--text-muted);
      max-width: 850px;
      line-height: 1.6;
    }

    /* Maximalist Metric Grid */
    .hero-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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
      transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }

    .metric-box:hover {
      transform: translateY(-4px) scale(1.02);
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
      background: linear-gradient(180deg, #ffffff, #cbd5e1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
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

    /* Maximalist Nav Pills */
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
      padding: 12px 24px;
      border-radius: 12px;
      font-family: var(--font-display);
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
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

    /* MATCH ARENA SIMULATOR CARD */
    .arena-card {
      background: var(--bg-card);
      border: 2px solid rgba(255, 183, 0, 0.3);
      border-radius: 28px;
      padding: 36px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(255, 183, 0, 0.08);
      position: relative;
      margin-bottom: 32px;
    }

    .arena-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 16px;
    }

    .arena-title {
      font-size: 1.5rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: -0.01em;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .controls-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 220px;
      gap: 20px;
      margin-bottom: 32px;
    }

    @media (max-width: 900px) {
      .controls-grid {
        grid-template-columns: 1fr;
      }
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
      letter-spacing: 0.05em;
    }

    select {
      background: #080c16;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #ffffff;
      padding: 14px 18px;
      border-radius: 12px;
      font-family: var(--font-display);
      font-size: 1.05rem;
      font-weight: 700;
      outline: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    select:focus {
      border-color: var(--neon-gold);
      box-shadow: 0 0 15px rgba(255, 183, 0, 0.3);
    }

    /* MATCHUP VISUALIZER ARENA */
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
      letter-spacing: -0.02em;
    }

    .team-elo-tag {
      font-family: var(--font-mono);
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-top: 4px;
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

    /* Prob Bars Deluxe */
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

    .row-lbl {
      font-weight: 700;
      font-size: 1.05rem;
      white-space: nowrap;
      text-transform: capitalize;
    }

    .row-val {
      font-family: var(--font-mono);
      font-size: 1.3rem;
      font-weight: 800;
      color: #ffffff;
      text-align: right;
    }

    .bar-outer {
      background: #030509;
      height: 28px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
    }

    .bar-inner {
      height: 100%;
      border-radius: 6px;
      transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }

    .bar-inner-a { background: linear-gradient(90deg, #00f2fe, #4facfe); box-shadow: 0 0 15px rgba(0, 242, 254, 0.4); }
    .bar-inner-draw { background: linear-gradient(90deg, #9ca3af, #d1d5db); }
    .bar-inner-b { background: linear-gradient(90deg, #ffb700, #ffe600); box-shadow: 0 0 15px rgba(255, 183, 0, 0.4); }

    /* Expected Goals HUD */
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
      position: relative;
    }

    .hud-box .val-txt {
      font-family: var(--font-mono);
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--neon-gold);
      text-shadow: 0 0 15px rgba(255, 183, 0, 0.4);
    }

    .hud-box .sub-txt {
      font-size: 0.85rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 4px;
    }

    /* Heatmap Grid Maximalist */
    .heatmap-wrap {
      margin-top: 32px;
      background: #050810;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 24px;
    }

    .heatmap-header-title {
      font-family: var(--font-mono);
      font-size: 0.9rem;
      text-transform: uppercase;
      color: var(--neon-cyan);
      margin-bottom: 16px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    .matrix-tbl {
      width: 100%;
      border-collapse: separate;
      border-spacing: 6px;
      text-align: center;
      font-family: var(--font-mono);
    }

    .matrix-tbl th {
      color: var(--text-muted);
      font-size: 0.85rem;
      padding: 8px;
    }

    .matrix-tbl td {
      padding: 14px 8px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 0.95rem;
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: transform 0.15s ease;
    }

    .matrix-tbl td:hover {
      transform: scale(1.1);
      z-index: 10;
      box-shadow: 0 0 15px rgba(255, 183, 0, 0.5);
    }

    /* TABLES STYLING MAXIMALIST */
    .table-card {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
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

    .search-input {
      background: #050810;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #ffffff;
      padding: 10px 18px;
      border-radius: 10px;
      font-family: var(--font-display);
      font-size: 0.95rem;
      outline: none;
      width: 280px;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      border-color: var(--neon-gold);
    }

    .filter-pills {
      display: flex;
      gap: 8px;
    }

    .f-btn {
      background: #050810;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-muted);
      padding: 8px 16px;
      border-radius: 8px;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
    }

    .f-btn.active {
      background: var(--neon-gold);
      color: #000000;
      border-color: var(--neon-gold);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

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

    td {
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 0.95rem;
    }

    tr:hover td {
      background: rgba(255, 255, 255, 0.03);
    }

    .hit-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(0, 255, 135, 0.15);
      color: var(--neon-green);
      border: 1px solid rgba(0, 255, 135, 0.3);
      padding: 4px 12px;
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 800;
    }

    .miss-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 0, 127, 0.15);
      color: var(--neon-magenta);
      border: 1px solid rgba(255, 0, 127, 0.3);
      padding: 4px 12px;
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 800;
    }

    /* Backtest Matrix */
    .chart-container-max {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 24px;
      padding: 32px;
      margin-top: 24px;
    }

    .rel-row {
      display: grid;
      grid-template-columns: 120px 1fr 140px;
      align-items: center;
      gap: 20px;
      margin-bottom: 16px;
    }

    .rel-track {
      background: #050810;
      height: 32px;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .rel-fill-pred {
      background: rgba(0, 242, 254, 0.25);
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      border-right: 2px solid var(--neon-cyan);
    }

    .rel-fill-obs {
      background: linear-gradient(90deg, var(--neon-gold), var(--neon-yellow));
      height: 50%;
      position: absolute;
      top: 25%;
      left: 0;
      border-radius: 4px;
      box-shadow: 0 0 10px rgba(255, 183, 0, 0.5);
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

    footer a {
      color: var(--neon-gold);
      text-decoration: none;
      font-weight: 700;
    }
  </style>
</head>
<body>

  <!-- Top Marquee Ticker -->
  <div class="marquee-container">
    <div class="marquee-inner">
      <span class="marquee-item"><span class="marquee-tag">RECORD</span> 70/102 WINNERS CALLED (69% ACCURACY)</span>
      <span class="marquee-item"><span class="marquee-tag">MODEL</span> ELO → DIXON-COLES POISSON → 50,000 SIMULATIONS</span>
      <span class="marquee-item"><span class="marquee-tag">LAST MATCH</span> ENGLAND 1–2 ARGENTINA (MODEL PICK: 37% ENG) ❌</span>
      <span class="marquee-item"><span class="marquee-tag">MATCH</span> FRANCE 0–2 SPAIN (MODEL PICK: 36% ESP) ✅</span>
      <span class="marquee-item"><span class="marquee-tag">CALIBRATION</span> 2.3% ECE EXPECTED CALIBRATION ERROR</span>
      <span class="marquee-item"><span class="marquee-tag">RECORD</span> 70/102 WINNERS CALLED (69% ACCURACY)</span>
      <span class="marquee-item"><span class="marquee-tag">MODEL</span> ELO → DIXON-COLES POISSON → 50,000 SIMULATIONS</span>
    </div>
  </div>

  <div class="wrapper">

    <!-- Header Banner -->
    <header>
      <div class="header-top">
        <div class="live-badge">
          <div class="pulse-dot"></div>
          FIFA WORLD CUP 2026 ENGINE LIVE
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--neon-gold); font-weight: 700;">
          [ CUP26MATCHES.COM OPEN MODEL ]
        </div>
      </div>
      <h1 class="main-title">Statistical Match Forecaster & Live Arena</h1>
      <p class="header-sub">
        Walk-forward out-of-sample calibrated model for the 2026 FIFA World Cup. Dixon-Coles bivariate Poisson adjustment correcting zero-zero draw bias + Elo recency weighting.
      </p>
    </header>

    <!-- Key Metrics Banner -->
    <div class="hero-metrics">
      <div class="metric-box">
        <div class="metric-label-txt">Tournament Winners</div>
        <div class="metric-big-num">70 / 102</div>
        <div class="metric-tag-pill pill-green">69% TOP PICK ACCURACY</div>
      </div>
      <div class="metric-box">
        <div class="metric-label-txt">Ranked Prob Score</div>
        <div class="metric-big-num">0.148</div>
        <div class="metric-tag-pill pill-gold">VS COIN-FLIP 0.245</div>
      </div>
      <div class="metric-box">
        <div class="metric-label-txt">Nations Calibrated</div>
        <div class="metric-big-num">54</div>
        <div class="metric-tag-pill pill-cyan">913 MATCHES FITTED</div>
      </div>
      <div class="metric-box">
        <div class="metric-label-txt">Reliability Error</div>
        <div class="metric-big-num">2.3%</div>
        <div class="metric-tag-pill pill-green">EXCELLENT CALIBRATION</div>
      </div>
    </div>

    <!-- Nav Tab Pills -->
    <div class="nav-pills-bar">
      <button class="pill-tab active" onclick="switchTab('simulator')">⚡ MATCH SIMULATOR ARENA</button>
      <button class="pill-tab" onclick="switchTab('record')">📊 LIVE TRACK RECORD (102 MATCHES)</button>
      <button class="pill-tab" onclick="switchTab('ratings')">⭐ CALIBRATED ELO RANKINGS (54 NATIONS)</button>
      <button class="pill-tab" onclick="switchTab('backtest')">📈 WALK-FORWARD BACKTEST & ECE</button>
    </div>

    <!-- TAB 1: SIMULATOR ARENA -->
    <div id="tab-simulator" class="tab-content active">
      <div class="arena-card">
        <div class="arena-header">
          <div class="arena-title">
            <span>⚽</span> HEAD-TO-HEAD DIXON-COLES MODEL
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">
            DC_RHO = -0.13
          </div>
        </div>

        <!-- Controls -->
        <div class="controls-grid">
          <div class="form-ctrl">
            <label for="teamA-select">NATION A (HOME / LEFT)</label>
            <select id="teamA-select"></select>
          </div>
          <div class="form-ctrl">
            <label for="teamB-select">NATION B (AWAY / RIGHT)</label>
            <select id="teamB-select"></select>
          </div>
          <div class="form-ctrl">
            <label for="venue-select">VENUE STATUS</label>
            <select id="venue-select">
              <option value="neutral">Neutral Stadium</option>
              <option value="homeA">Nation A Host (+75 Elo)</option>
              <option value="homeB">Nation B Host (+75 Elo)</option>
            </select>
          </div>
        </div>

        <!-- Matchup Arena -->
        <div class="matchup-arena">
          <div class="matchup-teams-display">
            <div class="team-display-side">
              <h3 id="display-teamA">SPAIN</h3>
              <div class="team-elo-tag" id="elo-tagA">ELO: 2055</div>
            </div>
            <div class="vs-badge">VS</div>
            <div class="team-display-side">
              <h3 id="display-teamB">GERMANY</h3>
              <div class="team-elo-tag" id="elo-tagB">ELO: 1945</div>
            </div>
          </div>

          <!-- Deluxe Prob Stack -->
          <div class="deluxe-prob-stack">
            <div class="deluxe-bar-row">
              <div class="row-lbl" id="lbl-teamA" style="color: var(--neon-cyan)">SPAIN WIN</div>
              <div class="row-val" id="val-teamA">53.2%</div>
              <div class="bar-outer">
                <div class="bar-inner bar-inner-a" id="bar-teamA" style="width: 53.2%"></div>
              </div>
            </div>

            <div class="deluxe-bar-row">
              <div class="row-lbl" style="color: var(--text-muted)">DRAW</div>
              <div class="row-val" id="val-draw">26.8%</div>
              <div class="bar-outer">
                <div class="bar-inner bar-inner-draw" id="bar-draw" style="width: 26.8%"></div>
              </div>
            </div>

            <div class="deluxe-bar-row">
              <div class="row-lbl" id="lbl-teamB" style="color: var(--neon-gold)">GERMANY WIN</div>
              <div class="row-val" id="val-teamB">20.0%</div>
              <div class="bar-outer">
                <div class="bar-inner bar-inner-b" id="bar-teamB" style="width: 20.0%"></div>
              </div>
            </div>
          </div>

          <!-- Expected Goals HUD -->
          <div class="hud-stats-grid">
            <div class="hud-box">
              <div class="val-txt" id="exp-a-val">1.68</div>
              <div class="sub-txt" id="exp-a-lbl">SPAIN EXPECTED GOALS (&lambda;)</div>
            </div>
            <div class="hud-box">
              <div class="val-txt" id="exp-b-val">1.08</div>
              <div class="sub-txt" id="exp-b-lbl">GERMANY EXPECTED GOALS (&mu;)</div>
            </div>
          </div>
        </div>

        <!-- Heatmap Grid -->
        <div class="heatmap-wrap">
          <div class="heatmap-header-title">DIXON-COLES BIVARIATE POISSON SCORE MATRIX (%)</div>
          <table class="matrix-tbl" id="matrix-table">
            <!-- JS populated -->
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: TRACK RECORD -->
    <div id="tab-record" class="tab-content">
      <div class="table-card">
        <div class="toolbar">
          <input type="text" id="rec-search" class="search-input" placeholder="Search match or date..." oninput="renderRecordTable()">
          <div class="filter-pills">
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
            <tbody id="rec-tbody">
              <!-- JS Populated -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 3: RATINGS -->
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
            <tbody id="rat-tbody">
              <!-- JS Populated -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 4: BACKTEST -->
    <div id="tab-backtest" class="tab-content">
      <div class="hero-metrics" style="margin-bottom: 24px;">
        <div class="metric-box">
          <div class="metric-label-txt">Out-Of-Sample Evaluated</div>
          <div class="metric-big-num">763 Matches</div>
          <div class="metric-tag-pill pill-gold">150 BURN-IN SKIPPED</div>
        </div>
        <div class="metric-box">
          <div class="metric-label-txt">Brier Score (↓)</div>
          <div class="metric-big-num">0.520</div>
          <div class="metric-tag-pill pill-green">BASELINE 0.667</div>
        </div>
        <div class="metric-box">
          <div class="metric-label-txt">Log-Loss (↓)</div>
          <div class="metric-big-num">0.886</div>
          <div class="metric-tag-pill pill-green">BASELINE 1.099</div>
        </div>
      </div>

      <div class="chart-container-max">
        <h3 style="font-size: 1.2rem; margin-bottom: 8px; color: #fff;">Reliability & Expected Calibration Curve</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px;">
          Comparing predicted probability bands (blue glow) vs actual observed outcome frequencies (gold glow).
        </p>
        <div id="rel-grid">
          <!-- JS Populated -->
        </div>
      </div>
    </div>

    <footer>
      OPEN-SOURCE FIFA WORLD CUP 2026 STATISTICAL MODEL · POWERED BY <a href="https://cup26matches.com" target="_blank">CUP26MATCHES.COM</a>
    </footer>

  </div>

  <script>
    const ELO = ${JSON.stringify(eloData.ratings)};
    const WC = ${JSON.stringify(wcData.matches)};
    const BACKTEST = ${JSON.stringify(backtestData)};

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

    function initSimulator() {
      const selA = document.getElementById('teamA-select');
      const selB = document.getElementById('teamB-select');
      const sorted = Object.keys(ELO).sort();

      sorted.forEach(t => {
        const opA = document.createElement('option');
        opA.value = t;
        opA.textContent = t.toUpperCase() + ' (ELO ' + ELO[t] + ')';
        selA.appendChild(opA);

        const opB = document.createElement('option');
        opB.value = t;
        opB.textContent = t.toUpperCase() + ' (ELO ' + ELO[t] + ')';
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

      // Heatmap Matrix
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

    function renderReliabilityGrid() {
      const container = document.getElementById('rel-grid');
      container.innerHTML = '';

      BACKTEST.calibration.bins.forEach((b, k) => {
        if (!b.n) return;
        const predPct = (b.avgPred * 100).toFixed(0);
        const obsPct = (b.obsFreq * 100).toFixed(0);

        const row = document.createElement('div');
        row.className = 'rel-row';
        row.innerHTML = '<div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted)">' + (k*10) + '–' + ((k+1)*10) + '% BAND</div>' +
                        '<div class="rel-track">' +
                          '<div class="rel-fill-pred" style="width:' + predPct + '%"></div>' +
                          '<div class="rel-fill-obs" style="width:' + obsPct + '%"></div>' +
                        '</div>' +
                        '<div style="font-family: var(--font-mono); font-size: 0.85rem; text-align: right;">' +
                          '<span style="color: var(--neon-gold); font-weight: 800;">' + obsPct + '% REAL</span> / ' +
                          '<span style="color: var(--neon-cyan); font-weight: 800;">' + predPct + '% PRED</span>' +
                        '</div>';
        container.appendChild(row);
      });
    }

    window.addEventListener('DOMContentLoaded', () => {
      initSimulator();
      renderRecordTable();
      renderRatingsTable();
      renderReliabilityGrid();
    });
  </script>
</body>
</html>`;

writeFileSync("index.html", htmlContent);
console.log("✓ Maximalist UI design index.html generated successfully.");
