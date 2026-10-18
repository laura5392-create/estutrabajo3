// stats.js - Animaciones de estadísticas y efectos visuales

document.addEventListener('DOMContentLoaded', () => {
  // 1. Animación de conteo para estadísticas
  const statNumbers = document.querySelectorAll('.stat b');
  
  const animateValue = (element, start, end, duration) => {
    const startTime = performance.now();
    const isPlus = element.textContent.includes('+');
    
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out-cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeOut);
      
      element.textContent = current + (isPlus ? '+' : '');
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    
    requestAnimationFrame(update);
  };

  // Observar estadísticas para animar cuando entran en viewport
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const text = element.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        
        if (!isNaN(number) && !element.dataset.animated) {
          element.dataset.animated = 'true';
          animateValue(element, 0, number, 1200);
        }
        
        statsObserver.unobserve(element);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach((stat) => {
    statsObserver.observe(stat);
  });

  // 2. Efecto de partículas en el fondo (sutil y elegante)
  const createParticles = () => {
    const particleCount = 15;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      document.body.appendChild(particle);
      particles.push(particle);
    }
  };

  // Solo crear partículas si no hay preferencia de movimiento reducido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    createParticles();
  }

  // 3. Efecto de tilt sutil en tarjetas de empleo (solo en desktop)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const empleos = document.querySelectorAll('.empleo');
    
    empleos.forEach((empleo) => {
      empleo.addEventListener('mousemove', (e) => {
        const rect = empleo.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        empleo.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      });
      
      empleo.addEventListener('mouseleave', () => {
        empleo.style.transform = '';
      });
    });
  }

  // 4. Efecto de scroll suave para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 5. Efecto de carga progresiva para imágenes
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.complete) {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s ease';
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
    }
  });
});
