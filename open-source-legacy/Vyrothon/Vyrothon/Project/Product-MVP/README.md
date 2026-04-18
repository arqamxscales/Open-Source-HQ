# Creatix AI — Product Design Case Study

> **VYROTHON 2026 · NUST NSTP · 18 April 2026**  
> Designer: **Mohammad Arqam Javed** · Domain: Product Design

---

## Overview

A complete product design submission for **Creatix AI** — an AI-first creative platform where users can create documents, slides, presentations, sheets, images, videos, music, and audio, all with AI assistance.

This submission covers the full user journey from first contact to active use:
- **Auth** — Signup & SSO with value signalling
- **Intent Capture** — Role-based personalisation in one screen
- **Onboarding** — 3-screen progressive disclosure flow
- **Dashboard** — 8-mode workspace with AI prompt bar
- **Style Guide** — Full design system: colours, typography, components

---

## Live Preview

Open `index.html` in any modern browser. Use the top navigation to move between screens:

| Tab | Contents |
|-----|----------|
| 📄 Cover | Project summary, approach, A/B test write-up |
| 🔐 01 Auth | Signup screen with SSO + form validation |
| 🎯 Intent | Role/use-case capture screen |
| 🚀 02 Onboarding | 3-step onboarding flow |
| 🏠 03 Dashboard | Full workspace dashboard |
| 🎨 04 Style Guide | Complete design system |

---

## Design Decisions

### Problem: Too much to explain, too little patience
Creatix has 8 creation modes. A typical productivity tool has one. The design challenge: reveal the product without overwhelming users.

### Solution: Progressive Disclosure + Intent-First Personalisation

**Step 1 — Auth**  
The left panel previews all 8 modes as an icon grid. Users understand "eight creation tools, one workspace" before they've typed a single character. SSO is top-of-form — reducing friction for the majority who prefer it.

**Step 2 — Intent Capture (1 screen)**  
One question: "What brings you to Creatix?" Six role cards (Creator, Marketer, Student, Developer, Business, Other). The selection reorders dashboard mode cards so the user's most relevant tools appear first. The word "survey" never appears.

**Step 3 — Onboarding (3 screens)**
- Screen 1: Mental model — "One workspace. Eight modes." Not features, but orientation.
- Screen 2: Mode gallery — each of the 8 modes shown with a distinct colour accent. Builds visual memory that persists in the dashboard.
- Screen 3: First creation — a free-text prompt box, not a mode picker. Asking users to *make something* instead of *learn something* drives the highest activation.

**Step 4 — Dashboard**  
AI prompt bar is highest-priority element (above mode grid). 8 creation modes carry their onboarding accent colours — visual continuity. Empty state CTA is action-oriented, not form-oriented.

---

## A/B Test Write-Up

**Hypothesis:** Presenting a free-text prompt box on Onboarding Screen 3 (Variant A) will outperform showing eight creation mode cards (Variant B) in driving first-content creation, because an open prompt lowers decision overhead — users don't need to choose a mode before they start.

**Primary Metric:** First-content creation rate within the onboarding session

**Expected Result:** Variant A (prompt-first) achieves +12–18% higher activation vs Variant B

**Why it Matters:** First content creation is the strongest predictor of Day-7 retention in creative productivity tools

**Secondary Signal:** Track mode distribution — what do users create when given total freedom? This informs which modes to surface first in future onboarding iterations.

---

## Style Guide Summary

### Colours
| Token | Value | Use |
|-------|-------|-----|
| `--primary` | `#5B5BF5` | CTAs, active states, links |
| `--accent` | `#0DDDD4` | Secondary highlights, badges |
| `--bg` | `#08080F` | Base page background |
| `--surface` | `#111119` | Cards, sidebars |
| `--text-1` | `#F0F0FF` | Headings, primary labels |
| `--text-2` | `#9999BB` | Body copy |

### Typography
- **Display:** Syne 800 — editorial, architectural, memorable
- **Body:** DM Sans — optically balanced at 13–16px
- **Mono:** JetBrains Mono — metadata, code, keyboard shortcuts

### Components
- Buttons: Primary, Secondary, Ghost, Danger (+ SM/LG sizes)
- Inputs: Default, Focused, Error, Success states
- Cards: Base, Elevated, Accent
- Badges: Primary, Success, Warning, Danger
- Navigation: Sidebar with active/hover states

---

## File Structure

```
creatix-ai/
├── index.html                    ← Full interactive prototype (all screens)
├── style-guide.html              ← Standalone style guide export
├── README.md                     ← This file
├── LICENSE                       ← MIT License
├── .gitignore                    ← Git ignore rules
├── .github/
│   ├── SECURITY.md              ← Security policy
│   ├── CODE_OF_CONDUCT.md        ← Community guidelines
│   ├── CONTRIBUTING.md           ← Contribution guide
│   └── workflows/
│       ├── security.yml          ← Security scanning pipeline
│       └── branch-protection.yml ← Branch protection rules
└── CHANGELOG.md                  ← Version history
```

---

## Installation & Usage

### Quick Start
1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohammadarqam/creatix-ai.git
   cd creatix-ai
   ```

2. **Open in browser:**
   - Simply open `index.html` in any modern browser
   - No build process, dependencies, or server required
   - Fully client-side interactive prototype

3. **View the design system:**
   - Open `style-guide.html` for the complete component library

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Security

This project follows strict security practices:

- ✅ No hardcoded secrets or API keys
- ✅ Automated security scanning via GitHub Actions
- ✅ Dependency vulnerability monitoring
- ✅ Secret detection in all commits
- ✅ Code quality analysis with CodeQL

**Found a security issue?** Please see [SECURITY.md](.github/SECURITY.md) for responsible disclosure.

---

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](.github/CONTRIBUTING.md) for:
- Development setup
- Code standards
- Pull request process
- Reporting issues

**Our community guidelines:** See [CODE_OF_CONDUCT.md](.github/CODE_OF_CONDUCT.md)

---

## Evaluation Criteria Addressed

| Criterion | Weight | How Addressed |
|-----------|--------|---------------|
| Visual Design Craft | 40% | Dark-mode editorial system, Syne display font, consistent colour accent system across all 8 modes, micro-interactions on hover |
| Problem Solving | 40% | Progressive disclosure architecture, intent-first personalisation, "create don't teach" onboarding, AI prompt bar as primary dashboard CTA |
| Systems Thinking | 20% | Full CSS variable token system, documented component library, 8-mode accent colour system used consistently onboarding → dashboard |

---

## Evaluation Criteria Addressed

| Criterion | Weight | How Addressed |
|-----------|--------|---------------|
| Visual Design Craft | 40% | Dark-mode editorial system, Syne display font, consistent colour accent system across all 8 modes, micro-interactions on hover |
| Problem Solving | 40% | Progressive disclosure architecture, intent-first personalisation, "create don't teach" onboarding, AI prompt bar as primary dashboard CTA |
| Systems Thinking | 20% | Full CSS variable token system, documented component library, 8-mode accent colour system used consistently onboarding → dashboard |

---

## Responsive Design

The prototype is fully responsive:
- **Desktop:** Sidebar + main layout for dashboard; split left/right for auth
- **Tablet (900px):** Horizontal sidebar, stacked auth, 2-column mode grid
- **Mobile (600px):** Single-column layouts, 2-column mode grid, prompt-above-fold onboarding

---

## License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## Support & Contact

- **Questions?** Open a [GitHub Issue](../../issues)
- **Security concerns?** Email: security@creatix.ai
- **General inquiries:** team@creatix.ai

---

## About This Submission

**Designer:** Mohammad Arqam Javed  
**Event:** VYROTHON 2026  
**Institution:** NUST NSTP  
**Date:** 18 April 2026  
**Domain:** Product Design  
**License:** MIT  

*"Design like it ships Monday." — Creatix AI Design Brief*

---

## Change Log

All notable changes to this project are documented in [CHANGELOG.md](CHANGELOG.md)
