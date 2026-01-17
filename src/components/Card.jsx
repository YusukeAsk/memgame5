import './Card.css'

const Card = ({ card, isFlipped, onClick }) => {
  return (
    <div
      className={`card ${isFlipped ? 'flipped' : ''}`}
      onClick={onClick}
    >
      <div className="card-inner">
        <div className="card-front">
          <span className="card-emoji">❓</span>
        </div>
        <div className="card-back">
          <span className="card-emoji">{card.value}</span>
        </div>
      </div>
    </div>
  )
}

export default Card
