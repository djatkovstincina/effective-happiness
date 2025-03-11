import React, { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAppDispatch } from "../hooks/useAppDispatch";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { addBlogPost, deleteBlogPost, selectBlogPosts, updateBlogPost } from "../redux/blog/blogSlice";
import { selectSelectedUser } from "../redux/user/userSlice";

import ConfirmationModal from "../components/Modal/ConfirmationModal";

const BlogPostPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const selectedUser = useTypedSelector(selectSelectedUser);
    const blogPosts = useTypedSelector(selectBlogPosts);
    const post = blogPosts.find((userPost) => userPost.id === postId);

    const isNewPost = postId === undefined;

    const [title, setTitle] = useState(post?.title || "");
    const [body, setBody] = useState(post?.body || "");
    const [isEditing, setIsEditing] = useState(isNewPost || false);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSave = useCallback(async () => {
        setLoading(true);
        try {
            if (isNewPost && selectedUser) {
                if (!title || !body) {
                    alert('Please fill the title and the body text fields.');
                    setLoading(false);
                    return;
                }
                await dispatch(addBlogPost({ id: Date.now().toString(), title, body, userId: selectedUser.id })).unwrap();
            } else {
                if (!post?.id) {
                    // eslint-disable-next-line no-console
                    console.error("Post ID is missing");
                    return;
                }
                await dispatch(updateBlogPost({ id: post.id, title, body })).unwrap();
            }
            setIsEditing(false);
            navigate(-1);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Failed to update post:", error);
        }
        setLoading(false);
    }, [dispatch, navigate, isNewPost, selectedUser, title, body, post?.id]);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
        if (isNewPost) {
            navigate(-1);
        }
    }, [navigate]);

    const handleDeletePost = useCallback(() => {
        if (post) {
            dispatch(deleteBlogPost(post.id));
            setIsModalOpen(false);
            navigate("/");
        }
    }, [post, dispatch, navigate]);

    const handleOpenDeleteModal = () => {
        setIsModalOpen(true);
    };

    if (!post && !isNewPost) {
        return <h2 className="mt-10 text-center text-xl font-semibold">Blog post not found</h2>;
    }

    const buttonStyle = { padding: "12px", cursor: "pointer", marginBottom: "32px", marginRight: "24px" };
    const deleteButtonStyle = { ...buttonStyle, backgroundColor: "red", color: "white", border: "none" };

    return (
        <div className="mt-10 mx-auto max-w-3xl p-6">
            <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 mb-8 bg-gray-300 hover:bg-gray-400 text-sm rounded cursor-pointer"
            >
                Back to Users list
            </button>

            {isEditing ? (
                <>
                    <p className="mb-4 font-semibold">
                        <strong>Author ID:</strong> {post?.userId}
                    </p>

                    <div className="mb-6">
                        <label htmlFor="title" className="block mb-2 font-medium">Title</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="body" className="block mb-2 font-medium">Post Body</label>
                        <textarea
                            id="body"
                            name="body"
                            value={body}
                            onChange={(event) => setBody(event.target.value)}
                            className="w-full h-40 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        disabled={loading}
                        onClick={handleSave}
                        className={`px-4 py-2 mr-4 text-sm rounded cursor-pointer ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                    >
                        {loading ? "Saving..." : isNewPost ? "Create Post" : "Save"}
                    </button>
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded cursor-pointer"
                    >
                        Cancel
                    </button>
                </>
            ) : (
                <>
                    <h1 className="mb-6 text-2xl font-bold">{post?.title}</h1>
                    <p className="mb-4 text-gray-600">
                        <strong>Author ID:</strong> {post?.userId}
                    </p>
                    <p className="mb-6">{post?.body}</p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 mr-4 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded cursor-pointer"
                    >
                        Edit Post
                    </button>
                    {!isNewPost && (
                        <button
                            onClick={handleOpenDeleteModal}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded cursor-pointer"
                        >
                            Delete Post
                        </button>
                    )}
                </>
            )}

            <ConfirmationModal
                isOpen={isModalOpen}
                message={`Are you sure you want to delete the post "${post?.title}"?`}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeletePost}
            />
        </div>
    );
};

export default BlogPostPage;
