import React, { memo } from "react";
import { Row, Cell } from "./TableStyles";
import { TableRowProps } from "../../types/TableRowProps";

// I've optimized the table by wrapping each row in a memoized TableRow component to prevent unnecessary re-renders
const TableRow = memo(({ index, style, data }: TableRowProps) => {
    const user = data[index];
    const rowStyle = index % 2 === 0 ? { backgroundColor: '#f9f9f9' } : { backgroundColor: '#fff' };

    return (
        <Row style={{ ...style, ...rowStyle }}>
            <Cell>{user.id}</Cell>
            <Cell>{user.first_name} {user.last_name}</Cell>
            <Cell>{user.email}</Cell>
            <Cell>{user.gender}</Cell>
            <Cell>{user.ip_address}</Cell>
        </Row>
    );
});

export default TableRow;
