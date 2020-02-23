import React from "react"
import PropTypes from "prop-types"
class CardName extends React.Component {
  render() {
    <Q> </Q>
  }
}

CardName.propTypes = {
  card: PropTypes.object
};

class Decks extends React.Component {
  addCard(name) {
    this.props.setCard({deck: name})
  }

  editCard(card) {
    this.props.setCard(card)
  }

  renderDeck(cards, name) {
    return <div className={"deck-" + name}>
      <div className="deck__title">{name} </div>
      <a href="#" onClick={(e) => { e.preventDefault(); this.addCard(name) }}>Add Card</a>
      <ul>
        {cards.map((card) => (
          <li key={card.id}>({card.number}) {card.name} <a href="#" onClick={(e) => { e.preventDefault(); this.editCard(card) }}>Edit</a></li>
        ))}
      </ul>
    </div>
  }
  render () {
    return (
      <div>
        { this.renderDeck(this.props.tasks, 'tasks') }
        <br />
        { this.renderDeck(this.props.achievements, 'achievements') }
        <br />
        { this.renderDeck(this.props.employees, 'employees') }
      </div>
    );
  }
}

Decks.propTypes = {
  tasks: PropTypes.array,
  employees: PropTypes.array,
  achievements: PropTypes.array,
  rules: PropTypes.object
};
export default Decks
