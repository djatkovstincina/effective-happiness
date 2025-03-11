import React, { useState, useCallback } from "react";
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

    if (!post && !isNewPost) {
        return <h2>Blog post not found</h2>;
    }

    const buttonStyle = { padding: "12px", cursor: "pointer", marginBottom: "32px", marginRight: "24px" };
    const deleteButtonStyle = { ...buttonStyle, backgroundColor: "red", color: "white", border: "none" };

    const actionButtons = isEditing ? (
        <>
            <button disabled={loading} onClick={handleSave} style={buttonStyle} type="button">
                {loading ? "Saving..." : isNewPost ? "Create Post" : "Save"}
            </button>
            <button onClick={handleCancel} style={buttonStyle} type="button">
                Cancel
            </button>
        </>
    ) : (
        <button onClick={() => setIsEditing(true)} style={buttonStyle} type="button">
            Edit Post
        </button>
    );

    const deleteButton = !isNewPost && !isEditing && (
        <button onClick={handleOpenDeleteModal} style={deleteButtonStyle} type="button">
            Delete Post
        </button>
    );

    return (
        <div style={{ marginTop: "40px" }}>
            <button onClick={() => navigate(-1)} style={buttonStyle} type="button">
                Back to Users list
            </button>
            {actionButtons}
            {deleteButton}
            {isEditing ? (
                <>
                    <p style={{ marginBottom: "18px" }}>
                        <strong>Author ID:</strong> {[post?.userId]}
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
                    <h1 style={{ marginBottom: "24px" }}>{post?.title}</h1>
                    <p style={{ marginBottom: "18px" }}>
                        <strong>Author ID:</strong> {post?.userId}
                    </p>
                    <p>{post?.body}</p>
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
