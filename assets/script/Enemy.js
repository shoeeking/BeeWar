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

    start() {
        this.m_type = EnemyState.Normal
        this.m_sprite = this.node.getComponent(cc.Sprite)
        this.lookLock = !0
        this.upDown = !1
        this.isStand = !0
        this.m_firstPos = this.node.position
        this.changeUpDown()
        this.rePlayerFlyAnimation()
    }, 
    reset() {
        this.lookLock = !0
        this.upDown = !1
        this.isStand = !0
        this.isUpDownMove = !1
        this.isFire = !1
        this.node.rotation = 0
    }, 
    setNormal() {
        this.m_type = EnemyState.Normal;
    }, 
    setPlayer(player) {
        this.m_player = player;
    }, 
    runStand() {
        null != this.animationSchedule && this.unschedule(this.animationSchedule), this.m_sprite.spriteFrame = this.m_frame[0];
    }, 
    runATK() {
        null != this.animationSchedule && this.unschedule(this.animationSchedule), this.m_sprite.spriteFrame = this.m_frame[1];
    }, 
    runFly() {
        var self = this
        var tb = [ 0, 1, 0, 2 ]
        var i = 0
        var updateFrame = function() {
            self.m_sprite.spriteFrame = self.m_frame[tb[o]];
        };
        this.animationSchedule = function() {
            if (i < tb.length - 1)
                i++ 
            else 
                i = 0
            updateFrame()
        }
        this.schedule(this.animationSchedule, .4), updateFrame();
    }, 
    rePlayerFlyAnimation() {}, 
    starATK(e, t) {
        console.log("开始攻击",e,t,this.m_firstPos.x )
        this.isStand = !1
        this.runATK()
        this.node.stopAllActions()
        var pos0 = this.node.position
        // var pos1 = this.m_player.position

        var dir1 = 1
        var dir2 = -1
        if(375 > this.m_firstPos.x + 375){
            dir1 = -1
            dir2 = 1
        } 
        var self = this
        var rotateTo1 = cc.rotateTo(.7, 180 * dir1)
        var bezierTo1 = cc.bezierTo(.8, [ 
            cc.pAdd(o, cc.p(0 * a, 85)), 
            cc.pAdd(o, cc.p(83 * a, 85)), 
            cc.pAdd(o, cc.p(83 * a, -20)) 
        ]) 
        var callFunc1 = callFunc(function() {
            self.lookLock = !1;
            var p0 = self.node.position
            var p1 = self.m_player.position;
            e && (n.x += t);
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
            this.fire();
        }, cc.gm.beeFireTime)

        // l.default.playSFX(l.soundList.beeRun);
    }, 
    getBezier() {}, 
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
    changeUpDown() {
        var self = this
        this.scheduleOnce(function() {
            self.upDown = !self.upDown
            self.changeUpDown();
        }, this.upDownTimeSize);
    }, 
    startUpDown() {
        this.isUpDownMove = !0;
    }, 
    upANdDownMove() {
        if (this.isUpDownMove && this.lookLock && this.isStand) {
            var pos = this.node.position;
            this.node.position = this.upDown ? cc.p(pos.x, this.m_firstPos.y + 2) : cc.p(pos.x, this.m_firstPos.y - 2);
        }
    }, 
    update() {
        switch (this.m_type) {
          case EnemyState.Normal:
            break;

          case EnemyState.ReDown:
          case EnemyState.ReDownRotate:
            this.reFightDown();
        }
        if(this.m_type != EnemyState.ReDownAtk){
            this.leftAndRightMove()
            this.upANdDownMove()
        }
        if (!this.lookLock){
            this.lookAtPlayer();
        }
    }, 
    lateUpdate() {
        this.isStand && (cc.gm.beeMoveOffSize = this.m_firstPos.x - this.node.position.x);
    }, 
    onCollisionEnter(self, other) {
        other.node.active = !1, 
        this.node.stopAllActions()
        this.unscheduleAllCallbacks()
        this.m_type = EnemyState.Death, 
        cc.gm.beeBoom_(this.node.position)
        cc.gm.beeDeath(this);
    }, 
    boxShow() {
        console.log("player  调用!");
    }, 
    fire() {
        this.isFire = !0;
        var num = Math.floor(2 + cc.gm.npcBulletNumAdd * GameManage.GetInstance().getLevel());
        num = Math.min(num, 5);
        var func = function(e) {
            cc.gm.beeFire(e);
        }
        for (var n = 0; n < num; n++) 
            this.scheduleOnce(function() {func(this.node);}, .2 * n);
    }, 
    reFight() {
        this.node.position = cc.p(this.m_firstPos.x - cc.gm.beeMoveOffSize, this.m_firstPos.y + 300)
        if(cc.gm.beeDontStop){
            this.m_type = EnemyState.ReDownAtk
            this.downAndAtk()
            // l.default.playSFX(l.soundList.beeRun)
        }else{
            this.m_type = EnemyState.ReDown 
            // l.default.playSFX(l.soundList.beeReset)
        }
        this.reset()
        this.node.active = !0
        this.node.rotation = -180
        this.runATK()
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
            self.rePlayerFlyAnimation();
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
    getMoveTime(e, t) {
        return cc.gm.getBeeMoveTime(e, t);
    },
});
