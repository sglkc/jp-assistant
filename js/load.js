$.getScript("js/bundle.js")
  .done(() => {
    console.log('bundle loaded');
  })
  .fail((e) => {
    console.log('bundle failed to load', e);
  });
