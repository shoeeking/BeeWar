
let NODE_TYPE = require("Constants").NODE_TYPE

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
    },
    start () {
        let collider = this.node.getComponent(cc.BoxCollider)
        collider.tag = this.nType
        let self = this
        this.schedule(function(){
            self.fire()
        },this.Freq,cc.macro.REPEAT_FOREVER,0)
    },
    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        let tag = other.tag
        if(tag&this.tag)return ;

    },
    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay: function (other, self) {
        // console.log('on collision stay');
    },
    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function (other, self) {
        // console.log('on collision exit');
    },
    // update (dt) {},
    fire(){
        cc.core.fire(
            cc.pAdd(this.node.position,this.BulletPointNode.position),
            cc.v2(0,10),
            this.tag
        )
    },
});
