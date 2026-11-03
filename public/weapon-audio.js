'use strict';
// Single-source CC0 launch sounds, grouped by material for impact routing.
// Matching physical actions intentionally share source families.
const WEAPON_AUDIO={
  "pencil": {
    "sample": "weapons/pencil",
    "gain": 0.3,
    "tail": 0.124,
    "interval": 0.14,
    "label": "彩铅短促掠纸",
    "material": "paper"
  },
  "book": {
    "sample": "weapons/book",
    "gain": 0.25,
    "tail": 0.515,
    "interval": 0.24,
    "label": "纸页翻动",
    "variants": [
      "weapons/book",
      "weapons/book2",
      "weapons/book3"
    ],
    "material": "paper"
  },
  "lightning": {
    "sample": "weapons/lightning",
    "gain": 0.26,
    "tail": 0.412,
    "interval": 0.24,
    "label": "短电弧",
    "material": "electric"
  },
  "tornado": {
    "sample": "weapons/tornado",
    "gain": 0.25,
    "tail": 0.416,
    "interval": 0.24,
    "label": "宽布料掠风",
    "material": "paper"
  },
  "fire": {
    "sample": "weapons/fire",
    "gain": 0.26,
    "tail": 0.482,
    "interval": 0.24,
    "label": "火球短喷",
    "material": "fire"
  },
  "scissors": {
    "sample": "weapons/scissors",
    "gain": 0.26,
    "tail": 0.268,
    "interval": 0.24,
    "label": "剪刃短切",
    "material": "cut"
  },
  "ink": {
    "sample": "weapons/ink",
    "gain": 0.25,
    "tail": 0.527,
    "interval": 0.24,
    "label": "下沉墨滴",
    "material": "ink"
  },
  "rose": {
    "sample": "weapons/rose",
    "gain": 0.25,
    "tail": 0.512,
    "interval": 0.24,
    "label": "叶片展开",
    "material": "nature"
  },
  "star": {
    "sample": "weapons/star",
    "gain": 0.2,
    "tail": 0.153,
    "interval": 0.24,
    "label": "纸星轻铃",
    "material": "music"
  },
  "plane": {
    "sample": "weapons/plane",
    "gain": 0.25,
    "tail": 0.532,
    "interval": 0.24,
    "label": "轻纸翼掠过",
    "material": "paper"
  },
  "bubble": {
    "sample": "weapons/bubble",
    "gain": 0.25,
    "tail": 0.512,
    "interval": 0.24,
    "label": "弹性泡泡",
    "material": "ink"
  },
  "bell": {
    "sample": "weapons/bell",
    "gain": 0.2,
    "tail": 0.153,
    "interval": 0.24,
    "label": "短铃音",
    "material": "music"
  },
  "ribbon": {
    "sample": "weapons/ribbon",
    "gain": 0.25,
    "tail": 0.37,
    "interval": 0.24,
    "label": "丝带滑动",
    "material": "paper"
  },
  "frost": {
    "sample": "weapons/frost",
    "gain": 0.25,
    "tail": 0.248,
    "interval": 0.24,
    "label": "冰晶细碎触发",
    "material": "frost"
  },
  "saber": {
    "sample": "weapons/saber",
    "gain": 0.26,
    "tail": 0.566,
    "interval": 0.24,
    "label": "宽刃挥切",
    "material": "cut"
  },
  "lance": {
    "sample": "weapons/lance",
    "gain": 0.26,
    "tail": 0.145,
    "interval": 0.24,
    "label": "尖刺前掠",
    "material": "cut"
  },
  "marble": {
    "sample": "weapons/marble",
    "gain": 0.26,
    "tail": 0.252,
    "interval": 0.24,
    "label": "石珠短碰",
    "material": "crush"
  },
  "yoyo": {
    "sample": "weapons/yoyo",
    "gain": 0.26,
    "tail": 0.145,
    "interval": 0.24,
    "label": "回旋掠风",
    "material": "cut"
  },
  "rocket": {
    "sample": "weapons/rocket",
    "gain": 0.26,
    "tail": 0.682,
    "interval": 0.24,
    "label": "火箭喷射",
    "material": "fire"
  },
  "firecracker": {
    "sample": "weapons/firecracker",
    "gain": 0.42,
    "tail": 0.4,
    "interval": 0.09,
    "label": "实录短促鞭炮爆裂",
    "material": "fire"
  },
  "ruler": {
    "sample": "weapons/ruler",
    "gain": 0.26,
    "tail": 0.662,
    "interval": 0.24,
    "label": "直线光束",
    "material": "electric"
  },
  "prism": {
    "sample": "weapons/prism",
    "gain": 0.26,
    "tail": 0.662,
    "interval": 0.24,
    "label": "折射脉冲",
    "material": "electric"
  },
  "turret": {
    "sample": "weapons/turret",
    "gain": 0.3,
    "tail": 0.292,
    "interval": 0.14,
    "label": "哨塔扳机",
    "material": "paper"
  },
  "foxspirit": {
    "sample": "weapons/foxspirit",
    "gain": 0.25,
    "tail": 0.495,
    "interval": 0.24,
    "label": "狐狸扑跃",
    "material": "nature"
  },
  "mine": {
    "sample": "weapons/mine",
    "gain": 0.26,
    "tail": 0.075,
    "interval": 0.24,
    "label": "地雷短爆",
    "material": "fire"
  },
  "stamp": {
    "sample": "weapons/stamp",
    "gain": 0.26,
    "tail": 0.272,
    "interval": 0.24,
    "label": "厚重印章落地",
    "material": "crush"
  },
  "whip": {
    "sample": "weapons/whip",
    "gain": 0.26,
    "tail": 0.41800000000000004,
    "interval": 0.24,
    "label": "实录软鞭掠风与鞭梢",
    "material": "cut",
    "variants": [
      "weapons/whip",
      "weapons/whip2",
      "weapons/whip3"
    ]
  },
  "thread": {
    "sample": "weapons/thread",
    "gain": 0.25,
    "tail": 0.274,
    "interval": 0.24,
    "label": "针线拉紧",
    "material": "paper"
  },
  "roller": {
    "sample": "weapons/roller",
    "gain": 0.25,
    "tail": 0.205,
    "interval": 0.24,
    "label": "滚筒擦纸",
    "material": "paper"
  },
  "chalk": {
    "sample": "weapons/chalk",
    "gain": 0.25,
    "tail": 0.204,
    "interval": 0.24,
    "label": "粉笔摩擦",
    "material": "paper"
  },
  "camera": {
    "sample": "weapons/camera",
    "gain": 0.26,
    "tail": 0.249,
    "interval": 0.24,
    "label": "相机快门",
    "material": "crush"
  },
  "music": {
    "sample": "weapons/music",
    "gain": 0.2,
    "tail": 0.539,
    "interval": 0.24,
    "label": "八音琴三音",
    "material": "music"
  },
  "meteor": {
    "sample": "weapons/meteor",
    "gain": 0.26,
    "tail": 0.862,
    "interval": 0.24,
    "label": "陨星落地",
    "material": "fire"
  },
  "compass": {
    "sample": "weapons/compass",
    "gain": 0.26,
    "tail": 0.232,
    "interval": 0.24,
    "label": "罗盘机械扣定",
    "material": "crush"
  },
  "magnetArm": {
    "sample": "weapons/magnetArm",
    "gain": 0.26,
    "tail": 0.444,
    "interval": 0.24,
    "label": "磁吸下滑音",
    "material": "electric"
  },
  "gear": {
    "sample": "weapons/gear",
    "gain": 0.26,
    "tail": 0.249,
    "interval": 0.24,
    "label": "齿轮短扣",
    "material": "crush"
  },
  "umbrella": {
    "sample": "weapons/umbrella",
    "gain": 0.25,
    "tail": 0.165,
    "interval": 0.24,
    "label": "纸伞撑开",
    "material": "paper"
  },
  "kite": {
    "sample": "weapons/kite",
    "gain": 0.25,
    "tail": 0.592,
    "interval": 0.24,
    "label": "风筝牵线",
    "material": "paper"
  },
  "leaf": {
    "sample": "weapons/leaf",
    "gain": 0.26,
    "tail": 0.173,
    "interval": 0.24,
    "label": "薄叶掠切",
    "material": "cut"
  },
  "shield": {
    "sample": "weapons/shield",
    "gain": 0.26,
    "tail": 0.562,
    "interval": 0.24,
    "label": "盾面共鸣",
    "material": "electric"
  },
  "portal": {
    "sample": "weapons/portal",
    "gain": 0.26,
    "tail": 0.862,
    "interval": 0.24,
    "label": "折门跃迁",
    "material": "electric"
  },
  "void": {
    "sample": "weapons/void",
    "gain": 0.25,
    "tail": 0.862,
    "interval": 0.24,
    "label": "墨洞吸入",
    "material": "ink"
  },
  "comet": {
    "sample": "weapons/comet",
    "gain": 0.26,
    "tail": 0.685,
    "interval": 0.24,
    "label": "彗星火尾",
    "material": "fire"
  },
  "garden": {
    "sample": "weapons/garden",
    "gain": 0.25,
    "tail": 0.582,
    "interval": 0.32,
    "label": "花叶舒展",
    "material": "nature"
  },
  "aurora": {
    "sample": "weapons/aurora",
    "gain": 0.26,
    "tail": 0.412,
    "interval": 0.24,
    "label": "极光短电弧",
    "material": "electric"
  },
  "tempest": {
    "sample": "weapons/tempest",
    "gain": 0.25,
    "tail": 0.139,
    "interval": 0.24,
    "label": "宽纸风暴",
    "material": "paper"
  },
  "nova": {
    "sample": "weapons/nova",
    "gain": 0.26,
    "tail": 0.962,
    "interval": 0.24,
    "label": "星云爆发",
    "material": "fire"
  },
  "dragon": {
    "sample": "weapons/dragon",
    "gain": 0.25,
    "tail": 0.416,
    "interval": 0.24,
    "label": "纸龙展开掠风",
    "material": "paper"
  },
  "mirror": {
    "sample": "weapons/mirror",
    "gain": 0.25,
    "tail": 1.135,
    "interval": 0.24,
    "label": "长镜面铃响",
    "material": "frost"
  },
  "paladin": {
    "sample": "weapons/paladin",
    "gain": 0.26,
    "tail": 0.732,
    "interval": 0.24,
    "label": "骑士刀刃出击",
    "material": "cut"
  },
  "pinball": {
    "sample": "weapons/pinball",
    "gain": 0.26,
    "tail": 0.206,
    "interval": 0.24,
    "label": "弹珠短碰",
    "material": "crush"
  },
  "festival": {
    "sample": "weapons/festival",
    "gain": 0.26,
    "tail": 0.432,
    "interval": 0.24,
    "label": "烟火实录短爆",
    "material": "fire"
  },
  "rainbowLaser": {
    "sample": "weapons/rainbowLaser",
    "gain": 0.26,
    "tail": 0.843,
    "interval": 0.24,
    "label": "彩虹长光束",
    "material": "electric"
  },
  "clockwork": {
    "sample": "weapons/clockwork",
    "gain": 0.26,
    "tail": 0.249,
    "interval": 0.24,
    "label": "纸城机械合拢",
    "material": "crush"
  },
  "printingPress": {
    "sample": "weapons/printingPress",
    "gain": 0.26,
    "tail": 0.229,
    "interval": 0.24,
    "label": "印刷机压合",
    "material": "crush"
  },
  "loom": {
    "sample": "weapons/loom",
    "gain": 0.25,
    "tail": 0.274,
    "interval": 0.24,
    "label": "织机拉线",
    "material": "paper"
  },
  "livingMural": {
    "sample": "weapons/livingMural",
    "gain": 0.25,
    "tail": 0.257,
    "interval": 0.32,
    "label": "纸页壁画舒展",
    "material": "paper"
  },
  "spotlight": {
    "sample": "weapons/spotlight",
    "gain": 0.26,
    "tail": 0.252,
    "interval": 0.24,
    "label": "聚光灯开关",
    "material": "electric"
  },
  "orrery": {
    "sample": "weapons/orrery",
    "gain": 0.2,
    "tail": 0.617,
    "interval": 0.24,
    "label": "星系钟音",
    "material": "music"
  },
  "scrapColossus": {
    "sample": "weapons/scrapColossus",
    "gain": 0.26,
    "tail": 0.532,
    "interval": 0.24,
    "label": "废纸巨人关节冲击",
    "material": "crush"
  },
  "skyWhale": {
    "sample": "weapons/skyWhale",
    "gain": 0.25,
    "tail": 0.416,
    "interval": 0.24,
    "label": "纸鲸宽翼掠过",
    "material": "ink"
  },
  "autumnGuardian": {
    "sample": "weapons/autumnGuardian",
    "gain": 0.25,
    "tail": 0.592,
    "interval": 0.32,
    "label": "秋叶护盾展开",
    "material": "nature"
  },
  "paperCosmos": {
    "sample": "weapons/paperCosmos",
    "gain": 0.26,
    "tail": 0.165,
    "interval": 0.24,
    "label": "纸宇宙展开",
    "material": "electric"
  }
};
