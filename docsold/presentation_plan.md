# Smadex Assessment — Presentation Content
## 3 Slides | Google Slides

---

## VISUAL STYLE GUIDE

**Background:** Near-black (#0a0e1a) — deep navy, not pure black. Feels premium, not void.
**Primary accent:** Gold (#c9a84c) — Raid's brand colour, use for headings and dividers.
**Secondary accent:** Cool white (#f0f4ff) — body text, clean and readable.
**Tertiary:** Muted purple (#7c3aed at 40% opacity) — subtle glow behind images if needed.
**Font:** Use Google Slides' built-in "Oswald" or "Rajdhani" for headers (game-adjacent feel), "Inter" or "Lato" for body. If unavailable, Arial Bold for headers is fine.
**Layout principle:** Generous whitespace. Dark backgrounds need room to breathe. Don't fill every pixel.

---

## SLIDE 1 — Who I am + What I used

**Purpose:** Quick, professional, confident. Sets the tone. Not a CV dump.

### Layout suggestion
Left column (40%): contact block
Right column (60%): tools + time block

---

### LEFT COLUMN — Contact

```
Hugo Muñoz Gris
Playable Ads Developer — Technical Assessment

barcelona, spain
hugomgris@gmail.com
+34 660 39 15 44
github.com/hugomgris
linktr.ee/hugomgris
```

Small, clean, no decoration needed. Just the facts.

---

### RIGHT COLUMN — Time + Tools

**Header:** `ASSESSMENT BREAKDOWN`
(small gold uppercase label, like a section tag)

**Time:**
```
Total time invested: ~15 hours
  — Research & analysis:    ~3h
  — Build:                 ~10h
  — Presentation:           ~2h

Smadex estimate: 5 hours.
I chose to invest the full week's runway
to deliver something I'd stand behind.
```

**Tools used:**
```
BUILD
  TypeScript + PixiJS v8    Core engine & rendering
  Vite                      Bundler + single-file output
  vite-plugin-singlefile    Self-contained HTML packaging

DESIGN
  Photoshop                 Asset prep, mockups, composition
  Provided Raid assets      All in-game visuals

AI TOOLS
  Claude (Anthropic)        Architecture guidance, debugging support,
                            methodology research
```

**Note on AI disclosure:** Being upfront here is the right move. The task explicitly said "AI tools as desired, please mention where used." Stating specifically *how* you used it (guidance + debugging, not code generation) shows integrity and self-awareness.

---

## SLIDE 2 — The Build

**Purpose:** Make them want to play it immediately. The link is the hero of this slide.

### Layout suggestion
Top third: title + pitch
Middle: screenshot(s) + link
Bottom: brief design notes

---

### TITLE / ELEVATOR PITCH

**Large heading (gold, prominent):**
```
TAP. EQUIP. DESTROY.
```

**Subtitle (white, smaller):**
```
A three-round combat playable that teaches players one new mechanic per fight —
turning a 20-second ad into a structured introduction to Raid's core fantasy.
```

This pitch works because it communicates:
- What the user does (tap, equip, destroy — active verbs)
- The design intention (one mechanic per round — shows UX thinking)
- The advertising goal (introduction to the game's fantasy — shows business awareness)

---

### BUILD LINK + PREVIEW

**Prominent, clearly labelled:**
```
▶ PLAY THE DEMO
github.com/hugomgris/[repo-name]
```

Use two screenshots side by side — suggest:
- Screenshot of Round 1 (clean initial state, hero vs enemy)
- Screenshot of the CTA screen (shows the full loop is complete)

These two images together communicate: "it starts well and ends well."

---

### DESIGN DECISIONS (3 bullets, tight)

```
→  Onboarding ladder: Round 1 teaches tapping, Round 2 introduces gear pickup,
   Round 3 unlocks a special ability. No instruction text — mechanics are shown, not told.

→  Hero upgrade system: Visual swap of head, sword and shoulders on gear equip
   communicates progression without UI — the character reflects the player's action.

→  CTA at peak excitement: The download prompt appears immediately after the boss
   kill sequence, at the moment of highest engagement — not after a cooldown.
```

These three bullets are your design thinking made explicit. They answer the unasked question: "does this candidate understand *why* playable ads work?"

---

### TECHNICAL NOTE (small, bottom of slide)

```
Built with TypeScript + PixiJS. Single self-contained HTML file, ~5.5MB.
Tested on desktop (Firefox/Chrome) and mobile (Android, Huawei P30 Pro).
Note: minor bottom crop observed in Android file:// context due to browser chrome —
not present in WebView ad delivery environments.
```

---

## SLIDE 3 — Creative Analysis

**Purpose:** Sharp, confident, shows analytical voice. Mirrors the draft we already wrote.
**Layout:** Three clearly labelled sections. Readable at a glance.

---

### SECTION HEADER (top, small gold label)
```
CREATIVE PERFORMANCE ANALYSIS — Test Campaign Data
```

---

### STRONGEST PERFORMER

**Label:** `SCALE →` (gold, left-aligned)
**Creative name:** `smx-king-ccs-dark-autostart`

```
On pure acquisition efficiency, this creative wins unambiguously — best IPM (1.91),
lowest CPI ($3.42), and the only entry generating positive ROAS at D3 (2.25%).
A 92% load rate and 91% completion rate point to a technically solid build
that holds user attention through to the end.

One flag before scaling: D3 Retention is 0%. A creative this efficient at driving
installs that retains nobody at day three raises a user quality question —
it may be reaching the right volume but the wrong audience.
```

---

### PAUSE

**Label:** `PAUSE ✕` (muted red, left-aligned)
**Creative name:** `clt_plyb_tunneldash_default_original`

```
Worst IPM (1.14), most expensive CPI ($8.26), and a loaded rate of just 61% —
nearly 40% of users never see it. That last point is the most actionable finding:
this is likely a build issue, not an audience problem.

Additional flag: the 143% Engagement Rate is a tracking anomaly —
engagement cannot exceed 100% by definition. Data for this entry
should be re-verified before drawing further conclusions.
```

---

### ADDITIONAL INSIGHTS

**Label:** `INSIGHTS` (white, left-aligned)

```
01  The most interesting tension: smx-king-ccs-dark-tutorial has the highest D3
    retention at 21.3% with nearly identical ROAS (2.21%). If LTV is the priority
    over install volume, it may be the stronger long-term bet. Both creatives
    deserve a longer attribution window before a final scaling decision.

02  Both "dark" variants outperform the rest on cost efficiency and ROAS —
    the format or visual direction is resonating. Worth carrying into the
    next creative iteration cycle.

03  With 63–88 installs per creative, this dataset is directional, not definitive.
    Conclusions are sound as hypotheses; scaling should wait for higher-volume data.
```

---

## PRODUCTION NOTES

### Slide order check
1. Slide 1 (contact + tools) — sets up who you are
2. Slide 2 (build) — the main event
3. Slide 3 (analysis) — shows the other half of the job

### What to avoid
- No bullet point walls. Every section above uses short, punchy blocks.
- No clip art or generic stock imagery. Use your actual screenshots.
- No excessive animation — one clean fade-in per slide maximum.
- Don't shrink the font to fit more text. Cut text instead.

### Sharing settings
Before submitting: File → Share → "Anyone with the link can view."
Test the link in an incognito window before sending.

### One final check
Read all three slides out loud as if presenting them in a room.
If anything sounds awkward or takes more than 10 seconds to get through,
cut it or simplify it. These slides will be read, not presented —
but writing them as if they'll be presented keeps the language sharp.

---

*Presentation plan v1.0 — ready to build in Google Slides*
