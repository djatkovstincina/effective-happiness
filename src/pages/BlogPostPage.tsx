import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useTypedSelector } from "../hooks/useTypedSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { selectBlogPosts, updateBlogPost } from "../redux/blog/blogSlice";

const BlogPostPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const blogPosts = useTypedSelector(selectBlogPosts);
    const post = blogPosts.find((p) => p.id === postId);

    const [title, setTitle] = useState(post?.title || "");
    const [body, setBody] = useState(post?.body || "");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!post) {
        return <h2>Blog post not found</h2>;
    }

    const handleSave = async () => {
        setLoading(true);
        try {
            await dispatch(updateBlogPost({ id: post.id, title, body })).unwrap();
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update post:", error);
        }
        setLoading(false);
    }

    return (
        <div style={{ marginTop: "40px" }}>
            <button
                onClick={() => navigate(-1)}
                style={{ marginBottom: "32px", padding: "12px", cursor: "pointer" }}
            >
                Back to Users list
            </button>
            {isEditing ? (
                <>
                    <button onClick={handleSave} disabled={loading} style={{ marginLeft: "24px", padding: "12px", cursor: "pointer" }}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                    <button onClick={() => setIsEditing(false)} style={{ marginLeft: "24px", padding: "12px", cursor: "pointer" }}>
                        Cancel
                    </button>
                </>
            ) : (
                <button onClick={() => setIsEditing(true)} style={{ marginLeft: "24px", padding: "12px", cursor: "pointer" }}>
                    Edit Post
                </button>
            )}
            {isEditing ? (
                <>
                    <p style={{ marginBottom: "18px" }}><strong>Author ID:</strong> {post.userId}</p>
                    <div style={{ display: "block" }}>
                        <label
                            htmlFor="title"
                            style={{ display: "block", width: "100%", marginBottom: "4px" }}
                        >
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={title}
                            aria-label="Edit post title"
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ display: "block", width: "100%", padding: "8px", marginBottom: "12px", border: "1px solid #ddd" }}
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
                            id="body"
                            name="body"
                            value={body}
                            aria-label="Edit post body"
                            onChange={(e) => setBody(e.target.value)}
                            style={{ display: "block", width: "100%", height: "200px", padding: "8px", marginBottom: "12px", border: "1px solid #ddd" }}
                        />
                    </div>
                </>
            ) : (
                <>
                    <h1 style={{ marginBottom: "24px" }}>{post.title}</h1>
                    <p style={{ marginBottom: "18px" }}><strong>Author ID:</strong> {post.userId}</p>
                    <p>{post.body}</p>
                </>
            )}
        </div>
    );
};

export default BlogPostPage;