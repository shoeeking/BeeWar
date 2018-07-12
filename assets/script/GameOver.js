

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
        G.GM.restartGame()
        cc.core.restart()
    },
    onReliveClick(){
        if(G.GM.getLife()>0){
            this.node.active = false
            G.GM.relive()
            cc.core.relive()
        }
    }

    // update (dt) {},
});
