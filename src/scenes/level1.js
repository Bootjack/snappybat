define([
  'proscenium'
], function(
  Proscenium
) {

  return {
    curtains: ['levelControls'],
    stages: [],
    init: function(){
      var self = this;
      this.conditions.push({
          test: function () {
              console.log('Testing level 1 win condition', Proscenium.actors.player.state.hasWon);
              return Proscenium.actors.player.state.hasWon;
          },
          run: function () {
              self.end();
              Proscenium.scenes.result.begin();
          }
      });
      console.log('level 1 scene ready');
    },
    prep: function(){
      Proscenium.curtains.levelControls.currentScene = this;
      console.log('level 1 scene has begun');
    },
    clear: function(){
      console.log('level 1 has ended');
    }
  }
})
