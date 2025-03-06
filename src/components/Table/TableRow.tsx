import React, { memo } from "react";

import { User } from "../../data/data";
import { BlogPost } from "../../data/data";

import { Row, Cell } from "./TableStyles";

interface ItemData {
    users: User[];
    expandedUser: number | null;
    handleRowClick: (userId: number) => void;
    blogPosts: BlogPost[];
}

// I've optimized the table by wrapping each row in a memoized TableRow component to prevent unnecessary re-renders
const TableRow = memo(({ index, style, data }: { index: number; style: React.CSSProperties; data: ItemData }) => {
    const { users, expandedUser, handleRowClick, blogPosts } = data;
    const user = users[index];

    const rowStyle = index % 2 === 0 ? { backgroundColor: '#f9f9f9' } : { backgroundColor: '#fff' };
    const isExpanded = expandedUser === user.id;
    const userPosts = blogPosts.filter((post: BlogPost) => post.userId === user.id);

    return (
        <>
            <Row style={{ ...style, ...rowStyle }} onClick={() => handleRowClick(user.id)}>
                <Cell>{user.id}</Cell>
                <Cell>{user.first_name} {user.last_name}</Cell>
                <Cell>{user.email}</Cell>
                <Cell>{user.gender}</Cell>
                <Cell>{user.ip_address}</Cell>
                {isExpanded && (
                    <div style={{ backgroundColor: "#fff", padding: "10px", gridColumn: "span 5" }}>
                        <h3>{user.first_name}'s blog posts:</h3>
                        {userPosts.length > 0 ? (
                            <ul style={{ padding: "4px 10px 4px 20px" }}>
                                {userPosts.map((post: BlogPost) => (
                                    <li key={post.id} style={{ padding: "10px" }}>
                                        <h4>{post.title.substring(0, 30)}...</h4>
                                        <p>{post.body.substring(0, 100)}...</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No post found.</p>
                        )}
                    </div>
                )}
            </Row>

        </>
    );
});

export default TableRow;
