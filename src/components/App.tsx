import React, { useEffect } from "react";
// I have added the FixedSizeList to render a large list of users with a fixed item size, so it is gradually rendered as the user scrolls
import { FixedSizeList as List } from "react-window";

import { useAppDispatch } from "../hooks/useAppDispatch";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { fetchUsers, selectUsers } from "../redux/user/userSlice";
import { GlobalStyles } from "./GlobalStyles/GlobalStyles";

import TableRow from "./Table/TableRow";
import { StyledWrapper, Table, TableHeader, Row, Cell } from "./Table/TableStyles";


export const App = () => {
  const dispatch = useAppDispatch();
  const users = useTypedSelector(selectUsers);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  return (
    <StyledWrapper>
      <GlobalStyles />

      <h1>NaviPartner Tech Test</h1>

      <h2>Create your app here!</h2>
      <p>Let's get you started:</p>
      <Table>
        <TableHeader>
          <Row>
            <Cell>ID</Cell>
            <Cell>Name</Cell>
            <Cell>Email</Cell>
            <Cell>Gender</Cell>
            <Cell>IP Address</Cell>
          </Row>
        </TableHeader>
        <List
          height={600}
          itemCount={users.length}
          itemSize={40}
          width={1440}
          itemData={users}
        >
          {TableRow}
        </List>
      </Table>
    </StyledWrapper>
  );
};
