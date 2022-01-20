export function fuck() {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(null)
      console.log((window.name as any).error.error)
    }, 500)
  )
}
