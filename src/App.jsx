import MemoryGame from './components/MemoryGame'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>🎮 神経衰弱ゲーム 🎮</h1>
        <p>同じ絵を見つけよう！</p>
      </header>
      <MemoryGame />
    </div>
  )
}

export default App
