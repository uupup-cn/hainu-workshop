import { getApiSecurityConfig } from './api-security'

/**
 * 获取 RSA 公钥（获取失败时返回 null，降级为明文传输）
 */
async function getPublicKey(): Promise<{ keyId: string; publicKey: string } | null> {
  try {
    const config = await getApiSecurityConfig()
    if (!config.publicKey) return null
    return { keyId: config.keyId, publicKey: config.publicKey }
  } catch {
    return null // 后端未实现 security-config 端点时降级明文
  }
}

/**
 * 使用 RSA-OAEP 加密字符串（公钥不可用时返回明文）
 */
async function encryptWithRSA(plaintext: string): Promise<{ keyId: string; ciphertext: string }> {
  const keyInfo = await getPublicKey()
  if (!keyInfo) return { keyId: '', ciphertext: plaintext } // 降级明文

  const pemHeader = '-----BEGIN PUBLIC KEY-----'
  const pemFooter = '-----END PUBLIC KEY-----'
  const pemContents = keyInfo.publicKey.replace(pemHeader, '').replace(pemFooter, '').replace(/\s/g, '')

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

  const encoded = new TextEncoder().encode(plaintext)
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP'
    },
    cryptoKey,
    encoded
  )

  return {
    keyId: keyInfo.keyId,
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
