document.getElementById('year').textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem('almas-theme') || 'void';
document.body.dataset.theme = savedTheme;

document.querySelectorAll('[data-theme]').forEach((button) => {
  button.classList.toggle('active', button.dataset.theme === savedTheme);
  button.addEventListener('click', () => {
    const theme = button.dataset.theme;
    document.body.dataset.theme = theme;
    localStorage.setItem('almas-theme', theme);
    document.querySelectorAll('[data-theme]').forEach((item) => item.classList.toggle('active', item === button));
  });
});
