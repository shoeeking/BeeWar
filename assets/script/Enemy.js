let CST = require("Constants")
let NODE_TYPE = CST.NODE_TYPE
let BEE_STATE = CST.BEE_STATE

cc.Class({
    extends: cc.Component,
    properties:{
        bulletNodePoint:{
            default:null,
            type:cc.Node,
            displayName:"Bullet Point",
            tooltip:"子弹初始化位置"
        },
        Clip:{
            default:null,
            type:cc.Animation,
        }
    },
    ctor(){
        this.id = 1
        this.tiled = cc.v2(0,0)
    },
    init(id,player,x,y){
        this.id = id
        this.tiled = cc.v2(x,y)
        this.mPlayer = player
        this.nType = NODE_TYPE.BEE
        this.m_firstPos = this.node.position
        this.collider = this.node.getComponent(cc.BoxCollider)
        this.m_sprite = this.node.getComponent(cc.Sprite)
        this.collider.tag = this.nType
        this.Idle="B"+id
        this.reset()
    },
    getTiled(){
        return cc.v2(this.tiled.x,this.tiled.y)
    },
    start() {
    }, 
    reset() {
        this.node.stopAllActions()
        this.unscheduleAllCallbacks()
        this.m_type = BEE_STATE.Normal
        this.lookLock = true
        this.offsetX = 0
        this.isStand = true
        this.isFire = false
        this.node.rotation = 0
        this.node.active = true
        this.node.position = this.m_firstPos
        this.node.rotation = 0
        this.Clip.play(this.Idle)
    },
    update() {
        switch (this.m_type) {
          case BEE_STATE.Normal:
            break;
          case BEE_STATE.ReDown:
          case BEE_STATE.ReDownRotate:
            this.reFightDown();
        }

        // 瞄准玩家
        if (!this.lookLock){
            this.lookAtPlayer();
        }
    },

    canATK(){
        return this.node.active && this.isStand && BEE_STATE.Normal==this.m_type
    },
    // 开始攻击
    starATK(offset) {
        this.isStand = false
        this.node.stopAllActions()
        var pos0 = this.node.position

        var dir1 = 1
        var dir2 = -1
        if( 0>this.m_firstPos.x ){
            dir1 = -1
            dir2 = 1
        }
        let self = this
        this.moveOut(dir1,function(){
            self.hit(dir1,dir2,offset)
        })
        this.scheduleOnce(function() {
            this.fire()
        }, 1.0)

        // l.default.playSFX(l.soundList.beeRun);
    }, 
    moveOut(dir,cb){
        var pos = this.node.position
        var rotateTo1 = cc.rotateTo(.7, 180 * dir)
        var bezierTo1 = cc.bezierTo(.8, [ 
            cc.pAdd(pos, cc.p(0 * dir, 85)), 
            cc.pAdd(pos, cc.p(83 * dir, 85)), 
            cc.pAdd(pos, cc.p(83 * dir, -20)) 
        ]) 
        var callFunc1 = cc.callFunc(cb)
        if(this.m_type == BEE_STATE.Normal){
            this.node.runAction(cc.sequence(cc.spawn(rotateTo1, bezierTo1), callFunc1))
        }else{
            cb()
        }
    },
    hit(dir1,dir2,offset){
        var self = this
        offset = offset?offset:cc.v2(0,0)
        this.lookLock = false
        var p0 = this.node.position
        var p1 = cc.pAdd(this.mPlayer.position,offset)
        var time = this.getMoveTime(p0, p1)
        var bezierTo2 = cc.bezierTo(time, [ 
            cc.pAdd(p0, cc.p(75 * dir1, -120)), 
            cc.pAdd(p1, cc.p(51 * dir2, 50)), 
            p1 
        ])
        var moveBy2 = cc.moveBy(.6, cc.p(0, -150))
        var callFunc2 = cc.callFunc(function() {
            self.lookLock = true
        })
        var callFunc3 = cc.callFunc(function() {
            self.node.active = false
            self.reFight()
        });
        this.node.runAction(cc.sequence(bezierTo2, callFunc2, moveBy2, callFunc3))
    },
    // 头瞄准玩家
    getAngle(x0, y0, x1, y1) {
        var x = Math.abs(x0 - x1)
        var y = Math.abs(y0 - y1)
        var s = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
        var cosA = Math.acos(y / s)
        var angle = Math.floor(180 / (Math.PI / cosA));
        if(x1 > x0 && y1 > y0){
            angle = 180 - angle
        }else if(x1 == x0 && y1 > y0){
            angle = 180
        }else if(x1 > x0 && y1 == y0){
            angle = 90
        }else if(x1 < x0 && y1 > y0){
            angle = 180 + angle
        } else if(x1 < x0 && y1 == y0){
            angle = 270
        }  else if(x1 < x0 && y1 < y0){
            angle = 360 - angle
        } 
        return angle
    },
    lookAtPlayer() {
        var p = this.mPlayer.position
        var angle = this.getAngle(this.node.position.x, this.node.position.y, p.x, p.y)
        this.node.rotation = 180-angle;
    }, 
    // 左右移动
    leftAndRightMove(offX) {
        this.offsetX = offX
        if (this.lookLock && this.isStand && this.m_type!=BEE_STATE.ReDownAtk) {
            this.node.position = cc.p(this.m_firstPos.x + offX, this.node.position.y);
        }
    },

    reFight() {
        this.isStand = true
        this.node.position = cc.p(this.m_firstPos.x+this.offsetX,this.m_firstPos.y + 300)
        // if(cc.gm.beeDontStop){
        //     this.m_type = BEE_STATE.ReDownAtk
        //     this.downAndAtk()
        // }else{
            this.m_type = BEE_STATE.ReDown 
        // }
        this.node.active = true
        this.node.rotation = 0
    },
    reFightDown() {
        var pos = this.node.position
        if(this.node.position.y > this.m_firstPos.y + 3) { 
            this.node.position = cc.p(pos.x, pos.y - 3) 
        }else{ 
            this.node.position = cc.p(pos.x, this.m_firstPos.y)
            this.m_type = BEE_STATE.Normal
        } 
        if(this.m_type == BEE_STATE.ReDown && this.node.position.y < this.m_firstPos.y + 100){
            this.m_type = BEE_STATE.ReDownRotate
            this.reFightRotation()
        } 
    }, 

    onCollisionEnter(other, self) {
        let tag = other.tag
        if(tag&this.nType)return
        // console.log("碰撞类型",tag,this.nType)
        this.node.stopAllActions()
        this.unscheduleAllCallbacks()
        this.die()
    },
    die(){
        if(this.m_type==BEE_STATE.Death)return
        this.m_type = BEE_STATE.Death
        this.lookLock = true

        let collider = this.node.getComponent(cc.BoxCollider)
        collider.active = false
        
        cc.core.beeDeath(this.id)
        
        this.Clip.play("Boom")
        this.Clip.on("lastframe",function(){
            this.Clip.off("lastframe")
            this.node.active = false
        },this)
        // 
    },
    fire() {
        this.isFire = true
        let runIndex = 0
        // 子弹数量
        let num = Math.floor(this.id*0.1+G.GM.getLevel()*Math.random())
        num = Math.max(num,1)
        num = Math.min(num,5)
        // 子弹间隔
        let gaps = [0.2,0.2,0.2,0.15,0.15,0.13]
        let gap = gaps[num]
        // 子弹时间
        var time = this.getMoveTime(this.node.position, this.mPlayer.position)*0.4/num
        for (var i = 0; i < num; i++) {
            this.scheduleOnce(function() {
                runIndex++
                let point = cc.pAdd(this.node.position,this.bulletNodePoint.position)
                let pos = this.mPlayer.position
                let pos1 = cc.pSub(pos,point)
                pos1.x *= (1.0-gap*runIndex)
                pos1.y *= 1.1
                cc.core.fire(point,pos1,this.nType)
            }, time*i);
        }
    }, 
 
    reFightRotation() {
        var self = this 
        var rotateTo1 = cc.rotateTo(.8, 0)
        var callFunc1 = cc.callFunc(function() {
        });
        this.node.runAction(cc.sequence(rotateTo1, callFunc1))
    }, 
    // 继续下落攻击
    downAndAtk() {
        var self = this;
        this.scheduleOnce(function() {
            self.lookLock = false;
            var pos0 = this.node.position
            var pos1 = this.mPlayer.position 
            var time = this.getMoveTime(pos1, pos0)
            var dir0 = 1
            var dir1 = -1
            if(0 < pos0.x){
                dir0 = -1
                dir1 = 1
            } 
            var bezierTo0 = cc.bezierTo(time, [ 
                cc.pAdd(pos0, cc.p(200 * dir0, -270)), 
                cc.pAdd(pos1, cc.p(-200 * dir1, 350)), 
                pos1 
            ])
            var callFunc0 = cc.callFunc(function() {
                self.lookLock = true;
            })
            var moveBy0 = cc.moveBy(.6, cc.p(0, -120)) 
            var callFunc1 = cc.callFunc(function() {
                self.node.active = !1, self.reFight();
            })
            this.node.runAction(cc.sequence(bezierTo0, callFunc0, moveBy0, callFunc1))
            this.scheduleOnce(function() {
                self.fire()
            }, 1.2 * cc.gm.beeFireTime);
        }, .1);
    }, 
    getMoveTime(p1, p2) {
        return cc.core.getBeeMoveTime(p1, p2);
    },
});
