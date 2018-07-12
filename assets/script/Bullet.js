let NODE_TYPE = require("Constants").NODE_TYPE

cc.Class({
    extends: cc.Component,

    properties: {
        bullet1:{
            default:null,
            type:cc.SpriteFrame,
        },
        bullet2:{
            default:null,
            type:cc.SpriteFrame,
        }
    },

    ctor(){
        this.isFight = false
        this.nType = NODE_TYPE.BULLET
        this.speed = cc.v2(0,10)
        // this.node.active = false
        this.isFight = false
    },
    start () {},
    initBullet(){
        this.collider = this.node.getComponent(cc.BoxCollider)
        this.collider.enabled = false
        this.reset()
    },
    reset(){
        this.node.active = false
        this.isFight = false
        this.collider.enabled = false
    },
    atkPlayer(speed,nType){
        this.collider.tag = this.nType+nType
        console.log("子弹碰撞类型",this.nType+nType)
        this.node.active = true
        this.speed = speed
        this.isFight = true
        this.collider.enabled = true
    },
    onCollisionEnter: function (other, self) {
        if(other.tag&this.nType)return
        this.reset()
    },
    update (dt) {
        if(!this.node.active) return
        this.node.position = cc.pAdd(this.node.position,this.speed)
    },
});
