import styled from "styled-components";

interface ScorePanelProps {
  points: number;
  roundsLeft: number;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({
  points,
  roundsLeft,
}) => (
  <Panel>
    Score: {points / 10} <br />
    Rounds left: {roundsLeft}
  </Panel>
);

const Panel = styled.div`
  font-size: 3vh;
  color: white;
  width: 15vw;
  height: 10vh;
  align-self: end;
  text-align: start;
`;
