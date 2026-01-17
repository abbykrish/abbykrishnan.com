// Main TypeScript entry point
// Add interactivity here as needed

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
});
