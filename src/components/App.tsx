import React, { useEffect } from "react";
import styled from "styled-components";

import { useAppDispatch } from "../hooks/useAppDispatch";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { fetchUsers, selectUsers } from "../redux/user/userSlice";
import { GlobalStyles } from "./GlobalStyles/GlobalStyles";

const StyledWrapper = styled.div`
  padding: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  background: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

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
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Gender</Th>
            <Th>IP Address</Th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <Td>{user.id}</Td>
              <Td>{user.first_name} {user.last_name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.gender}</Td>
              <Td>{user.ip_address}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </StyledWrapper>
  );
};
