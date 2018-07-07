// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var EnemyState = cc.Enum({
    Normal : 0, 
    ATK : 1, 
    ReDown : 10, 
    ReDownRotate : 11, 
    ReDownAtk : 12, 
    Death : 20,
})
cc.Class({
    extends: cc.Component,
    properties:{
        bulletNodePoint:{
            default:null,
            type:cc.Node,
            displayName:"Bullet Point",
            tooltip:"子弹初始化位置"
        },
        pfBullet:{
            default:null,
            type:cc.Prefab,
            displayName:"Bullet",
            tooltip:"子弹预制件"
        },
    },
    init(id,player){
        this.m_player = player
    },
    start() {
        this.m_type = EnemyState.Normal
        this.m_sprite = this.node.getComponent(cc.Sprite)
        this.lookLock = !0
        this.upDown = !1
        this.isStand = !0
        this.m_firstPos = this.node.position
    }, 
    reset() {
        this.lookLock = !0
        this.upDown = !1
        this.isStand = !0
        this.isUpDownMove = !1
        this.isFire = !1
        this.node.rotation = 0
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
            self.lookLock = !1;
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
                self.lookLock = !0;
            })
            var callFunc3 = cc.callFunc(function() {
                self.node.active = !1, self.reFight();
            });
            self.node.runAction(cc.sequence(bezierTo2, callFunc2, moveBy2, callFunc3))
            // self.node.runAction(bezierTo2);
        })
        if(this.m_type == EnemyState.Normal){
            this.node.runAction(cc.sequence(cc.spawn(rotateTo1, bezierTo1), callFunc1))
        }else{
            this.node.runAction(callFunc1)
        }
        this.scheduleOnce(function() {
            this.fire()
        }, 0.5)

        // l.default.playSFX(l.soundList.beeRun);
    }, 
    getAngle(e, i, p, d) {
        var s = a(e - p), l = a(i - d), u = o(n(s, 2) + n(l, 2)), c = Math.acos(l / u), m = r(180 / (t / c));
        return p > e && d > i && (m = 180 - m), p == e && d > i && (m = 180), p > e && d == i && (m = 90), 
        p < e && d > i && (m = 180 + m), p < e && d == i && (m = 270), p < e && d < i && (m = 360 - m), 
        m;
    }, 
    lookAtPlayer() {
        var p = this.m_player.position
        var r = this.getAngle(this.node.position.x, this.node.position.y, p.x, p.y)
        this.node.rotation = 180 - r;
    }, 
    leftAndRightMove() {
        if (this.lookLock && this.isStand && !cc.gm.moveStop) {
            var pos = this.node.position;
            this.node.position = cc.gm.moveType ? cc.p(pos.x - .5, pos.y) : cc.p(pos.x + .5, pos.y);
        }
    }, 
    startUpDown() {
        this.isUpDownMove = !0;
    }, 
    upAndDownMove() {
        if (this.isUpDownMove && this.lookLock && this.isStand) {
            var pos = this.node.position;
            this.node.position = this.upDown ? cc.p(pos.x, this.m_firstPos.y + 2) : cc.p(pos.x, this.m_firstPos.y - 2);
        }
    }, 
    update() {
        // switch (this.m_type) {
        //   case EnemyState.Normal:
        //     break;
        //   case EnemyState.ReDown:
        //   case EnemyState.ReDownRotate:
        //     this.reFightDown();
        // }
        // if(this.m_type != EnemyState.ReDownAtk){
        //     this.leftAndRightMove()
        //     this.upAndDownMove()
        // }
        // if (!this.lookLock){
        //     this.lookAtPlayer();
        // }
    }, 
    lateUpdate() {
        // this.isStand && (cc.gm.beeMoveOffSize = this.m_firstPos.x - this.node.position.x);
    }, 
    onCollisionEnter(other, self) {
        // this.node.active = false
        this.node.stopAllActions()

        // this.unscheduleAllCallbacks()
        // this.m_type = EnemyState.Death, 
        // cc.gm.beeBoom_(this.node.position)
        // cc.gm.beeDeath(this);
        this.starATK()
    },
    fire() {
        this.isFire = !0
        var num = Math.floor(2.0)
        num = Math.min(num, 5)
        for (var n = 0; n < num; n++) {
            this.scheduleOnce(function() {
                let point = cc.pAdd(this.node.position,this.bulletNodePoint.position)
                cc.core.fire(point,cc.p(0,-10))
            }, 0.2 * n);
        }
    }, 

    reFight() {
        this.node.position = cc.p(this.m_firstPos.x - cc.gm.beeMoveOffSize, this.m_firstPos.y + 300)
        if(cc.gm.beeDontStop){
            this.m_type = EnemyState.ReDownAtk
            this.downAndAtk()
        }else{
            this.m_type = EnemyState.ReDown 
        }
        this.reset()
        this.node.active = !0
        this.node.rotation = -180
    }, 
    reFightDown() {
        var pos = this.node.position
        if(this.node.position.y > this.m_firstPos.y + 3) { 
            this.node.position = cc.p(pos.x, pos.y - 3) 
        }else{ 
            this.node.position = cc.p(pos.x, this.m_firstPos.y)
            this.m_type = EnemyState.Normal
        } 
        if(this.m_type == EnemyState.ReDown && this.node.position.y < this.m_firstPos.y + 100){
            this.m_type = EnemyState.ReDownRotate
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
    downAndAtk() {
        var self = this;
        this.scheduleOnce(function() {
            self.lookLock = !1;
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
                self.lookLock = !0;
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
