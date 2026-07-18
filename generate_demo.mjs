import { readFileSync, writeFileSync } from "node:fs";

const eloData = JSON.parse(readFileSync("./data/elo-calibrated.json", "utf8"));
const wcData = JSON.parse(readFileSync("./data/wc2026-results.json", "utf8"));
const backtestData = JSON.parse(readFileSync("./data/model-backtest.json", "utf8"));

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>World Cup 2026 Prediction Model — Cup26 AI Engine</title>
  <style>
    :root {
      --bg: #0b0f17;
      --card-bg: #151c28;
      --card-border: #232d3f;
      --text-main: #f1f5f9;
      --text-muted: #94a3b8;
      --accent-yellow: #f59e0b;
      --accent-gold: #fbbf24;
      --accent-green: #10b981;
      --accent-red: #ef4444;
      --accent-blue: #3b82f6;
      --primary: #6366f1;
      --font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: var(--font-family);
      line-height: 1.5;
      padding: 24px;
      max-width: 1280px;
      margin: 0 auto;
    }

    header {
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 24px;
      margin-bottom: 28px;
    }

    .brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #272010;
      color: var(--accent-yellow);
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    h1 {
      font-size: 2.2rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }

    .subtitle {
      color: var(--text-muted);
      font-size: 1.05rem;
      max-width: 800px;
    }

    /* Stats Banner */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .metric-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .metric-value {
      font-size: 1.8rem;
      font-weight: 800;
      color: #ffffff;
    }

    .metric-label {
      color: var(--text-muted);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .metric-badge {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 4px;
      width: fit-content;
      font-weight: 600;
    }

    .badge-green { background: rgba(16, 185, 129, 0.15); color: var(--accent-green); }
    .badge-yellow { background: rgba(245, 158, 11, 0.15); color: var(--accent-yellow); }

    /* Tabs Navigation */
    .nav-tabs {
      display: flex;
      gap: 8px;
      border-bottom: 1px solid var(--card-border);
      margin-bottom: 24px;
      overflow-x: auto;
    }

    .tab-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      padding: 12px 20px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .tab-btn:hover {
      color: var(--text-main);
    }

    .tab-btn.active {
      color: var(--accent-gold);
      border-bottom-color: var(--accent-gold);
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
    }

    /* Predictor Section */
    .predictor-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 32px;
    }

    .predictor-controls {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 16px;
      align-items: end;
      margin-bottom: 28px;
    }

    @media (max-width: 768px) {
      .predictor-controls {
        grid-template-columns: 1fr;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    select, input {
      background: #0d121d;
      border: 1px solid #2a364a;
      color: #ffffff;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s;
    }

    select:focus, input:focus {
      border-color: var(--accent-gold);
    }

    .btn-primary {
      background: var(--accent-yellow);
      color: #000000;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.1s, background-color 0.2s;
      height: 48px;
    }

    .btn-primary:hover {
      background: var(--accent-gold);
    }

    .btn-primary:active {
      transform: scale(0.98);
    }

    /* Prediction Display */
    .prob-bars-container {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .prob-bar-row {
      display: grid;
      grid-template-columns: 140px 70px 1fr;
      align-items: center;
      gap: 16px;
    }

    .team-name-label {
      font-weight: 700;
      font-size: 1rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .prob-pct-label {
      font-weight: 800;
      font-size: 1.1rem;
      color: #ffffff;
      text-align: right;
    }

    .progress-track {
      background: #0d121d;
      border-radius: 6px;
      height: 20px;
      overflow: hidden;
      position: relative;
    }

    .progress-fill {
      height: 100%;
      border-radius: 6px;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .fill-a { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
    .fill-draw { background: linear-gradient(90deg, #6b7280, #9ca3af); }
    .fill-b { background: linear-gradient(90deg, #f59e0b, #fbbf24); }

    .goals-summary {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid var(--card-border);
    }

    .goal-box {
      background: #0d121d;
      padding: 16px;
      border-radius: 10px;
      text-align: center;
      border: 1px solid #1e293b;
    }

    .goal-box .val {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--accent-gold);
    }

    .goal-box .lbl {
      font-size: 0.8rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Heatmap Grid */
    .heatmap-section {
      margin-top: 28px;
    }

    .heatmap-title {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 12px;
      color: var(--text-muted);
    }

    .grid-table {
      width: 100%;
      border-collapse: collapse;
      text-align: center;
      font-size: 0.85rem;
    }

    .grid-table th, .grid-table td {
      padding: 10px 6px;
      border: 1px solid var(--card-border);
    }

    .grid-table th {
      background: #0d121d;
      color: var(--text-muted);
    }

    .grid-cell {
      transition: transform 0.1s;
      border-radius: 4px;
    }

    /* Table Component */
    .data-table-container {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      overflow: hidden;
    }

    .table-toolbar {
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--card-border);
      gap: 16px;
      flex-wrap: wrap;
    }

    .search-box {
      max-width: 300px;
      width: 100%;
    }

    .filter-group {
      display: flex;
      gap: 8px;
    }

    .filter-btn {
      background: #0d121d;
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 0.85rem;
      cursor: pointer;
      font-weight: 600;
    }

    .filter-btn.active {
      background: var(--accent-yellow);
      color: #000;
      border-color: var(--accent-yellow);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    th {
      background: #0e1420;
      color: var(--text-muted);
      font-weight: 600;
      font-size: 0.85rem;
      padding: 12px 16px;
      border-bottom: 1px solid var(--card-border);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    td {
      padding: 12px 16px;
      border-bottom: 1px solid #1e2736;
      font-size: 0.92rem;
    }

    tr:hover td {
      background: #1a2332;
    }

    .status-hit { color: var(--accent-green); font-weight: bold; }
    .status-miss { color: var(--accent-red); font-weight: bold; }

    /* Reliability Chart */
    .chart-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 24px;
      margin-top: 24px;
    }

    .rel-chart-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 20px;
    }

    .chart-bar-row {
      display: grid;
      grid-template-columns: 90px 1fr 100px;
      align-items: center;
      gap: 16px;
    }

    .chart-track {
      background: #0d121d;
      height: 24px;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
    }

    .chart-fill-pred {
      background: rgba(99, 102, 241, 0.4);
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    .chart-fill-obs {
      background: var(--accent-gold);
      height: 40%;
      position: absolute;
      top: 30%;
      left: 0;
      border-radius: 2px;
    }

    footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid var(--card-border);
      text-align: center;
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    footer a {
      color: var(--accent-gold);
      text-decoration: none;
    }
  </style>
</head>
<body>

  <header>
    <div class="brand-badge">
      🏆 CUP26 AI — FIFA World Cup 2026 Engine
    </div>
    <h1>Statistical Match Predictor & Live Track Record</h1>
    <p class="subtitle">
      Powered by Elo ratings, Dixon-Coles bivariate Poisson goal models, and Monte Carlo tournament simulations. Transparent, reproducible, walk-forward calibrated maths.
    </p>
  </header>

  <!-- Key Metrics Banner -->
  <div class="metrics-grid">
    <div class="metric-card">
      <div class="metric-label">Tournament Track Record</div>
      <div class="metric-value">70 / 102</div>
      <div class="metric-badge badge-green">69% Top Pick Accuracy</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Ranked Probability Score (RPS)</div>
      <div class="metric-value">0.148</div>
      <div class="metric-badge badge-green">vs Coin-flip 0.245</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Calibrated Nations</div>
      <div class="metric-value">54</div>
      <div class="metric-badge badge-yellow">913 Int'l Matches Fitted</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Calibration Error (ECE)</div>
      <div class="metric-value">2.3%</div>
      <div class="metric-badge badge-green">&lt; 5% Target Achieved</div>
    </div>
  </div>

  <!-- Tabs Navigation -->
  <div class="nav-tabs">
    <button class="tab-btn active" onclick="switchTab('simulator')">⚡ Head-to-Head Predictor</button>
    <button class="tab-btn" onclick="switchTab('record')">📊 2026 Live Track Record (102 Matches)</button>
    <button class="tab-btn" onclick="switchTab('ratings')">⭐ Team Elo Ratings (54 Teams)</button>
    <button class="tab-btn" onclick="switchTab('backtest')">📈 Walk-Forward Backtest & Calibration</button>
  </div>

  <!-- Tab 1: Simulator -->
  <div id="tab-simulator" class="tab-content active">
    <div class="predictor-card">
      <h2 style="font-size: 1.3rem; margin-bottom: 20px; color: #fff;">Simulate Match Outcome</h2>
      <div class="predictor-controls">
        <div class="form-group">
          <label for="teamA-select">Team A (Home / Left)</label>
          <select id="teamA-select"></select>
        </div>
        <div class="form-group">
          <label for="teamB-select">Team B (Away / Right)</label>
          <select id="teamB-select"></select>
        </div>
        <div class="form-group">
          <label for="venue-select">Venue Advantage</label>
          <select id="venue-select">
            <option value="neutral">Neutral Venue</option>
            <option value="homeA">Team A Advantage (+75 Elo)</option>
            <option value="homeB">Team B Advantage (+75 Elo)</option>
          </select>
        </div>
      </div>

      <!-- Probability Bars -->
      <div class="prob-bars-container">
        <div class="prob-bar-row">
          <div class="team-name-label" id="label-teamA">Team A</div>
          <div class="prob-pct-label" id="pct-teamA">0.0%</div>
          <div class="progress-track">
            <div class="progress-fill fill-a" id="bar-teamA" style="width: 0%"></div>
          </div>
        </div>
        <div class="prob-bar-row">
          <div class="team-name-label" style="color: var(--text-muted)">Draw</div>
          <div class="prob-pct-label" id="pct-draw">0.0%</div>
          <div class="progress-track">
            <div class="progress-fill fill-draw" id="bar-draw" style="width: 0%"></div>
          </div>
        </div>
        <div class="prob-bar-row">
          <div class="team-name-label" id="label-teamB">Team B</div>
          <div class="prob-pct-label" id="pct-teamB">0.0%</div>
          <div class="progress-track">
            <div class="progress-fill fill-b" id="bar-teamB" style="width: 0%"></div>
          </div>
        </div>
      </div>

      <!-- Goals Summary -->
      <div class="goals-summary">
        <div class="goal-box">
          <div class="lbl" id="goal-label-a">Team A Expected Goals (&lambda;)</div>
          <div class="val" id="exp-goals-a">0.00</div>
        </div>
        <div class="goal-box">
          <div class="lbl" id="goal-label-b">Team B Expected Goals (&mu;)</div>
          <div class="val" id="exp-goals-b">0.00</div>
        </div>
      </div>

      <!-- Score Heatmap Grid -->
      <div class="heatmap-section">
        <div class="heatmap-title">Dixon-Coles Score Probability Heatmap (%)</div>
        <table class="grid-table" id="heatmap-table">
          <!-- Populated by JS -->
        </table>
      </div>
    </div>
  </div>

  <!-- Tab 2: Track Record -->
  <div id="tab-record" class="tab-content">
    <div class="data-table-container">
      <div class="table-toolbar">
        <input type="text" id="record-search" class="search-box" placeholder="Search team or date..." oninput="filterRecordTable()">
        <div class="filter-group">
          <button class="filter-btn active" onclick="setRecordFilter('all', this)">All (102)</button>
          <button class="filter-btn" onclick="setRecordFilter('hits', this)">Hits (70)</button>
          <button class="filter-btn" onclick="setRecordFilter('misses', this)">Misses (32)</button>
        </div>
      </div>
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Match Result</th>
              <th>Model's Pre-Match Pick</th>
              <th>Win Prob</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="record-table-body">
            <!-- Populated by JS -->
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Tab 3: Elo Ratings -->
  <div id="tab-ratings" class="tab-content">
    <div class="data-table-container">
      <div class="table-toolbar">
        <input type="text" id="ratings-search" class="search-box" placeholder="Search nation..." oninput="filterRatingsTable()">
      </div>
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Nation</th>
              <th>Calibrated Elo Rating</th>
              <th>Host Status</th>
            </tr>
          </thead>
          <tbody id="ratings-table-body">
            <!-- Populated by JS -->
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Tab 4: Backtest & Calibration -->
  <div id="tab-backtest" class="tab-content">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
      <div class="metric-card">
        <div class="metric-label">Backtest Set Size</div>
        <div class="metric-value">763 Matches</div>
        <div class="metric-badge badge-yellow">150 Burn-in Excluded</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Model Brier Score</div>
        <div class="metric-value">0.520</div>
        <div class="metric-badge badge-green">vs Coin-flip 0.667</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Model Log-Loss</div>
        <div class="metric-value">0.886</div>
        <div class="metric-badge badge-green">vs Coin-flip 1.099</div>
      </div>
    </div>

    <div class="chart-card">
      <h3 style="color: #fff; margin-bottom: 8px;">Reliability Curve & Calibration Bins</h3>
      <p style="color: var(--text-muted); font-size: 0.9rem;">
        Comparing predicted probability range (blue background) vs observed real match outcomes (gold bar). Close alignment indicates honest, un-overconfident forecasts.
      </p>
      <div class="rel-chart-grid" id="rel-chart-body">
        <!-- Populated by JS -->
      </div>
    </div>
  </div>

  <footer>
    Replicated and powered by open-source data from <a href="https://github.com/Hicruben/world-cup-2026-prediction-model" target="_blank">Hicruben/world-cup-2026-prediction-model</a> · Cup26 AI Engine
  </footer>

  <script>
    // Embedded Data
    const ELO_RATINGS = ${JSON.stringify(eloData.ratings)};
    const WC_MATCHES = ${JSON.stringify(wcData.matches)};
    const BACKTEST_DATA = ${JSON.stringify(backtestData)};

    // Dixon-Coles Constants
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

          if (a < 6 && b < 6) {
            grid[a][b] += p;
          }
        }
      }
      const total = winA + draw + winB;
      return {
        winA: winA / total,
        draw: draw / total,
        winB: winB / total,
        expectedGoalsA: lambda,
        expectedGoalsB: mu,
        grid
      };
    }

    // Tab Switcher
    function switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      
      event.target.classList.add('active');
      document.getElementById('tab-' + tabId).classList.add('active');
    }

    // Initialize Selects
    function initPredictor() {
      const teamASelect = document.getElementById('teamA-select');
      const teamBSelect = document.getElementById('teamB-select');
      const sortedTeams = Object.keys(ELO_RATINGS).sort();

      sortedTeams.forEach(team => {
        const optA = document.createElement('option');
        optA.value = team;
        optA.textContent = team + ' (Elo ' + ELO_RATINGS[team] + ')';
        teamASelect.appendChild(optA);

        const optB = document.createElement('option');
        optB.value = team;
        optB.textContent = team + ' (Elo ' + ELO_RATINGS[team] + ')';
        teamBSelect.appendChild(optB);
      });

      teamASelect.value = 'spain';
      teamBSelect.value = 'germany';

      teamASelect.addEventListener('change', calculatePredictor);
      teamBSelect.addEventListener('change', calculatePredictor);
      document.getElementById('venue-select').addEventListener('change', calculatePredictor);

      calculatePredictor();
    }

    function calculatePredictor() {
      const teamA = document.getElementById('teamA-select').value;
      const teamB = document.getElementById('teamB-select').value;
      const venue = document.getElementById('venue-select').value;

      let hb = 0;
      if (venue === 'homeA') hb = 75;
      if (venue === 'homeB') hb = -75;

      const ra = ELO_RATINGS[teamA];
      const rb = ELO_RATINGS[teamB];

      const res = matchProb(ra, rb, hb);

      document.getElementById('label-teamA').textContent = teamA;
      document.getElementById('label-teamB').textContent = teamB;

      document.getElementById('pct-teamA').textContent = (res.winA * 100).toFixed(1) + '%';
      document.getElementById('pct-draw').textContent = (res.draw * 100).toFixed(1) + '%';
      document.getElementById('pct-teamB').textContent = (res.winB * 100).toFixed(1) + '%';

      document.getElementById('bar-teamA').style.width = (res.winA * 100) + '%';
      document.getElementById('bar-draw').style.width = (res.draw * 100) + '%';
      document.getElementById('bar-teamB').style.width = (res.winB * 100) + '%';

      document.getElementById('goal-label-a').textContent = teamA + ' Expected Goals';
      document.getElementById('goal-label-b').textContent = teamB + ' Expected Goals';
      document.getElementById('exp-goals-a').textContent = res.expectedGoalsA.toFixed(2);
      document.getElementById('exp-goals-b').textContent = res.expectedGoalsB.toFixed(2);

      // Render Score Matrix
      const table = document.getElementById('heatmap-table');
      let html = '<thead><tr><th>' + teamA + ' \\ ' + teamB + '</th>';
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
          const bg = 'rgba(245, 158, 11, ' + (intensity * 0.45).toFixed(2) + ')';
          html += '<td style="background:' + bg + ';" class="grid-cell">' + pct + '%</td>';
        }
        html += '</tr>';
      }
      html += '</tbody>';
      table.innerHTML = html;
    }

    // Render Track Record Table
    let recordFilter = 'all';
    function renderRecordTable() {
      const search = document.getElementById('record-search').value.toLowerCase();
      const tbody = document.getElementById('record-table-body');
      tbody.innerHTML = '';

      const HOSTS = new Set(["mexico", "usa", "canada"]);

      WC_MATCHES.forEach(m => {
        const ra = ELO_RATINGS[m.t1];
        const rb = ELO_RATINGS[m.t2];
        if (!ra || !rb) return;

        const hb = (HOSTS.has(m.t1) ? 75 : 0) - (HOSTS.has(m.t2) ? 75 : 0);
        const p = matchProb(ra, rb, hb);
        const probs = [p.winA, p.draw, p.winB];
        const actual = m.g1 > m.g2 ? 0 : m.g1 < m.g2 ? 2 : 1;
        const pick = probs.indexOf(Math.max(...probs));
        const hit = pick === actual;

        if (recordFilter === 'hits' && !hit) return;
        if (recordFilter === 'misses' && hit) return;

        const pickLabel = pick === 0 ? m.team1 : pick === 2 ? m.team2 : "Draw";
        const matchStr = m.team1 + ' ' + m.g1 + '–' + m.g2 + ' ' + m.team2;

        if (search && !matchStr.toLowerCase().includes(search) && !m.date.includes(search)) return;

        const tr = document.createElement('tr');
        tr.innerHTML = '<td>' + m.date + '</td>' +
                       '<td><strong>' + m.team1 + '</strong> ' + m.g1 + '–' + m.g2 + ' <strong>' + m.team2 + '</strong></td>' +
                       '<td>' + pickLabel + '</td>' +
                       '<td>' + Math.round(probs[pick] * 100) + '%</td>' +
                       '<td><span class="' + (hit ? 'status-hit' : 'status-miss') + '">' + (hit ? '✅ Picked ' + pickLabel : '❌ Missed') + '</span></td>';
        tbody.appendChild(tr);
      });
    }

    function setRecordFilter(filter, btn) {
      recordFilter = filter;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderRecordTable();
    }

    function filterRecordTable() {
      renderRecordTable();
    }

    // Render Elo Ratings Table
    function renderRatingsTable() {
      const search = document.getElementById('ratings-search').value.toLowerCase();
      const tbody = document.getElementById('ratings-table-body');
      tbody.innerHTML = '';

      const sorted = Object.entries(ELO_RATINGS).sort((a,b) => b[1] - a[1]);
      const HOSTS = new Set(["mexico", "usa", "canada"]);

      sorted.forEach(([team, rating], idx) => {
        if (search && !team.toLowerCase().includes(search)) return;

        const isHost = HOSTS.has(team);
        const tr = document.createElement('tr');
        tr.innerHTML = '<td>#' + (idx + 1) + '</td>' +
                       '<td><strong style="text-transform: capitalize;">' + team.replace(/-/g, ' ') + '</strong></td>' +
                       '<td>' + rating + '</td>' +
                       '<td>' + (isHost ? '<span class="metric-badge badge-yellow">Host (+75 Elo)</span>' : '<span style="color: var(--text-muted)">—</span>') + '</td>';
        tbody.appendChild(tr);
      });
    }

    function filterRatingsTable() {
      renderRatingsTable();
    }

    // Render Reliability Calibration Chart
    function renderReliabilityChart() {
      const container = document.getElementById('rel-chart-body');
      container.innerHTML = '';

      BACKTEST_DATA.calibration.bins.forEach((b, k) => {
        if (!b.n) return;
        const predPct = (b.avgPred * 100).toFixed(0);
        const obsPct = (b.obsFreq * 100).toFixed(0);

        const row = document.createElement('div');
        row.className = 'chart-bar-row';
        row.innerHTML = '<div style="font-size: 0.85rem; color: var(--text-muted)">' + (k*10) + '–' + ((k+1)*10) + '% range</div>' +
                        '<div class="chart-track">' +
                          '<div class="chart-fill-pred" style="width:' + predPct + '%" title="Predicted: ' + predPct + '%"></div>' +
                          '<div class="chart-fill-obs" style="width:' + obsPct + '%" title="Observed: ' + obsPct + '%"></div>' +
                        '</div>' +
                        '<div style="font-size: 0.85rem; text-align: right;"><span style="color: var(--accent-gold); font-weight: bold;">' + obsPct + '%</span> / <span style="color: #818cf8;">' + predPct + '%</span></div>';
        container.appendChild(row);
      });
    }

    // Global Init
    window.addEventListener('DOMContentLoaded', () => {
      initPredictor();
      renderRecordTable();
      renderRatingsTable();
      renderReliabilityChart();
    });
  </script>
</body>
</html>`;

writeFileSync("index.html", htmlContent);
console.log("✓ Demo page index.html successfully generated.");
