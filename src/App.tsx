import BetPanel from './Components/BetPanel'
import Card from './Components/Card'
import styled from 'styled-components'
import ScorePanel from './Components/ScorePanel'
import { useEffect, useState } from 'react'
import { getShuffledDeckId, getNextCard } from "./core/api"
import HistoryPanel from './Components/HistoryPanel'

const NUMERIC_VALUES = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'JACK': 11, 'QUEEN': 12, 'KING': 13, 'ACE': 14 }

class PlayingCard {
  value: string;
  suit: string;
  code: string;

  constructor(value: string, suit: string, code: string) {
    this.value = value;
    this.suit = suit;
    this.code = code;
  }

  getNumericValue = (): number => {
    return NUMERIC_VALUES[this.value as keyof typeof NUMERIC_VALUES];
  }
}

class GameState {
  deckId: string;
  currentCard: PlayingCard;
  bet: string;
  points: number;
  roundsLeft: number;

  constructor(deckId: string, currentCard: PlayingCard, bet: string, points: number, roundsLeft: number) {
    this.deckId = deckId;
    this.currentCard = currentCard;
    this.bet = bet;
    this.points = points;
    this.roundsLeft = roundsLeft;
  }
}


export default function App() {
  const [history, setHistory] = useState([new GameState('', new PlayingCard('', '', '-'), '', 0, 30)]);

  const [isContinue, setIsContinue] = useState(false);
  const [isGameOn, setIsGameOn] = useState(false);

  /**
   * Checks whether there is a unfinished game in localStorage and sets isContinue state to true if there is
   */
  useEffect(() => {
    const stringState = window.localStorage.getItem('gameHistory');
    let state;
    if (stringState !== null) {
      state = JSON.parse(stringState);
    } else {
      throw console.error();
    }
    if (state[state.length - 1].roundsLeft < 1) { endGame(); return; };
    setIsContinue(true);
  }, [])

  /**
   * starts the game:
   * 
   * gets new shuffled deck`s id, 
   * gets first card, 
   * creates current game state object and saves it
   */
  const startGame = () => {
    getShuffledDeckId().then(deckId => {
      getNextCard(deckId).then(c => {
        const card = new PlayingCard(c.value, c.suit, c.code);
        const currentState = new GameState(deckId, card, '-', 0, 29);
        saveState([currentState]);
      }).catch(e => console.log('error', e));
    }).catch(e => console.log('error', e));
    setIsGameOn(true);
  }

  /**
   * @param bet 0 for "High" bet and 1 for "Low"
   *
   * gets next card from the api
   * calculates and sets new points value
   * calls function which stores the game info in localStorage
   * ends game if last roun is reached
   * decrements number of rounds left
   */
  const handleBet = (bet: string) => {
    let currentState = history[history.length - 1];
    currentState.bet = bet;
    getNextCard(currentState.deckId).then(res => {
      const card = new PlayingCard(res.value, res.suit, res.code);
      let p = currentState.points;
      if (bet === '0' && (currentState.currentCard.getNumericValue() < card.getNumericValue())) p++;
      if (bet === '1' && (currentState.currentCard.getNumericValue() > card.getNumericValue())) p++;
      const newState = new GameState(currentState.deckId, card, '', p, currentState.roundsLeft - 1);
      saveState([...history.slice(0, history.length - 1), currentState, newState]);
      if (currentState.roundsLeft < 2) { endGame(); return; };
    }).catch(e => console.log('error', e));
  }

  /**
   * Called on click of a continue button; initiates an unfinished game
   */
  const continueGame = () => {
    const stringState = window.localStorage.getItem('gameHistory');
    let state;
    if (stringState !== null) {
      state = JSON.parse(stringState);
    } else {
      throw console.error();
    }
    setHistory(state);
    setIsGameOn(true);
    setIsContinue(false);
  }

  /**
   * ends the game
   */
  const endGame = () => {
    setIsGameOn(false);
    setIsContinue(false);
  }

  /**
  * saves game state to localStorage and to history variable
  */
  const saveState = (gameState: GameState[]) => {
    setHistory(gameState);
    window.localStorage.setItem('gameHistory', JSON.stringify(gameState))
  }

  return (
    <MainPage>
      <Column>
        <h2>History</h2>
        <HistoryPanel entry={['Round', 'Card', 'Points', 'Bet']} />
        {history &&
          (history as [])
            .map((e: any, i: number) =>
              <HistoryPanel key={e.currentCard.code} entry={[i + 1, e.currentCard.code, e.points / 10, e.bet === '0' ? "High" : e.bet === '1' ? "Low" : "-"]} />
            )
        }
      </Column>
      <CenterColumn>
        <Card currentCard={history[history.length - 1].currentCard} isGameOn={isGameOn} />
        <BetPanel handleBet={handleBet} continueGame={continueGame} startGame={startGame} isGameOn={isGameOn} isContinue={isContinue} />
      </CenterColumn>
      <Column>
        <ScorePanel points={history[history.length - 1].points} roundsLeft={history[history.length - 1].roundsLeft} />
      </Column>
    </MainPage>
  )
}

const Column = styled.div`
display: flex;
flex-direction: column;
padding-top: 50px;
color: white;
font-size: 20px;
text-align:center;
`

const CenterColumn = styled(Column)`
align-items:center;

`

const MainPage = styled.div`
display: grid;
grid-template-columns: 1fr 1fr 1fr;
background-color: #414141;
min-height: 100vh;
`