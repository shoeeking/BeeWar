// 通用方法

// 获取场景画布
function getCanvas(){
    let scane = cc.director.getScene()
    let canvas = this.scene.getChildByName("Canvas")
    return canvas
}

function handler(cb,tag,...args){
	return function(){
		cb.apply(tag,args)
	}
}
// 获取窗口大小
function WinSize(){
	return cc.view.getFrameSize()
}
module.exports = {
    getCanvas: getCanvas,
    handler:handler,
};