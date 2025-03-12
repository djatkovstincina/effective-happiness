import { useEffect, useState } from "react";

import { deleteBlogPost, fetchBlogPosts, selectBlogPosts } from "../redux/blog/blogSlice";
import { deleteUser, fetchUsers, selectUsers } from "../redux/user/userSlice";
import { useAppDispatch } from "./useAppDispatch";
import { useTypedSelector } from "./useTypedSelector";

export const useAppState = () => {
    const dispatch = useAppDispatch();
    const users = useTypedSelector(selectUsers);
    const blogPosts = useTypedSelector(selectBlogPosts);

    const [expandedUser, setExpandedUser] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [selectedPostTitle, setSelectedPostTitle] = useState<string>("");
    const [modalType, setModalType] = useState<"user" | "post" | null>(null);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchBlogPosts());
    }, [dispatch]);

    const handleRowClick = (userId: number) => {
        setExpandedUser(expandedUser === userId ? null : userId);
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
        }
    };

    const handleDeletePost = () => {
        if (selectedPostId) {
            dispatch(deleteBlogPost(selectedPostId));
            setIsModalOpen(false);
        }
    };

    return {
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
    };
};
