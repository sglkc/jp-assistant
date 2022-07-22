import * as conjugator from './conjugator.js';
import * as converter from './converter.js';
import * as deconjugator from './deconjugator.js';

/* Enable Bootstrap popovers */
const popovers = $('[data-bs-toggle="popover"]').each((i, el) => {
  new bootstrap.Popover(el, {
    sanitizeFn(content) {
      return content;
    }
  });
});

/* Bind Input Method Editor */
$('.wanakana').each((i, elm) => {
  Wanakana.bind(elm);
});

/* Text area auto-resize */
$('textarea').on('input', function () {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
});

/* Copy button listener */
$('.btn-copy').click(function () {
  const id = this.dataset.copy;
  const element = document.getElementById(id);

  element.select();
  element.setSelectionRange(0, 999);
  navigator.clipboard.writeText(element.value);

  this.innerText = 'Copied!';

  setTimeout(() => {
    this.innerText = 'Copy';
  }, 3000);
});
