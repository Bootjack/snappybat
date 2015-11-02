define([
  'jquery',
  'proscenium'
],function(
  $,
  Proscenium
){
  return {
    curtains: ['splash'],
    prep: function() {
      var splash, $splash;

      splash = Proscenium.curtains.splash;
      splash.update();
      $splash = $(splash.element);
      $splash.show();
    }
  };
});
