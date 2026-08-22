import { config } from '../config';

interface WechatResponse { openid?: string; errcode?: number; errmsg?: string }

export async function codeToOpenid(code: string): Promise<string> {
  const url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + config.wxAppid
    + '&secret=' + config.wxAppSecret + '&js_code=' + code + '&grant_type=authorization_code';
  const res = await fetch(url);
  const data = (await res.json()) as WechatResponse;
  if (data.errcode) throw new Error('微信授权失败: ' + data.errmsg);
  return data.openid as string;
}
