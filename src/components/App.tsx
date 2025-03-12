import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "../components/Header/Header";
import ConfirmationModal from "../components/Modal/ConfirmationModal";
import Table from "../components/Table/Table";
import { useAppState } from "../hooks/useAppState";
import BlogPostPage from "../pages/BlogPostPage";

export const App = () => {
  const {
    users,
    blogPosts,
    expandedUser,
    isModalOpen,
    userToDelete,
    selectedPostTitle,
    modalType,
    handleRowClick,
    handleOpenModalForUser,
    handleOpenModalForPost,
    handleDeleteUser,
    handleDeletePost,
    setIsModalOpen,
  } = useAppState();

  return (
    <Router>
      <div className="p-6 max-w-[1440px] mx-auto">
        <Header />
        <Routes>
          <Route
            element={
              <Table
                blogPosts={blogPosts}
                expandedUser={expandedUser}
                handleOpenModalForPost={handleOpenModalForPost}
                handleOpenModalForUser={handleOpenModalForUser}
                handleRowClick={handleRowClick}
                users={users}
              />
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
