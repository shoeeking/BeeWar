// 定义静态常量

// 游戏状态
let GAME_STATE=cc.Enum({
    Normal : 0,
    WIN : 10,
    FAIL : 11
})
// 节点类型
const NODE_TYPE = cc.Enum({
    ANY     : 0B0000,  //可以任意攻击
	PLANE	: 0B0001,  // 飞机
	BEE		: 0B0010,  // 蜜蜂
	BULLET	: 0B0100,  // 子弹
})
// 蜜蜂状态
const BEE_STATE = cc.Enum({
    Normal : 0, 
    ATK : 1, 
    ReDown : 10,  //重新降落
    ReDownRotate : 11, 
    ReDownAtk : 12, 
    Death : 20,
})
// 飞机状态
const PLANE_STATE = cc.Enum({
    Normal:0,
    ATK:1,
    Death:2,
})
// 操作方式
const OPERATION_MODE = cc.Enum({
    BUTTON:0,
    AUTO : 1,
})



module.exports={
	NODE_TYPE : NODE_TYPE,
	BEE_STATE : BEE_STATE,
    PLANE_STATE : PLANE_STATE,
    GAME_STATE : GAME_STATE,
    OM : OPERATION_MODE,
}
