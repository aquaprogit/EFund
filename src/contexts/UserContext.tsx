import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import User from "../features/users/models/User";
import { useAuth } from "../features/auth/store/auth.store";
import { userRepository } from "../features/users/api/userRepository";

interface UserContextState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

interface UserContextValue extends UserContextState {
    updateUser: (user: User | null) => void;
    refreshUser: () => Promise<User | null>;
    clearUser: () => void;
    isAuthenticated: boolean;
}

const initialState: UserContextState = {
    user: null,
    loading: false,
    error: null
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export const UserProvider = ({ children }: PropsWithChildren) => {
    const [state, setState] = useState<UserContextState>(initialState);
    const { accessToken, refreshToken, signOut } = useAuth();

    const updateUser = useCallback((user: User | null) => {
        setState(prev => ({ ...prev, user, error: null }));
        if (!user) {
            signOut();
        }
    }, [signOut]);

    const clearUser = useCallback(() => {
        setState(initialState);
        signOut();
    }, [signOut]);

    const refreshUser = async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await userRepository.me();

            if (response.isSuccess && response.data) {
                setState(prev => ({
                    ...prev,
                    user: response.data as User,
                    loading: false,
                    error: null
                }));
                return response.data;
            }

            setState(prev => ({
                ...prev,
                user: null,
                loading: false,
                error: response.error?.message || 'Failed to fetch user data'
            }));
            signOut();
            return null;
        } catch (error) {
            setState(prev => ({
                ...prev,
                user: null,
                loading: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            }));
            signOut();
            return null;
        }
    };

    useEffect(() => {
        if (!state.user && accessToken && refreshToken && !state.loading) {
            refreshUser();
        }
    }, [state.user, accessToken, refreshToken]);

    const value = useMemo(() => ({
        ...state,
        updateUser,
        refreshUser,
        clearUser,
        isAuthenticated: !!state.user
    }), [state, updateUser, refreshUser, clearUser]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};