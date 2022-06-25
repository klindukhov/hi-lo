import PlayingCard from "./PlayingCard";

export default class GameState {
  deckId: string;
  currentCard: PlayingCard;
  bet: string;
  points: number;
  roundsLeft: number;

  constructor(
    deckId: string,
    currentCard: PlayingCard,
    bet: string,
    points: number,
    roundsLeft: number
  ) {
    this.deckId = deckId;
    this.currentCard = currentCard;
    this.bet = bet;
    this.points = points;
    this.roundsLeft = roundsLeft;
  }
}
