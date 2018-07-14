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
        interval:1/60,
        isRepeat:false,
    },
    ctor(){
        this.isTouch = false
        this.callback = null
        this.target = null
    },
    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, this._TOUCH_START,this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._TOUCH_MOVE,this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._TOUCH_CANCEL,this)
        this.node.on(cc.Node.EventType.TOUCH_END, this._TOUCH_END,this)
    },
    _TOUCH_START(){
        this.startSchedule()
    },
    _TOUCH_MOVE(){

    },
    _TOUCH_CANCEL(){
        this.stopSchedule()
    },
    _TOUCH_END(){
        this.stopSchedule()
    },
    startSchedule(dt){
        if(this.isTouch)return
        this.isTouch = true
        let delay = 0
        if(this.lastTime&&this.isRepeat){
            delay = Date.now()-this.lastTime
            delay = Math.max(delay,0)
            if(delay>this.interval*1000){
                delay = 0
            }
        }
        this.schedule(this.updateTouch,this.interval,cc.macro.REPEAT_FOREVER,delay/1000)
        // 当delay==0时，默认延迟interval执行
        if(delay==0){
            this.updateTouch()            
        }
    },  
    stopSchedule(){
        if(this.isTouch){
            this.unschedule(this.updateTouch)
            this.isTouch = false
        }
    },
    updateTouch(){
        if(this.callback){
            this.callback.apply(this.target,[this.node])
            if(this.isRepeat){
                this.lastTime = Date.now()
            }
        }
    },
    on(cb,target){
        this.callback = cb
        this.target = target
    }

    // update (dt) {},
});
