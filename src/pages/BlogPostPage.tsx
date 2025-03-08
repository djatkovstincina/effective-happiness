import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useTypedSelector } from "../hooks/useTypedSelector";
import { selectBlogPosts } from "../redux/blog/blogSlice";

const BlogPostPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const blogPosts = useTypedSelector(selectBlogPosts);
    
    const post = blogPosts.find((p) => p.id === postId);

    if (!post) {
        return <h2>Blog post not found</h2>;
    }

    return (
        <div style={{ marginTop: "40px" }}>
            <button 
                onClick={() => navigate(-1)} 
                style={{marginBottom: "32px", padding: "12px", cursor: "pointer"}}
            >
                Back to Users list
            </button>
            <h1 style={{ marginBottom: "24px" }}>{post.title}</h1>
            <p style={{ marginBottom: "18px" }}><strong>Author ID:</strong> {post.userId}</p>
            <p>{post.body}</p>
        </div>
    );
};

export default BlogPostPage;