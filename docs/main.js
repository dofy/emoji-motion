for (const button of document.querySelectorAll('.doc-copy')) {
  button.addEventListener('click', async () => {
    const code = button.parentElement.querySelector('code').textContent;
    try {
      await navigator.clipboard.writeText(code);
      button.textContent = 'Copied ✓';
      setTimeout(() => { button.textContent = 'Copy'; }, 2000);
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(button.parentElement.querySelector('code'));
      selection.removeAllRanges(); selection.addRange(range);
      button.textContent = 'Select & copy';
      setTimeout(() => { button.textContent = 'Copy'; }, 3000);
    }
  });
}

// Keep both desktop and mobile tables of contents in sync with the reader.
const contentsLinks = [...document.querySelectorAll('.docs-sidebar nav a, .mobile-contents a')];
const sections = [...document.querySelectorAll('.docs-content h2[id]')];
let currentSection;
let scrollScheduled = false;
function updateCurrentSection() {
  scrollScheduled = false;
  if (!sections.length) return;
  const threshold = Math.min(120, window.innerHeight * 0.25);
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= threshold) current = section;
    else break;
  }
  if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) current = sections.at(-1);
  if (current.id === currentSection) return;
  currentSection = current.id;
  for (const link of contentsLinks) {
    if (link.getAttribute('href') === `#${currentSection}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
function scheduleCurrentSection() {
  if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateCurrentSection); }
}
window.addEventListener('scroll', scheduleCurrentSection, { passive: true });
window.addEventListener('resize', scheduleCurrentSection);
window.addEventListener('pageshow', scheduleCurrentSection);
document.fonts?.ready.then(scheduleCurrentSection);
updateCurrentSection();
