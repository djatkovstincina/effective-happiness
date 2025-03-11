import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { BlogPost, User } from "../../data/data";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setSelectedUser } from "../../redux/user/userSlice";

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

        const isExpanded = expandedUser === user.id;
        const userPosts = blogPosts.filter((post: BlogPost) => post.userId === user.id);

        return (
            <>
                <tr
                    onClick={() => handleRowClick(user.id)}
                    style={style}
                    className={`grid grid-cols-6 border-b border-gray-300 cursor-pointer ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                        }`}
                >
                    <td className="p-2">{user.id}</td>
                    <td className="p-2">{user.first_name} {user.last_name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.gender}</td>
                    <td className="p-2">{user.ip_address}</td>
                    <td className="p-2 flex gap-2">
                        <button
                            onClick={(event) => {
                                handleEventPropagation(event);
                                handleOpenModalForUser(user.id, `${user.first_name} ${user.last_name}`);
                            }}
                            className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 cursor-pointer"
                            type="button"
                        >
                            Delete User
                        </button>
                        <button
                            onClick={handleAddBlogPost}
                            className="ml-3 px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 cursor-pointer"
                            type="button"
                        >
                            Add Blog
                        </button>
                    </td>
                    {isExpanded && (
                        <div className="bg-white p-4 col-span-6 overflow-y-auto">
                            <h3 className="font-bold mb-2">{user.first_name}'s blog posts:</h3>
                            {userPosts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {userPosts.map((post: BlogPost) => (
                                        <div
                                            key={post.id}
                                            onClick={(event) => {
                                                handleEventPropagation(event);
                                                navigate(`/blog/${user.id}/${post.id}`);
                                            }}
                                            className="p-4 bg-gray-100 rounded shadow cursor-pointer hover:bg-gray-200"
                                        >
                                            <h4 className="font-semibold text-lg">{post.title.substring(0, 30)}...</h4>
                                            <p className="text-sm text-gray-700">{post.body.substring(0, 100)}...</p>
                                            <button
                                                onClick={(event) => {
                                                    handleEventPropagation(event);
                                                    handleOpenModalForPost(post.id, post.title);
                                                }}
                                                className="mt-2 px-3 py-1 bg-red-500 text-white text-xs sm:text-sm rounded hover:bg-red-600"
                                                type="button"
                                            >Delete Post</button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No posts found.</p>
                            )}
                        </div>
                    )}
                </tr>
            </>
        );
    },
);

export default TableRow;
