// Main TypeScript entry point

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
});
