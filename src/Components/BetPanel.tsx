import styled from "styled-components"

interface BetPanelProps {
    handleBet: (a: string) => void,
    startGame: () => void,
    continueGame: () => void,
    isContinue: boolean,
    isGameOn: boolean
}

export const BetPanel : React.FC<BetPanelProps> = ({handleBet, startGame, continueGame, isContinue, isGameOn}) => (
    <Panel>
        {isGameOn && <>
            <Button onClick={() => handleBet('0')}>Bet high</Button>
            <Button onClick={() => handleBet('1')}>Bet low</Button>
        </>}
        {!isGameOn && <>
            <Button onClick={startGame}>New game</Button>
            <Button onClick={continueGame} disabled={!isContinue} style={!isContinue ? { backgroundColor: 'white', cursor: 'auto' } : {}}>
                Continue
            </Button>
        </>}
    </Panel>
)

export const Button = styled.button`
    border: 3px solid #FFFFFF;
    border-radius: 2vh;
    background-color: transparent;
    color: white;
    width: 10vw;
    height: 5vh;
    font-size: 3vh; 
    cursor: pointer;
`

const Panel = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    justify-items: center;
    width: 25vw;
`