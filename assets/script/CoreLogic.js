// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        Left: {
            default: null,        // The default value will be used only when the component attaching
                                  // to a node for the first time
            type: cc.Button, // optional, default is typeof default
        },
        Right: {
            default: null,        // The default value will be used only when the component attaching
                                  // to a node for the first time
            type: cc.Button, // optional, default is typeof default
        },
        FightButton:{
            default:null,
            type:cc.Button,
        },
        Player:{
            default:null,
            type:cc.Node,
        },
        speed:{
            default:cc.v2(0,0),
        },
    },


    start () {
        this.initCollision()
    },
    onLeftClick(){
        this.onPlayerMove(-this.speed.x,this.speed.y)
    },
    onRightClick(){
        this.onPlayerMove(this.speed.x,this.speed.y)
    },
    onPlayerMove(x,y){
        this.Player.x += x
        this.Player.y += y
    },
    onFightClick(){
        let playerScript = this.Player.getComponent("Player")
        playerScript.fire()
    },
    // update (dt) {},


    initCollision(){
        // 获取碰撞检测系统
        var manager = cc.director.getCollisionManager();
        // 默认碰撞检测系统是禁用的，如果需要使用则需要以下方法开启碰撞检测系统
        manager.enabled = true;
        // 默认碰撞检测系统的 debug 绘制是禁用的，如果需要使用则需要以下方法开启 debug 绘制
        manager.enabledDebugDraw = true;
        // 如果还希望显示碰撞组件的包围盒，那么可以通过以下接口来进行设置
        manager.enabledDrawBoundingBox = true;
    },
});
