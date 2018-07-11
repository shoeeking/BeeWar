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
let GAME_STATE = require("Constants")
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
        }
    },

    ctor(){
        cc.core = this
        this.isMoveLeft = true
        this.beeSpeed = 3
        this.bulletPool = []
        this.beeList = []
        this.beeRowList = []
        this.killBee = 0
        this.beeAtkTimeSize = 3
        this.npcBulletNumAdd = .2
        this.game_type = GAME_STATE.Normal
        this.moveX = 0
    },
    start () {
        this.initCollision()
        this.initBee()
        this.registTouch()
        this.winLayer.active = false
        this.overLayer.active = false


        this.scheduleOnce(function() {
            this.atkMgr()
        }, 3.5)
    },
    // 开始游戏
    starGame(){

    },
    // 重新开始
    restart(){
        this.resetBee()
        this.resetPlane()
    },
    // 复活
    relive(){
        this.resetPlane()
    },

    initBee(){
        let pos = cc.v2(-220,400)
        let size = cc.v2(44,44)
        let list = Formation.Normal;
        for(var i=0;i<list.length;i++){
            let line = list[i]
            for(var j=0;j<line.length;j++){
                if(line[j]==0)continue;
                let bee = cc.instantiate(this.pfEnemy)
                let beeScript = bee.getComponent("Enemy")
                bee.position = cc.v2(pos.x+size.x/2+size.x*j,pos.y-size.y/2-size.y*i)
                beeScript.init(line[j],this.Player)
                this.node.addChild(bee)
                this.beeList.push(bee)
                this.beeRowList[j] = this.beeRowList[j]?this.beeRowList[j]:[]
                this.beeRowList[j][i] = bee
            }
        }
    },

    initCollision(){
        // 获取碰撞检测系统
        var manager = cc.director.getCollisionManager();
        // 默认碰撞检测系统是禁用的，如果需要使用则需要以下方法开启碰撞检测系统
        manager.enabled = true;
        // 默认碰撞检测系统的 debug 绘制是禁用的，如果需要使用则需要以下方法开启 debug 绘制
        // manager.enabledDebugDraw = true;
        // 如果还希望显示碰撞组件的包围盒，那么可以通过以下接口来进行设置
        // manager.enabledDrawBoundingBox = true;
    },
    // 触摸层
    registTouch() {
        var self = this 
        this.touchLayer.on(cc.Node.EventType.TOUCH_START, function(event) {
            self.touchCallback(event);
        })
        this.touchLayer.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
            self.touchCallback(event);
        })
        this.touchLayer.on(cc.Node.EventType.TOUCH_CANCEL, function(event) {
            self.touchCallback(event);
        })
        this.touchLayer.on(cc.Node.EventType.TOUCH_END, function(event) {
            self.touchCallback(event);
        });
    },
    touchCallback(event) {
        var pos0 = event.getLocation()
        if(event.type == cc.Node.EventType.TOUCH_START){
            this.touchStartPos = pos0 
        }else if(event.type == cc.Node.EventType.TOUCH_MOVE){
            this.setTouchPlayerPoint(cc.pSub(pos0,this.touchStartPos)) 
        }else if(event.type == cc.Node.EventType.TOUCH_END){
            this.setTouchPlayerPoint(cc.pSub(pos0,this.touchStartPos)) 
        }else if( event.type == cc.Node.EventType.TOUCH_CANCEL){
            this.setTouchPlayerPoint(cc.pSub(pos0,this.touchStartPos)) 
        }   
        this.touchStartPos = pos0 
    },
    setTouchPlayerPoint(os) {
        var x = this.Player.position.x+os.x
        x = Math.min(x, 355)
        x = Math.max(x, -355)
        this.Player.position = cc.p(x, this.Player.position.y)
    },

    update (dt) {
        var posX = this.findBeePos(this.isMoveLeft)
        if ( this.isMoveLeft && posX<-300 ){
             this.isMoveLeft = !this.isMoveLeft
        } else if(!this.isMoveLeft && posX>300){
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
    beeDeath(){
        this.killBee += 1
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
    atkMgr(){
        var self = this;
        if (this.game_type != GAME_STATE.Normal) {
            this.scheduleOnce(function() {
                self.atkMgr()
            }, 1);
            return
        }
        var getBossAtk = function() {
            var list = []
            var formLeft = true
            var n = 100 * Math.random()
            if(50 < n){
                formLeft = false
            }
            var point = cc.p(0, 0)
            var sizes = []

            // BOSS
            if (formLeft){
                for (var r = 0; r < self.beeRowList.length - 1; r++) {
                    var row = self.beeRowList[r]
                    var enemy = row[5]
                    if (null != enemy) {
                        var npc = enemy.getComponent("Enemy");
                        if (enemy.active && npc.isStand && 0 == npc.m_type) {
                            point = enemy.position
                            list.push(enemy)
                            sizes.push(0);
                            break
                        }
                    }
                    if (0 < list.length) break
                } 
            }else{
               for (var r = self.beeRowList.length - 1; 0 <= r; r--) {
                    var row = self.beeRowList[r]
                    var enemy = row[5];
                    if (null != enemy) {
                        var npc = enemy.getComponent("Enemy");
                        if (enemy.active && npc.isStand && 0 == npc.m_type) {
                            point = enemy.position
                            list.push(enemy)
                            sizes.push(0)
                            break;
                        }
                    }
                    if (0 < list.length) break;
                } 
            } 
            if (0 == list.length){
                console.log("没有找到可以使用的boss")
                return {list: [],size: [] }
            } 

            if (formLeft){
                for (var r = 0; r < self.beeRowList.length - 1; r++) {
                    var row = self.beeRowList[r]
                    var enemy = row[4];
                    if (null != enemy) {
                        var npc = enemy.getComponent("Enemy");
                        if(enemy.active && npc.isStand && 0 == npc.m_type && 3 > list.length){
                            list.push(enemy)
                            sizes.push(enemy.position.x - point.x)
                        } 
                    }
                } 
            } else {
                for (var r = self.beeRowList.length - 1; 0 <= r; r--) {
                    var row = self.beeRowList[r]
                    var enemy = row[4]
                    if (null != enemy) {
                        var npc = enemy.getComponent("Enemy")
                        if(enemy.active && npc.isStand && 0 == npc.m_type && 3 > list.length){
                            list.push(enemy)
                            sizes.push(enemy.position.x - point.x)
                        }
                    }
                }
            } 
            return { list: list, size: sizes }
        }
        var getBeeAtk = function() {
            var leftEnemy = null
            for (var i = 0; i < self.beeRowList.length - 1; i++) {
                var list = self.beeRowList[i];
                for (var j = list.length - 1; 0 <= j; j--) {
                    if (null != list[j]) {
                        var npc = list[j].getComponent("Enemy");
                        if (list[j].active && npc.isStand && 0 == npc.m_type) {
                            leftEnemy = list[j];
                            break;
                        }
                    }
                }
                if (null != leftEnemy) break;
            }
            var rightEnemy = null
            for (var i = self.beeRowList.length - 1; 0 <= i; i--) {
                let list = self.beeRowList[i];
                for (var j = list.length - 1; 0 <= j; j--){
                    if (null != list[j]) {
                        var npc = list[j].getComponent("Enemy");
                        if (list[j].active && npc.isStand && 0 == npc.m_type) {
                            rightEnemy = list[j];
                            break;
                        }
                    }
                }
                if (null != rightEnemy) break;
            }
            var list = []
            if(null != leftEnemy){
                list.push(leftEnemy)
            }
            if(null != rightEnemy){
                list.push(rightEnemy)
            }
            return list;
        } 
        var randomValue = 100 * Math.random()
        var atkList = []
        var size = null
        var isBossAtk = false

        if (this.killBee>10 && randomValue<30) {
            isBossAtk = true
            var atkGroup = getBossAtk();
            atkList = atkGroup.list
            size = atkGroup.size 
            if(0 == atkList.length) {
                isBossAtk = false
                atkList = getBeeAtk()
            };
        }else{
            atkList = getBeeAtk()
        } 

        var atkEnemy = null
        if (!isBossAtk) {
            var rValue = 10 * Math.random();
            if(atkList==1){
                atkEnemy = atkList[0]
            }else if(rValue<5){
                atkEnemy = atkList[0]
            }else{
                atkEnemy = atkList[1]
            }
        }
        if (!isBossAtk){
            if(null == atkEnemy){
                console.log("Not Bee ATK ")
            }else if(this.game_type == GAME_STATE.Normal){
                 atkEnemy.getComponent("Enemy").starATK(); 
            }
        } else if (0 == atkList.length){
            console.log("Not Boss ATK "); 
        }else if (this.game_type == GAME_STATE.Normal){
            for (var i in atkList) {
                var enemy = atkList[i]
                enemy.getComponent("Enemy").starATK()
            }
        } 
        var rValue = 0.1 * (10 * Math.random())
        var y = this.beeAtkTimeSize + rValue - this.npcBulletNumAdd*(1 - 1);
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
        bullet.init()
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
        this.overLayer.active = true
    },
    GameWin(){
        this.game_type = GAME_STATE.WIN
        this.winLayer.active = true
    },
});