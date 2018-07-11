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
    init(){
        this.collider = this.node.getComponent(cc.BoxCollider)
        this.clear()
    },
    clear(){
        this.node.active = false
        this.isFight = false
        this.collider.tag = this.nType
    },
    atkPlayer(speed,nType){
        this.node.active = true
        this.speed = speed
        this.isFight = true
        this.nType = nType+this.nType
        this.collider.tag = this.nType
    },
    onCollisionEnter: function (other, self) {
        if(other.tag&this.nType)return
        this.clear()
    },
    update (dt) {
        if(!this.node.active) return
        this.node.position = cc.pAdd(this.node.position,this.speed)
    },
});
