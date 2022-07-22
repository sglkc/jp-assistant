const template = $('#conjugator-template')
  .clone()
  .attr('id', null)
  .removeClass('d-none');

$('#conjugator-template').remove();
$('input', template).attr('name', 'conjugation');
$('input', template).attr('type', 'radio');
window.Kamiya.conjugations.forEach((con) => {
  $('label', template).text(con);
  $('label', template).attr('for', con);
  $('input', template).attr('id', con);
  $('input', template).attr('value', con);

  template.clone().appendTo('#conjugator-settings > :nth-child(2)')
});

$('input', template).attr('name', 'auxilaries[]');
$('input', template).attr('type', 'checkbox');
$('input', template).attr('required', null);
window.Kamiya.auxiliaries.forEach((aux) => {
  $('label', template).text(aux);
  $('label', template).attr('for', aux);
  $('input', template).attr('id', aux);
  $('input', template).attr('value', aux);

  template.clone().appendTo('#conjugator-settings > :nth-child(3)')
});

$('#conjugator form').submit((e) => {
  const verb = $('[name="conjugate"]').val();
  const conjugation = $('[name="conjugation"]:checked').val();
  const ichidan = $('[name="ichidan"]').is(':checked');
  const auxilaries = [];

  $('[name="auxilaries[]"]:checked').each((i, e) => {
    auxilaries.push(e.value);
  });

  if (!verb && !conjugation) return e.reportValidity();

  e.preventDefault();
  $('#conjugator-results').removeClass('d-none');
  try {
    $('#conjugator-results').children().remove();
    window.Kamiya.conjugateAuxiliaries(verb, auxilaries, conjugation, ichidan)
      .forEach((conjugated) => {
        $('#conjugator-results').append(
          `<li class="list-group-item list-group-item-info">${conjugated}</li>`
        );
      });
  } catch (error) {
    $('#conjugator-results').append(
      `<li class="list-group-item list-group-item-danger">${error}</li>`
    );
  }
});
