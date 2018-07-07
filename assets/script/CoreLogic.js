// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
let Formation = require("table/formation")
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
        pfBullet:{
            default:null,
            type:cc.Prefab,
            displayName:"Bullet",
            tooltip:"子弹预制件",
        },
        pfEnemy:{
            default:null,
            displayName:"Enemy",
            tooltip:"敌人预制件",
            type:cc.Prefab
        }
    },

    ctor(){
        cc.core = this
        this.beeSpeed = 1.2
    },
    start () {
        this.initCollision()
        this.initEnemy()
    },
    initEnemy(){
        let pos = cc.v2(-220,400)
        let size = cc.v2(44,44)
        let list = Formation.Normal;
        for(var i=0;i<list.length;i++){
            let line = list[i]
            for(var j=0;j<line.length;j++){
                if(line[j]==0)continue;
                let enemy = cc.instantiate(this.pfEnemy)
                let enemyScript = enemy.getComponent("Enemy")
                enemyScript.init(line[j],this.Player)
                enemy.position = cc.v2(pos.x+size.x/2+size.x*j,pos.y-size.y/2-size.y*i)
                this.node.addChild(enemy)
            }
        }
    },
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

    onLeftClick() {
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


    fire(point,speed){
        var bullet = cc.instantiate(this.pfBullet)
        bullet.position = point
        bullet.getComponent("Bullet").atkPlayer(speed)
        this.node.addChild(bullet)
    },
    getBeeMoveTime(p0, p1) {
        var length = cc.pDistance(p0, p1)
        var time = length / this.beeSpeed / 100;
        return time;
    },
});