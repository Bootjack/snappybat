define('src/emitter',[], function () {

    var Emitter = function () {
        this._events = {};
        return this;
    };

    Emitter.prototype.trigger = function (event, data) {
        var i;
        if (this._events[event] && this._events[event].length) {
            for (i = 0; i < this._events[event].length; i += 1) {
                if ('function' === typeof this._events[event][i]) {
                    this._events[event][i](data);
                }
            }
        }
    };

    Emitter.prototype.on = function (event, func, scope) {
        scope = scope || this;
        func = func.bind(scope);
        this._events[event] = this._events[event] || [];
        this._events[event].push(func);
    };

    Emitter.prototype.off = function (event, func) {
        var index = this._events[event].indexOf(func);
        if (func) {
            this._events[event].splice(index, 1);
        } else {
            this._events[event] = [];
        }
    };

    return Emitter;
});

define('src/util',[], function() {
    'use strict';

    var util = {
        object: function (obj) {
            function F() {}
            F.prototype = obj;
            return new F();
        },
        merge: function (Mixins, config) {
            var props, proto;

            props = {};
            proto = {};

            Mixins.forEach(function (Mixin) {
                var p, m = new Mixin(config);
                for (p in m) {
                    if (m.hasOwnProperty(p)) {
                        props[p] = m[p];
                    } else {
                        proto[p] = Mixin.prototype[p];
                    }
                }
                proto.constructor = m.constructor;
            });

            function Merged() {
                var p;
                for (p in props) {
                    this[p] = props[p];
                }
            }

            Merged.prototype = proto;

            return Merged;
        },
        inherit: function (Parent, Child, config) {
            var child, parent;

            child = new Child(config);

            function Clone() {
                var p;
                for (p in child) {
                    this[p] = child[p];
                }
            }
            Clone.prototype = Parent.prototype;

            parent = new Clone();

            Parent.prototype = parent;

            return Parent;
        },
        mixin: function (Self, Mixins, configs) {
            var config, mix, proto, Mixed = function () {};
            configs = configs || [];
            if (!(configs instanceof Array)) {
                configs = [configs];
            }
            configs.forEach(function(conf, i) {
                if (i > 0 && configs[i + 1]) {
                    configs[i] = util.merge(configs.slice(i));
                }
            });
            Mixins.forEach(function (Mixin, i) {
                Mixed = util.inherit(Mixed, Mixin, configs[i]);
            });

            proto = Self.prototype;

            function Clone() {
                var p;
                for (p in proto) {
                    this[p] = proto[p];
                }
            }
            Clone.prototype = Mixed.prototype;

            mix = new Clone();
            mix.constructor = Self;

            Self.prototype = mix;

            return Self;
        },
        mock: function (scope) {
            scope.A = function (config) {config = config || {}; this.test = config.test; return this;};
            scope.B = function (config) {config = config || {}; this.test = !config.test; return this;};
            scope.C = function (config) {this.config = config; return this;};
            scope.A.prototype.isA = true;
            scope.B.prototype.isB = true;
            scope.C.prototype.isC = true;
        }
    };

    return util;
});

define('src/actor',[
    'src/emitter',
    'src/util'
], function (
    Emitter,
    util
) {
    'use strict';
    
    var Actor = function(config) {
        config = config || {};

        this.evaluations = [];
        this.id = config.id;
        this.preparations = [];
        this.roles = [];
        
        // The state object stores all data about the actor so that it can be saved and restored.
        this.state = {};

        if ('function' === typeof config.prep) {
            this.preparations.push(config.prep);
        }

        if ('function' === typeof config.evaluate) {
            this.evaluations.push(config.evaluate);
        }

        if ('function' === typeof config.init) {
            config.init.call(this);
        }

        return this;
    };

    // A shared set of role definitions. Proscenium.role() adds to this list.
    Actor.prototype._roles = {};

    /* Assign a role or array of roles to an actor. The actor will inherit (all the way up the prototype chain) all
     * properties of given role(s) in the given order. */
    Actor.prototype.role = function (roles) {
        var i, property, role;
        if ('string' === typeof roles) {
            roles = [roles];
        }
        // Loop through role names to be applied to actor
        for (i = 0; i < roles.length; i += 1) {
            // Make sure there is a role by that name already defined
            role = this._roles[roles[i]];
            if (role) {
                // Add role name to actor's roles array
                this.roles.push(roles[i]);
                // Add actor to role's members array
                role.members.push(this);
                // Copy properties from role definition to actor
                for (property in role.definition) {
                    if ('prep' === property) {
                        this.preparations.push(role.definition[property]);
                    } else if ('evaluate' === property) {
                        this.evaluations.push(role.definition[property]);
                    } else if ('init' !== property) {
                        this[property] = role.definition[property];
                    }
                }
                if ('function' === typeof role.definition.init) {
                    role.definition.init.call(this);
                }
            } else {
                throw new Error('Actor role "' + roles[i] + '" is not defined');
            }
        }
        return this;
    };

    Actor.prototype.set = function (name, value) {
        this.state[name] = value;
        this.trigger('update');
        return this;
    };

    Actor.prototype.prep = function () {
        var that = this;
        this.preparations.forEach(function (prep) {
            prep.call(that);
        });
    };
    
    Actor.prototype.evaluate = function (interval) {
        var that = this;
        return this.evaluations.map(function (ev) {
            return ev.call(that, interval);
        });
    };

    util.mixin(Actor, [Emitter]);

    return Actor;
});

define('src/collection',[], function () {

    // Utility functions
    function addOne (name, object) {
        object.on('update', this.update.bind(this));
        this[name].push(object);
        this.update();
    }

    function removeOne (name, object) {
        var index = this[name].indexOf(object);
        this[name].splice(index, 1);
        object.off('update', this.update.bind(this));
        this.update();
    }

    var Collection = function (config) {
        var collection, name;
        config = config || {};

        collection = [];
        name = config.name || 'collection';

        this[name] = collection;
        this.addOne = function (object) {
            addOne.call(this, name, object);
        };

        this.removeOne = function (object) {
            removeOne.call(this, name, object);
        };

        this.clear = function () {
            this[name].forEach(this.removeOne.bind(this));
        };
    };

    Collection.prototype.update = function () {
        return this;
    };
    
    Collection.prototype.add = function (addition) {
        if (Array === addition.constructor) {
            addition.forEach(this.addOne.bind(this));
        } else {
            this.addOne(addition);
        }

        return this;
    };

    Collection.prototype.remove = function (member) {
        if (Array === member.constructor) {
            member.forEach(this.removeOne.bind(this));
        } else {
            this.removeOne(member);
        }
    };
    
    return Collection;
});

define('src/curtain',[
    'src/collection',
    'src/util'
], function (
    Collection,
    util
) {
    'use strict';
    
    var Curtain = function (config) {
        config = config || {};
        this._updating = false;

        if ('function' === typeof config.beforeUpdate) {
            this.beforeUpdate = config.beforeUpdate;
        }

        if ('function' === typeof config.afterUpdate) {
            this.afterUpdate = config.afterUpdate;
        }

        if (config.template) {
            this.template = config.template;
        }

        if ('function' === typeof config.calculate) {
            this.calculate = config.calculate;
        }

        if ('function' === typeof config.render) {
            this.render = config.render;
        }

        if (config.element instanceof HTMLElement) {
            this.element = config.element;
        } else if (config.element) {
            this.element = document.getElementById(config.element);
        } else {
            this.element = document.body.appendChild(document.createElement('div'));
            this.element.id = 'pr-curtain-' + config.id;
        }

        if ('function' === typeof config.init) {
            config.init.call(this);
        }
    };

    /**
     * The updating process is intended to be highly configurable. Any work that needs to be done whenever the
     * curtain is updated but is unrelated to rendering new curtain content belongs in beforeUpdate or afterUpdate.
     *
     * The rendering process itself is run by render(), which first prepares data using calculate() and then passes
     * that data to template(). At a minimum the template must be provided in order to generate any output. By default
     * the template is rendered with the entire curtain object passed as its data context. To change this behavior,
     * provide a custom calculate function that returns a data object. To customize the entire render process, a new
     * render function may be provided that does something completely different..
     */

    Curtain.prototype.beforeUpdate = function () {};

    Curtain.prototype.afterUpdate= function () {};

    Curtain.prototype.calculate = function () {
        return this;
    };

    Curtain.prototype.template = function () {
        return "";
    };

    Curtain.prototype.render = function () {
        var data = this.calculate();
        return this.template(data);
    };

    Curtain.prototype.update = function () {
        var that = this;

        if (!this._updating) {
            this._updating = true;
            this.beforeUpdate();
            this.element.innerHTML = this.render();
            this.afterUpdate();

            setTimeout(function () {
                that._updating = false;
            }, 5);
        }
        return this;
    };

    Curtain.prototype.destroy = function () {
        this.element.parentNode.removeChild(this.element);
    };

    util.mixin(Curtain, [Collection], {name: 'actors'});

    return Curtain;
});

define('src/scene',[
    'src/collection',
    'src/util'
], function (
    Collection,
    util
) {
    'use strict';

    /**
     * A Scene controls the flow of game logic by defining a beginning state and one or more ending states. Once it's
     * initialized, the scene will iterate frame-by-frame invoking evaluation logic on each of its actors and stages.
     * The last step of each frame is to test each ending condition to see if the scene should end and how control
     * should be passed to the next segment of the game.
     * @param config {scenConfig} Configuration options for initializing this scene
     * @param scope {Proscenium} A reference to the Proscenium object used to define the Scene
     * @returns {Scene}
     * @constructor
     *
     * {Object} sceneConfig
     * {Function} sceneConfig.always will run at the beginning of every frame
     * {Function} sceneConfig.init will run immediately upon instantiation
     */
    var Scene = function(config, scope) {
        var that = this;

        config = config || {};
        this.id = config.id;

        this._frame = 0;
        this._framerate = 0;
        this._lastFrame = 0;
        this._pausedAt = 0;
        this._pausedFor = 0;

        this.actors = [];
        this.conditions = [];
        this.curtains = [];
        this.paused = false;
	this.running = false;
        this.stages = [];

        this.always = config.always;
        this.throttle = config.throttle || 60;

        if (config.curtains instanceof Array) {
            this.curtains = config.curtains.map(function (name) {
                return scope.curtains[name];
            });
        } else if ('string' === typeof config.curtains) {
            this.curtains.push(scope.curtains[name]);
        }

        if (config.stages instanceof Array) {
            this.stages = config.stages.map(function (name) {
                return scope.stages[name];
            });
        } else if ('string' === typeof config.curtains) {
            this.stages.push(scope.stages[name]);
        }

        if ('function' === typeof config.prep) {
            this.prep = config.prep.bind(this);
        }
        
        if ('function' === typeof config.clear) {
            this.clear = config.clear.bind(this);
        }

        if ('function' === typeof config.init) {
            config.init.call(this);
        }

        return this;
    };

    Scene.prototype.warmup = function (config) {
        if ('function' === typeof this.prep) {
            this.prep(config);
        }
        this.curtains.forEach(function (curtain) {
            curtain.clear();
        });
        this.stages.forEach(function (stage) {
            if ('function' === typeof stage.prep) {
                stage.prep(config);
            }
        });
        this.actors.forEach(function (actor) {
            if ('function' === typeof actor.prep) {
                actor.prep(config);
            }
        });
        return this;
    };
    
    Scene.prototype.evaluate = function (interval) {
        var evaluations, frame;

        evaluations = [];
        this._frame += 1;
        frame = this._frame;

        if ('function' === typeof this.always) {
            this.always(interval);
        }

        this.actors.forEach(function (actor) {
            var result;
            if ('function' === typeof actor.evaluate) {
                result = actor.evaluate(interval);
                if ('function' === typeof result) {
                    evaluations.push(result);
                } else if (result instanceof Array) {
                    evaluations = evaluations.concat(result);
                }
            }
        });

        evaluations.forEach(function (execute) {
            execute();
        });

        this.stages.forEach(function (stage) {
            if ('function' === typeof stage.evaluate) {
                if ('function' !== typeof stage.phase || stage.phase(frame)) {
                    stage.evaluate(interval);
                }
            }
        });

        this.conditions.forEach(function (condition) {
            if (condition.test()) {
                condition.run();
            }
        });
    };
    
    Scene.prototype.pause = function () {
        if (!this.paused) {
            this.paused = true;
            this._pausedAt = new Date().getTime();
        }
        return this;
    };
    
    Scene.prototype.unpause = function () {
        if (this.paused) {
            this.paused = false;
            this._pausedFor += new Date().getTime() - this._pausedAt;
        }
        return this;
    };
    
    Scene.prototype.run = function () {
        var interval, now, timeout;

        now = new Date().getTime();
        timeout = 1000 / this.throttle;
        interval = now - this._lastFrame;
        this._lastFrame = now;

        if (!this.paused) {
            this.evaluate(interval);
            now = new Date().getTime();
            interval = now - this._lastFrame;
            if (interval < timeout) {
                timeout -= interval;
                this._framerate = this.throttle;
            } else {
                timeout = interval % timeout;
                this._framerate = Math.floor(1000 / Math.max(interval, 1));
            }
        }

        if (this.running) {
            this._timeout = setTimeout(
                this.run.bind(this),
                timeout
            );
        }

        return this;
    };

    Scene.prototype.cleanup = function () {
        var scene = this;
        this.curtains.forEach(function (curtain) {
            curtain.clear(scene);
        });
        this.stages.forEach(function (stage) {
            stage.clear(scene);
        });
        if ('function' === typeof this.clear) {
            this.clear();
        }
        return this;
    };

    Scene.prototype.begin = function (config) {
        this.running = true;
        this._lastFrame = new Date().getTime();
        this.warmup(config);
        this.run();
    };

    Scene.prototype.end = function () {
        this.running = false;
        clearTimeout(this._timeout);
	this.cleanup();
    };

    return Scene;
});



define('src/stage',[], function () {
    'use strict';

    function phaseFactory(interval, offset) {
        return function (frame) {
            var phase = (frame + offset) % interval;
            return !phase;
        };
    }

    /**
     * A Stage is a place for Actors to be manipulated. While a Scene is running it will iterate over all of its
     * active Stages to call each one's evaluate() method. This happens immediately after the Actors have run their
     * own evaluations.
     *
     * @param config
     * @constructor
     */
    var Stage = function (config) {
        config = config || {};
        this.id = config.id;

        if (config.interval > 1) {
            this.phase = phaseFactory(config.interval, config.offset);
        }

        if ('function' === typeof config.prep) {
            this.prep = config.prep.bind(this);
        }

        if ('function' === typeof config.evaluate) {
            this.evaluate = config.evaluate.bind(this);
        }

        if ('function' === typeof config.clear) {
            this.clear = config.clear.bind(this);
        }

        if ('function' === typeof config.init) {
            config.init.call(this);
        }
    };

    Stage.prototype.clear = function () {};

    return Stage;
});

define('src/proscenium.js',[
    'src/actor',
    'src/curtain',
    'src/scene',
    'src/stage'
], function (Actor, Curtain, Scene, Stage) {
    'use strict';
    
    var Proscenium = { 
        actors: {},
        _actors: 0,
        curtains: {},
        _curtains: 0,
        scenes: {},
        _scenes: 0,
        stages: {},
        _stages: 0,
        roles: Actor.prototype._roles,
        
        create: function (Constructor, collection, id, config) {
            config = config || ('string' !== typeof id && id);
            id = id || collection + '-' + this['_' + collection];
            config.id = config.id || id;
            var instance = new Constructor(config, this);
            this[collection][id] = instance;
            this['_' + collection] += 1;
            return instance;
        },

        destroy: function () {

        },
        
        actor: function (id, config) {
            config = config || {};
            return this.create(Actor, 'actors', id, config);
        },

        curtain: function (id, config) {
            config = config || {};
            return this.create(Curtain, 'curtains', id, config);
        },

        role: function (id, role) {
            Actor.prototype._roles[id] = {
                definition: role,
                members: []
            };
        },
        
        scene: function (id, config) {
            config = config || {};
            return this.create(Scene, 'scenes', id, config);
        },
        
        stage: function (id, config) {
            config = config || {};
            return this.create(Stage, 'stages', id, config);
        }
    };
    
    return Proscenium;
});

