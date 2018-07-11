

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.setLocalZOrder(10)
    },

    onRestarClick(){
        this.node.active = false
        cc.core.restart()
    },
    onReliveClick(){
        this.node.active = false
        cc.core.relive()
    }

    // update (dt) {},
});
