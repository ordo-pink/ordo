import { Loader } from "./loader"

export const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-700">
      <Loader />
    </div>
  )
}
