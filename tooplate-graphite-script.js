// JavaScript Document

/*

Portfolio Interactions

*/

const navLinks = document.querySelectorAll('nav a');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

// Mobile Menu Toggle
menuToggle.addEventListener('click', (e) => {
   e.stopPropagation();
   menuToggle.classList.toggle('active');
   nav.classList.toggle('active');
});

// Scroll to top function
function scrollToTop() {
   window.scrollTo({
      top: 0,
      behavior: 'smooth'
   });
   menuToggle.classList.remove('active');
   nav.classList.remove('active');
}

// Highlight active nav on scroll
function highlightActiveNav() {
   let current = '';
   const sections = document.querySelectorAll('section');

   sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 300) {
         current = section.getAttribute('id');
      }
   });

   navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
         link.classList.add('active');
      }
   });
}

// Handle nav link clicks
navLinks.forEach(link => {
   link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Check if it's an external link (like portfolio.html)
      if (href.includes('.html') || !href.startsWith('#')) {
         // Allow normal navigation for external pages
         return;
      }

      e.preventDefault();

      const targetId = href.slice(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
         // Close mobile menu
         menuToggle.classList.remove('active');
         nav.classList.remove('active');

         // Calculate scroll position accounting for header
         const headerHeight = document.querySelector('header').offsetHeight;
         const targetPosition = targetSection.offsetTop - headerHeight;

         // Smooth scroll
         window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
         });

         // Update active class
         navLinks.forEach(l => l.classList.remove('active'));
         link.classList.add('active');
      }
   });
});

// Update nav on scroll
window.addEventListener('scroll', highlightActiveNav);

// Close menu when clicking outside
document.addEventListener('click', (e) => {
   if (!e.target.closest('header')) {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
   }
});

// Portfolio Modal Functions
function openPortfolioModal(item) {
   const modal = document.getElementById('portfolioModal');
   const label = item.querySelector('.portfolio-label');
   const data = item.querySelector('.portfolio-data');
   const image = item.querySelector('img');

   // Get data from hidden content
   const title = label.querySelector('h3').textContent;
   const category = label.querySelector('p').textContent;
   const imageUrl = image.src;
   const description = data.querySelector('.description').textContent;
   const features = data.querySelectorAll('.features li');
   const visitUrl = data.querySelector('.visit-url').href;

   // Populate modal
   document.getElementById('modalTitle').textContent = title;
   document.getElementById('modalCategory').textContent = category;
   document.getElementById('modalImage').src = imageUrl;
   document.getElementById('modalDescription').textContent = description;

   // Populate features list
   const featuresList = document.getElementById('modalFeatures');
   featuresList.innerHTML = '';
   features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature.textContent;
      featuresList.appendChild(li);
   });

   // Set visit button
   document.getElementById('modalVisitBtn').href = visitUrl;

   modal.classList.add('active');
   document.body.style.overflow = 'hidden';
}

function closePortfolioModal() {
   const modal = document.getElementById('portfolioModal');
   modal.classList.remove('active');
   document.body.style.overflow = 'auto';
}

// Add click listeners to portfolio items
document.querySelectorAll('.portfolio-item').forEach(item => {
   item.addEventListener('click', () => openPortfolioModal(item));
});

// Close modal when clicking outside the content
document.getElementById('portfolioModal').addEventListener('click', (e) => {
   if (e.target.id === 'portfolioModal') {
      closePortfolioModal();
   }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
   if (e.key === 'Escape') {
      closePortfolioModal();
   }
});