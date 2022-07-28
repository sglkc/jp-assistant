/* Init Kuroshiro */
const kuroshiro = new Kuroshiro();
const kuroshiroConfig = {
  to: 'hiragana',
  mode: 'normal',
  romajiSystem: 'hepburn'
};

$('#converter .textarea-container button').click(() => {
  $('#converter-result').removeClass('text-danger');
  $('#converter-result').html('<div class="spinner-border"></div>');
  $('#converter .textarea-container button').addClass('d-none');

  kuroshiro.init(new KuromojiAnalyzer({ dictPath: 'dist/dict' }))
    .then(() => {
      $('#converter-result').html('Result will be shown here');
      $('#converter-result').css('white-space', 'pre-wrap');
      $('#converter textarea, [disabled]:not([name="romajiSystem"], [name="rt"])')
        .attr('disabled', false);
    })
    .catch((e, a) => {
      $('#converter .textarea-container button').removeClass('d-none');
      $('#converter-result').html('Unexpected error: ' + e);
      $('#converter-result').addClass('text-danger');
    });
});

/* Converter generate function */
function convert() {
  const text = $('#converter textarea').val();

  kuroshiro.convert(text, kuroshiroConfig)
    .then((result) => {
      const display = result || 'Result will be shown here';
      const furiganaSize = $('#converter-settings [name="rt"]').val();

      $('#converter-result').html(display);
      $('#converter-result rt').css('font-size', furiganaSize + 'px');
    });
}

/* Converter auto-submit */
$('#converter textarea').on('input', convert);

/* Converter settings */
$('#converter-settings select').change(function () {
  const name = this.name;
  const option = this.value.toLowerCase();

  kuroshiroConfig[name] = option;

  const isRomaji = kuroshiroConfig.to === 'romaji';
  const isFurigana = kuroshiroConfig.mode === 'furigana';

  $('#converter-settings [name="romajiSystem"]').attr('disabled', !isRomaji);
  $('#converter-settings [name="rt"]').attr('disabled', !isFurigana)
  convert();
});

$('#converter-settings input[type="range"]').on('input', function () {
  const name = this.name;
  const value = this.value;

  $('#converter-result ' + name).css('font-size', value + 'px');
});
