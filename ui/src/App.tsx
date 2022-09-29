import { Suspense } from "react"
import { MainView } from "./MainView"

export function App() {
  return (
    <Suspense>
      <MainView />
    </Suspense>
  )
}
