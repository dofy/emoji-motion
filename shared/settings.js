(() => {
  const languageKey = 'emoji-motion.language';
  const themeKey = 'emoji-motion.theme';
  const languages = ['en', 'zh-CN', 'zh-TW', 'ja'];
  const themes = ['auto', 'light', 'dark'];
  const get = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const set = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Settings still work for this page. */ } };
  const resolveLanguage = value => {
    const tag = String(value).toLowerCase();
    if (tag.startsWith('zh')) return /hant|tw|hk|mo/.test(tag) ? 'zh-TW' : 'zh-CN';
    if (tag.startsWith('ja')) return 'ja';
    if (tag.startsWith('en')) return 'en';
    return null;
  };
  const storedLanguage = get(languageKey);
  const languagePreference = languages.includes(storedLanguage) ? storedLanguage : 'auto';
  const language = languagePreference === 'auto' ? (navigator.languages ?? [navigator.language]).map(resolveLanguage).find(Boolean) ?? 'en' : languagePreference;
  let themePreference = themes.includes(get(themeKey)) ? get(themeKey) : 'auto';
  const media = matchMedia('(prefers-color-scheme: dark)');
  function applyTheme() {
    document.documentElement.dataset.theme = themePreference === 'auto' ? (media.matches ? 'dark' : 'light') : themePreference;
    document.documentElement.style.colorScheme = document.documentElement.dataset.theme;
  }
  applyTheme();
  media.addEventListener?.('change', () => { if (themePreference === 'auto') applyTheme(); });
  document.documentElement.lang = language;
  let messages = {};
  const ready = language === 'en' ? Promise.resolve() : fetch(`/i18n/${language}.json`).then(response => { if (!response.ok) throw new Error('Translation file unavailable'); return response.json(); }).then(data => { messages = data; }).catch(() => { document.documentElement.lang = 'en'; });
  const t = value => messages[value] ?? value;
  function translate(container) {
    // Translate prose as a whole while moving the original inline code and links
    // into their translated positions. Code contents are never translated.
    for (const element of container.querySelectorAll('p,h1,h2,h3,th,td,blockquote,summary')) {
      if (element.closest('pre,code,svg,.brand,[data-i18n-ignore],.custom-preview p') || element.querySelector('p,h1,h2,h3,th,td,blockquote,summary')) continue;
      const children = []; let key = '';
      for (const child of element.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) key += child.nodeValue;
        else if (child.nodeType === Node.ELEMENT_NODE) { key += ` ZZX${children.length}XZ `; children.push(child); }
      }
      key = key.trim().replace(/\s+/g, ' ');
      const translation = messages[`@${key}`];
      if (!translation) continue;
      const parts = translation.split(/(ZZX\d+XZ)/g);
      const fragment = document.createDocumentFragment();
      for (const part of parts) {
        const marker = part.match(/^ZZX(\d+)XZ$/);
        if (marker && children[Number(marker[1])]) fragment.append(children[Number(marker[1])]);
        else if (part) fragment.append(document.createTextNode(part));
      }
      element.replaceChildren(fragment);
    }
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      if (node.parentElement?.closest('script,style,pre,code,textarea,svg,emoji-motion,.brand,.art-main,.art-float,[data-i18n-ignore]')) continue;
      const original = node.nodeValue;
      const key = original.trim().replace(/\s+/g, ' ');
      if (!key || !messages[key]) continue;
      const leading = original.match(/^\s*/)[0];
      const trailing = original.match(/\s*$/)[0];
      node.nodeValue = leading + t(key) + trailing;
    }
    for (const element of container.querySelectorAll('[aria-label], [placeholder], [title]')) {
      for (const attr of ['aria-label', 'placeholder', 'title']) {
        const value = element.getAttribute(attr);
        if (value && messages[value]) element.setAttribute(attr, t(value));
      }
    }
    if (messages[document.title]) document.title = t(document.title);
    // CSS-generated labels in the mobile parameter cards need the same translation.
    for (const cell of container.querySelectorAll('[data-label]')) {
      const label = cell.getAttribute('data-label');
      if (messages[label]) cell.setAttribute('data-label', t(label));
    }
  }
  let resolveControls;
  const controlsReady = new Promise(resolve => { resolveControls = resolve; });
  document.addEventListener('DOMContentLoaded', async () => {
    await ready;
    const header = document.querySelector('.topbar, .docs-header');
    if (!header) { resolveControls(null); return; }
    const controls = document.createElement('div');
    controls.className = 'site-settings';
    controls.setAttribute('data-i18n-ignore', '');
    controls.setAttribute('data-emoji-motion-ignore', '');

    const languageMenu = document.createElement('details');
    languageMenu.className = 'language-menu';
    const languageTrigger = document.createElement('summary');
    languageTrigger.className = 'language-trigger';
    languageTrigger.setAttribute('aria-label', t('Language'));
    languageTrigger.title = t('Language');
    const languageGlyph = document.createElement('span');
    languageGlyph.className = 'language-glyph'; languageGlyph.setAttribute('aria-hidden', 'true'); languageGlyph.textContent = '🌍';
    languageTrigger.append(languageGlyph);
    const languageOptions = document.createElement('div');
    languageOptions.className = 'language-options';
    languageOptions.setAttribute('aria-label', t('Language'));
    for (const [value, label] of [['auto', t('System')], ['en', 'English'], ['zh-CN', '简体中文'], ['zh-TW', '繁體中文'], ['ja', '日本語']]) {
      const option = document.createElement('button');
      option.type = 'button'; option.textContent = label;
      option.dataset.language = value;
      option.setAttribute('aria-pressed', String(value === languagePreference));
      option.addEventListener('click', () => {
        if (value === languagePreference) { languageMenu.open = false; return; }
        set(languageKey, value); location.reload();
      });
      languageOptions.append(option);
    }
    languageMenu.append(languageTrigger, languageOptions);
    document.addEventListener('click', event => { if (!languageMenu.contains(event.target)) languageMenu.open = false; });
    languageMenu.addEventListener('keydown', event => {
      if (event.key === 'Escape' && languageMenu.open) { languageMenu.open = false; languageTrigger.focus(); }
    });

    const themeGroup = document.createElement('div');
    themeGroup.className = 'theme-options';
    themeGroup.setAttribute('role', 'group');
    themeGroup.setAttribute('aria-label', t('Theme'));
    for (const [value, label, emoji] of [['auto', t('Auto'), '🖥️'], ['light', t('Light'), '☀️'], ['dark', t('Dark'), '🌙']]) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'theme-option'; button.dataset.theme = value;
      button.title = label; button.setAttribute('aria-label', `${t('Theme')}: ${label}`);
      button.setAttribute('aria-pressed', String(value === themePreference));
      const glyph = document.createElement('span'); glyph.className = 'theme-glyph'; glyph.setAttribute('aria-hidden', 'true'); glyph.textContent = emoji;
      button.append(glyph);
      button.addEventListener('click', () => {
        themePreference = value; set(themeKey, value); applyTheme();
        for (const item of themeGroup.querySelectorAll('button')) item.setAttribute('aria-pressed', String(item === button));
      });
      themeGroup.append(button);
    }
    controls.append(languageMenu, themeGroup); header.append(controls);
    resolveControls(controls);
  });
  async function animateControls(registry) {
    const controls = await controlsReady;
    if (!controls) return;
    const languageGlyph = controls.querySelector('.language-glyph');
    registry.bind(languageGlyph, '🌍', { trigger: languageGlyph.parentElement, events: ['pointerenter', 'focus', 'click'] });
    for (const button of controls.querySelectorAll('.theme-option')) {
      const glyph = button.querySelector('.theme-glyph');
      registry.bind(glyph, glyph.textContent, { trigger: button, events: ['pointerenter', 'focus', 'click'] });
    }
  }
  const copyIcon = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="11" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2"/></svg>';
  const checkIcon = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg>';
  const feedbackTimers = new WeakMap();
  function setupCopyButtons() {
    for (const button of document.querySelectorAll('.doc-copy, .copy-example, #copy-install')) {
      button.dataset.copyLabel = button.getAttribute('aria-label') || button.textContent.trim() || t('Copy code');
      button.classList.add('copy-icon-button');
      button.setAttribute('aria-label', button.dataset.copyLabel);
      button.title = button.dataset.copyLabel;
      button.innerHTML = copyIcon;
    }
  }
  function copyFeedback(button, state) {
    clearTimeout(feedbackTimers.get(button));
    const label = state === 'copied' ? t('Copied ✓') : t('Select & copy');
    button.setAttribute('aria-label', label); button.title = label;
    button.classList.toggle('is-copied', state === 'copied');
    button.innerHTML = state === 'copied' ? checkIcon : copyIcon;
    feedbackTimers.set(button, setTimeout(() => {
      button.setAttribute('aria-label', button.dataset.copyLabel); button.title = button.dataset.copyLabel;
      button.classList.remove('is-copied'); button.innerHTML = copyIcon;
    }, state === 'copied' ? 2000 : 3000));
  }
  window.emojiSite = { ready, language, t, translate, animateControls, setupCopyButtons, copyFeedback };
})();
