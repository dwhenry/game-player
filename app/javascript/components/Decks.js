import React from "react"
import PropTypes from "prop-types"
class CardItem extends React.Component {
  constructor(props) {
    super(props);
    this.cloneCard = this.cloneCard.bind(this);
    this.editCard = this.editCard.bind(this);
  }

  cloneCard(event) {
    event.preventDefault();
    this.props.setCard({
      id: "",
      name: this.props.card.name,
      cost: this.props.card.cost,
      actions: this.props.card.actions,
      deck: this.props.card.deck,
      number: this.props.card.number
    })
  }

  editCard(event) {
    event.preventDefault();
    this.props.setCard(this.props.card)
  }

  render() {
    return <li className="deck__card">
      <a href="#" onClick={this.editCard}>({this.props.card.number}) {this.props.card.name}</a>
      &nbsp;-&nbsp;
      <a href="#" onClick={this.cloneCard}>Clone</a>
    </li>
  }
}

class Decks extends React.Component {
  constructor(props) {
    super(props);
    this.setCard = this.setCard.bind(this);
    this.addCard = this.addCard.bind(this);
  }

  addCard(event) {
    event.preventDefault()
    const deckName = event.target.attribute('data-deck');
    this.props.setCard({deck: deckName})
  }

  setCard(card) {
    this.props.setCard(card)
  }

  renderDeck(cards, name) {
    return <div className={"deck-" + name}>
      <div className="deck__title">({cards.length}) {name} </div>
      <a className="deck__add-link" href="#" data-deck={name} onClick={this.addCard}>Add Card</a>
      <ul>
        {cards.map((card) => (
          <CardItem key={card.id} card={card} setCard={this.setCard} />
        ))}
      </ul>
    </div>
  }
  render () {
    return (
      <div className="decks">
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
