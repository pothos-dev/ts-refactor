import useFetch from "fetch-suspense"

const baseUrl = "https://pothos-dev-ts-refactor-4jvr65gp5jqc7qrx-8080.githubpreview.dev/"

export function useApi<T>(url: string): T {
  return useFetch(baseUrl + url) as T
}
