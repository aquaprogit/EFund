import { useState } from "react";
import {
    Tooltip,
    Typography,
    Box,
    Avatar,
    Card,
    CardContent,
    CircularProgress,
    Divider
} from "@mui/material";
import { userRepository } from "../../features/users/api/userRepository";
import { UserDetails } from "../../features/users/models/UserDetails";
import { useNavigate } from "react-router-dom";
import RatingSlider from "./RatingSlider";

interface UserPreviewTooltipProps {
    children: React.ReactElement<any, any>;
    userId: string;
}

const UserPreviewTooltip = ({ children, userId }: UserPreviewTooltipProps) => {
    const [user, setUser] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const navigate = useNavigate();

    const fetchUser = async () => {
        if (hasLoaded || loading) return;

        try {
            setLoading(true);
            setError(false);
            const response = await userRepository.getUser(userId);

            if (response.isSuccess && response.data) {
                const foundUser = response.data;

                if (foundUser) {
                    setUser(foundUser);
                } else {
                    setError(true);
                }
            } else {
                setError(true);
            }
        } catch (err) {
            console.error('Failed to fetch user:', err);
            setError(true);
        } finally {
            setLoading(false);
            setHasLoaded(true);
        }
    };

    const renderTooltipContent = () => {
        fetchUser();

        if (loading) {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                    <CircularProgress size={20} />
                    <Typography variant="body2">Loading user details...</Typography>
                </Box>
            );
        }

        if (error || !user) {
            return (
                <Box sx={{ p: 2, maxWidth: 200 }}>
                    <Typography variant="body2" color="text.secondary">
                        Unable to load user details
                    </Typography>
                </Box>
            );
        }


        return (
            <Card elevation={4} sx={{ maxWidth: 320, borderRadius: 3 }} onClick={() => navigate(`/user/${user.id}`)}>
                <CardContent sx={{ p: 3 }}>
                    {/* Header with Avatar and Basic Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar
                            src={user.avatarUrl}
                            sx={{
                                width: 56,
                                height: 56,
                                border: '3px solid',
                                borderColor: 'primary.main'
                            }}
                        >
                            {user.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                {user.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {/* <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} /> */}
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'primary.main',
                                        fontWeight: 500,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {user.email}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Rating Section */}
                    <Box sx={{ mb: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: -2 }}>
                            User Rating
                        </Typography>
                        <RatingSlider
                            rating={user.rating || 0}
                            size="medium"
                            showLabels={true}
                            showValue={true}
                        />
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <Tooltip
            title={renderTooltipContent()}
            placement="top"
            arrow
            enterDelay={300}
            leaveDelay={100}
            componentsProps={{
                tooltip: {
                    sx: {
                        bgcolor: 'transparent',
                        p: 0,
                        boxShadow: 'none',
                        maxWidth: 'none'
                    }
                }
            }}
        >
            {children}
        </Tooltip>
    );
};

export default UserPreviewTooltip; 