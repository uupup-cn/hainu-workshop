import { prisma } from '../utils/prisma';
export async function getSettings() { const settings = await prisma.systemSetting.findMany(); const r: Record<string,string> = {}; for (const s of settings) r[s.settingKey] = s.settingValue || ''; return r; }
