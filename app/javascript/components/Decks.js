import React from "react"
import PropTypes from "prop-types"
class CardName extends React.Component {
  render() {
    <li>{this.props.card.name}</li>
  }
}

CardName.propTypes = {
  card: PropTypes.object
};

class Decks extends React.Component {
  addCard(name) {
    alert('add something')
  }

  renderDeck(cards, name) {
    return <div className={"deck-" + name}>
      <div className="deck__title">{name} <a href="#" onClick={() => { this.addCard(name) }}>Add</a></div>
      <ul>
        {cards.map((card) => (
          <CardName key={card.id} card={card} />
        ))}
      </ul>
    </div>
  }
  render () {
    return (
      <div>
        { this.renderDeck(this.props.tasks, 'tasks') }
        { this.renderDeck(this.props.achievements, 'achievements') }
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
