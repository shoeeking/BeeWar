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
    init(id,player){
        this.m_player = player
        this.nType = NODE_TYPE.BEE
        this.m_firstPos = this.node.position
        this.collider = this.node.getComponent(cc.BoxCollider)
        this.m_sprite = this.node.getComponent(cc.Sprite)
        this.collider.tag = this.nType
        this.Idle="B"+id
        this.reset()
    },
    start() {
    }, 
    reset() {
        this.m_type = BEE_STATE.Normal
        this.lookLock = true
        this.upDown = false
        this.isStand = true
        this.isUpDownMove = false
        this.isFire = false
        this.node.rotation = 0
        this.node.active = true
        this.node.position = this.m_firstPos
    }, 
    starATK() {
        console.log("开始攻击",this.m_firstPos.x )
        this.isStand = false
        this.node.stopAllActions()
        var pos0 = this.node.position

        var dir1 = 1
        var dir2 = -1
        if(0 > this.m_firstPos.x){
            dir1 = -1
            dir2 = 1
        } 
        var self = this
        var rotateTo1 = cc.rotateTo(.7, 180 * dir1)
        var bezierTo1 = cc.bezierTo(.8, [ 
            cc.pAdd(pos0, cc.p(0 * dir1, 85)), 
            cc.pAdd(pos0, cc.p(83 * dir1, 85)), 
            cc.pAdd(pos0, cc.p(83 * dir1, -20)) 
        ]) 
        var callFunc1 = cc.callFunc(function() {
            self.lookLock = false
            var p0 = self.node.position
            var p1 = self.m_player.position;
            var time = self.getMoveTime(p0, p1)
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
                self.reFight();
            });
            self.node.runAction(cc.sequence(bezierTo2, callFunc2, moveBy2, callFunc3))
            // self.node.runAction(bezierTo2);
        })
        if(this.m_type == BEE_STATE.Normal){
            this.node.runAction(cc.sequence(cc.spawn(rotateTo1, bezierTo1), callFunc1))
        }else{
            this.node.runAction(callFunc1)
        }
        this.scheduleOnce(function() {
            this.fire()
        }, 0.5)

        // l.default.playSFX(l.soundList.beeRun);
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
        var p = this.m_player.position
        var r = this.getAngle(this.node.position.x, this.node.position.y, p.x, p.y)
        this.node.rotation = 180 - r;
    }, 

    leftAndRightMove() {
        if (this.lookLock && this.isStand) {
            var pos = this.node.position;
            this.node.position = cc.core.isMoveLeft ? cc.p(pos.x - .5, pos.y) : cc.p(pos.x + .5, pos.y);
        }
    }, 
    startUpDown() {
        this.isUpDownMove = true;
    }, 
    upAndDownMove() {
        if (this.isUpDownMove && this.lookLock && this.isStand) {
            var pos = this.node.position;
            this.node.position = this.upDown ? cc.p(pos.x, this.m_firstPos.y + 2) : cc.p(pos.x, this.m_firstPos.y - 2);
        }
    }, 
    update() {
        switch (this.m_type) {
          case BEE_STATE.Normal:
            break;
          case BEE_STATE.ReDown:
          case BEE_STATE.ReDownRotate:
            this.reFightDown();
        }


        if(this.m_type != BEE_STATE.ReDownAtk){
            this.leftAndRightMove()
            this.upAndDownMove()
        }
        // 瞄准玩家
        if (!this.lookLock){
            this.lookAtPlayer();
        }
    }, 
    lateUpdate() {
        // this.isStand && (cc.gm.beeMoveOffSize = this.m_firstPos.x - this.node.position.x);
    }, 
    onCollisionEnter(other, self) {
        let tag = other.tag
        if(tag&this.nType)return
        this.node.stopAllActions()
        this.unscheduleAllCallbacks()
        this.die()
    },
    die(){
        if(this.m_type==BEE_STATE.Death)return
        this.m_type = BEE_STATE.Death

        let collider = this.node.getComponent(cc.BoxCollider)
        collider.active = false
        
        cc.core.beeDeath()
        
        this.Clip.play("Boom")
        this.Clip.on("lastframe",function(){
            this.Clip.off("lastframe")
            this.node.active = false
        },this)
        // 
    },
    fire() {
        this.isFire = !0
        var num = Math.floor(2.0)
        num = Math.min(num, 5)
        for (var n = 0; n < num; n++) {
            this.scheduleOnce(function() {
                let point = cc.pAdd(this.node.position,this.bulletNodePoint.position)
                cc.core.fire(point,cc.p(0,-10),this.tag)
            }, 0.2 * n);
        }
    }, 

    reFight() {
        this.node.position = cc.p(this.m_firstPos.x,this.m_firstPos.y + 300)
        // if(cc.gm.beeDontStop){
        //     this.m_type = BEE_STATE.ReDownAtk
        //     this.downAndAtk()
        // }else{
            this.m_type = BEE_STATE.ReDown 
        // }
        this.reset()
        this.node.active = true
        this.node.rotation = -180
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
            var pos1 = cc.gm.player.position 
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
                self.fire();
            }, 1.2 * cc.gm.beeFireTime);
        }, .1);
    }, 
    getMoveTime(p1, p2) {
        return cc.core.getBeeMoveTime(p1, p2);
    },
});
