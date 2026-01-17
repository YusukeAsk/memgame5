import { useState, useEffect } from 'react'
import Card from './Card'
import './MemoryGame.css'

// 5歳児向けのシンプルな絵柄（動物と果物）
const cardImages = [
  '🐶', '🐱', '🐼', '🐰',
  '🍎', '🍌', '🍓', '🍊',
  '🚗', '🚀', '🎈', '🎁'
]

const MemoryGame = () => {
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)

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
  }, [])

  // 勝利判定
  useEffect(() => {
    if (cards.length > 0 && matchedPairs.length === cards.length) {
      setGameWon(true)
    }
  }, [matchedPairs, cards.length])

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
