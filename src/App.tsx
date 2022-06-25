import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { BetPanel } from './Components/BetPanel'
import { Card } from './Components/Card'
import { HistoryPanel } from './Components/HistoryPanel'
import { ScorePanel } from './Components/ScorePanel'

import { getNextCard, getShuffledDeckId } from "./api/api"

import GameState from './data/GameState'
import PlayingCard from './data/PlayingCard'
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'

export default function App() {
  const [history, setHistory] = useState([new GameState('', new PlayingCard('', '', '-'), '', 0, 30)]);

  const [isNextMoveAllowed, setIsNextMoveAllowed] = useState(false);

  const [isContinue, setIsContinue] = useState(false);
  const [isGameOn, setIsGameOn] = useState(false);

  const [isFetchError, setIsFetchError] = useState(false);

  /**
   * Checks whether there is a unfinished game in localStorage and sets isContinue state to true if there is
   */
  useEffect(() => {
    const stringState = window.localStorage.getItem('gameHistory');
    if (stringState === null) return;
    const state = JSON.parse(stringState);
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
        if (!c) {
          setIsFetchError(true);
          return;
        }
        const card = new PlayingCard(c.value, c.suit, c.code);
        const currentState = new GameState(deckId, card, '-', 0, 29);
        saveState([currentState]);
        setIsGameOn(true);
        setIsNextMoveAllowed(true);
      }).catch(e => console.log('error', e));
    }).catch(e => console.log('error', e));
  }

  /**
   * @param bet 0 for "High" bet and 1 for "Low"
   *
   * gets next card from the api,
   * creates current game state object and saves it,
   * ends game if last roun is reached
   */
  const handleBet = (bet: string) => {
    if (!isNextMoveAllowed) return;
    setIsNextMoveAllowed(false);
    let currentState = history[history.length - 1];
    currentState.bet = bet;
    getNextCard(currentState.deckId).then(res => {
      if (!res) {
        setIsFetchError(true);
        return;
      }
      const card = new PlayingCard(res.value, res.suit, res.code);
      let p = currentState.points;
      if (bet === '0' && (currentState.currentCard.getNumericValue() < card.getNumericValue())) p++;
      if (bet === '1' && (currentState.currentCard.getNumericValue() > card.getNumericValue())) p++;
      const newState = new GameState(currentState.deckId, card, '', p, currentState.roundsLeft - 1);
      saveState([...history.slice(0, history.length - 1), currentState, newState]);
      if (currentState.roundsLeft < 2) { endGame(); return; };
      setIsNextMoveAllowed(true);
    }).catch(e => console.log('error', e));
  }

  /**
   * Called on click of a continue button; initiates an unfinished game
   */
  const continueGame = () => {
    const stringState = window.localStorage.getItem('gameHistory');
    let state: any[];
    if (stringState === null) return;
    state = JSON.parse(stringState);
    setHistory(state.map(e => new GameState(e.deckId,
      new PlayingCard(e.currentCard.value, e.currentCard.suit, e.currentCard.code),
      e.bet,
      e.points,
      e.roundsLeft
    )));
    setIsGameOn(true);
    setIsContinue(false);
    setIsNextMoveAllowed(true);
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

  const checkConnection = (): void => {
    setIsFetchError(false);
    getShuffledDeckId().then(d => {
      if (!d) {
        setIsFetchError(true)
        return;
      };
      continueGame();
    })
  }

  return (
    <React.Fragment>
      <Dialog open={isFetchError}>
        <DialogTitle>There is a problem</DialogTitle>
        <DialogContent>
          It seems that we cant get a deck for you.<br /> Check your internet connection, or try again later.
        </DialogContent>
        <DialogActions>
          <Button onClick={checkConnection}>Try now</Button>
        </DialogActions>
      </Dialog>
      <MainPage>
        <Column>
          <h2>History</h2>
          <HistoryPanel entry={['Round', 'Card', 'Points', 'Bet']} />
          {history &&
            (history as [])
              .map((e: any, i: number) => <HistoryPanel key={e.currentCard.code}
                entry={[i + 1, e.currentCard.code, e.points / 10, e.bet === '0' ? "High" : e.bet === '1' ? "Low" : "-"]}
              />)}
        </Column>
        <CenterColumn>
          <Card currentCard={history[history.length - 1].currentCard} isGameOn={isGameOn} />
          <BetPanel handleBet={handleBet} continueGame={continueGame} startGame={startGame} isGameOn={isGameOn} isContinue={isContinue} />
        </CenterColumn>
        <Column>
          <ScorePanel points={history[history.length - 1].points} roundsLeft={history[history.length - 1].roundsLeft} />
        </Column>
      </MainPage>
    </React.Fragment>

  )
}

const Column = styled.div`
display: flex;
flex-direction: column;
padding-top: 5vh;
color: white;
font-size: 2vh;
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
min-width: 100vw;
`

const DialogContent = styled.div`
padding: 2vh;
`