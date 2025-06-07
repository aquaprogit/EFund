import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext';
import { useUser } from '../../../contexts/UserContext';
import { useAuth } from '../../auth/store/auth.store';

export const useAuthorizationCheck = (createdByUserId: string, fundraisingId: string, loading: boolean) => {
    const { user, loading: userLoading } = useUser();
    const { isAuth } = useAuth();
    const { showError } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuth) {
            showError('You are not allowed to edit this fundraising');
            navigate(`/fundraising/${fundraisingId}`);
        }

        if (!userLoading && createdByUserId && !loading && user) {
            if (user.id !== createdByUserId) {
                showError('You are not allowed to edit this fundraising');
                navigate(`/fundraising/${fundraisingId}`);
            }
        }
    }, [user, createdByUserId, userLoading, loading, isAuth, fundraisingId, navigate, showError]);

    return user;
}; 