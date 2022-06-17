import styled from "styled-components"

interface ScorePanelProps {
    points: number,
    roundsLeft: number
}

export const ScorePanel: React.FC<ScorePanelProps> = ({ points, roundsLeft }) => (
    <Panel>
        Score: {points / 10} <br />
        Rounds left: {roundsLeft}
    </Panel>
)

const Panel = styled.div`
    font-size: 30px;
    color: white;
    width: 300px;
    height: 100px;
    align-self: end;
    text-align: start;
    margin: 0px;
`