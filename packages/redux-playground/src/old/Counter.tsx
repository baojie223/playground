import { useState } from 'react'

export default function Counter() {
  const [counter, setCounter] = useState(0)
  const increment = () => {
    setCounter((prevCount) => prevCount + 1)
  }

  return (
    <div>
      Value: {Counter} <button onClick={increment}>Increment</button>
    </div>
  )
}
