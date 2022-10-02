export type TSConfig = {
  extends: string

  compilerOptions: {
    baseUrl: string
    paths: Record<string, string[]>
  }
  include?: string[]
  exclude?: string[]
}
