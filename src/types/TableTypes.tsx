import { BlogPost, User } from "../data/data";

export interface TableProps {
    users: User[];
    expandedUser: number | null;
    handleRowClick: (userId: number) => void;
    blogPosts: BlogPost[];
    handleOpenModalForUser: (userId: number, userName: string) => void;
    handleOpenModalForPost: (postId: string, postTitle: string) => void;
}