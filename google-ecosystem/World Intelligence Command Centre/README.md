# World Intelligence Command Center - Real-Time Intelligence Terminal

**Developed by: Mohammad Arqam Javed**

A sophisticated real-time geopolitical and economic intelligence dashboard built with modern web technologies.

## 🔗 Live Links

- **🌐 Live Application**: https://arqamxjay.github.io/World-Intelligence-Command-Centre/
- **📦 GitHub Repository**: https://github.com/arqamxjay/World-Intelligence-Command-Centre
- **📖 GitHub Pages**: https://pages.github.com/arqamxjay/World-Intelligence-Command-Centre

## 🚀 Features

### Core Features
- **Live Clock & Date Updates**: Real-time UTC clock and date display
- **Dynamic Ticker**: Scrolling news ticker with breaking updates
- **Interactive World Map**: Geographic hotspots with real-time conflict indicators
- **Live Economic Data**: Auto-updating financial indicators (stocks, crypto, commodities, forex)
- **Multi-View Navigation**: Switch between Overview, Conflicts, Economics, Media, and Alerts views
- **Global Country Coverage**: 50+ countries tracked across all intelligence domains

### Data Monitoring
- **Active Conflict Tracking**: 12+ crisis zones with 8+ military conflicts globally
- **Economic Indicators**: 
  - 10 Major stock markets (USA, EU, Japan, China, India, Brazil, Russia, UK)
  - Cryptocurrencies (Bitcoin)
  - Commodities (Gold, WTI Oil)
  - Currency pairs (EUR/USD)
  - Market volatility (VIX)
  
- **Displaced Persons Data**: Global humanitarian crisis tracking (40M+ displaced)
- **GDP & Economic Health**: Real-time macroeconomic indicators per country

### AI Intelligence Features
- **Claude AI Integration**: Ask questions about world events (requires API key)
- **Quick Topic Buttons**: Pre-configured queries for rapid intelligence gathering
- **Live Query Response**: Real-time AI analysis with typewriter effect

### Media Analytics
- **Sentiment Analysis**: Track media sentiment by source (Positive/Negative/Neutral)
- **Bias Detection**: Source bias indicators (L, R, CTR, CL, N, M, ST)
- **Real-Time Trending**: Track global trending topics with volumes

### Alert System
- **Critical Alerts**: High-priority geopolitical developments
- **Auto-Updated Feed**: Real-time alert generation and updates
- **Threat Level Classification**: Critical, High, Medium severity indicators

### Global Coverage
- **50+ Countries Tracked**: Crisis zones, conflicts, economies, defense systems
- **10 Intelligence Domains**: Crisis, Wars, Disasters, Economics, Climate, Cyber, Finance, Telecom, Defense, Energy, Maritime, Aviation, Disease, Networks
- **Country-Specific Indicators**: Every data point linked to specific countries
- **Regional Analysis**: Group incidents by region and country

### UI/UX Enhancements
- **Retro Terminal Design**: IBM Plex monospace fonts with red alert theme
- **Animated Elements**: Pulsing conflict hotspots, animated tickers, loading states
- **Color-Coded Severity**: Red (Critical), Dark Red (High), Orange (Medium), Gray (Low)
- **Responsive Panels**: Scrollable, draggable, resizable content areas
- **Scanline Effect**: Authentic CRT monitor overlay

## 📊 Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                          TICKER BAR                              │
├─────────────────────────────────────────────────────────────────┤
│                    NAVIGATION & STATUS BAR                       │
├───────────────────┬─────────────────────────────┬─────────────────┤
│  Left Sidebar     │     Center Content          │   Right Sidebar │
│  - Conflicts      │  - Interactive Map          │  - AI Terminal  │
│  - Economics      │  - Statistics               │  - Trending     │
│                   │  - Multi-view panels        │  - Sentiment    │
└───────────────────┴─────────────────────────────┴─────────────────┘
```

## 🛠️ Setup & Installation

### Quick Start (No Installation Required)
**Visit the live application directly:**
👉 **https://arqamxjay.github.io/World-Intelligence-Command-Centre/** ✅

### Prerequisites (Local Setup)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.6+ (for local server)
- Optional: Claude API key (for AI features)

### Local Installation Steps

1. **Clone/Extract Files**
```bash
cd "World Intelligence"
```

2. **Start Local Server**
```bash
# Using Python
python3 -m http.server 8000

# Or using Node.js
npx http-server
```

3. **Open in Browser**
```
http://localhost:8000/global-intel-hub.html
```

### API Configuration (Optional)

To enable AI intelligence features:

1. Get a Claude API key from [Anthropic](https://console.anthropic.com)
2. In `sigint.html`, find line with `'x-api-key': 'YOUR_API_KEY_HERE'`
3. Replace with your actual API key
4. Save and reload

## 🔄 Live Data Updates

The dashboard includes automatic live updates:

- **Economic Data**: Updates every 8 seconds with realistic market fluctuations
- **Conflict Statistics**: Dynamic zone count updates
- **Trending Topics**: Real-time volume changes
- **Clock**: Updates every second
- **Ticker**: Continuous scrolling news feed

## 🎨 Customization

### Colors
Edit CSS variables in the `<style>` section:
```css
:root {
  --green: #00C864;      /* Primary accent */
  --red: #FF3B3B;        /* Critical alerts */
  --yellow: #FFB800;     /* High priority */
  --blue: #00AAFF;       /* Medium priority */
  --bg: #030508;         /* Background */
}
```

### Content Updates
- **Ticker Items**: Edit `ticker-inner` HTML content
- **Conflict Zones**: Modify `.conflict-item` elements
- **Economic Indicators**: Update values in `#econList`
- **Trending Topics**: Edit `.trend-item` elements

## 📱 Responsive Design

The dashboard is optimized for:
- **Desktop**: Full 3-column layout (1920x1080+)
- **Tablet**: 2-column layout (1024x768)
- **Mobile**: Single column with horizontal scroll (adjustments needed)

## 🔐 Security Notes

- **API Keys**: Never commit API keys to version control
- **Local Storage**: Use for session data only
- **CORS**: Configure appropriately for production
- **Data Validation**: All user inputs are sanitized

## 📈 Performance Tips

- Browser caching enabled for static assets
- Minimal DOM manipulation for updates
- CSS animations use GPU acceleration
- Efficient event delegation
- Debounced resize handlers

## 🐛 Troubleshooting

### Dashboard Not Loading
- Check browser console (F12) for errors
- Verify server is running on port 8000
- Clear browser cache (Ctrl+Shift+Delete)

### AI Queries Not Working
- Verify API key is correctly configured
- Check API quota and billing
- Look for CORS errors in console
- Test API connectivity

### Live Updates Not Working
- Check browser developer console for JS errors
- Verify setInterval is running (F12 > Sources)
- Try refreshing the page
- Check network tab for failed requests

### Performance Issues
- Close unnecessary browser tabs
- Disable browser extensions
- Update browser to latest version
- Check system RAM usage

## 📚 Technical Stack

- **HTML5**: Semantic markup
- **CSS3**: Grid, Flexbox, Animations
- **JavaScript**: ES6+, async/await
- **SVG**: Interactive maps and charts
- **APIs**: Anthropic Claude (optional)
- **Fonts**: IBM Plex Mono, IBM Plex Sans, Bebas Neue

## 🔮 Future Enhancements

Planned features for v2.0:
- [ ] WebSocket real-time data feeds
- [ ] Database backend for historical data
- [ ] Advanced geospatial visualizations
- [ ] Export reports to PDF/CSV
- [ ] User authentication & sessions
- [ ] Mobile app (React Native)
- [ ] Dark/Light theme toggle
- [ ] Custom alert rules
- [ ] Data source aggregation
- [ ] Predictive analytics

## 📄 License

Open source - feel free to modify and distribute.

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Data accuracy and sources
- UI/UX enhancements
- Performance optimization
- Feature additions
- Bug fixes

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review browser console errors
3. Check API documentation
4. Test in different browser

## 🎓 Learning Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Grid Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [JavaScript Async/Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [SVG Basics](https://developer.mozilla.org/en-US/docs/Web/SVG)
- [Anthropic API Docs](https://docs.anthropic.com)

---

**Version**: 4.0 (Global Country Expansion)  
**Last Updated**: February 28, 2026  
**Status**: Production Ready ✅

### 🔗 Important Links
- **Live Demo**: https://arqamxjay.github.io/World-Intelligence-Command-Centre/
- **GitHub Repo**: https://github.com/arqamxjay/World-Intelligence-Command-Centre
- **Issue Tracker**: https://github.com/arqamxjay/World-Intelligence-Command-Centre/issues
**Last Updated**: February 27, 2026  
**Status**: Production Ready ✅
