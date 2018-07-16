
cc.Class({
    extends: cc.Component,

    properties: {
    },

    start() {
        this.node.color = cc.color(255*Math.random(), 255*Math.random(), 255*Math.random(),255) 
        this.blink()
    }, 
    blink() {
        var self = this
        var t = Math.random()
        this.scheduleOnce(function() {
            this.node.opacity = 0==this.node.opacity?255:0
            self.blink()
        }, 0.2 + t);
    },
    update() {
        var pos = this.node.position;
        let size = G.SIZE
        this.node.position = -size.height/2 > pos.y ? cc.p(pos.x, size.height/2) : cc.p(pos.x, pos.y - 1);
    }
});
