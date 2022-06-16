import BetPanel from './Components/BetPanel'
import Card from './Components/Card'
import styled from 'styled-components'
import ScorePanel from './Components/ScorePanel'
import { useEffect, useState } from 'react'
import { getShuffledDeckId, getNextCard } from "./core/api"
import HistoryPanel from './Components/HistoryPanel'

/**
 * @returns 1 if second card is bigger than firs and 0 if smaller
 */
const compareCards = (c1: any, c2: any) => {
  const val = { JACK: 11, QUEEN: 12, KING: 13, ACE: 14 }
  let v1 = c1.value;
  let v2 = c2.value;
  if (+v1 !== +v1) { v1 = val[c1.value as keyof typeof val] }
  if (+v2 !== +v2) { v2 = val[c2.value as keyof typeof val] }

  return +(v2 > v1);
}

export default function App() {
  const [history, setHistory] = useState();

  const [deckId, setDeckId] = useState("");
  const [currentCard, setCurrentCard] = useState({ suit: null, value: "" });
  const [points, setPoints] = useState(0);
  const [roundsLeft, setRoundsLeft] = useState(30);
  
  const [isContinue, setIsContinue] = useState(false);
  const [isGameOn, setIsGameOn] = useState(false);

 /**
  * Checks whether there is a unfinished game in localStorage and sets isContinue state to true if there is
  */
  useEffect(() => {
    const stringState = window.localStorage.getItem('gameHistory');
    let state;
    if (stringState === null) return;
    setIsContinue(true);
  }, [])

  /**
   * Called on click of a continue button; initialises an unfinished game
   */
  const continueGame = () => {
    const stringState = window.localStorage.getItem('gameHistory');
    let state;
    if (stringState !== null) {
      state = JSON.parse(stringState);
    } else {
      throw console.error();
    }
    console.log(state);
    setDeckId(state[state.length - 1].deckId);
    setCurrentCard(state[state.length - 1].currentCard);
    setHistory(state);
    setPoints(state[state.length - 1].points);
    setRoundsLeft(state[state.length - 1].roundsLeft);
    setIsGameOn(true);
    setIsContinue(false);
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
  const handleBet = (bet: number) => {
    getNextCard(deckId).then(res => {
      let p = points;
      if (bet === compareCards(res, currentCard)) { setPoints(p + 1); p++ };
      saveState(res, bet, p);
      setCurrentCard(res);
    }).catch(e => console.log('error', e));
    if (roundsLeft === 0) { endGame(); return; };
    setRoundsLeft(roundsLeft - 1);
  }

  /**
   * starts the game
   * 
   * gets new shuffled deck`s id
   * gets first card
   * calls function which stores the game info in localStorage
   * sets game info: points and roundsLeft
   */
  const startGame = () => {
    getShuffledDeckId().then(res => {
      setDeckId(res);
      getNextCard(res).then(c => {
        setCurrentCard(c);
        saveInitialState(c, res);
      }).catch(e => console.log('error', e));
    }).catch(e => console.log('error', e));
    setPoints(0);
    setRoundsLeft(30);

    setIsGameOn(true);
  }

  /**
   * ends the game
   * 
   * clears localStorage
   * sets global game state
   * resets deckId and currentCard values
   */
  const endGame = () => {
    clearState();
    setIsGameOn(false);
    setDeckId('');
    setCurrentCard({ suit: null, value: "" });
  }

  /**
   * 
   * @param card firstly displayed card 
   * @param deck deck id
   * 
   * saves the game info in the beginning of the game
   */
  const saveInitialState = (card: any, deck: any) => {
    const state: any = [{
      deckId: deck,
      currentCard: card,
      bet: ' ',
      points: 0,
      roundsLeft: 30
    }];
    window.localStorage.setItem('gameHistory', JSON.stringify(state));
    setHistory(state);
  }

  /**
   * 
   * @param card currently displayed card 
   * @param bet last bet value
   * @param p current number of points
   * 
   * saves the game info during the game
   * 
   */
  const saveState = (card: any, bet: number, p: number) => {
    let state: any = history;
    state[state.length - 1].bet = bet;
    const newState: any = [...state, {
      deckId: deckId,
      currentCard: card,
      bet: '',
      points: p,
      roundsLeft: roundsLeft - 1
    }]
    window.localStorage.setItem('gameHistory', JSON.stringify(newState))
    setHistory(newState);
  }

  /**
   * clears localStorage
   */
  const clearState = () => {
    window.localStorage.clear();
  }


  return (
    <MainPage>
      <Column>
        <h2>History</h2>
        <HistoryPanel entry={['Round', 'Card', 'Points', 'Bet']} />
        {history &&
          (history as [])
            .map((e: any, i: number) =>
              <HistoryPanel key={e.currentCard.code} entry={[i, e.currentCard.code, e.points / 10, e.bet === 0 ? "High" : e.bet === 1 ? "Low" : " "]} />)
        }
      </Column>
      <CenterColumn>
        <Card currentCard={currentCard} isGameOn={isGameOn} />
        <BetPanel handleBet={handleBet} isGameOn={isGameOn} isContinue={isContinue} continueGame={continueGame} startGame={startGame} />
      </CenterColumn>
      <Column>
        <ScorePanel points={points} isGameOn={isGameOn} roundsLeft={roundsLeft} />
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