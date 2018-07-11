// 游戏管理类

var GameManager = cc.Class({
    ctor(){
    	this.level = 1
    },
    levelUp(){
    	this.level += 1
    },
    resetGame(){
    	this.level = 1
    }
});

module.exports=GameManager
