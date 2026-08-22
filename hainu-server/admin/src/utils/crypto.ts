import { getApiSecurityConfig } from './api-security'

/**
 * 获取 RSA 公钥
 */
async function getPublicKey() {
  const config = await getApiSecurityConfig()
  return {
    keyId: config.keyId,
    publicKey: config.publicKey
  }
}

/**
 * 使用 RSA-OAEP 加密字符串
 */
async function encryptWithRSA(plaintext: string): Promise<{ keyId: string; ciphertext: string }> {
  const { publicKey, keyId } = await getPublicKey()

  // 将 PEM 格式公钥转换为 CryptoKey
  const pemHeader = '-----BEGIN PUBLIC KEY-----'
  const pemFooter = '-----END PUBLIC KEY-----'
  const pemContents = publicKey.replace(pemHeader, '').replace(pemFooter, '').replace(/\s/g, '')

  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0))

  const cryptoKey = await crypto.subtle.importKey(
    'spki',
    binaryDer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    false,
    ['encrypt']
  )

  // 加密
  const encoded = new TextEncoder().encode(plaintext)
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP'
    },
    cryptoKey,
    encoded
  )

  // 转换为 Base64
  return {
    keyId,
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
  }
}

/**
 * 加密对象中的指定字段
 */
type EncryptedFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: string
}

export async function encryptPasswordFields<T extends object, K extends keyof T>(
  obj: T,
  fields: readonly K[]
): Promise<{ payload: EncryptedFields<T, K>; keyId: string }> {
  const result = { ...obj } as EncryptedFields<T, K>
  let keyId = ''

  for (const field of fields) {
    const value = result[field]

    if (value !== undefined && value !== null && value !== '') {
      const encrypted = await encryptWithRSA(String(value))
      keyId = encrypted.keyId
      result[field] = encrypted.ciphertext as EncryptedFields<T, K>[K]
    }
  }

  return {
    payload: result,
    keyId
  }
}
