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
