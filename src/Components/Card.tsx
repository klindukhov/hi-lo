import styled from 'styled-components';

import hearts from '../imgs/hearts.svg'
import diamonds from '../imgs/diamonds.svg'
import clubs from '../imgs/clubs.svg'
import spades from '../imgs/spades.svg'
import PlayingCard from '../data/PlayingCard';

interface CardProps{
  currentCard: PlayingCard,
  isGameOn: boolean
}

const SVG_VALUES = { HEARTS: hearts, DIAMONDS: diamonds, CLUBS: clubs, SPADES: spades };

export const Card : React.FC<CardProps> = ({isGameOn, currentCard}) => {
  const color = (currentCard.suit === 'HEARTS' || currentCard.suit === 'DIAMONDS') ? '#7c0a02' : 'white';
  const value = currentCard.value.length > 2 ? currentCard.value[0] : currentCard.value;
  const src = SVG_VALUES[currentCard.suit as keyof typeof SVG_VALUES];

  return (
    <CardSurface>
      {isGameOn && <>
        <CardInfo>
          <div style={{ color: color }}>{value}</div>
          <img alt={currentCard.suit} src={src} width='70px' />
        </CardInfo>
        <CardInfoUpsideDown>
          <div style={{ color: color }}>{value}</div>
          <img alt={currentCard.suit} src={src} width='70px' />
        </CardInfoUpsideDown>
      </>}
    </CardSurface>
  )
}

const CardSurface = styled.div`
  width: 400px;
  height: 600px;
  padding: 15px;
  margin : 50px;
  display: grid;

  border-style: solid;
  border-color: white;
  border-width: 1px;
  background: #131313;
  border-radius: 20px;
`
const CardInfo = styled.div`
  background-color: transparent;
  width: 70px;
  text-align: center;
  font-size: 60px;
  justify-self:start;
`

const CardInfoUpsideDown = styled(CardInfo)`
  justify-self:end;
  transform: rotate(180deg);
`