import User from "../models/User";
import {
    Card,
    Box,
    Avatar,
    Typography,
    Badge,
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Chip,
    Stack,
    CardContent
} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BlockIcon from '@mui/icons-material/Block';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import { useState } from "react";
import { userRepository } from '../api/userRepository';
import { useNavigate } from "react-router-dom";

interface UserCardProps {
    user: User;
    onAction: () => void;
    onSuccess: () => void;
}

const UserCard = ({ user, onAction, onSuccess }: UserCardProps) => {
    const navigate = useNavigate();
    const [dialogOpened, setDialogOpened] = useState<boolean>(false);
    const [dialogPayload, setDialogPayload] = useState<{
        actionType: 'block' | 'unblock' | 'make admin';
        action: (user: User) => void;
        color: 'error' | 'success' | 'primary';
        title: string;
        description: string;
    } | undefined>(undefined);

    const handleCardClick = () => {
        navigate(`/user/${user.id}`);
    };

    const handleButtonClick = (event: React.MouseEvent, callback: () => void) => {
        event.stopPropagation();
        callback();
    };

    const handleAction = (action: (user: User) => void) => {
        action(user);
        onAction();
    };

    const openBlockDialog = () => {
        setDialogOpened(true);
        setDialogPayload({
            actionType: 'block',
            action: async (user) => {
                const result = await userRepository.userAction(user.id, 'block');
                if (result) {
                    onSuccess();
                }
            },
            color: 'error',
            title: 'Block User',
            description: `Are you sure you want to block ${user.name}? They will no longer be able to access the platform.`
        });
    };

    const openUnblockDialog = () => {
        setDialogOpened(true);
        setDialogPayload({
            actionType: 'unblock',
            action: async (user) => {
                const result = await userRepository.userAction(user.id, 'unblock');
                if (result) {
                    onSuccess();
                }
            },
            color: 'success',
            title: 'Unblock User',
            description: `Are you sure you want to unblock ${user.name}? They will regain access to the platform.`
        });
    };

    const openMakeAdminDialog = () => {
        setDialogOpened(true);
        setDialogPayload({
            actionType: 'make admin',
            action: async (user) => {
                const result = await userRepository.makeAdmin(user.id);
                if (result) {
                    onSuccess();
                }
            },
            color: 'primary',
            title: 'Make Admin',
            description: `Are you sure you want to give ${user.name} administrator privileges? This action will grant them full access to admin features.`
        });
    };

    return (
        <>
            <Card
                onClick={handleCardClick}
                elevation={2}
                sx={{
                    height: '100%',
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    position: 'relative',
                    '&:hover': {
                        elevation: 4,
                        transform: 'translateY(-2px)',
                    }
                }}
            >
                {/* Status Chip - Top Right Corner */}
                <Box sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 1
                }}>
                    {user.isAdmin && (
                        <Chip
                            icon={<StarIcon />}
                            label="Admin"
                            size="medium"
                            color="primary"
                            variant="filled"
                            sx={{ fontWeight: 600 }}
                        />
                    )}
                    {user.isBlocked && (
                        <Chip
                            icon={<BlockIcon />}
                            label="Blocked"
                            size="medium"
                            color="error"
                            variant="filled"
                            sx={{ fontWeight: 600 }}
                        />
                    )}
                    {!user.isAdmin && !user.isBlocked && (
                        <Chip
                            label="Active"
                            size="medium"
                            color="success"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                        />
                    )}
                </Box>

                <CardContent sx={{ p: 3, height: '100%' }}>
                    <Stack spacing={3} sx={{ height: '100%' }}>
                        {/* Avatar and Admin Badge Section */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            position: 'relative',
                            mt: 1 // Add margin top to account for chip
                        }}>
                            {user.isAdmin ? (
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    badgeContent={
                                        <AdminPanelSettingsIcon
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                color: 'primary.main',
                                                backgroundColor: 'background.paper',
                                                borderRadius: '50%',
                                                p: 0.5
                                            }}
                                        />
                                    }
                                >
                                    <Avatar
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            border: 2,
                                            borderColor: 'primary.main'
                                        }}
                                        alt={user.name}
                                        src={user.avatarUrl ?? undefined}
                                    >
                                        <PersonIcon sx={{ fontSize: 40 }} />
                                    </Avatar>
                                </Badge>
                            ) : (
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        border: 2,
                                        borderColor: user.isBlocked ? 'error.main' : 'grey.300'
                                    }}
                                    alt={user.name}
                                    src={user.avatarUrl ?? undefined}
                                >
                                    <PersonIcon sx={{ fontSize: 40 }} />
                                </Avatar>
                            )}
                        </Box>

                        {/* User Info Section */}
                        <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
                            <Typography
                                variant="h6"
                                component="h3"
                                gutterBottom
                                sx={{
                                    fontWeight: 600,
                                    color: 'text.primary',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {user.name}
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.5
                            }}>
                                <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '200px'
                                    }}
                                >
                                    {user.email}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Action Buttons Section */}
                        <Stack spacing={1.5}>
                            {!user.isAdmin && (
                                <>
                                    {user.isBlocked ? (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="medium"
                                            onClick={(e) => handleButtonClick(e, openUnblockDialog)}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600
                                            }}
                                        >
                                            Unblock User
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="medium"
                                            onClick={(e) => handleButtonClick(e, openBlockDialog)}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600
                                            }}
                                        >
                                            Block User
                                        </Button>
                                    )}

                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="medium"
                                        onClick={(e) => handleButtonClick(e, openMakeAdminDialog)}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        Make Admin
                                    </Button>
                                </>
                            )}
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog
                open={dialogOpened}
                onClose={() => setDialogOpened(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 2 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {dialogPayload?.title}
                </DialogTitle>

                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {dialogPayload?.description}
                    </Typography>

                    <Box sx={{
                        backgroundColor: 'grey.50',
                        p: 2,
                        borderRadius: 1,
                        border: 1,
                        borderColor: 'grey.200'
                    }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            User Details:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Name: {user.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Email: {user.email}
                        </Typography>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setDialogOpened(false)}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color={dialogPayload?.color}
                        onClick={() => {
                            handleAction((user: User) => dialogPayload?.action(user));
                            setDialogOpened(false);
                        }}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                    >
                        {dialogPayload?.actionType === 'make admin' ? 'Make Admin' :
                            dialogPayload?.actionType === 'block' ? 'Block User' : 'Unblock User'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UserCard;