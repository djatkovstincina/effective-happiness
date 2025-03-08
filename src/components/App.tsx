import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { VariableSizeList as List } from "react-window";

import ConfirmationModal from "../components/Modal/ConfirmationModal";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useTypedSelector } from "../hooks/useTypedSelector";
import BlogPostPage from "../pages/BlogPostPage";
import { fetchBlogPosts, selectBlogPosts } from "../redux/blog/blogSlice";
import { deleteUser, fetchUsers, selectUsers } from "../redux/user/userSlice";
import { GlobalStyles } from "./GlobalStyles/GlobalStyles";
import TableRow from "./Table/TableRow";
import {
  Cell,
  Row,
  StyledWrapper,
  Table,
  TableHeader,
} from "./Table/TableStyles";

export const App = () => {
  const dispatch = useAppDispatch();
  const users = useTypedSelector(selectUsers);
  const blogPosts = useTypedSelector(selectBlogPosts);
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const listRef = useRef<List>(null);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchBlogPosts());
  }, [dispatch]);

  const handleRowClick = (userId: number) => {
    setExpandedUser(expandedUser === userId ? null : userId);
    listRef.current?.resetAfterIndex(0);
  };

  const handleOpenModal = (id: number, name: string) => {
    setUserToDelete({ id, name });
    setIsModalOpen(true);
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete.id));
      setIsModalOpen(false);
      setExpandedUser(null);
      listRef.current?.resetAfterIndex(0);
    }
  };

  const getItemSize = (index: number) => {
    const user = users[index];
    return expandedUser === user.id ? 320 : 40;
  };

  const itemData = {
    users,
    expandedUser,
    handleRowClick,
    blogPosts,
    handleOpenModal,
  };

  return (
    <Router>
      <StyledWrapper>
        <GlobalStyles />

        <h1>NaviPartner Tech Test</h1>

        <h2>Create your app here!</h2>
        <p>Let's get you started:</p>
        <Routes>
          <Route
            element={
              <Table>
                <TableHeader>
                  <Row>
                    <Cell>ID</Cell>
                    <Cell>Name</Cell>
                    <Cell>Email</Cell>
                    <Cell>Gender</Cell>
                    <Cell>IP Address</Cell>
                    <Cell>Action</Cell>
                  </Row>
                </TableHeader>
                <List
                  estimatedItemSize={40}
                  height={600}
                  itemCount={users.length}
                  itemData={itemData}
                  itemSize={getItemSize}
                  ref={listRef}
                  width={1440}
                >
                  {({ index, style }) => (
                    <TableRow data={itemData} index={index} style={style} />
                  )}
                </List>
              </Table>
            }
            path="/"
          />
          <Route element={<BlogPostPage />} path="/blog/:postId" />
        </Routes>
        <ConfirmationModal
          isOpen={isModalOpen}
          message={`Are you sure you want to delete user ${userToDelete?.name}?`}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDeleteUser}
        />
      </StyledWrapper>
    </Router>
  );
};
