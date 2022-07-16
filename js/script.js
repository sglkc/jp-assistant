window.Wanakana = require('wanakana');
window.Deconjugator = require('jp-verbs');
window.Kuroshiro = require('kuroshiro');
window.KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');
window.kuroshiro = new Kuroshiro();

const kuroshiroConfig = {
  to: 'hiragana',
  mode: 'normal',
  romajiSystem: 'hepburn'
};

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
$('#convert .textarea-container button').click(() => {
  $('#convert-result').removeClass('text-danger');
  $('#convert-result').html('<div class="spinner-border"></div>');
  $('#convert .textarea-container button').addClass('d-none');

  kuroshiro.init(new KuromojiAnalyzer())
    .then(() => {
      $('#convert-result').html('Result will be shown here');
      $('#convert textarea, #convert-settings :not(:last-child)')
        .attr('disabled', false);
    })
    .catch((e, a) => {
      $('#convert .textarea-container button').removeClass('d-none');
      $('#convert-result').html('Unexpected error: ' + e);
      $('#convert-result').addClass('text-danger');
    });
});

/* Converter generate function */
function convert() {
  const text = $('#convert textarea').val();

  kuroshiro.convert(text, kuroshiroConfig)
    .then((result) => {
      const display = result || 'Result will be shown here';

      $('#convert-result').html(display);
    });
}

/* Converter auto-submit */
$('#convert textarea').on('input', convert);

/* Converter settings */
$('#convert-settings select').change(function () {
  const name = this.name;
  const option = this.value.toLowerCase();

  kuroshiroConfig[name] = option;

  const isRomaji = kuroshiroConfig.to === 'romaji';

  $('#convert-settings [name="romajiSystem"]').attr('disabled', !isRomaji);
  convert();
});
