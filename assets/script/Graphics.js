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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        Player:{
            default:null,
            type:cc.Sprite,
        },
        Enemy:{
            default:null,
            type:cc.Sprite,
        },
        param:{
            default:10
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var startPoint = this.Enemy.node.position
        var endPoint = this.Player.node.position
        var beginPoint = cc.pSub(startPoint,this.node.position)
        var corner1 = 1
        var corner2 = -1
        if(startPoint.x<0){
            corner1 *= -1
            corner2 *= -1
        }
        var o = cc.pSub(endPoint,startPoint)
        var ctx = this.node.getComponent(cc.Graphics);
        ctx.moveTo(beginPoint);
        ctx.bezierCurveTo(
            beginPoint.x+75*corner1,beginPoint.y-120,
            beginPoint.x+o.x+51*corner2, beginPoint.y+o.y+50, 
            beginPoint.x+o.x,beginPoint.y+o.y
        );
        ctx.stroke();
    },

    // update (dt) {},
});
