define([
    'proscenium'
], function(
    Proscenium
) {

    return {
        curtains: ['result'],
        stages: [],
        init: function(){
            Proscenium.curtains.result.resultScene = this;
        },
        prep: function(config){
            Proscenium.curtains.result.currentScene = config.currentScene;
            Proscenium.curtains.result.nextScene = config.nextScene;
            $(Proscenium.curtains.result.element).show();
        },
        clear: function(){
            $(Proscenium.curtains.result.element).hide();
        }
    }
});
