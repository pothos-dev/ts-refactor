import { useApi } from "./hooks/useApi"

export function MainView() {
  const files = useApi("/files")
  return <p>{JSON.stringify(files)}</p>
}
