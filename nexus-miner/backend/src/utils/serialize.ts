export function serializeUser<T extends { telegramId: bigint }>(user: T) {
  return { ...user, telegramId: user.telegramId.toString() };
}
