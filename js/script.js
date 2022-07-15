window.Wanakana = require('wanakana');
window.Deconjugator = require('jp-verbs');
window.Kuroshiro = require('kuroshiro');
window.KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');
window.kuroshiro = new Kuroshiro();

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

/* Deconjugator function */
function deconjugate() {
  const verb = new URLSearchParams(location.search).get('deconjugate');
  const template = $('#deconjugator-template')
    .clone()
    .attr('id', null)
    .removeClass('d-none');

  $('#deconjugator-list > :not(#deconjugator-template)').remove();

  if (!verb.length) return;

  const words = Deconjugator.unconjugate(verb, true).filter((word, i, self) => {
    const current = JSON.stringify(word);

    return i === self.findIndex((obj) => {
      return JSON.stringify(obj) === current;
    });
  });

  words.forEach((word, index, words) => {
    $('.card-header', template).text(word.base)
      .attr('href', 'https://jisho.org/search/' + word.base);

    const forms = word.derivationSequence.wordFormProgression;
    const links = Deconjugator.GrammarLinkForWordType;

    word.derivationSequence.derivations.forEach((derivation, i) => {
      const clickable =
        links[derivation]
        ? `<a href="${links[derivation]}">${derivation}</a>`
        : derivation;

      $('ul', template).append(
        `<li class="list-group-item py-3">${forms[i]}<br>${clickable}</li>`
      );
    });

    if (!forms.length) {
      $('ul', template).append(
        `<li class="list-group-item">Already at dictionary form</li>`
      );
    }

    template.clone().appendTo('#deconjugator-list');
    $('ul > li', template).remove();
  });
}

/* Deconjugate if found parameter */
if (new URLSearchParams(location.search).get('deconjugate')) {
  const verb = new URLSearchParams(location.search).get('deconjugate');

  $('[name="deconjugate"').val(verb);
  document.getElementById('deconjugator').scrollIntoView({ block: 'center' });
  deconjugate();
}

/* Deconjugator submit */
$('#deconjugator form').submit((e) => {
  const verb = $('[name="deconjugate"]').val();

  e.preventDefault();
  history.replaceState(null, "", '?deconjugate=' + verb);
  deconjugate();
});

/* Init Kuroshiro */
$('#furigana .textarea-container button').click(() => {
  window.kuroshiro = new Kuroshiro();

  $('#furigana-result').removeClass('text-danger');
  $('#furigana-result').html('<div class="spinner-border"></div>');
  $('#furigana .textarea-container button').addClass('d-none');

  kuroshiro.init(new KuromojiAnalyzer())
    .then(() => {
      $('#furigana-result').html('Result will be showed here');
      $('#furigana textarea').attr('disabled', false);
    })
    .catch((e, a) => {
      $('#furigana .textarea-container button').removeClass('d-none');
      $('#furigana-result').html('Unexpected error: ' + e);
      $('#furigana-result').addClass('text-danger');
    });
});

/* Furigana auto-submit */
$('#furigana textarea').on('input', async function () {
  const text = this.value;
  const result = await kuroshiro.convert(text, { to: 'hiragana', mode: 'furigana' });
  const display = result || 'Result will be showed here';

  $('#furigana-result').html(display);
});
