const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('preferredTheme');
if (savedTheme === 'dark') {
  body.classList.add('dark');
  themeToggle.textContent = 'Light mode';
}

themeToggle.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark');
  themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
  localStorage.setItem('preferredTheme', isDark ? 'dark' : 'light');
});

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
    openDoc(url);
  });
});

function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
  pdfThumbs.innerHTML = '';
  pdfCanvasWrap.innerHTML = '';
  pdfText.innerHTML = '';
  pdfDoc = null;
}

pdfClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
