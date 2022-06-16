import styled from "styled-components"

export default function BetPanel(props: any) {
    return (
        
        <Panel>
            {props.isGameOn && <>
                <Button onClick={() => props.handleBet(0)}>Bet high</Button>
                <Button onClick={() => props.handleBet(1)}>Bet low</Button>
            </>}
            {!props.isGameOn && <>
                <Button onClick={props.startGame}>Start the game</Button>
                <Button onClick={props.continueGame} disabled={!props.isContinue} style={!props.isContinue ? {backgroundColor: 'white', cursor: 'auto'} : {}}>Continue</Button>
            </>}
        </Panel>
    )
}

const Button = styled.button`
    border: 3px solid #FFFFFF;
    border-radius: 20px;
    background-color: transparent;
    color: white;
    width: 200px;
    height: 50px;
    font-size: 25px; 
    cursor: pointer;
`

const Panel = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    justify-items: center;
    width: 600px;
`