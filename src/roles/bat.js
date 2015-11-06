define([], function () {
    var batAcceleration = 2000,
        batFlapDuration = 10,
        batFlapCooldown = 500;

    return {
        init: function () {
            this.state.x = 200;
            this.state.y = 100;
            this.state.velocity = 0;
            this.state.acceleration = 0;
        },
        evaluate: function (interval) {
            var flapDuration, handler;

            flapDuration = this.state.flapDuration;
            handler = flapDuration > 0 ? function () {} : this.set.bind(this, 'acceleration', 0);

            this.set('flapDuration', flapDuration - interval);
            this.set('flapCooldown', Math.max(0, batFlapCooldown - interval));

            return handler;
        },
        flap: function () {
            if (true || this.state.flapCooldown === 0) {
                this.set('flapDuration', batFlapDuration);
                this.set('acceleration', batAcceleration);
            }
        }
    };
});
