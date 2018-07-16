// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let GameManager = require("GameManager")
cc.Class({
    extends: cc.Component,

    properties: {
        delay:1
    },
    ctor(){
        this.isChange = false
    },
    start () {
        this.runTime = 0
        G.GM = new GameManager()
        G.SIZE = cc.view.getVisibleSize()
        cc.director.setDisplayStats(false)
    },

    update (dt) {
        if(this.isChange)return
        this.runTime+=dt
        if (this.runTime>=this.delay){
            this.playGame()
        }
    },
    playGame: function () {
        this.isChange = true
        cc.director.loadScene('GameScene');
    },
});
