export function logger(name: string, enabled?: boolean) {
  return (...args: any[]) => {
    if (enabled) {
      console.log(`[${name}]`, ...args)
    }
  }
}
