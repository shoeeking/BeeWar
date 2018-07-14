let CST = require("Constants")
let NODE_TYPE = CST.NODE_TYPE
let PLANE_STATE = CST.PLANE_STATE
let OM = CST.OM

cc.Class({
    extends: cc.Component,

    properties: {
        BulletPointNode:{
            default:null,
            type:cc.Node,
            displayName:"Bullet Point",
            tooltip:"子弹初始化位置"
        },
        pfBullet:{
            default:null,
            type:cc.Prefab,
            displayName:"Bullet",
            tooltip:"子弹预制件",
        },
        speedX:{
            default:10,
            tooltip:"横向移动速度"
        },
        Freq:{
            default:1,
            tooltip:"发射子弹频率(秒/次)"
        }
    },
    ctor(){
        this.nType = NODE_TYPE.PLANE
        this.eState = PLANE_STATE.Normal
    },
    start () {
        this.collider = this.node.getComponent(cc.BoxCollider)
        this.animation = this.node.getComponent(cc.Animation);
        this.collider.tag = this.nType
        if(G.GM.isMode(OM.AUTO)){
            // this.startFire(true)
        }
    },
    reset(){
        this.eState = PLANE_STATE.Normal
        this.node.active = true
        this.animation.play("Plane_Idle")
        this.collider.enabled = true
    },
    onCollisionEnter: function (other, self) {
        if(other.tag&this.nType)return
        this.collider.enabled = false
        // this.die()
    },
    canMove(){
        return this.eState==PLANE_STATE.Normal
    },
    move(os,isPoint){
        if(!this.canMove())return 
        var x = this.node.position.x
        var y = this.node.position.y
        if(isPoint){
            x += os.x
        }else if(os.x<0){
            x -= this.speedX
        }else if(os.x>0){
            x += this.speedX
        }
        x = Math.min(x, 320)
        x = Math.max(x, -320)
        this.node.position = cc.p(x, y)
    },
    // update (dt) {},
    startFire(isStart){
        if(isStart&&!this.isFireSchedule){
            this.isFireSchedule = true
            this.schedule(
                this.fire,
                this.Freq,
                cc.macro.REPEAT_FOREVER,
                0
            )
        }else if(!isStart&&this.isFireSchedule){
            this.unschedule(this.fire)
            this.isFireSchedule = false
        }
    },
    fire(){
        if(this.eState!=PLANE_STATE.Normal)return
        cc.core.fire(
            cc.pAdd(this.node.position,this.BulletPointNode.position),
            cc.v2(0,10),
            this.nType
        )
    },
    die(){
        if(this.eState==PLANE_STATE.Death)return
        this.eState = PLANE_STATE.Death
        this.animation.play("Boom")
        this.animation.active = true
        this.animation.on("lastframe",function(){
            this.animation.off("lastframe")
            this.node.active = false
            cc.core.GameOver()
        },this)
    },
});
