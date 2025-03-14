import React, { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ConfirmationModal from "../components/Modal/ConfirmationModal";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { addBlogPost, deleteBlogPost, selectBlogPosts, updateBlogPost } from "../redux/blog/blogSlice";
import { selectSelectedUser } from "../redux/user/userSlice";

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

    return (
        <div className="mt-10 mx-auto max-w-3xl p-6">
            <button
                aria-label="Back to Users list"
                className="px-4 py-2 mb-8 bg-gray-300 hover:bg-gray-400 text-sm rounded cursor-pointer"
                onClick={() => navigate(-1)}
                type="button"
            >
                Back to Users list
            </button>

            {isEditing ? (
                <>
                    <p className="mb-4 font-semibold">
                        <strong>Author:</strong> {selectedUser?.first_name} {selectedUser?.last_name}
                    </p>

                    <div className="mb-6">
                        <label className="block mb-2 font-medium" htmlFor="title">Title</label>
                        <input
                            aria-describedby="title-desc"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            id="title"
                            name="title"
                            onChange={(event) => setTitle(event.target.value)}
                            type="text"
                            value={title}
                        />
                        <p className="text-sm text-gray-500" id="title-desc">Enter the blog post title.</p>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 font-medium" htmlFor="body">Post Body</label>
                        <textarea
                            aria-describedby="body-desc"
                            className="w-full h-40 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            id="body"
                            name="body"
                            onChange={(event) => setBody(event.target.value)}
                            value={body}
                        />
                        <p className="text-sm text-gray-500" id="body-desc">Enter the blog post text.</p>
                    </div>

                    <button
                        aria-label={loading ? "Saving..." : isNewPost ? "Create Post" : "Save"}
                        className={`px-4 py-2 mr-4 text-sm rounded cursor-pointer ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                        disabled={loading}
                        onClick={handleSave}
                        type="button"
                    >
                        {loading ? "Saving..." : isNewPost ? "Create Post" : "Save"}
                    </button>
                    <button
                        aria-label="Cancel"
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded cursor-pointer"
                        onClick={handleCancel}
                        type="button"
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
                        aria-label="Edit Post"
                        className="px-4 py-2 mr-4 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded cursor-pointer"
                        onClick={() => setIsEditing(true)}
                        type="button"
                    >
                        Edit Post
                    </button>
                    <button
                        aria-label="Delete Post"
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded cursor-pointer"
                        onClick={handleOpenDeleteModal}
                        type="button"
                    >
                        Delete Post
                    </button>
                </>
            )}

            <ConfirmationModal
                aria-live="assertive"
                isOpen={isModalOpen}
                message={`Are you sure you want to delete the post "${post?.title}"?`}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeletePost}
            />
        </div>
    );
};

export default BlogPostPage;
