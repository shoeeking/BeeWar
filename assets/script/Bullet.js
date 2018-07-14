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
        },
        speedV:{
            default:7,
        },
    },

    ctor(){
        this.isFight = false
        this.nType = NODE_TYPE.BULLET
        this.speed = cc.v2(0,10)
        // this.node.active = false
        this.isFight = false
        this.masterType = NODE_TYPE.ANY
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
    getSpeed(angle){
        let l = cc.pDistance(angle,cc.v2(0,0))
        if(l==0)return cc.v2(0,0)
        return cc.v2(this.speedV*angle.x/l,this.speedV*angle.y/l)
    },
    atkPlayer(angle,nType){
        this.masterType = nType
        this.collider.tag = this.nType+nType
        this.node.active = true
        this.speed = this.getSpeed(angle)
        this.isFight = true
        this.collider.enabled = true
    },
    onCollisionEnter: function (other, self) {
        // 子弹碰到子弹
        if(other.tag&this.nType)return
        // 同类型子弹
        if(other.tag&this.masterType)return
        this.reset()
    },
    update (dt) {
        if(!this.node.active) return
        this.node.position = cc.pAdd(this.node.position,this.speed)
        if(this.node.position.y<-G.SIZE.height/2){
            this.reset()
        }
    },
});
