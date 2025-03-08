import React, { useEffect, useState, useRef } from "react";
import { VariableSizeList as List } from "react-window";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useAppDispatch } from "../hooks/useAppDispatch";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { fetchUsers, selectUsers } from "../redux/user/userSlice";
import { fetchBlogPosts, selectBlogPosts } from "../redux/blog/blogSlice";
import { GlobalStyles } from "./GlobalStyles/GlobalStyles";

import TableRow from "./Table/TableRow";
import { StyledWrapper, Table, TableHeader, Row, Cell } from "./Table/TableStyles";

import BlogPostPage from "../pages/BlogPostPage";


export const App = () => {
  const dispatch = useAppDispatch();
  const users = useTypedSelector(selectUsers);
  const blogPosts = useTypedSelector(selectBlogPosts);
  const [expandedUser, setExpandedUser] = useState<number | null>(null);

  const listRef = useRef<List>(null);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchBlogPosts());
  }, [dispatch]);

  const handleRowClick = (userId: number) => {
    setExpandedUser(expandedUser === userId ? null : userId);
    listRef.current?.resetAfterIndex(0);
  }

  const getItemSize = (index: number) => {
    const user = users[index];
    return expandedUser === user.id ? 320 : 40;
  };

  const itemData = { users, expandedUser, handleRowClick, blogPosts };

  return (
    <Router>
      <StyledWrapper>
        <GlobalStyles />

        <h1>NaviPartner Tech Test</h1>

        <h2>Create your app here!</h2>
        <p>Let's get you started:</p>
        <Routes>
          <Route path="/" element={
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
                ref={listRef}
                height={600}
                itemCount={users.length}
                itemSize={getItemSize}
                estimatedItemSize={40}
                width={1440}
                itemData={itemData}
              >
                {({ index, style }) => (
                  <TableRow index={index} style={style} data={itemData} />
                )}
              </List>
            </Table>
          } />
          <Route path="/blog/:postId" element={<BlogPostPage />} />
        </Routes>
      </StyledWrapper>
    </Router>
  );
};
