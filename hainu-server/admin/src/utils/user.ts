type UserDisplaySource = {
  username?: string | null
  nickName?: string | null
}

export function resolveUserDisplayName(user: UserDisplaySource): string {
  const nickName = user.nickName?.trim()
  if (nickName) return nickName

  const username = user.username?.trim()
  if (username) return username

  return '-'
}
