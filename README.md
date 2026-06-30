# Kijiji Kidijitali (KIJI) — Digital Village

> **KIJI** (short for **Kijiji Kidijitali**, Swahili for "Digital Village") — An open-source outreach, community engagement, and collaboration platform built on Google Apps Script.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Made with Google Apps Script](https://img.shields.io/badge/Made%20with-Google%20Apps%20Script-34A853.svg)](https://developers.google.com/apps-script)
[![GitHub stars](https://img.shields.io/badge/dynamic/json?logo=github&label=Stars&style=flat&color=blue&query=%24.stargazers_count&url=https%3A%2F%2Fapi.github.com%2Frepos%2Fkangwa-ntema%2Fkiji)](https://github.com/kangwa-ntema/kiji/stargazers)
[![GitHub issues](https://img.shields.io/badge/dynamic/json?logo=github&label=Issues&style=flat&color=blue&query=%24.open_issues_count&url=https%3A%2F%2Fapi.github.com%2Frepos%2Fkangwa-ntema%2Fkiji)](https://github.com/kangwa-ntema/kiji/issues)
[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)
[![GitHub release](https://img.shields.io/github/v/release/kangwa-ntema/kiji)](https://github.com/kangwa-ntema/kiji/releases)

---

## 🌍 What is KIJI?

In a traditional village (*kijiji*), people come together to share, collaborate, and grow. **KIJI** brings that same spirit into the digital world.

It's a complete, lightweight CRM and outreach management system that turns Google Sheets into a powerful community engagement hub for:

- 📊 **Dashboard** — Real-time community stats
- 🎯 **Outreach Campaigns** — Set and track engagement goals
- 👥 **Community Members** — Manage contacts, leads, and collaborators
- 🚀 **Projects** — Track community initiatives and participation
- 📝 **Daily Activity Log** — Record community engagement
- 📈 **Reports** — Understand your community's growth

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **🌍 Digital Village Management** | Everything you need to engage your community |
| **📱 Phone Number Normalization** | Automatic formatting for African numbers (+260) |
| **⭐ Lead Scoring** | Track engagement quality |
| **🎯 Campaign Tracking** | Daily, weekly, monthly goals with minimums |
| **🤝 Collaboration Hub** | Link community members to projects |
| **📊 Community Reports** | Status breakdowns, top institutions, activity logs |
| **⚡ One-Click Setup** | `normalizeAllSheets()` initializes everything |
| **📎 CSV Export** | Download data for external analysis |
| **📱 Mobile-Friendly** | Menu-based setup works on mobile |
| **📄 Google Doc Integration** | Auto-generates documentation with web app link |

---

### 🚀 Quick Start

### Option 1: One-Click Setup (Recommended) 📱

1. **[Click here to copy the template](https://docs.google.com/spreadsheets/d/1xlwol7ISkM6GX6BAtz2_dRE_ipuiaT86WyebkfxmI8s/copy)**
2. Open the copied sheet (works on mobile too!)
3. From the **🏘️ KIJI** menu, click **Initialize Village**
4. Wait for initialization to complete (takes 10-15 seconds)
5. Go to **Extensions > Apps Script**
6. Click **Deploy** > **New deployment**
7. Click the settings gear ⚙️ next to "Web app"
8. Set **"Execute as"** to **"Me"**
9. Set **"Who has access"** to **"Anyone"**
10. Click **Deploy** and copy the URL
11. Click **Fix Deployment** from the KIJI menu to save your URL
12. Click **Open Web App** from the KIJI menu to access your village 🏘️

**That's it! No coding required!**

> 📱 **Mobile Users:** The KIJI menu works on mobile. Just tap the menu icon (⋮) in the top-right corner of the Google Sheets app and follow the steps.
---

### Option 2: Manual Setup (For Developers)

```bash
# 1. Create a new Google Sheet
# 2. Go to Extensions > Apps Script
# 3. Copy all files from the src/ folder into the editor
# 4. Run normalizeAllSheets() to initialize
# 5. Deploy as a Web App
```

---

### Option 3: Development Setup with clasp (Recommended for Contributors)

This is the professional way to develop and contribute to KIJI.

#### Prerequisites

```bash
# Install Node.js (v14 or later)
# npm comes with Node.js
# Install clasp globally
npm install -g @google/clasp
```

#### Setup Steps

```bash
# 1. Clone the repository
git clone https://github.com/kangwa-ntema/kiji.git
cd kiji

# 2. Install dependencies
npm install

# 3. Login to clasp
npm run login

# 4. Link to your Google Apps Script project
clasp clone 1cT7SSGrqiNrr7WsuS3uZidzkp-p3v2SOw-Vw5Uh8t_F9NKnhnG_k_V3l

# 5. Pull the latest code
npm run pull

# 6. Make changes, then push back
npm run push

# 7. Deploy as web app
npm run deploy
```

---

## 📁 Project Structure

```
kiji/
├── .clasp.json          # clasp configuration (gitignored)
├── .claspignore         # Files to exclude from clasp push
├── .env                 # Environment variables (gitignored)
├── .gitignore           # Git ignore file
├── .jsconfig.json       # VS Code/IDE configuration
├── appsscript.json      # Google Apps Script manifest
├── CONTRIBUTING.md      # Contribution guidelines
├── LICENSE              # MIT License
├── README.md            # Project documentation
├── package.json         # npm configuration
└── src/                 # Your Apps Script code
    ├── 00_Config.gs     # Configuration & constants
    ├── 01_Utils.gs      # Utility functions
    ├── 02_Outreach.gs   # Outreach campaigns
    ├── 03_Contacts.gs   # Community members
    ├── 04_Projects.gs   # Village projects
    ├── 05_Collaborations.gs # Collaborations
    ├── 06_DailyLog.gs   # Daily activity logging
    ├── 07_Reports.gs    # Village reports
    ├── 08_Dashboard.gs  # Dashboard stats
    ├── 09_System.gs     # System reset/normalize & deployment
    ├── 10_Debug.gs      # Debugging utilities
    └── index.html       # Web app frontend
```

---

## 🛠️ Development Workflow

### Common npm Scripts

| Command | Description |
|---------|-------------|
| `npm run login` | Login to clasp |
| `npm run pull` | Pull latest code from Apps Script |
| `npm run push` | Push local code to Apps Script |
| `npm run deploy` | Deploy as web app |
| `npm run open` | Open in browser |
| `npm run status` | Check deployments |
| `npm run versions` | List versions |
| `npm run logs` | View execution logs |

### Daily Workflow

```bash
# Start your day - pull latest from Apps Script
npm run pull

# Make changes in src/ folder
# ... edit files ...

# Push changes to Apps Script
npm run push

# Deploy to web app
npm run deploy

# Commit to GitHub
git add .
git commit -m "Update: Added new feature"
git push
```

---

## 🛠️ Configuration

Edit `00_Config.gs` to customize your digital village:

```javascript
const CONFIG = {
  APP_NAME: 'KIJI — Kijiji Kidijitali (Digital Village)',
  VERSION: '1.0.0',
  SPREADSHEET_ID: '',  // Leave blank for active spreadsheet
  OUTREACH_SHEET_NAME: 'Outreach Campaigns',
  DATA_SHEET_NAME: 'Daily Log',
  CONTACTS_SHEET_NAME: 'Contacts',
  PROJECTS_SHEET_NAME: 'Projects',
  COLLABORATIONS_SHEET_NAME: 'Collaborations'
};
```

---

## 📊 Reports Available

| Report | Description |
|--------|-------------|
| **📈 Village Overview** | Community stats, engagement breakdowns |
| **👥 Members Report** | All community members with details |
| **📝 Activities Report** | Daily engagement logs |
| **🚀 Projects Report** | Project status and participation |

---

## 🤝 Contributing

Everyone is welcome in this digital village!

### How to Contribute

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m 'Add amazing feature'

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

### Development Guidelines

- Follow existing code style
- Test your changes before submitting
- Update documentation as needed
- Be respectful and inclusive

---

## 🌍 Why "Kijiji Kidijitali" (KIJI)?

In Swahili culture, the **village (kijiji)** represents:

- 🤝 **Community** — People coming together
- 🌱 **Growth** — Supporting each other's development
- 📖 **Storytelling** — Sharing knowledge and experiences
- 🔗 **Connection** — Building relationships

**KIJI** brings these values into the digital age — a village where everyone can connect, collaborate, and grow together.

---

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ using [Google Apps Script](https://developers.google.com/apps-script)
- Powered by [clasp](https://github.com/google/clasp) for professional development
- Inspired by real-world community engagement challenges
- Made for community organizations, student groups, and NGOs across Africa and beyond

---

## 📬 Connect

- **GitHub Issues**: [Report a bug](https://github.com/kangwa-ntema/kiji/issues)
- **Discussions**: [Start a discussion](https://github.com/kangwa-ntema/kiji/discussions)

---

**⭐ Star this digital village if you find it useful!**

---

*Karibu sana!* (You're very welcome!)  
*Made with ❤️ in Zambia*

---

## 🚀 Ready to Commit!

```bash
# Stage all files
git add .

# Commit with the full message
git commit -m "feat: initial release of KIJI — Kijiji Kidijitali v1.0.0

🏘️ KIJI (short for Kijiji Kidijitali, Swahili for 'Digital Village')
is a complete open-source outreach, community engagement, and
collaboration platform built on Google Apps Script.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PROJECT OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A lightweight CRM that turns Google Sheets into a powerful community
engagement hub with:

  • 📊 Dashboard — Real-time community stats
  • 🎯 Outreach Campaigns — Set and track engagement goals
  • 👥 Community Members — Manage contacts, leads, and collaborators
  • 🚀 Projects — Track community initiatives and participation
  • 📝 Daily Activity Log — Record community engagement
  • 📈 Reports — Comprehensive analytics and data export

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ KEY FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  • Phone number normalization for African numbers (+260)
  • Lead scoring and engagement tracking
  • Daily/weekly/monthly campaign goals with minimums
  • Collaboration hub linking members to projects
  • One-click initialization with normalizeAllSheets()
  • CSV export for external analysis
  • Status breakdowns and top institutions reporting
  • Real-time dashboard with key metrics
  • 📱 Mobile-friendly menu-based setup
  • 📄 Auto-generated Google Doc with web app link

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛠️ DEVELOPMENT SETUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  • Professional clasp + npm integration
  • VSCode/IDE support with jsconfig.json
  • Environment variables for secure configuration
  • Comprehensive documentation with CONTRIBUTING.md
  • MIT License for open collaboration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 PROJECT STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  kiji/
  ├── .clasp.json          # clasp configuration (gitignored)
  ├── .claspignore         # Files to exclude from push
  ├── .env                 # Environment variables (gitignored)
  ├── .gitignore           # Git ignore rules
  ├── .jsconfig.json       # IDE configuration
  ├── appsscript.json      # Apps Script manifest
  ├── CONTRIBUTING.md      # Contribution guidelines
  ├── LICENSE              # MIT License
  ├── README.md            # Complete documentation
  ├── package.json         # npm dependencies
  └── src/
      ├── 00_Config.gs     # Application configuration
      ├── 01_Utils.gs      # Utility functions
      ├── 02_Outreach.gs   # Outreach campaign management
      ├── 03_Contacts.gs   # Community member management
      ├── 04_Projects.gs   # Project management
      ├── 05_Collaborations.gs # Collaboration hub
      ├── 06_DailyLog.gs   # Daily activity logging
      ├── 07_Reports.gs    # Reporting and analytics
      ├── 08_Dashboard.gs  # Dashboard statistics
      ├── 09_System.gs     # System initialization & deployment
      ├── 10_Debug.gs      # Debugging utilities
      └── index.html       # Web application frontend

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 WHY 'KIJI'?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Short for Kijiji Kidijitali (Swahili for 'Digital Village').

In Swahili culture, the village (kijiji) represents community, growth,
storytelling, and connection. KIJI brings these values into the digital
age — creating a village where everyone can connect, collaborate, and
grow together.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 LICENSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MIT License — Open source, permissive, and ready for collaboration.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🙏 ACKNOWLEDGMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Built with ❤️ using Google Apps Script
Powered by clasp for professional development
Inspired by real-world community engagement challenges
Made for community organizations, student groups, and NGOs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is the first open-source release of KIJI.
Star ⭐ the repo if you find it useful!

Karibu sana! (You're very welcome!)
Made with ❤️ in Zambia"

# Push to GitHub
git push origin main
```