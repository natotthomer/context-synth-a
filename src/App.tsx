import './App.css'
import { AudioEngineProvider } from './AudioEngine/AudioEngineProvider'
import { Child } from './Child'

function App() {

  return (
    <AudioEngineProvider>
      <Child />
    </AudioEngineProvider>
  )
}

export default App
