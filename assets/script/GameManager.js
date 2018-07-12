// 游戏管理类
let Formation = require("table/formation")
var GameManager = cc.Class({
    ctor(){
    	this.level = 1
    	this.life = 1
    	this.score = 0
        this.killAllBee = 0
        this.levelKillBee = 0

    	this.armyList = {}
    	this.curArmy = this.formatArmy("Normal")
    },
    reset(){
        this.level = 1
        this.life = 1
        this.score = 0
        this.killAllBee = 0
        this.levelKillBee = 0
    },
    formatArmy(name){
    	this.armyName = "Normal"
		var map = Formation[name]
		var info = {
			width : map[0].length,
			height : map.length,
			map : map,
			beeList:{}
		}
		for(var i=0;i<map.length;i++){
			for(var j=0;j<map[i].length;j++){
				let v = map[i][j]
				if(v>0){
					info.beeList[v] = info.beeList[v]?info.beeList[v]:{max:0,die:0}
					info.beeList[v].max+=1
				}
			}
		}
		return info
    },

    // 通关
    levelUp(){
    	this.level += 1
    },
    // 重新开始
    restartGame(){
        this.reset()
        this.resetBee()
    },
    // 复活
    relive(){
        this.life -= 1
        if(this.life<0){
            this.life = 0
        }
    },
    // 重置蜜蜂
    resetBee(){
        let list = this.curArmy.beeList
        for(var i in list){
            var data = list[i]
            data.die = 0
        }
    },

    layout(){
    	return this.curArmy.map
    },
    getWidth(){
    	return this.curArmy.width
    },
    getHeight(){
    	return this.curArmy.height
    },
    getBee(id){
    	return this.curArmy.beeList[id]
    },
    getLife(){
    	return this.life
    },
    getScore(){
    	return this.score
    },
    getLevel(){
    	return this.level
    },
    getKillNum(){
        return this.levelKillBee
    },
    getAllKillNum(){
        return this.killAllBee
    },

    beeDeath(id){
    	this.curArmy.beeList[id].die += 1
    	this.score += id
    	this.killAllBee += 1
    	this.levelKillBee += 1
    },
    playerDie(){},

    isWin(){
        let list = this.curArmy.beeList
        for(var i in list){
            var data = list[i]
            if(data.die<data.max){
                return false
            }
        }
        return true
    },
});

module.exports=GameManager
