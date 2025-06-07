import React from 'react';
import UserSearchDropdown from './UserSearchDropdown';
import { UserDetails } from '../models/UserDetails';

interface UserDropDownProps {
    selectedUser: string | undefined;
    setSelectedUser: (userId: string) => void;
    label?: string;
    placeholder?: string;
}

export default function UserDropDown({
    selectedUser,
    setSelectedUser,
    label = "Select User",
    placeholder = "Search users..."
}: UserDropDownProps) {
    const [selectedUserObject, setSelectedUserObject] = React.useState<UserDetails | null>(null);

    const handleUserSelect = (user: UserDetails | null) => {
        setSelectedUserObject(user);
        setSelectedUser(user?.id || '');
    };

    return (
        <UserSearchDropdown
            selectedUser={selectedUserObject}
            onUserSelect={handleUserSelect}
            label={label}
            placeholder={placeholder}
            fullWidth
        />
    );
}
