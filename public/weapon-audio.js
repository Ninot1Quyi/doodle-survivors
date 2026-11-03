'use strict';
// Authored CC0 samples; one distinctive voice for every active weapon.
const WEAPON_AUDIO={
  "pencil": {
    "sample": "weapons/pencil",
    "gain": 0.2,
    "tail": 0.15,
    "interval": 0.2,
    "label": "短木质笔尖发射"
  },
  "book": {
    "sample": "weapons/book",
    "gain": 0.23,
    "tail": 0.4,
    "interval": 0.24,
    "label": "纸页翻动",
    "variants": [
      "weapons/book",
      "weapons/book2",
      "weapons/book3"
    ]
  },
  "lightning": {
    "sample": "weapons/lightning",
    "gain": 0.32,
    "tail": 0.3,
    "interval": 0.24,
    "label": "短电弧"
  },
  "tornado": {
    "sample": "weapons/tornado",
    "gain": 0.29,
    "tail": 0.75,
    "interval": 0.24,
    "label": "宽布料掠风"
  },
  "fire": {
    "sample": "weapons/fire",
    "gain": 0.25,
    "tail": 0.35,
    "interval": 0.24,
    "label": "低沉火球喷发"
  },
  "scissors": {
    "sample": "weapons/scissors",
    "gain": 0.26,
    "tail": 0.35,
    "interval": 0.24,
    "label": "剪刃抽动"
  },
  "ink": {
    "sample": "weapons/ink",
    "gain": 0.27,
    "tail": 0.5,
    "interval": 0.24,
    "label": "下沉墨滴"
  },
  "rose": {
    "sample": "weapons/rose",
    "gain": 0.25,
    "tail": 0.4,
    "interval": 0.24,
    "label": "叶片展开"
  },
  "star": {
    "sample": "weapons/star",
    "gain": 0.24,
    "tail": 0.32,
    "interval": 0.24,
    "label": "上扬星点"
  },
  "plane": {
    "sample": "weapons/plane",
    "gain": 0.25,
    "tail": 0.42,
    "interval": 0.24,
    "label": "轻纸翼掠过"
  },
  "bubble": {
    "sample": "weapons/bubble",
    "gain": 0.23,
    "tail": 0.4,
    "interval": 0.24,
    "label": "弹性泡泡"
  },
  "bell": {
    "sample": "weapons/bell",
    "gain": 0.22,
    "tail": 0.3,
    "interval": 0.24,
    "label": "短铃音"
  },
  "ribbon": {
    "sample": "weapons/ribbon",
    "gain": 0.25,
    "tail": 0.5,
    "interval": 0.24,
    "label": "丝带滑动"
  },
  "frost": {
    "sample": "weapons/frost",
    "gain": 0.23,
    "tail": 0.42,
    "interval": 0.24,
    "label": "冰晶碎光"
  },
  "saber": {
    "sample": "weapons/saber",
    "gain": 0.29,
    "tail": 0.45,
    "interval": 0.24,
    "label": "宽刃切风"
  },
  "lance": {
    "sample": "weapons/lance",
    "gain": 0.29,
    "tail": 0.38,
    "interval": 0.24,
    "label": "尖锐突刺"
  },
  "marble": {
    "sample": "weapons/marble",
    "gain": 0.22,
    "tail": 0.3,
    "interval": 0.24,
    "label": "圆润小珠敲击"
  },
  "yoyo": {
    "sample": "weapons/yoyo",
    "gain": 0.24,
    "tail": 0.43,
    "interval": 0.24,
    "label": "回旋滑音"
  },
  "rocket": {
    "sample": "weapons/rocket",
    "gain": 0.29,
    "tail": 0.65,
    "interval": 0.24,
    "label": "加速升调"
  },
  "firecracker": {
    "sample": "weapons/firecracker",
    "gain": 0.25,
    "tail": 0.25,
    "interval": 0.24,
    "label": "短促爆豆"
  },
  "ruler": {
    "sample": "weapons/ruler",
    "gain": 0.26,
    "tail": 0.55,
    "interval": 0.24,
    "label": "直线光束"
  },
  "prism": {
    "sample": "weapons/prism",
    "gain": 0.24,
    "tail": 0.55,
    "interval": 0.24,
    "label": "折射脉冲"
  },
  "turret": {
    "sample": "weapons/turret",
    "gain": 0.22,
    "tail": 0.18,
    "interval": 0.24,
    "label": "哨塔扳机"
  },
  "foxspirit": {
    "sample": "weapons/foxspirit",
    "gain": 0.26,
    "tail": 0.38,
    "interval": 0.24,
    "label": "狐狸扑跃"
  },
  "mine": {
    "sample": "weapons/mine",
    "gain": 0.29,
    "tail": 0.23,
    "interval": 0.24,
    "label": "地雷短爆"
  },
  "stamp": {
    "sample": "weapons/stamp",
    "gain": 0.34,
    "tail": 0.33,
    "interval": 0.24,
    "label": "厚重印章落地"
  },
  "whip": {
    "sample": "weapons/whip",
    "gain": 0.29,
    "tail": 0.38,
    "interval": 0.24,
    "label": "细鞭抽风"
  },
  "thread": {
    "sample": "weapons/thread",
    "gain": 0.22,
    "tail": 0.3,
    "interval": 0.24,
    "label": "针线拉紧"
  },
  "roller": {
    "sample": "weapons/roller",
    "gain": 0.27,
    "tail": 0.55,
    "interval": 0.24,
    "label": "滚筒擦纸"
  },
  "chalk": {
    "sample": "weapons/chalk",
    "gain": 0.25,
    "tail": 0.45,
    "interval": 0.24,
    "label": "粉笔摩擦"
  },
  "camera": {
    "sample": "weapons/camera",
    "gain": 0.25,
    "tail": 0.28,
    "interval": 0.24,
    "label": "相机快门"
  },
  "music": {
    "sample": "weapons/music",
    "gain": 0.24,
    "tail": 0.6,
    "interval": 0.24,
    "label": "八音琴三音"
  },
  "meteor": {
    "sample": "weapons/meteor",
    "gain": 0.31,
    "tail": 0.75,
    "interval": 0.24,
    "label": "陨星落地"
  },
  "compass": {
    "sample": "weapons/compass",
    "gain": 0.23,
    "tail": 0.38,
    "interval": 0.24,
    "label": "罗盘锁定提示"
  },
  "magnetArm": {
    "sample": "weapons/magnetArm",
    "gain": 0.27,
    "tail": 0.65,
    "interval": 0.24,
    "label": "磁吸下滑音"
  },
  "gear": {
    "sample": "weapons/gear",
    "gain": 0.24,
    "tail": 0.4,
    "interval": 0.24,
    "label": "齿轮扣动"
  },
  "umbrella": {
    "sample": "weapons/umbrella",
    "gain": 0.25,
    "tail": 0.55,
    "interval": 0.24,
    "label": "纸伞撑开"
  },
  "kite": {
    "sample": "weapons/kite",
    "gain": 0.24,
    "tail": 0.55,
    "interval": 0.24,
    "label": "风筝牵线"
  },
  "leaf": {
    "sample": "weapons/leaf",
    "gain": 0.24,
    "tail": 0.4,
    "interval": 0.24,
    "label": "叶片切风"
  },
  "shield": {
    "sample": "weapons/shield",
    "gain": 0.24,
    "tail": 0.45,
    "interval": 0.24,
    "label": "盾面共鸣"
  },
  "portal": {
    "sample": "weapons/portal",
    "gain": 0.3,
    "tail": 0.75,
    "interval": 0.24,
    "label": "折门跃迁"
  },
  "void": {
    "sample": "weapons/void",
    "gain": 0.28,
    "tail": 0.75,
    "interval": 0.24,
    "label": "墨洞吸入"
  },
  "comet": {
    "sample": "weapons/comet",
    "gain": 0.32,
    "tail": 0.8,
    "interval": 0.24,
    "label": "彗星连奏"
  },
  "garden": {
    "sample": "weapons/garden",
    "gain": 0.26,
    "tail": 1.0,
    "interval": 0.24,
    "label": "花园渐盛"
  },
  "aurora": {
    "sample": "weapons/aurora",
    "gain": 0.29,
    "tail": 0.8,
    "interval": 0.24,
    "label": "极光电音上行"
  },
  "tempest": {
    "sample": "weapons/tempest",
    "gain": 0.28,
    "tail": 0.85,
    "interval": 0.24,
    "label": "纸风暴旋涡"
  },
  "nova": {
    "sample": "weapons/nova",
    "gain": 0.32,
    "tail": 0.85,
    "interval": 0.24,
    "label": "星云爆发"
  },
  "dragon": {
    "sample": "weapons/dragon",
    "gain": 0.3,
    "tail": 0.9,
    "interval": 0.24,
    "label": "纸龙长啸"
  },
  "mirror": {
    "sample": "weapons/mirror",
    "gain": 0.23,
    "tail": 1.05,
    "interval": 0.24,
    "label": "长镜面铃响"
  },
  "paladin": {
    "sample": "weapons/paladin",
    "gain": 0.31,
    "tail": 0.85,
    "interval": 0.24,
    "label": "骑士登场"
  },
  "pinball": {
    "sample": "weapons/pinball",
    "gain": 0.25,
    "tail": 0.45,
    "interval": 0.24,
    "label": "弹珠台跳音"
  },
  "festival": {
    "sample": "weapons/festival",
    "gain": 0.29,
    "tail": 0.84,
    "interval": 0.24,
    "label": "烟火连续绽放"
  },
  "rainbowLaser": {
    "sample": "weapons/rainbowLaser",
    "gain": 0.29,
    "tail": 0.9,
    "interval": 0.24,
    "label": "彩虹长光束"
  },
  "clockwork": {
    "sample": "weapons/clockwork",
    "gain": 0.28,
    "tail": 0.85,
    "interval": 0.24,
    "label": "纸城齿轮乐句"
  },
  "printingPress": {
    "sample": "weapons/printingPress",
    "gain": 0.33,
    "tail": 0.4,
    "interval": 0.24,
    "label": "印刷机压合"
  },
  "loom": {
    "sample": "weapons/loom",
    "gain": 0.27,
    "tail": 0.85,
    "interval": 0.24,
    "label": "织机穿梭"
  },
  "livingMural": {
    "sample": "weapons/livingMural",
    "gain": 0.27,
    "tail": 0.9,
    "interval": 0.24,
    "label": "壁画生长乐句"
  },
  "spotlight": {
    "sample": "weapons/spotlight",
    "gain": 0.28,
    "tail": 0.85,
    "interval": 0.24,
    "label": "剧场亮灯"
  },
  "orrery": {
    "sample": "weapons/orrery",
    "gain": 0.28,
    "tail": 0.95,
    "interval": 0.24,
    "label": "星系钟音"
  },
  "scrapColossus": {
    "sample": "weapons/scrapColossus",
    "gain": 0.31,
    "tail": 0.65,
    "interval": 0.24,
    "label": "巨人厚重金属共鸣"
  },
  "skyWhale": {
    "sample": "weapons/skyWhale",
    "gain": 0.28,
    "tail": 1.0,
    "interval": 0.24,
    "label": "云鲸低吟"
  },
  "autumnGuardian": {
    "sample": "weapons/autumnGuardian",
    "gain": 0.28,
    "tail": 0.85,
    "interval": 0.24,
    "label": "秋叶护卫和音"
  },
  "paperCosmos": {
    "sample": "weapons/paperCosmos",
    "gain": 0.31,
    "tail": 1.15,
    "interval": 0.24,
    "label": "宇宙展开长音"
  }
};
