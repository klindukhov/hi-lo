import styled from "styled-components";

interface HistoryPanelProps {
  entry: string[];
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ entry }) => (
  <Panel>
    {entry.map((e: string, i: number) => (
      <span key={i}>{e}</span>
    ))}
  </Panel>
);

const Panel = styled.div`
  margin-left: 2.5vw;
  margin-right: 2.5vw;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  border-style: dotted;
  border-width: 0px 0px 1px 0px;
`;
