const Wanakana = require('wanakana');
const Deconjugator = require('jp-verbs');
const Kuroshiro = require('kuroshiro');
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');
const kuroshiro = new Kuroshiro();

/* Input Method Editor */
const ime = document.getElementById('wanakana');

Wanakana.bind(ime);

/* Copy button listener */
$('.btn-copy').click(function () {
  const id = this.dataset.copy;
  const element = document.getElementById(id);

  element.select();
  element.setSelectionRange(0, 999);
 // navigator.clipboard.writeText(element.value);

  this.innerText = 'Copied!';

  setTimeout(() => {
    this.innerText = 'Copy';
  }, 3000);
});
