

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
function WinSize(){
	return cc.view.getFrameSize()
}
module.exports = {
    getCanvas: getCanvas,
    handler:handler,
};