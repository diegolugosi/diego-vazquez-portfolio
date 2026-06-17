# Diego Vázquez — Industrial Designer Portfolio

Professional portfolio of **Diego Vázquez Gutiérrez**, Industrial Designer and Project Coordinator.

## About Diego

Industrial Designer with extensive experience in technical project management, production logistics, and creative manufacturing. Specialized in coordinating complex design and manufacturing projects for global brands including Amazon and Mercado Libre.

**Location:** Mexico City, MX  
**Email:** diego.vgtz98@gmail.com  
**Phone:** +52 (554) 367-1743

## Key Skills

- **Design & Technical:** Rhino, AutoCAD, 3ds Max, KeyShot, Adobe Suite, JavaScript, HTML
- **Project Management:** Budgeting, Supplier Relations, Assembly Logistics, Technical Reporting, Cost Analysis
- **Manufacturing:** 3D Printing, Laser Cutting, CNC Programming, Fine Cabinetry

## Portfolio Sections

- **Home:** Hero introduction and call-to-action
- **Core Expertise:** Six key service areas including 3D Design, Project Coordination, Manufacturing, and Technical Documentation
- **Professional Experience:** Detailed project and work history
- **About:** Background and professional philosophy
- **Contact:** Direct contact form and channels

## Getting Started

### Option 1: Run Locally (Python)

```powershell
cd c:\Users\Sebastian\Documents\diego\diego-vg
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

### Option 2: Run Locally (Node.js/npx)

```powershell
cd c:\Users\Sebastian\Documents\diego\diego-vg
npx http-server
```

Then open the displayed local URL (typically http://localhost:8080).

### Option 3: Direct File Access

Open `index.html` directly in your browser:

```powershell
Start-Process "c:\Users\Sebastian\Documents\diego\diego-vg\index.html"
```

## Features

- **Responsive Design:** Works seamlessly on desktop, tablet, and mobile devices
- **Minimal, Modern Aesthetic:** Clean dark theme with geometric design elements
- **Image Slider:** Auto-rotating project showcase with manual navigation
- **Portfolio Modal:** Click any project to view detailed information
- **Contact Form:** Integrated form for inquiries (currently logs to console)
- **Smooth Navigation:** Sticky header with active section highlighting
- **Mobile Menu:** Hamburger menu for mobile navigation

## File Structure

```
diego-vg/
├── index.html                          # Main portfolio page
├── tooplate-graphite-creative.css      # Styling
├── tooplate-graphite-script.js         # Interactivity
├── README.md                           # This file
├── images/                             # Portfolio and project images
│   ├── tooplate-creative-01.jpg
│   ├── tooplate-creative-02.jpg
│   └── ...
└── coverage/                           # Test/build artifacts
```

## Customization

### Update Contact Information
Edit the contact details in the **CONTACT SECTION** of `index.html`:
- Email address
- Phone number
- Location

### Add/Update Projects
Edit the **PORTFOLIO SECTION** in `index.html`:
- Replace image paths in `src` attributes
- Update project titles and descriptions
- Modify project links and details

### Change Colors and Styling
Modify variables and selectors in `tooplate-graphite-creative.css`:
- Background colors: `#1a1a1a` (dark), `#121212` (darker), `#2a2a2a` (borders)
- Text colors: `#d0d0d0` (main), `#999` (secondary), `#555` (subtle)
- Accent colors: Modify gradient definitions and hover effects

### Update Hero Image Slider
Replace or add images in the slider container within the **HERO SECTION**:
```html
<div class="slide active" data-fallback="Design Workspace">
    <img src="images/your-image.jpg" alt="Your Alt Text">
</div>
```

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design supports: Desktop, Tablet, Mobile
- Graceful fallback for missing images

## Form Submission

Currently, the contact form logs data to the browser console. To enable email delivery, you can:

1. **Use a third-party service** (Formspree, Netlify, Getform)
2. **Integrate a backend API** to handle submissions
3. **Use serverless functions** (AWS Lambda, Vercel Functions, etc.)

Example: Integrate with Formspree:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
    <!-- form fields remain the same -->
</form>
```

## Deployment Options

### GitHub Pages
```powershell
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/diego-vg.git
git push -u origin main
```

Then enable GitHub Pages in repository settings (Settings → Pages → Deploy from branch: main).

### Netlify
1. Connect your GitHub repo to Netlify
2. Configure build settings (optional for static site)
3. Deploy automatically on push

### Vercel
```powershell
npm install -g vercel
vercel
```

### Traditional Hosting
Upload files to your web host via FTP/SFTP or control panel file manager.

## License

This portfolio is custom-built for Diego Vázquez Gutiérrez. Feel free to modify and adapt as needed.

## Support

For questions or assistance with the portfolio, contact Diego directly:
- **Email:** diego.vgtz98@gmail.com
- **Phone:** +52 (554) 367-1743

---

**Portfolio Last Updated:** May 28, 2026