import styled from "styled-components";

export default function HistoryPanel(props: any) {
    return (
        <Panel>
            {props.entry.map((e: any, i: number) =><span key={i}>{e}</span>)}
        </Panel>
    )
}

const Panel = styled.div`
    margin-left:50px;
    margin-right:50px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    border-style: dotted;
    border-width: 0px 0px 1px 0px; 
`