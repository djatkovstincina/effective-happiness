import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { VariableSizeList as List } from "react-window";

import { useAppDispatch } from "../hooks/useAppDispatch";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { deleteBlogPost, fetchBlogPosts, selectBlogPosts } from "../redux/blog/blogSlice";
import { deleteUser, fetchUsers, selectUsers } from "../redux/user/userSlice";

import Header from "../components/Header/Header";
import TableRow from "./Table/TableRow";
import BlogPostPage from "../pages/BlogPostPage";
import ConfirmationModal from "../components/Modal/ConfirmationModal";

export const App = () => {
  const dispatch = useAppDispatch();

  const users = useTypedSelector(selectUsers);
  const blogPosts = useTypedSelector(selectBlogPosts);

  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: number; name: string; } | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedPostTitle, setSelectedPostTitle] = useState<string>("");
  const [modalType, setModalType] = useState<"user" | "post" | null>(null);

  const listRef = useRef<List>(null);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchBlogPosts());
  }, [dispatch]);

  const handleRowClick = (userId: number) => {
    setExpandedUser(expandedUser === userId ? null : userId);
    listRef.current?.resetAfterIndex(0);
  };

  const handleOpenModalForUser = (id: number, name: string) => {
    setUserToDelete({ id, name });
    setSelectedPostId(null);
    setModalType("user");
    setIsModalOpen(true);
  };

  const handleOpenModalForPost = (postId: string, postTitle: string) => {
    setSelectedPostId(postId);
    setSelectedPostTitle(postTitle);
    setUserToDelete(null);
    setModalType("post");
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

  const handleDeletePost = () => {
    if (selectedPostId) {
      dispatch(deleteBlogPost(selectedPostId));
      setIsModalOpen(false);
    }
  };

  const getItemSize = (index: number) => {
    const user = users[index];
    return expandedUser === user.id ? 420 : 45;
  };

  const itemData = {
    users,
    expandedUser,
    handleRowClick,
    blogPosts,
    handleOpenModalForUser,
    handleOpenModalForPost,
  };

  return (
    <Router>
      <div className="py-6 max-w-[1440px] mx-auto">
        <Header />
        <Routes>
          <Route
            element={
              <div className="mt-4 border border-gray-300 rounded-md overflow-hidden">
                <table className="w-full border-collapse" aria-label="User Table">
                  <thead>
                    <tr className="grid grid-cols-6 bg-gray-200 border-b border-gray-300">
                      <th scope="col" className="p-2 text-left">ID</th>
                      <th scope="col" className="p-2 text-left">Name</th>
                      <th scope="col" className="p-2 text-left">Email</th>
                      <th scope="col" className="p-2 text-left">Gender</th>
                      <th scope="col" className="p-2 text-left">IP Address</th>
                      <th scope="col" className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <List
                      estimatedItemSize={45}
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
                  </tbody>
                </table>
              </div>
            }
            path="/"
          />
          <Route element={<BlogPostPage />} path="/blog/:userId/new" />
          <Route element={<BlogPostPage />} path="/blog/:userId/:postId" />
        </Routes>

        <ConfirmationModal
          isOpen={isModalOpen}
          message={
            modalType === "user" && userToDelete
              ? `Are you sure you want to delete user ${userToDelete.name}?`
              : `Are you sure you want to delete the post "${selectedPostTitle}"?`
          }
          onClose={() => setIsModalOpen(false)}
          onConfirm={modalType === "user" && userToDelete ? handleDeleteUser : handleDeletePost}
        />
      </div>
    </Router>
  );
};
