import { Solar, Lunar } from 'lunar-javascript';

export interface XiaoLiuRenResult {
  name: string;
  meaning: string;
  index: number;
}

export const SIX_GODS: XiaoLiuRenResult[] = [
  { name: '大安', meaning: '稳定顺利，适合办事', index: 0 },
  { name: '留连', meaning: '事情拖延，暂缓行动', index: 1 },
  { name: '速喜', meaning: '有好消息，喜事临门', index: 2 },
  { name: '赤口', meaning: '容易争执，需防口舌', index: 3 },
  { name: '小吉', meaning: '小有吉利，顺水推舟', index: 4 },
  { name: '空亡', meaning: '事情落空，徒劳无功', index: 5 },
];

export const SHICHEN_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export function getShichenIndex(hour: number): number {
  // 子时: 23:00 - 01:00 (index 0)
  // 丑时: 01:00 - 03:00 (index 1)
  // ...
  if (hour >= 23 || hour < 1) return 0;
  return Math.floor((hour + 1) / 2);
}

export function calculateXiaoLiuRen(date: Date) {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  
  const month = lunar.getMonth();
  const day = lunar.getDay();
  const hour = date.getHours();
  const shichenIndex = getShichenIndex(hour);

  // Algorithm:
  // 1. Month index: (month - 1) % 6
  // 2. Day index: (monthIndex + day - 1) % 6
  // 3. Shichen index: (dayIndex + shichenIndex) % 6 (Note: shichenIndex is 0-based, so if we use 1-based shichen like the PRD says, it's (dayIndex + shichen - 1) % 6)
  
  const monthIdx = (month - 1) % 6;
  const dayIdx = (monthIdx + day - 1) % 6;
  // PRD says: resultIndex = (dayIndex + shichenIndex - 1) % 6
  // But wait, if shichenIndex is 1-based (子=1), then (dayIdx + 1 - 1) = dayIdx.
  // My getShichenIndex returns 0 for 子. So if 子 is 1st shichen:
  const resultIdx = (dayIdx + (shichenIndex + 1) - 1) % 6;

  return {
    lunarMonth: lunar.getMonthInChinese(),
    lunarDay: lunar.getDayInChinese(),
    shichen: SHICHEN_NAMES[shichenIndex],
    result: SIX_GODS[resultIdx],
    fullLunar: `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
  };
}
