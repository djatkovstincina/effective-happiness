import styled from "styled-components";

export const StyledWrapper = styled.div`
  padding: 24px;
  max-width: 1440px;
  margin: 0 auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

export const TableHeader = styled.thead`
  background-color: #f4f4f4;
  border-bottom: 1px solid #ddd;
`;

export const Row = styled.tr`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border-bottom: 1px solid #ddd;
`;

export const Cell = styled.td`
  padding: 10px;
  border: 0;
`;