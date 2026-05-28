const body = document.body;

// Fixed light theme: remove any saved theme preference
try { localStorage.removeItem('preferredTheme'); } catch (e) {}

/* PDF.js in-page viewer */
const pdfButtons = document.querySelectorAll('[data-doc]');
const modal = document.getElementById('pdf-modal');
const pdfThumbs = document.getElementById('pdf-thumbs');
const pdfCanvasWrap = document.getElementById('pdf-canvas-wrap');
const pdfText = document.getElementById('pdf-text');
const pdfClose = document.querySelector('.pdf-close');

if (window['pdfjsLib']) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
}

let pdfDoc = null;

async function openDoc(url) {
  modal.setAttribute('aria-hidden', 'false');
  pdfThumbs.innerHTML = '';
  pdfCanvasWrap.innerHTML = '';
  pdfText.innerHTML = '';
  try {
    pdfDoc = await pdfjsLib.getDocument(url).promise;
    const numPages = pdfDoc.numPages;
    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: 0.28 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport }).promise;
      canvas.addEventListener('click', () => renderPage(i));
      pdfThumbs.appendChild(canvas);
    }
    renderPage(1);
  } catch (err) {
    pdfText.textContent = 'Failed to load document.';
    console.error(err);
  }
}

async function renderPage(pageNum) {
  if (!pdfDoc) return;
  pdfCanvasWrap.innerHTML = '';
  pdfText.innerHTML = '';
  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale: 1.6 });
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  pdfCanvasWrap.appendChild(canvas);
  await page.render({ canvasContext: ctx, viewport }).promise;
  // extract text and show in side panel
  try {
    const textContent = await page.getTextContent();
    const strings = textContent.items.map(item => item.str).join(' ');
    pdfText.textContent = strings || 'No readable text on this page.';
  } catch (e) {
    pdfText.textContent = 'Text extraction not available.';
  }
}

pdfButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const url = btn.getAttribute('data-doc');
    if (typeof openDoc === 'function' && modal) openDoc(url);
  });
});

function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
  pdfThumbs.innerHTML = '';
  pdfCanvasWrap.innerHTML = '';
  pdfText.innerHTML = '';
  pdfDoc = null;
}

if (pdfClose) pdfClose.addEventListener('click', closeModal);
if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') closeModal(); });

// --- Automatic extraction and page population ---
async function extractResume(url) {
  try {
    const doc = await pdfjsLib.getDocument(url).promise;
    let fullText = '';
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      // preserve simple line breaks between text items
      fullText += content.items.map(it => it.str).join('\n') + '\n\n';
    }
    // normalize whitespace and split into paragraphs
    const normalized = fullText.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n');
    const paragraphs = normalized.split(/\n\s*\n/).map(p => p.replace(/\n+/g, ' ').trim()).filter(Boolean);
    const summaryEl = document.getElementById('resume-summary');
    const expEl = document.getElementById('resume-experience');
    const skillsEl = document.getElementById('resume-skills');
    if (paragraphs.length) {
      summaryEl.innerHTML = '<h3>Summary</h3><p>' + paragraphs.slice(0,2).join('</p><p>') + '</p>';
      // heuristically place paragraphs containing years into experience
      const expPars = paragraphs.filter(p => /20\d{2}/.test(p) || /Experience|Worked|Company|Role/i.test(p));
      if (expPars.length) {
        expEl.innerHTML = '<h3>Experience</h3>' + expPars.map(p => '<p>' + p + '</p>').join('');
      } else {
        expEl.innerHTML = '<h3>Experience</h3><p>' + paragraphs.slice(2,6).join('</p><p>') + '</p>';
      }
      const skillPars = paragraphs.filter(p => /Skills|Toolkit|Proficien|CAD|Prototype|Ergonom/i.test(p));
      if (skillPars.length) {
        skillsEl.innerHTML = '<h3>Skills & Tools</h3><p>' + skillPars.join('</p><p>') + '</p>';
      }
    } else {
      summaryEl.textContent = 'No extractable resume text found.';
    }
  } catch (e) {
    console.error('Resume extraction failed', e);
  }
}

async function extractPortfolioAsImages(url) {
  try {
    const doc = await pdfjsLib.getDocument(url).promise;
    const gallery = document.getElementById('work-gallery');
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: 1.2 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport }).promise;
      const card = document.createElement('div');
      card.className = 'project-card';
      // append canvas directly to ensure the image is visible even if toDataURL fails
      canvas.alt = 'Portfolio page ' + i;
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = 'auto';
      card.appendChild(canvas);
      // try to extract a short caption from the page text
      try {
        const tc = await page.getTextContent();
        const first = (tc.items.map(it => it.str).join(' ') || '').trim();
        const capText = first ? first.split(/[\n\.\-–]/)[0].slice(0,120) : 'Page ' + i;
        const caption = document.createElement('p');
        caption.className = 'caption';
        caption.textContent = capText;
        card.appendChild(caption);
      } catch (e) {
        const caption = document.createElement('p');
        caption.className = 'caption';
        caption.textContent = 'Page ' + i;
        card.appendChild(caption);
      }
      gallery.appendChild(card);
    }
  } catch (e) {
    console.error('Portfolio extraction failed', e);
  }
}

// Extract a simple average color from first page of portfolio and apply as accent
async function extractPaletteFromPortfolio(url) {
  try {
    const doc = await pdfjsLib.getDocument(url).promise;
    const page = await doc.getPage(1);
    const viewport = page.getViewport({ scale: 0.25 });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = Math.max(160, Math.floor(viewport.width));
    canvas.height = Math.max(120, Math.floor(viewport.height));
    await page.render({ canvasContext: ctx, viewport }).promise;
    try {
      const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
      let r=0,g=0,b=0,count=0;
      for (let i=0;i<data.length;i+=4) {
        const alpha = data[i+3];
        if (alpha<128) continue;
        r += data[i]; g += data[i+1]; b += data[i+2]; count++;
      }
      if (count===0) return;
      r=Math.round(r/count); g=Math.round(g/count); b=Math.round(b/count);
      const accent = `rgb(${r}, ${g}, ${b})`;
      document.documentElement.style.setProperty('--accent', accent);
      // compute luminance for contrast
      const lum = (0.2126*r + 0.7152*g + 0.0722*b)/255;
      // choose readable text and surface colors based on palette
      if (lum < 0.5) {
        document.documentElement.style.setProperty('--text', '#f8fafc');
        document.documentElement.style.setProperty('--muted', '#cbd5e1');
        document.documentElement.style.setProperty('--surface', 'rgba(255,255,255,0.04)');
        document.documentElement.style.setProperty('--bg', '#0b1220');
      } else {
        document.documentElement.style.setProperty('--text', '#0b1220');
        document.documentElement.style.setProperty('--muted', '#334155');
        // light surface based on accent
        document.documentElement.style.setProperty('--surface', '#ffffff');
        document.documentElement.style.setProperty('--bg', '#f8fafc');
      }
    } catch (e) {
      console.warn('Palette extraction failed', e);
    }
  } catch (e) {
    console.error('Palette extraction failed', e);
  }
}

async function extractCertificates(urls) {
  try {
    const doc = await pdfjsLib.getDocument(url).promise;
    let fullText = '';
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      fullText += content.items.map(it => it.str).join('\n') + '\n\n';
    }
    const normalized = fullText.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    const sections = splitByHeadings(normalized);
    renderResumeSections(sections, normalized);
  } catch (e) {
    console.error('Resume extraction failed', e);
    const summaryEl = document.getElementById('resume-summary');
    if (summaryEl) summaryEl.textContent = 'No extractable resume text found.';
  }


function splitByHeadings(text) {
  // Look for common section headings and split the text into named sections
  const headings = ['summary','profile','experience','work experience','professional experience','education','skills','certifications','projects','awards'];
  const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);
  const idx = {};
  for (let i = 0; i < lines.length; i++) {
    const low = lines[i].toLowerCase();
    for (const h of headings) {
      if (low.startsWith(h) || low === h || low.includes(h + ':')) {
        idx[h] = i;
      }
    }
  }
  // Build sections by taking ranges between found indexes
  const entries = {};
  const found = Object.entries(idx).sort((a,b) => a[1]-b[1]);
  if (found.length === 0) return { raw: text };
  for (let i = 0; i < found.length; i++) {
    const key = found[i][0];
    const start = found[i][1] + 1;
    const end = i+1 < found.length ? found[i+1][1] : lines.length;
    entries[key] = lines.slice(start, end).join('\n');
  }
  return entries;
}

function renderResumeSections(sections, rawText) {
  const summaryEl = document.getElementById('resume-summary');
  const expEl = document.getElementById('resume-experience');
  const skillsEl = document.getElementById('resume-skills');
  // Summary / profile
  const summaryText = sections.summary || sections.profile || rawText.split(/\n\n/)[0] || '';
  if (summaryEl) summaryEl.innerHTML = '<h3>Summary</h3><p>' + summaryText.replace(/\n+/g,' ').trim() + '</p>';
  // Experience
  const expText = sections.experience || sections['work experience'] || sections['professional experience'] || '';
  if (expEl) {
    expEl.innerHTML = '<h3>Experience</h3>';
    if (expText) {
      const blocks = expText.split(/\n\n/).map(b => b.trim()).filter(Boolean);
      for (const b of blocks) {
        const lines = b.split(/\n/).map(l => l.trim()).filter(Boolean);
        // try to extract date
        const dateMatch = b.match(/((?:19|20)\d{2}(?:\s*[–-]\s*(?:19|20)\d{2})?)/);
        const year = dateMatch ? dateMatch[0] : '';
        const title = lines[0] || '';
        const rest = lines.slice(1).join(' ');
        const art = document.createElement('article');
        art.className = 'timeline-item';
        if (year) art.innerHTML = '<span class="timeline-year">' + year + '</span>';
        art.innerHTML += '<h3>' + escapeHtml(title) + '</h3>';
        if (rest) art.innerHTML += '<p>' + escapeHtml(rest) + '</p>';
        expEl.appendChild(art);
      }
    } else {
      expEl.innerHTML += '<p>No structured experience found.</p>';
    }
  }
  // Skills
  const skillsText = sections.skills || '';
  if (skillsEl) {
    skillsEl.innerHTML = '<h3>Skills & Tools</h3>';
    if (skillsText) {
      const items = skillsText.split(/[,\n\u2022]/).map(s => s.trim()).filter(Boolean);
      const container = document.createElement('div');
      container.className = 'skill-list';
      for (const it of items) {
        const span = document.createElement('span');
        span.textContent = it;
        container.appendChild(span);
      }
      skillsEl.appendChild(container);
    } else {
      skillsEl.innerHTML += '<p>No skills section detected.</p>';
    }
  }
  // Education
  const educEl = document.getElementById('resume-education');
  const educText = sections.education || '';
  if (educEl) {
    educEl.innerHTML = '<h3>Education</h3>';
    if (educText) {
      const blocks = educText.split(/\n\n/).map(b => b.trim()).filter(Boolean);
      for (const b of blocks) {
        const lines = b.split(/\n/).map(l => l.trim()).filter(Boolean);
        const degree = lines[0] || '';
        const rest = lines.slice(1).join(' ');
        const art = document.createElement('article');
        art.className = 'timeline-item';
        art.innerHTML = '<h3>' + escapeHtml(degree) + '</h3>';
        if (rest) art.innerHTML += '<p>' + escapeHtml(rest) + '</p>';
        educEl.appendChild(art);
      }
    } else {
      educEl.innerHTML += '<p>No education section detected.</p>';
    }
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c];});
}
document.addEventListener('DOMContentLoaded', () => {
  // paths to documents in the repository
  extractResume('assets/docs/Resume202605050213.pdf');
  // derive page palette from portfolio first page, then render images
  extractPaletteFromPortfolio('assets/docs/Portafolio.pdf').then(() => {
    extractPortfolioAsImages('assets/docs/Portafolio.pdf');
  });
  // exclude the incorrect SAT constancia; only include valid certificates
  extractCertificates([
    'assets/docs/Constancia_DCCM.pdf',
    'assets/docs/Constancia_IPE_Iluminacion.pdf',
    'assets/docs/Constancia_TFTRPC.pdf'
  ]);
  // also extract contact info from the resume and populate contact section (no public pdf links)
  extractContactFromResume('assets/docs/Resume202605050213.pdf');
});

/**
 * Extract basic contact info (email, phone, linkedin) from first pages of resume.
 */
async function extractContactFromResume(url) {
  try {
    const doc = await pdfjsLib.getDocument(url).promise;
    const pages = Math.min(2, doc.numPages);
    let text = '';
    for (let i = 1; i <= pages; i++) {
      const page = await doc.getPage(i);
      const tc = await page.getTextContent();
      text += tc.items.map(it => it.str).join(' ') + ' ';
    }
    // email
    const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    if (emailMatch) {
      const el = document.getElementById('contact-email');
      if (el) { el.textContent = emailMatch[0]; el.href = 'mailto:' + emailMatch[0]; }
    }
    // phone (simple heuristic)
    const phoneMatch = text.match(/(?:\+?\d{1,3}[\s-])?(?:\(?\d{2,4}\)?[\s-])?\d{3,4}[\s-]\d{3,4}/);
    if (phoneMatch) {
      const el = document.getElementById('contact-phone');
      if (el) {
        const raw = phoneMatch[0].trim();
        const digits = raw.replace(/[^\d+]/g, '');
        el.textContent = raw;
        el.href = 'tel:' + digits;
      }
    }
    // linkedin
    const lnMatch = text.match(/linkedin\.com\/[A-Za-z0-9_\-\/]+/i);
    if (lnMatch) {
      const ln = lnMatch[0].startsWith('http') ? lnMatch[0] : 'https://' + lnMatch[0];
      const a = document.querySelector('.contact-grid a[href*="linkedin.com"]');
      if (a) { a.href = ln; a.textContent = ln.replace(/^https?:\/\//,'').replace(/\/$/,''); }
    }
  } catch (e) {
    console.error('Contact extraction failed', e);
  }
}
