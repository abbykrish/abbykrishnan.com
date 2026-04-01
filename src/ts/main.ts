// Main TypeScript entry point

function copyEmail(): void {
  navigator.clipboard.writeText('abbykrishnan16@gmail.com').then(() => {
    const tooltip = document.querySelector('.copy-tooltip') as HTMLElement;
    const inlineEl = document.querySelector('.copy-tooltip-inline') as HTMLElement;
    if (tooltip) {
      tooltip.classList.add('show');
      setTimeout(() => tooltip.classList.remove('show'), 1500);
    }
    if (inlineEl) {
      inlineEl.classList.add('show');
      setTimeout(() => inlineEl.classList.remove('show'), 1500);
    }
  });
}

// Expose to global scope for onclick handlers
(window as any).copyEmail = copyEmail;

function initShowMoreButtons(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('.show-more-btn');

  buttons.forEach(button => {
    const section = button.closest('.recs-section') as HTMLElement;
    const cards = section?.querySelector('.recs-cards');
    if (!section || !cards) return;

    button.addEventListener('click', () => {
      const isCollapsed = section.dataset.collapsed === 'true';
      section.dataset.collapsed = isCollapsed ? 'false' : 'true';
      button.setAttribute('aria-expanded', isCollapsed ? 'true' : 'false');
      button.textContent = isCollapsed ? 'Show less' : `Show all ${cards.children.length}`;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Mark current page as active in nav
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (
      href === currentPath ||
      (currentPath === '/' && href === '/') ||
      (currentPath.endsWith('/') && href === currentPath.slice(0, -1))
    )) {
      link.classList.add('active');
    }
  });

  // Initialize show more buttons on SF Recs page
  initShowMoreButtons();

  // Falling veggies on click
  initFallingVeggies();
});

function initFallingVeggies(): void {
  const veggies = ['🍅', '🥕', '🌽', '🥦', '🍆', '🫑', '🥬', '🧄', '🌶️', '🥒'];

  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a, button, input, textarea, select, [role="button"]')) return;
    const veggie = veggies[Math.floor(Math.random() * veggies.length)];
    const el = document.createElement('div');
    el.textContent = veggie;
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = `
      position: fixed;
      left: ${e.clientX - 14}px;
      top: ${e.clientY - 14}px;
      font-size: 28px;
      pointer-events: none;
      z-index: 9999;
      user-select: none;
    `;
    document.body.appendChild(el);

    let vy = -2; // slight upward pop
    const gravity = 0.5;
    const startTop = e.clientY - 14;
    let y = startTop;
    let opacity = 1;

    function fall() {
      vy += gravity;
      y += vy;
      el.style.top = `${y}px`;

      // fade out near bottom of viewport
      if (y > window.innerHeight - 100) {
        opacity -= 0.05;
        el.style.opacity = `${Math.max(opacity, 0)}`;
      }

      if (y < window.innerHeight + 50 && opacity > 0) {
        requestAnimationFrame(fall);
      } else {
        el.remove();
      }
    }

    requestAnimationFrame(fall);
  });
}
