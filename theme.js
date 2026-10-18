// theme.js - Modo oscuro/claro con persistencia

document.addEventListener('DOMContentLoaded', () => {
  // Crear botón de tema
  const themeToggle = document.createElement('button');
  themeToggle.classList.add('theme-toggle');
  themeToggle.setAttribute('aria-label', 'Cambiar entre modo claro y oscuro');
  themeToggle.innerHTML = '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
  document.body.appendChild(themeToggle);

  // Cargar tema guardado
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  // Toggle tema
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Feedback visual
    themeToggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
      themeToggle.style.transform = '';
    }, 150);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
      themeToggle.setAttribute('aria-label', 'Cambiar a modo claro');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
      themeToggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
    }
  }
});
