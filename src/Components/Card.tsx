import styled from "styled-components";

import hearts from "../imgs/hearts.svg";
import diamonds from "../imgs/diamonds.svg";
import clubs from "../imgs/clubs.svg";
import spades from "../imgs/spades.svg";
import PlayingCard from "../data/PlayingCard";

interface CardProps {
  currentCard: PlayingCard;
  isGameOn: boolean;
}

const SVG_VALUES = {
  HEARTS: hearts,
  DIAMONDS: diamonds,
  CLUBS: clubs,
  SPADES: spades,
};

export const Card: React.FC<CardProps> = ({ isGameOn, currentCard }) => {
  const color =
    currentCard.suit === "HEARTS" || currentCard.suit === "DIAMONDS"
      ? "#7c0a02"
      : "white";
  const value =
    currentCard.value.length > 2 ? currentCard.value[0] : currentCard.value;
  const src = SVG_VALUES[currentCard.suit as keyof typeof SVG_VALUES];

  return (
    <CardSurface>
      {isGameOn && (
        <>
          <CardInfo>
            <div style={{ color: color }}>{value}</div>
            <img alt={currentCard.suit} src={src} width="60vw" />
          </CardInfo>
          <CardInfoUpsideDown>
            <div style={{ color: color }}>{value}</div>
            <img alt={currentCard.suit} src={src} width="60vw" />
          </CardInfoUpsideDown>
        </>
      )}
    </CardSurface>
  );
};

const CardSurface = styled.div`
  width: 20vw;
  height: 60vh;
  padding: 1.5vh;
  margin: 5vh;
  display: grid;

  border-style: solid;
  border-color: white;
  border-width: 1px;
  background: #131313;
  border-radius: 2vh;
`;
const CardInfo = styled.div`
  background-color: transparent;
  width: 3.5vw;
  text-align: center;
  font-size: 6vh;
  justify-self: start;
`;

const CardInfoUpsideDown = styled(CardInfo)`
  justify-self: end;
  transform: rotate(180deg);
`;
