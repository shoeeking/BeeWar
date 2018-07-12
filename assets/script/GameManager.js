// 游戏管理类
let Formation = require("table/formation")
var GameManager = cc.Class({
    ctor(){
    	this.level = 1
    	this.life = 1
    	this.score = 0
    	this.node = null
    	this.armyList = {}
    	this.killAllBee = 0
    	this.levelKillBee = 0
    	this.curArmy = this.formatArmy("Normal")
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
    levelUp(){
    	this.level += 1
    },
    resetGame(){
    	this.level = 1
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
    	let num = this.curArmy[id]
    	return num?num : 0
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

    beeDeath(id){
    	this.curArmy.beeList[id].die += 1
    	this.score += id
    	this.killAllBee += 1
    	this.levelKillBee += 1
    },
    getKillNum(){
    	return this.levelKillBee
    },
    getAllKillNum(){
    	return this.killAllBee
    }
});

module.exports=GameManager
