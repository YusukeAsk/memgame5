import { useState, useEffect } from 'react'
import Card from './Card'
import './MemoryGame.css'

// 5歳児向けのシンプルな絵柄（4列×2行 = 8枚 = 4種類×2枚）
const cardImages = [
  '🐶', '🐈', '🐼', '🐰'
]

// 効果音を再生する関数
const playMatchSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.value = 800
  oscillator.type = 'sine'
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.3)
}

// 全クリア時の効果音
const playWinSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  
  // メロディーを再生
  const notes = [523.25, 659.25, 783.99, 1046.50] // C, E, G, C
  let time = audioContext.currentTime
  
  notes.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = freq
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, time)
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.2)
    
    oscillator.start(time)
    oscillator.stop(time + 0.2)
    
    time += 0.15
  })
}

// 最高記録更新時の効果音
const playRecordSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  
  // もっと華やかなメロディーを再生
  const notes = [659.25, 783.99, 987.77, 1318.51] // E, G, B, E
  let time = audioContext.currentTime
  
  notes.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = freq
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.4, time)
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.3)
    
    oscillator.start(time)
    oscillator.stop(time + 0.3)
    
    time += 0.2
  })
}

// 記録をlocalStorageから取得
const getRecords = () => {
  const recordsJson = localStorage.getItem('memoryGameRecords')
  return recordsJson ? JSON.parse(recordsJson) : []
}

// 記録をlocalStorageに保存（最大5つ）
const saveRecord = (moves) => {
  const records = getRecords()
  records.push(moves)
  // 最新5つを保持
  const sortedRecords = records.slice(-5).sort((a, b) => a - b)
  localStorage.setItem('memoryGameRecords', JSON.stringify(sortedRecords))
  return sortedRecords
}

const MemoryGame = () => {
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [records, setRecords] = useState([])

  // ゲームの初期化
  const initializeGame = () => {
    // カードをペアにしてシャッフル
    const cardPairs = [...cardImages, ...cardImages]
    const shuffled = cardPairs
      .map((value, index) => ({ id: index, value, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5)
    
    setCards(shuffled)
    setFlippedCards([])
    setMatchedPairs([])
    setMoves(0)
    setGameWon(false)
  }

  useEffect(() => {
    initializeGame()
    // 記録を読み込む
    setRecords(getRecords())
  }, [])

  // 勝利判定
  useEffect(() => {
    if (cards.length > 0 && matchedPairs.length === cards.length && !gameWon) {
      setGameWon(true)
      playWinSound() // 全クリア時の効果音を再生
      
      // 保存前の記録を取得して、最高記録（最小値）をチェック
      const previousRecords = getRecords()
      const previousBest = previousRecords.length > 0 ? Math.min(...previousRecords) : Infinity
      
      // 記録を保存
      const savedRecords = saveRecord(moves)
      setRecords(savedRecords)
      
      // 最高記録が更新されたら効果音を再生
      if (previousRecords.length === 0 || moves < previousBest) {
        setTimeout(() => {
          playRecordSound()
        }, 1500) // 勝利効果音の後に再生
      }
    }
  }, [matchedPairs, cards.length, gameWon, moves])

  // カードをクリックしたときの処理
  const handleCardClick = (cardId) => {
    // すでにマッチしたカードや、すでにめくられているカードは無視
    if (matchedPairs.includes(cardId) || flippedCards.includes(cardId)) {
      return
    }

    // 2枚以上めくられている場合は無視
    if (flippedCards.length >= 2) {
      return
    }

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    // 2枚めくられたら判定
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)
      
      const [firstCard, secondCard] = newFlippedCards
      const firstCardData = cards.find(c => c.id === firstCard)
      const secondCardData = cards.find(c => c.id === secondCard)

      if (firstCardData.value === secondCardData.value) {
        // マッチした！
        playMatchSound() // 効果音を再生
        setMatchedPairs([...matchedPairs, firstCard, secondCard])
        setFlippedCards([])
      } else {
        // マッチしなかったので、カードを裏返す
        setTimeout(() => {
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  return (
    <div className="memory-game">
      <div className="game-info">
        <div className="moves-counter">動いた回数: {moves}</div>
        <button className="reset-button" onClick={initializeGame}>
          🔄 もう一度遊ぶ
        </button>
      </div>

      {gameWon && (
        <div className="win-message">
          <h2>🎉 おめでとう！全部見つけたよ！ 🎉</h2>
          <p>動いた回数: {moves}回</p>
          {records.length > 0 && moves === Math.min(...records) && (
            <p className="new-record">⭐ 新記録！ ⭐</p>
          )}
        </div>
      )}

      {records.length > 0 && (
        <div className="records-section">
          <h3>記録（操作回数）</h3>
          <div className="records-list">
            {records.map((record, index) => (
              <div 
                key={index} 
                className={`record-item ${record === moves && gameWon && record === Math.min(...records) ? 'best-record' : ''}`}
              >
                {index + 1}位: {record}回
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="cards-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            isFlipped={flippedCards.includes(card.id) || matchedPairs.includes(card.id)}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default MemoryGame
