import './App.css'
import { AudioEngineProvider } from './AudioEngine/AudioEngineProvider'
import { UI } from './UI'

function App() {

  return (
    <AudioEngineProvider>
      <UI />
    </AudioEngineProvider>
  )
}

export default App
