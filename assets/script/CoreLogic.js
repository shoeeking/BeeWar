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
let CST = require("Constants")
let GAME_STATE = CST.GAME_STATE
let OM = CST.OM
cc.Class({
    extends: cc.Component,

    properties: {
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
        },
        touchLayer:{
            default:null,
            type:cc.Node
        },
        overLayer:{
            default:null,
            type:cc.Node,
        },
        winLayer:{
            default:null,
            type:cc.Node,
        },
        beeTexts:{
            default:[],
            type:[cc.Label]
        },
        txtScore:{
            default:null,
            type:cc.Label,
        },
        txtLevel:{
            default:null,
            type:cc.Label,
        },
        txtLife:{
            default:null,
            type:cc.Label,
        },
        startNode:{
            default:null,
            type:cc.Node,
        },
        btnLeft:cc.Button,
    },

    ctor(){
        cc.core = this
        this.isMoveLeft = true
        this.beeSpeed = 3
        this.bulletPool = []
        this.beeList = []
        this.beeRowList = []
        this.beeAtkTimeSize = 3
        this.npcBulletNumAdd = .2
        this.game_type = GAME_STATE.Normal
        this.moveX = 0
    },
    start () {
        this.playerScript = this.Player.getComponent("Player")
        this.initCollision()
        this.initBee()
        this.registTouch()
        this.refreshUI()
        this.winLayer.active = false
        this.overLayer.active = false

        this.scheduleOnce(function() {
            this.atkMgr()
        }, 3.5)
    },
    // 开始游戏
    starGame(){
        this.game_type=GAME_STATE.Normal
    },
    // 重新开始
    restart(){
        this.game_type=GAME_STATE.Normal
        this.resetBee()
        this.resetPlane()
        this.refreshUI()
    },
    // 复活
    relive(){
        this.game_type=GAME_STATE.Normal
        this.resetPlane()
        this.refreshUI()
    },
    initBee(){
        let pos = this.startNode.position
        let size = cc.v2(44,44)
        let list = G.GM.layout()
        for(var i=0;i<list.length;i++){
            let line = list[i]
            for(var j=0;j<line.length;j++){
                if(line[j]==0)continue;
                let bee = cc.instantiate(this.pfEnemy)
                let beeScript = bee.getComponent("Enemy")
                bee.position = cc.v2(pos.x+size.x/2+size.x*j,pos.y-size.y/2-size.y*i)
                beeScript.init(line[j],this.Player,j,i)
                this.node.addChild(bee)
                this.beeList.push(bee)
                this.beeRowList[j] = this.beeRowList[j]?this.beeRowList[j]:[]
                this.beeRowList[j][i] = bee
            }
        }
    },
    refreshUI(){
        this.txtLife.string=G.GM.getLife()
        this.txtScore.string=G.GM.getScore()
        this.txtLevel.string=G.GM.getLevel()
        for(var i=1;i<=4;i++){
            let txt = this.beeTexts[i-1]
            let data = G.GM.getBee(i)
            txt.string = "x "+(data.max-data.die)+"/"+data.max
        }
    },
    initCollision(){
        // 获取碰撞检测系统
        var manager = cc.director.getCollisionManager()
        // 默认碰撞检测系统是禁用的，如果需要使用则需要以下方法开启碰撞检测系统
        manager.enabled = true
        // 默认碰撞检测系统的 debug 绘制是禁用的，如果需要使用则需要以下方法开启 debug 绘制
        // manager.enabledDebugDraw = true;
        // 如果还希望显示碰撞组件的包围盒，那么可以通过以下接口来进行设置
        // manager.enabledDrawBoundingBox = true;
    },
    // 触摸层
    registTouch() {
        var self = this 
        this.touchLayer.on(cc.Node.EventType.TOUCH_START, this.touchCallback,this)
        this.touchLayer.on(cc.Node.EventType.TOUCH_MOVE, this.touchCallback,this)
        this.touchLayer.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCallback,this)
        this.touchLayer.on(cc.Node.EventType.TOUCH_END, this.touchCallback,this)

        this.btnLeft.node.on(cc.Node.EventType.TOUCH_START, this.touchCallback,this)
        this.btnLeft.node..on(cc.Node.EventType.TOUCH_CANCEL, this.touchCallback,this)
        this.btnLeft.node..on(cc.Node.EventType.TOUCH_END, this.touchCallback,this)
    },
    touchCallback(event) {
        var pos0 = event.getLocation()
        if(event.type == cc.Node.EventType.TOUCH_START){
            this.touchStartPos = pos0 
        }else if(event.type == cc.Node.EventType.TOUCH_MOVE){
            this.setPlayerPoint(cc.pSub(pos0,this.touchStartPos)) 
        }else if(event.type == cc.Node.EventType.TOUCH_END){
            this.setPlayerPoint(cc.pSub(pos0,this.touchStartPos)) 
        }else if( event.type == cc.Node.EventType.TOUCH_CANCEL){
            this.setPlayerPoint(cc.pSub(pos0,this.touchStartPos)) 
        }   
        this.touchStartPos = pos0 
    },
    touchLeftCallback(event){
        if(event.type == cc.Node.EventType.TOUCH_START){
            this.playerScript.start
        }else if(event.type == cc.Node.EventType.TOUCH_END){

        }else if( event.type == cc.Node.EventType.TOUCH_CANCEL){
        }

    },
    touchRightCallback(event){

    },
    touchFireCallback(event){

    },
    setPlayerPoint(os) {
        if(this.game_type!=GAME_STATE.Normal)return
        if(!this.playerScript.canMove())return 
        var x = this.Player.position.x+os.x
        x = Math.min(x, 320)
        x = Math.max(x, -320)

        this.Player.position = cc.p(x, this.Player.position.y)
    },

    update (dt) {
        var posX = this.findBeePos(this.isMoveLeft)
        if ( this.isMoveLeft && posX<-260 ){
             this.isMoveLeft = !this.isMoveLeft
        } else if(!this.isMoveLeft && posX>260){
             this.isMoveLeft = !this.isMoveLeft
        }
        let utilX = 1
        let offX = this.isMoveLeft?-utilX:utilX
        this.moveX += offX
        for(var i in this.beeList){
            var bee = this.beeList[i]
            bee.getComponent("Enemy").leftAndRightMove(this.moveX)
        }
    },
    // 飞机
    resetPlane(){
        this.Player.getComponent("Player").reset()
    },
    // 蜜蜂
    resetBee(){
        for(var i in this.beeList){
            let bee = this.beeList[i]
            if(bee){
                bee.getComponent("Enemy").reset()
            }
        }
    },
    resetBullet(){
        for(var i in this.bulletPool){
            bullet.getComponent("Bullet").reset()
        }
    },
    beeDeath(id){
        G.GM.beeDeath(id)
        this.refreshUI()
        if(G.GM.isWin()){
            this.GameWin()
        }
    },
    findBeePos(moveLeft) {
        let posx = 0
        if (moveLeft){
            posx = 750
            for (var i in this.beeList) {
                var x = this.beeList[i].position.x;
                if(x<posx && this.beeList[i].active){
                    posx = x
                }
            }
        }else{
            posx = 0
            for (var i in this.beeList) {
                var x = this.beeList[i].position.x;
                if(x > posx && this.beeList[i].active) {
                    posx = x
                }
            }
        }
        return posx
    },
    bossAtk(){
        var list = []
        var offset = []
        var formLeft = true
        var n = 100 * Math.random()
        if(50 < n){
            formLeft = false
        }

        for (var r=0; r<this.beeRowList.length-1; r++) {
            var row = this.beeRowList[r]
            if(!formLeft){
                row = this.beeRowList[this.beeRowList.length-1-r]
            }
            if (null != row[0]) {
                var boss = row[0].getComponent("Enemy");
                if (boss.canATK()) {
                    list.push(row[0])
                    offset.push(cc.v2(0,0))

                    let tiled = boss.getTiled()
                    formLeft = tiled.x<this.beeRowList.length/2
                    for(var i=-1;i<=1;i++){
                        let row1 = this.beeRowList[tiled.x+i]
                        if(!formLeft){
                            row1 = this.beeRowList[tiled.x-i]
                        }
                        if(row1&&row1[tiled.y+1]){
                            let npc1 = row1[tiled.y+1].getComponent("Enemy")
                            if(npc1.canATK()){
                                list.push(row1[tiled.y+1])
                                offset.push(cc.v2(row1[tiled.y+1].position.x-row[0].position.x,0))
                            }
                            if(list.length==3){
                                break
                            }
                        }
                    }
                    console.log("BOSS带队攻击")
                    return {list:list,offset:offset}
                }
            }
        }

        let boss1 = null
        for (var r=0; r<this.beeRowList.length-1; r++) {
            var row = this.beeRowList[r]
            if(!formLeft){
                row = this.beeRowList[this.beeRowList.length-1-r]
            }
            if (null != row[1]) {
                var npc = row[1].getComponent("Enemy");
                if(npc.canATK()){
                    list.push(row[1])
                    boss1 = boss1?boss1:row[1]
                    offset.push(cc.v2(row[1].position.x-boss1.position.x,0))
                }
                if(list.length==2){
                    break
                }
            }
        } 
        console.log("没有BOSS带队攻击")
        return  {list:list,offset:offset}
    },

    beeAtk(){
        var rValue = 10 * Math.random()
        var atkList = []
        if (rValue<5){
            for ( var i=0 ; i<this.beeRowList.length-1 ; i++ ) {
                var list = this.beeRowList[i];
                for( var j =0 ; j<list.length-1 ; j++ ) {
                    if (null != list[j]) {
                        var npc = list[j].getComponent("Enemy");
                        if (npc.canATK()) {
                            atkList.push(list[j])
                            break
                        }
                    }
                }
                if (atkList.length>0) break
            } 
        }else{
            for (var i=this.beeRowList.length-1 ; i>=0 ; i--) {
                let list = this.beeRowList[i]
                for (var j=0 ; j<list.length-1 ; j++){
                    if (null != list[j]) {
                        var npc = list[j].getComponent("Enemy");
                        if (npc.canATK()) {
                            atkList.push(list[j])
                            break
                        }
                    }
                }
                if (atkList.length>0) break
            }
        }
        return atkList
    },
    atkMgr(){
        var self = this;
        if (this.game_type != GAME_STATE.Normal) {
            this.scheduleOnce(function() {
                self.atkMgr()
            }, 1);
            return
        }
        var randomValue = 100*Math.random()
        var atkList = []
        var pointList = []

        let killBee = G.GM.getKillNum()
        if (killBee>=10 && randomValue<30) {
            let data = this.bossAtk()
            atkList = data.list
            pointList = data.offset
            if(0 == atkList.length) {
                atkList = this.beeAtk()
                pointList = [cc.v2(0,0)]
            };
        }else{
            atkList = this.beeAtk()
            pointList = [cc.v2(0,0)]
        } 

        var atkEnemy = null
        if(this.game_type == GAME_STATE.Normal){
            for (var i in atkList) {
                var enemy = atkList[i]
                enemy.getComponent("Enemy").starATK(pointList[i])
            }
        } 
        var rValue = Math.random()
        var y = this.beeAtkTimeSize + rValue - this.npcBulletNumAdd*(G.GM.getLevel() - 1);
        this.scheduleOnce(function() {
            self.atkMgr()
        }, y)
    },

    // 子弹
    getBullet(){
        for(var i in this.bulletPool){
            let bullet = this.bulletPool[i]
            if(!bullet.active){
                return bullet
            }
        }
        var bullet = cc.instantiate(this.pfBullet)
        bullet.getComponent("Bullet").initBullet()
        this.node.addChild(bullet)
        this.bulletPool.push(bullet)
        return bullet
    },
    clearAllBullet(){
        for(var i in this.bulletPool){
            let bullet = this.bulletPool[i]
            bullet.active = false
        }
    },
    fire(point,speed,tag){
        var bullet = this.getBullet()
        bullet.position = point
        bullet.getComponent("Bullet").atkPlayer(speed,tag)
    },

    getBeeMoveTime(p0, p1) {
        var length = cc.pDistance(p0, p1)
        var time = length / this.beeSpeed / 100;
        return time;
    },

    GameOver(){
        this.game_type = GAME_STATE.FAIL
        G.GM.playerDie()
        this.refreshUI()
        this.overLayer.active = true
    },
    GameWin(){
        this.game_type = GAME_STATE.WIN
        this.winLayer.active = true
    },
});