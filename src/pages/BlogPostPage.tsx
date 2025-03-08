import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ConfirmationModal from "../components/Modal/ConfirmationModal";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { deleteBlogPost,selectBlogPosts, updateBlogPost } from "../redux/blog/blogSlice";

const BlogPostPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const blogPosts = useTypedSelector(selectBlogPosts);
    const post = blogPosts.find((userPost) => userPost.id === postId);

    const [title, setTitle] = useState(post?.title || "");
    const [body, setBody] = useState(post?.body || "");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!post) {
        return <h2>Blog post not found</h2>;
    }

    const handleSave = async () => {
        setLoading(true);
        try {
            await dispatch(updateBlogPost({ id: post.id, title, body })).unwrap();
            setIsEditing(false);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Failed to update post:", error);
        }
        setLoading(false);
    };

    const handleDeletePost = () => {
        if (post) {
            dispatch(deleteBlogPost(post.id));
            setIsModalOpen(false);
            navigate("/");
        }
    };

    const handleOpenDeleteModal = () => {
        setIsModalOpen(true);
    };

    return (
        <div style={{ marginTop: "40px" }}>
            <button
                onClick={() => navigate(-1)}
                style={{ marginBottom: "32px", padding: "12px", cursor: "pointer" }}
                type="button"
            >
                Back to Users list
            </button>
            {isEditing ? (
                <>
                    <button
                        disabled={loading}
                        onClick={handleSave}
                        style={{ marginTop: "32px", marginLeft: "24px", padding: "12px", cursor: "pointer" }}
                        type="button"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        style={{ marginTop: "32px", marginLeft: "24px", padding: "12px", cursor: "pointer" }}
                        type="button"
                    >
                        Cancel
                    </button>
                </>
            ) : (
                <button
                    onClick={() => setIsEditing(true)}
                    style={{ marginTop: "32px", marginLeft: "24px", padding: "12px", cursor: "pointer" }}
                    type="button"
                >
                    Edit Post
                </button>
            )}
            <button
                onClick={handleOpenDeleteModal}
                style={{
                    marginTop: "32px",
                    marginLeft: "24px",
                    padding: "12px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                }}
                type="button"
            >
                Delete Post
            </button>
            {isEditing ? (
                <>
                    <p style={{ marginBottom: "18px" }}>
                        <strong>Author ID:</strong> {post.userId}
                    </p>
                    <div style={{ display: "block" }}>
                        <label
                            htmlFor="title"
                            style={{ display: "block", width: "100%", marginBottom: "4px" }}
                        >
                            Title
                        </label>
                        <input
                            aria-label="Edit post title"
                            id="title"
                            name="title"
                            onChange={(event) => setTitle(event.target.value)}
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "8px",
                                marginBottom: "12px",
                                border: "1px solid #ddd",
                            }}
                            type="text"
                            value={title}
                        />
                    </div>
                    <div style={{ display: "block" }}>
                        <label
                            htmlFor="body"
                            style={{ display: "block", width: "100%", marginBottom: "4px" }}
                        >
                            Post Body
                        </label>
                        <textarea
                            aria-label="Edit post body"
                            id="body"
                            name="body"
                            onChange={(event) => setBody(event.target.value)}
                            style={{
                                display: "block",
                                width: "100%",
                                height: "200px",
                                padding: "8px",
                                marginBottom: "12px",
                                border: "1px solid #ddd",
                            }}
                            value={body}
                        />
                    </div>
                </>
            ) : (
                <>
                    <h1 style={{ marginBottom: "24px" }}>{post.title}</h1>
                    <p style={{ marginBottom: "18px" }}>
                        <strong>Author ID:</strong> {post.userId}
                    </p>
                    <p>{post.body}</p>
                </>
            )}
            <ConfirmationModal
                isOpen={isModalOpen}
                message={`Are you sure you want to delete the post "${post.title}"?`}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeletePost}
            />
        </div>
    );
};

export default BlogPostPage;
