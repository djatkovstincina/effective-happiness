import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { BlogPost, User } from "../../data/data";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setSelectedUser } from "../../redux/user/userSlice";
import { Cell, Row } from "./TableStyles";

interface ItemData {
    users: User[];
    expandedUser: number | null;
    handleRowClick: (userId: number) => void;
    blogPosts: BlogPost[];
    handleOpenModalForUser: (userId: number, userName: string) => void;
    handleOpenModalForPost: (postId: string, postTitle: string) => void;
}

const TableRow = memo(
    ({ index, style, data }: { index: number; style: React.CSSProperties; data: ItemData }) => {
        const { users, expandedUser, handleRowClick, blogPosts, handleOpenModalForUser, handleOpenModalForPost } = data;
        const user = users[index];
        const navigate = useNavigate();
        const dispatch = useAppDispatch();

        const handleAddBlogPost = useCallback(() => {
            dispatch(setSelectedUser(user));
            navigate(`/blog/${user.id}/new`);
        }, [dispatch, navigate, user]);

        const handleEventPropagation = (event: React.MouseEvent) => {
            event.stopPropagation();
        };

        const rowStyle =
            index % 2 === 0
                ? { backgroundColor: "#f9f9f9" }
                : { backgroundColor: "#fff" };
        const isExpanded = expandedUser === user.id;
        const userPosts = blogPosts.filter(
            (post: BlogPost) => post.userId === user.id,
        );

        return (
            <>
                <Row
                    onClick={() => handleRowClick(user.id)}
                    style={{ ...style, ...rowStyle }}
                >
                    <Cell>{user.id}</Cell>
                    <Cell>
                        {user.first_name} {user.last_name}
                    </Cell>
                    <Cell>{user.email}</Cell>
                    <Cell>{user.gender}</Cell>
                    <Cell>{user.ip_address}</Cell>
                    <Cell>
                        <button
                            onClick={(event) => {
                                handleEventPropagation(event);
                                handleOpenModalForUser(user.id, `${user.first_name} ${user.last_name}`,
                                );
                            }}
                            style={{ padding: "2px 8px", cursor: "pointer", backgroundColor: "red", color: "white" }}
                            type="button"
                        >
                            Delete User
                        </button>
                        <button
                            onClick={handleAddBlogPost}
                            style={{ marginLeft: "12px", padding: "2px 8px", cursor: "pointer", color: "white", backgroundColor: "green" }}
                            type="button"
                        >
                            Add Blog
                        </button>
                    </Cell>
                    {isExpanded ? (
                        <div
                            style={{
                                backgroundColor: "#fff",
                                padding: "10px",
                                gridColumn: "span 6",
                                overflowY: "auto"
                            }}
                        >
                            <h3>{user.first_name}'s blog posts:</h3>
                            {userPosts.length > 0 ? (
                                <ul style={{ padding: "4px 10px 4px 20px" }}>
                                    {userPosts.map((post: BlogPost) => (
                                        <li
                                            key={post.id}
                                            onClick={(event) => {
                                                handleEventPropagation(event);
                                                navigate(`/blog/${user.id}/${post.id}`);
                                            }}
                                            style={{ padding: "10px" }}
                                        >
                                            <h4>{post.title.substring(0, 30)}...</h4>
                                            <p>{post.body.substring(0, 100)}...</p>
                                            <button
                                                onClick={(event) => {
                                                    handleEventPropagation(event);
                                                    handleOpenModalForPost(post.id, post.title);
                                                }}
                                                style={{ marginTop: "8px", padding: "2px 8px", backgroundColor: "red", color: "white", cursor: "pointer" }}
                                                type="button"
                                            >Delete Post</button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No post found.</p>
                            )}
                        </div>
                    ) : null}
                </Row>
            </>
        );
    },
);

export default TableRow;
