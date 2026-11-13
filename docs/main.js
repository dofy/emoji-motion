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
