import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { User } from "../../data/data";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setSelectedUser } from "../../redux/user/userSlice";
import { TableProps } from "../../types/TableTypes";

const Table: React.FC<TableProps> = ({ users, blogPosts, expandedUser, handleRowClick, handleOpenModalForUser, handleOpenModalForPost }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [filter, setFilter] = useState("");
    const [page, setPage] = useState(0);
    const pageSize = 50;

    const filteredUsers = useMemo(() => users.filter(user =>
        user.first_name.toLowerCase().includes(filter.toLowerCase()) ||
        user.last_name.toLowerCase().includes(filter.toLowerCase()) ||
        user.email.toLowerCase().includes(filter.toLowerCase())
    ), [users, filter]);

    const paginatedUsers = useMemo(() => filteredUsers.slice(page * pageSize, (page + 1) * pageSize), [filteredUsers, page, pageSize]);

    useEffect(() => {
        setPage(0);
    }, [filter]);

    const handleEventPropagation = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            { accessorKey: "id", header: "ID" },
            {
                id: "name",
                header: "Name",
                cell: ({ row }) => `${row.original.first_name} ${row.original.last_name}`,
            },
            { accessorKey: "email", header: "Email" },
            { accessorKey: "gender", header: "Gender" },
            { accessorKey: "ip_address", header: "IP Address" },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <button
                        className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 cursor-pointer"
                        onClick={(event) => {
                            handleEventPropagation(event);
                            handleOpenModalForUser(row.original.id, `${row.original.first_name} ${row.original.last_name}`);
                        }}
                        type="button"
                    >
                        Delete User
                    </button>
                ),
            },
        ],
        [handleOpenModalForUser]
    );

    const table = useReactTable({
        data: paginatedUsers,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="mt-4 border border-gray-300 rounded-md overflow-hidden">
            <div className="p-2 flex justify-center items-center">
                <label htmlFor="search">
                    Search users by name or email
                </label>
                <input
                    name="search"
                    id="search"
                    className="ml-4 p-2 border border-gray-300 rounded-md"
                    onChange={(event) => setFilter(event.target.value)}
                    placeholder="Search users..."
                    type="text"
                    value={filter}
                />
            </div>
            <table className="w-full border-collapse table-auto">
                <thead className="bg-gray-200 border-b border-gray-300">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th className="p-2 text-left" key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => {
                        const user = row.original;

                        const handleAddBlogPost = () => {
                            dispatch(setSelectedUser(user));
                            navigate(`/blog/${user.id}/new`);
                        };

                        return (
                            <React.Fragment key={row.id}>
                                <tr
                                    className={` border-b border-gray-200 cursor-pointer ${row.original.id % 2 === 0 ? "bg-gray-100" : "bg-white"
                                        }`}
                                    onClick={() => handleRowClick(user.id)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td className="p-2" key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>

                                {expandedUser === user.id && (
                                    <tr className="bg-white p-4">
                                        <td className="p-4" colSpan={6}>
                                            <div className="flex items-center mb-2">
                                                <h3 className="text-lg font-semibold">{user.first_name}'s Blog Posts</h3>
                                                <button
                                                    className="ml-3 px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 cursor-pointer"
                                                    onClick={handleAddBlogPost}
                                                    type="button"
                                                >
                                                    + Add Blog
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                {blogPosts
                                                    .filter((post) => post.userId === user.id)
                                                    .map((post) => (
                                                        <div
                                                            className="p-4 bg-gray-100 rounded shadow cursor-pointer hover:bg-gray-200"
                                                            key={post.id}
                                                            onClick={(event) => {
                                                                handleEventPropagation(event);
                                                                navigate(`/blog/${user.id}/${post.id}`);
                                                            }}
                                                        >
                                                            <h4 className="font-semibold text-base mb-2">{post.title.substring(0, 30)}...</h4>
                                                            <p className="text-sm text-gray-700 mb-2"><i>Author: {user.first_name} {user.last_name}</i></p>
                                                            <p className="text-sm text-gray-700 mb-2">{post.body.substring(0, 100)}...</p>
                                                            <button
                                                                className="mt-2 px-3 py-1 bg-red-500 text-white text-xs sm:text-sm rounded hover:bg-red-600 cursor-pointer"
                                                                onClick={() => handleOpenModalForPost(post.id, post.title)}
                                                                type="button"
                                                            >
                                                                Delete Post
                                                            </button>
                                                        </div>
                                                    ))}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
            <div className="mt-2 p-2 flex justify-between">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    disabled={page === 0}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    type="button"
                >
                    Previous
                </button>
                <span>Page {page + 1} of {Math.ceil(filteredUsers.length / pageSize)}</span>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    disabled={(page + 1) * pageSize >= filteredUsers.length}
                    onClick={() => setPage((prev) => (prev + 1 < Math.ceil(filteredUsers.length / pageSize) ? prev + 1 : prev))}
                    type="button"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Table;
