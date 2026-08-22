import axios, { type AxiosRequestConfig } from 'axios'

export const API_SECURITY_HEADERS = {
  timestamp: 'X-Api-Timestamp',
  nonce: 'X-Api-Nonce',
  signature: 'X-Api-Signature',
  contentSha256: 'X-Api-Content-SHA256',
  signatureVersion: 'X-Api-Signature-Version'
} as const

export const API_SECURITY_SIGNATURE_VERSION = 'v1'

export interface ApiSecurityConfig {
  keyId: string
  publicKey: string
  enabled: boolean
  serverTime?: number
  signatureRequired: boolean
  clockSkewMs: number
  nonceTtlMs: number
  nonceMinLength: number
  unsignedPayloadToken: string
  exemptPaths: string[]
}

type JsonPrimitive = null | string | number | boolean | Date

interface JsonObject {
  [key: string]: JsonValue
}

type JsonValue = JsonPrimitive | JsonValue[] | JsonObject

const { VITE_API_URL, VITE_WITH_CREDENTIALS } = import.meta.env

let cachedSecurityConfig: ApiSecurityConfig | null = null
let securityConfigPromise: Promise<ApiSecurityConfig> | null = null
let apiSecurityClockOffsetMs = 0

function normalizeValue(value: unknown): JsonValue {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(item))
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, item]) => item !== undefined)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, normalizeValue(item)])
    )
  }

  return String(value)
}

export function canonicalizePayload(value: unknown) {
  return JSON.stringify(normalizeValue(value) ?? null)
}

async function sha256Hex(value: string) {
  const encoded = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(digest))
    .map((item) => item.toString(16).padStart(2, '0'))
    .join('')
}

async function hmacSha256Base64(secret: string, payload: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
}

export function buildCanonicalQuery(input: unknown) {
  const normalized = normalizeValue(input)

  if (!normalized || Array.isArray(normalized) || typeof normalized !== 'object') {
    return ''
  }

  const entries: Array<[string, string]> = []

  const appendEntry = (prefix: string, value: JsonValue) => {
    if (value === null) {
      return
    }

    if (Array.isArray(value)) {
      value.forEach((item) => appendEntry(prefix, item))
      return
    }

    if (typeof value === 'object') {
      Object.entries(value).forEach(([key, item]) => {
        appendEntry(prefix ? `${prefix}.${key}` : key, item)
      })
      return
    }

    entries.push([prefix, String(value)])
  }

  Object.entries(normalized).forEach(([key, value]) => {
    appendEntry(key, value)
  })

  return entries
    .sort(([leftKey, leftValue], [rightKey, rightValue]) => {
      const keyCompare = leftKey.localeCompare(rightKey)
      if (keyCompare !== 0) {
        return keyCompare
      }
      return leftValue.localeCompare(rightValue)
    })
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

function buildSignaturePayload(input: {
  method: string
  path: string
  query: string
  contentSha256: string
  timestamp: string
  nonce: string
}) {
  return [
    API_SECURITY_SIGNATURE_VERSION,
    input.method.toUpperCase(),
    input.path,
    input.query,
    input.contentSha256,
    input.timestamp,
    input.nonce
  ].join('\n')
}

function resolveBaseUrl(baseURL?: string) {
  const candidate = baseURL || VITE_API_URL || ''

  if (!candidate || candidate === '/') {
    return window.location.origin
  }

  if (/^https?:\/\//i.test(candidate)) {
    return candidate
  }

  return new URL(candidate, window.location.origin).toString()
}

function resolveAbsoluteUrl(config: AxiosRequestConfig) {
  return new URL(config.url || '/', resolveBaseUrl(config.baseURL))
}

export async function getApiSecurityConfig(force = false): Promise<ApiSecurityConfig> {
  if (cachedSecurityConfig && !force) {
    return cachedSecurityConfig
  }

  if (!securityConfigPromise || force) {
    const requestStartedAt = Date.now()
    securityConfigPromise = axios
      .get<{ code: number; data: ApiSecurityConfig }>('/api/v1/crypto/security-config', {
        baseURL: resolveBaseUrl(),
        withCredentials: VITE_WITH_CREDENTIALS === 'true'
      })
      .then((response) => {
        cachedSecurityConfig = response.data.data
        syncApiSecurityClock(response.data.data.serverTime, requestStartedAt)
        return response.data.data
      })
      .finally(() => {
        securityConfigPromise = null
      })
  }

  return securityConfigPromise
}

function syncApiSecurityClock(serverTime: unknown, requestStartedAt: number) {
  const serverTimeMs = Number(serverTime)
  if (!Number.isFinite(serverTimeMs) || serverTimeMs <= 0) {
    return
  }

  const requestFinishedAt = Date.now()
  const clientApproxReceiveAt = requestStartedAt + (requestFinishedAt - requestStartedAt) / 2
  apiSecurityClockOffsetMs = serverTimeMs - clientApproxReceiveAt
}

function resolveApiSecurityTimestamp() {
  return String(Math.round(Date.now() + apiSecurityClockOffsetMs))
}

function createNonce(minLength: number) {
  const first = crypto.randomUUID().replace(/-/g, '')
  if (first.length >= minLength) {
    return first
  }

  return `${first}${crypto.randomUUID().replace(/-/g, '')}`.slice(0, minLength)
}

async function resolveContentSha256(data: unknown, unsignedPayloadToken: string) {
  if (data instanceof FormData) {
    return unsignedPayloadToken
  }

  if (typeof data === 'string') {
    return sha256Hex(data)
  }

  return sha256Hex(canonicalizePayload(data ?? null))
}

export async function applyApiSecurityHeaders(config: AxiosRequestConfig, accessToken: string) {
  const securityConfig = await getApiSecurityConfig()
  if (!securityConfig.enabled || !securityConfig.signatureRequired) {
    return config
  }

  const absoluteUrl = resolveAbsoluteUrl(config)
  const timestamp = resolveApiSecurityTimestamp()
  const nonce = createNonce(securityConfig.nonceMinLength)
  const query = buildCanonicalQuery(config.params)
  const contentSha256 = await resolveContentSha256(config.data, securityConfig.unsignedPayloadToken)
  const signaturePayload = buildSignaturePayload({
    method: config.method || 'GET',
    path: absoluteUrl.pathname,
    query,
    contentSha256,
    timestamp,
    nonce
  })
  const signature = await hmacSha256Base64(accessToken, signaturePayload)

  config.headers = config.headers || {}

  if (config.headers instanceof Headers) {
    config.headers.set(API_SECURITY_HEADERS.signatureVersion, API_SECURITY_SIGNATURE_VERSION)
    config.headers.set(API_SECURITY_HEADERS.timestamp, timestamp)
    config.headers.set(API_SECURITY_HEADERS.nonce, nonce)
    config.headers.set(API_SECURITY_HEADERS.contentSha256, contentSha256)
    config.headers.set(API_SECURITY_HEADERS.signature, signature)
  } else {
    config.headers[API_SECURITY_HEADERS.signatureVersion] = API_SECURITY_SIGNATURE_VERSION
    config.headers[API_SECURITY_HEADERS.timestamp] = timestamp
    config.headers[API_SECURITY_HEADERS.nonce] = nonce
    config.headers[API_SECURITY_HEADERS.contentSha256] = contentSha256
    config.headers[API_SECURITY_HEADERS.signature] = signature
  }

  return config
}
