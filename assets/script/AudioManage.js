// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var soundList = {
    bmg : "bmg.mp3", 
    beeBoom : "beeBoom.mp3", 
    beeReset : "beeReset.mp3", 
    beeRun : "beeRun.mp3", 
    playerBoom : "playerBoom.mp3", 
    shoot : "shoot.mp3", 
    start : "start.mp3",
};
// var Tool = require("Tool");
cc.Class({
    extends: cc.Component,

    properties: {},
    init() {
        this.bgmVolume = 1
        this.sfxVolume = 1 
        this.bgmAudioID = -1
        this._musicOpen = !0
        this._sfxOpen = !0
        cc.game.on(cc.game.EVENT_HIDE, function() {
            console.log("cc.audioEngine.pauseAll")
             cc.audioEngine.pauseAll();
        })
        cc.game.on(cc.game.EVENT_SHOW, function() {
            console.log("cc.audioEngine.resumeAll")
            cc.audioEngine.resumeAll();
        });
        var e = Tool.getData("_musicOpen")
        var t = Tool.getData("_sfxOpen");
        this._musicOpen = "1" == e || null == e, 
        this._sfxOpen = "1" == t || null == t;
    }, 
    getUrl(name) {
        return cc.url.raw("resources/Sound/" + name);
    }, 
    playBGM(name) {
        if (this._musicOpen) {
            var path = this.getUrl(name);
            if(0 <= this.bgmAudioID){
              cc.audioEngine.stop(this.bgmAudioID)
            }
            this.bgmAudioID = cc.audioEngine.play(path, !0, this.bgmVolume);
        }
    }, 
    stopBGM() {
        if(0 <= this.bgmAudioID){
            cc.audioEngine.stop(this.bgmAudioID);
        }       
    }, 
    playSFX(name) {
        if (!1 != this._sfxOpen) {
            var path = this.getUrl(name)
            if (0 < this.sfxVolume) 
                cc.audioEngine.play(path, !1, this.sfxVolume);
        }
    }, 
    pauseAll() {
        cc.audioEngine.pauseAll();
    }, 
    resumeAll() {
        cc.audioEngine.resumeAll();
    }, 
    sFXSwitch(isOpen) {
        this._sfxOpen = isOpen
        Tool.saveData("_sfxOpen", isOpen ? 1 : 0);
    }, 
    mucSwitch(isOpen) {
        this._musicOpen = isOpen
        if(isOpen){
            this.playBGM(soundList.bmg) 
        } else{
            cc.audioEngine.stopAll()
        }
        Tool.saveData("_musicOpen", isOpen ? 1 : 0);
    }, 
    playVioMsg() {}, 
    pushVioMsg() {}, 
    checkPlayVioMsg() {}, 
    setSoundVolume(Volume) {
        this.sfxVolume = Volume
        cc.audioEngine.setVolume(this.bgmAudioID, Volume)
    }, 
    start () {

    },
});
