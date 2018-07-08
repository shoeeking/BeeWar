// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        this.tag = 0B0100
        this.speed = cc.v2(0,10)
    },
    start () {
        let collider = this.node.getComponent(cc.BoxCollider)
        collider.tag = this.tag
    },
    atkPlayer(speed,tag){
        this.speed = speed
        this.isFight = true
        this.tag = tag+this.tag
        let collider = this.node.getComponent(cc.BoxCollider)
        collider.tag = this.tag
    },
    onCollisionEnter: function (other, self) {
        let tag = other.tag
        if(tag&this.tag)return ;
        console.log("Bullet is Collider")
        self.node.active = false
        // // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        // var world = self.world;

        // // 碰撞组件的 aabb 碰撞框
        // var aabb = world.aabb;

        // // 上一次计算的碰撞组件的 aabb 碰撞框
        // var preAabb = world.preAabb;

        // // 碰撞框的世界矩阵
        // var t = world.transform;

        // // 以下属性为圆形碰撞组件特有属性
        // var r = world.radius;
        // var p = world.position;

        // // 以下属性为 矩形 和 多边形 碰撞组件特有属性
        // var ps = world.points;
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

    update (dt) {
        if(!this.isFight) return
        if(this.isDone) return 
        this.node.position = cc.pAdd(this.node.position,this.speed)
    },
});
