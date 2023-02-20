import Loader from "./loader"

export default function Loading() {
  return (
    <div className="flex max-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-700">
      <Loader />
    </div>
  )
}
