import { useEffect, useState } from 'react'
import DrawCanvas from './components/DrawCanvas'

function App() {
  const [home, setHome] = useState(true); // 0: select model, 1: digit model, 2: doodle model
  const [model, setModel] = useState(0);
  return (
    <div className="App">
      {home && <div className="relative h-screen w-screen flex items-center justify-center">
        <button className='rounded-lg bg-teal-400 border-2 border-black px-8 py-3 text-xl mr-10 duration-200 hover:scale-105 hover:bg-teal-500' onClick={() => {
          setModel(0);
          setHome(false);
        }}>CIFFER</button>

        <button className='rounded-lg bg-teal-400 border-2 border-black px-8 py-3 text-xl ml-10 duration-200 hover:scale-105 hover:bg-teal-500' onClick={() => {
          setModel(1);
          setHome(false);
        }}>TEGNING</button>
      </div>}

      {!home && <DrawCanvas model={model} goBack={() => setHome(true)} />}
    </div>
  )
}

export default App
