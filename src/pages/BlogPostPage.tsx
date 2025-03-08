import React from "react";
import { useParams } from "react-router-dom";

import { useTypedSelector } from "../hooks/useTypedSelector";
import { selectBlogPosts } from "../redux/blog/blogSlice";

const BlogPostPage = () => {
    const { postId } = useParams();
    const blogPosts = useTypedSelector(selectBlogPosts);
    const post = blogPosts.find((p) => p.id === postId);

    if (!post) {
        return <h2>Blog post not found</h2>;
    }

    return (
        <div style={{ marginTop: "40px" }}>
            <h1 style={{ marginBottom: "24px" }}>{post.title}</h1>
            <p style={{ marginBottom: "18px" }}><strong>Author ID:</strong> {post.userId}</p>
            <p>{post.body}</p>
        </div>
    );
};

export default BlogPostPage;