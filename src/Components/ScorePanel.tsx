import styled from "styled-components"

export default function ScorePanel(props: any){
    return(
        <Panel>
            Score: {props.points/10} <br/>
            Rounds left: {props.roundsLeft}
        </Panel>
    )
}

const Panel = styled.div`
    font-size: 30px;
    color: white;
    width: 300px;
    height: 100px;
    align-self: end;
    text-align: start;
    margin: 0px;
`