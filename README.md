# 🏆 World Cup 2026 Prediction Model

An open-source statistical model that forecasts **2026 FIFA World Cup** matches and title odds —
**Elo ratings → Dixon-Coles bivariate Poisson → Monte Carlo simulation**. Transparent, reproducible football maths with no black-box machine learning or scraped bookmaker odds.

> 🤖 **Walk-Forward Validated & Calibrated Model**: Built on an auditable methodology, a walk-forward backtest, and a public track record of verified international and tournament calls (**50/70 correct picks** so far, misses included).

> 🔴 **The tournament model conditions on real results**: finished matches are locked, eliminated teams collapse to 0%, the actual bracket is used, and remaining matches are simulated across 50,000 Monte Carlo trials.

---

## Why it's worth a look

It's tested the honest way — **walk-forward, out-of-sample** on **913 real internationals**
(Oct 2023 – Jun 2026). Every match is predicted using only data available *before* kickoff, then
scored against the actual result — with **proper scoring rules** (RPS, log-loss, Brier), not just
accuracy, because accuracy alone rewards lucky guessing. Reproduce it yourself in one command:

```bash
node backtest.mjs
```

| Metric (763 evaluated, 150 burn-in) | Model | Baseline |
|---|---|---|
| **Ranked Probability Score** (the football standard, ↓) | **0.175** | coin-flip 0.241 |
| Log-loss (↓) | **0.89** | coin-flip 1.10 |
| Brier score (↓) | **0.52** | coin-flip 0.67 |
| **Expected Calibration Error** (↓) | **2.3%** | < 5% = well-calibrated |
| Correct result (win/draw/loss) | **62%** | always-home 49% · coin-flip 33% |
| When a clear favourite (p ≥ 50%) | **69%** | — |


### Is it calibrated? (the chart that matters)

A forecaster is honest when the things it calls "70%" happen about 70% of the time. Pooling every
probability the model issued across the out-of-sample matches:

| Model said | Actually happened | n |
|---|---|---|
| 5% | 7% | 225 |
| 15% | 13% | 374 |
| 26% | 24% | 804 |
| 35% | 32% | 205 |
| 45% | 54% | 200 |
| 55% | 56% | 149 |
| 65% | 67% | 136 |
| 75% | 76% | 95 |
| 85% | 85% | 100 |

No model is a crystal ball — football is high-variance and draws are genuinely hard. These are
well-calibrated estimates, and we make **no claim to beat the betting market**.

---

## 📊 Live Track Record (2026)

The model's call on **every finished match** of the tournament:

<!-- TRACK-RECORD:START -->
**50/70 correct picks (71%) · avg RPS 0.137** (coin-flip ≈ 0.245) · updated 2026-07-15

| Date | Result | Model's pick | |
|---|---|---|---|
| 2026-07-15 | England 1–2 Argentina | Argentina 44% | ✅ |
| 2026-07-14 | France 0–2 Spain | Spain 40% | ✅ |
| 2026-07-12 | Argentina 3–1 aet Switzerland | Argentina 66% | ✅ |
| 2026-07-10 | Spain 2–1 Belgium | Spain 57% | ✅ |
| 2026-07-09 | France 2–0 Morocco | France 55% | ✅ |
| 2026-07-07 | USA 1–4 Belgium | Belgium 40% | ✅ |
| 2026-07-07 | Argentina 3–2 Egypt | Argentina 81% | ✅ |
| 2026-07-07 | Switzerland 0–0 (4–3 p) Colombia | Colombia 45% | ❌ |
| 2026-07-06 | Mexico 2–3 England | England 46% | ✅ |
| 2026-07-06 | Portugal 0–1 Spain | Spain 51% | ✅ |
| 2026-07-04 | Colombia 1–0 Ghana | Colombia 66% | ✅ |
| 2026-07-04 | Paraguay 0–1 France | France 79% | ✅ |
| 2026-07-04 | Canada 0–3 Morocco | Morocco 46% | ✅ |
| 2026-07-03 | Australia 1–1 (2–4 p) Egypt | Australia 46% | ❌ |
| 2026-07-03 | Switzerland 2–0 Algeria | Switzerland 51% | ✅ |
| 2026-07-02 | USA 2–0 Bosnia & Herzegovina | USA 70% | ✅ |
| 2026-07-02 | Portugal 2–1 Croatia | Portugal 44% | ✅ |
| 2026-07-01 | Mexico 2–0 Ecuador | Mexico 48% | ✅ |
| 2026-07-01 | Belgium 3–2 aet Senegal | Belgium 43% | ✅ |
| 2026-06-30 | Netherlands 1–1 (2–3 p) Morocco | Netherlands 42% | ❌ |
| 2026-06-29 | Brazil 2–1 Japan | Brazil 53% | ✅ |
| 2026-06-29 | Germany 1–1 (3–4 p) Paraguay | Germany 69% | ❌ |
| 2026-06-28 | South Africa 0–1 Canada | Canada 64% | ✅ |
| 2026-06-27 | Jordan 1–3 Argentina | Argentina 88% | ✅ |
| 2026-06-27 | Colombia 0–0 Portugal | Portugal 41% | ❌ |
| 2026-06-27 | Panama 0–2 England | England 83% | ✅ |
| 2026-06-27 | Croatia 2–1 Ghana | Croatia 64% | ✅ |
| 2026-06-26 | Egypt 1–1 Iran | Iran 43% | ❌ |
| 2026-06-26 | New Zealand 1–5 Belgium | Belgium 75% | ✅ |
| 2026-06-26 | Uruguay 0–1 Spain | Spain 64% | ✅ |
| 2026-06-25 | Paraguay 0–0 Australia | Australia 48% | ❌ |
| 2026-06-25 | Ecuador 2–1 Germany | Germany 52% | ❌ |
| 2026-06-25 | Tunisia 1–3 Netherlands | Netherlands 69% | ✅ |
| 2026-06-24 | Czech Republic 0–3 Mexico | Mexico 69% | ✅ |
| 2026-06-24 | South Africa 1–0 South Korea | South Korea 59% | ❌ |
| 2026-06-24 | Switzerland 2–1 Canada | Switzerland 38% | ✅ |
| 2026-06-24 | Bosnia & Herzegovina 3–1 Qatar | Bosnia & Herzegovina 37% | ✅ |
| 2026-06-24 | Scotland 0–3 Brazil | Brazil 78% | ✅ |
| 2026-06-24 | Morocco 4–2 Haiti | Morocco 80% | ✅ |
| 2026-06-23 | England 0–0 Ghana | England 78% | ❌ |
| 2026-06-23 | Panama 0–1 Croatia | Croatia 70% | ✅ |
| 2026-06-22 | Jordan 1–2 Algeria | Algeria 58% | ✅ |
| 2026-06-21 | Belgium 0–0 Iran | Belgium 54% | ❌ |
| 2026-06-21 | New Zealand 1–3 Egypt | Egypt 50% | ✅ |
| 2026-06-21 | Spain 4–0 Saudi Arabia | Spain 84% | ✅ |
| 2026-06-20 | Germany 2–1 Ivory Coast | Germany 62% | ✅ |
| 2026-06-20 | Tunisia 0–4 Japan | Japan 59% | ✅ |
| 2026-06-19 | Scotland 0–1 Morocco | Morocco 64% | ✅ |
| 2026-06-19 | Brazil 3–0 Haiti | Brazil 86% | ✅ |
| 2026-06-19 | USA 2–0 Australia | USA 46% | ✅ |
| 2026-06-18 | Czech Republic 1–1 South Africa | Czech Republic 44% | ❌ |
| 2026-06-18 | Mexico 1–0 South Korea | Mexico 54% | ✅ |
| 2026-06-18 | Switzerland 4–1 Bosnia & Herzegovina | Switzerland 65% | ✅ |
| 2026-06-18 | Canada 6–0 Qatar | Canada 63% | ✅ |
| 2026-06-17 | England 4–2 Croatia | England 50% | ✅ |
| 2026-06-17 | Ghana 1–0 Panama | Ghana 41% | ✅ |
| 2026-06-16 | France 3–1 Senegal | France 60% | ✅ |
| 2026-06-16 | Argentina 3–0 Algeria | Argentina 80% | ✅ |
| 2026-06-15 | Belgium 1–1 Egypt | Belgium 61% | ❌ |
| 2026-06-15 | Iran 2–2 New Zealand | Iran 58% | ❌ |
| 2026-06-15 | Saudi Arabia 1–1 Uruguay | Uruguay 60% | ❌ |
| 2026-06-14 | Ivory Coast 1–0 Ecuador | Ecuador 45% | ❌ |
| 2026-06-14 | Netherlands 2–2 Japan | Netherlands 45% | ❌ |
| 2026-06-13 | Qatar 1–1 Switzerland | Switzerland 66% | ❌ |
| 2026-06-13 | Brazil 1–1 Morocco | Brazil 51% | ❌ |
| 2026-06-13 | Haiti 0–1 Scotland | Scotland 53% | ✅ |
| 2026-06-12 | Canada 1–1 Bosnia & Herzegovina | Canada 62% | ❌ |
| 2026-06-12 | USA 4–1 Paraguay | USA 59% | ✅ |
| 2026-06-11 | Mexico 2–0 South Africa | Mexico 77% | ✅ |
| 2026-06-11 | South Korea 2–1 Czech Republic | South Korea 51% | ✅ |

_Every call is listed — hits and misses. Probabilities are the model's frozen pre-match numbers (ratings don't re-fit mid-tournament), so nothing here is retro-fitted. Reproduce with `node track-record.mjs`._
<!-- TRACK-RECORD:END -->

---

## 🚀 Quick Start

No external dependencies required. Node 18+.

```bash
git clone <your-repository-url>
cd world-cup-2026-prediction-model

node predict.mjs brazil argentina      # Head-to-head probabilities
node predict.mjs usa mexico usa        # 3rd arg = home team (host bonus)
node backtest.mjs                      # Reproduce the accuracy numbers
node calibrate.mjs                     # Rebuild ratings from data/results.json
```

Example output:

```text
$ node predict.mjs spain germany

  spain (Elo 2068)  vs  germany (Elo 1935)   [neutral]

  spain            win   51.4%  ███████████████
  draw                   27.2%  ████████
  germany          win   21.4%  ██████

  expected goals:  1.68 – 1.02
```

---

## 🛠️ How It Works

1. **Team strength (Elo).** Each nation starts from a long-run prior, then is calibrated on
   recent real internationals — wins over strong sides in important games move a rating more than
   friendlies, and recent form outweighs old form. See [`calibrate.mjs`](./calibrate.mjs).
2. **Each match (Dixon-Coles Poisson).** Ratings → expected goals → a Dixon-Coles bivariate
   Poisson gives win/draw/loss probabilities. The Dixon-Coles correction fixes plain Poisson's
   well-known under-count of low-scoring draws (0-0, 1-1). See [`elo.mjs`](./elo.mjs).
3. **The tournament (Monte Carlo).** Plays all 104 matches **50,000 times** through
   the real bracket to get championship & advancement odds — locking finished results and simulating only remaining matches.

---

## 📁 Repository File Structure

| File | Description |
|---|---|
| `index.html` | Interactive web dashboard & simulator |
| `elo.mjs` | Bivariate Dixon-Coles Poisson match engine & goal probability math |
| `calibrate.mjs` | Builds calibrated team Elo ratings from `data/results.json` |
| `backtest.mjs` | Walk-forward out-of-sample evaluation (RPS, log-loss, Brier, ECE) |
| `predict.mjs` | Command-line head-to-head match predictor |
| `track-record.mjs` | Regenerates the live 2026 track-record scorecard table in this README |
| `data/results.json` | 913 real international results (Oct 2023 – Jun 2026) |
| `data/elo-calibrated.json` | Calibrated Elo ratings for finalist nations |
| `data/wc2026-results.json` | Finished 2026 World Cup match results |
| `data/probabilities-pre.json` | Unconditioned 50,000 simulation pre-tournament odds |
| `data/probabilities.json` | Live in-tournament conditioned odds |
| `data/model-backtest.json` | Saved backtest evaluation metrics |

---

## 📄 License

MIT License. Open-source, free to use, modify, and distribute.
