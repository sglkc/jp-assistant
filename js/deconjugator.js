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
