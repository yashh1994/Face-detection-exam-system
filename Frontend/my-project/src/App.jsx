import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  
  useEffect(()=>{
    const apiUrl = import.meta.env.VITE_BACKEND_API_KEY;
console.log('API URL:', apiUrl);
  },[])
  return (
    <>
      
    </>
  )
}

export default App
