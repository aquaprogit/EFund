import { useEffect, useState } from 'react';
import { userRepository } from '../../users/api/userRepository';
import { UserDetails } from '../../users/models/UserDetails';

interface UseUsersProps {
    initialUserId?: string;
}

export const useUsers = ({ initialUserId }: UseUsersProps = {}) => {
    const [allUsers, setAllUsers] = useState<UserDetails[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | undefined>(initialUserId);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchUsers = async (searchQuery = '') => {
        setLoading(true);
        try {
            const { data: users } = await userRepository.getUsersMinimized(searchQuery);
            if (users) {
                setAllUsers(users);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        allUsers,
        selectedUser,
        setSelectedUser,
        loading,
        refreshUsers: fetchUsers
    };
}; 