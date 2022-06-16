import styled from 'styled-components';
import hearts from '../img/hearts.svg'
import diamonds from '../img/diamonds.svg'
import clubs from '../img/clubs.svg'
import spades from '../img/spades.svg'

export default function Card(props: any) {
  const suitToSvg = { HEARTS : hearts, DIAMONDS : diamonds, CLUBS : clubs, SPADES : spades };
  const color = (props.currentCard.suit === 'HEARTS' || props.currentCard.suit === 'DIAMONDS') ? '#7c0a02' : 'white';
  const value = props.currentCard.value.length > 2 ? props.currentCard.value[0] : props.currentCard.value;
  const src = suitToSvg[props.currentCard.suit as keyof typeof suitToSvg];

  return (
    <CardSurface>
      {props.isGameOn && <>
        <CardInfo>
          <div style={{ color: color }}>{value}</div>
          <img alt={props.currentCard.suit} src={src} width='70px' />
        </CardInfo>
        <CardInfoUpsideDown>
          <div style={{ color: color }}>{value}</div>
          <img alt={props.currentCard.suit} src={src} width='70px' />
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