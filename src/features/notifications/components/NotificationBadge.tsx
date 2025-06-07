import { Badge, IconButton, Popover, Box, Typography, Stack, Divider, Button } from "@mui/material"
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useEffect, useState, useRef } from "react";
import notificationsRepository from "../repository/notificationsRepository";
import { Notification } from "../models/Notification";
import NotificationCard from "./NotificationCard";
import MarkAllReadIcon from '@mui/icons-material/DoneAll';

const NotificationBadge = () => {
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [loading, setLoading] = useState(false);
    const badgeRef = useRef<HTMLButtonElement>(null);

    const open = Boolean(anchorEl);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const result = await notificationsRepository.getNotifications(true);

            if (result.isSuccess) {
                const unreadNotifications = result.data?.filter(n => !n.isRead) ?? [];
                setNotificationsCount(unreadNotifications.length);
                setNotifications(result.data ?? []);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            const result = await notificationsRepository.markAsRead(notificationId);

            if (result.isSuccess) {
                // Update local state
                setNotifications(prev =>
                    prev.map(n =>
                        n.id === notificationId
                            ? { ...n, isRead: true }
                            : n
                    )
                );

                // Update count
                setNotificationsCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        const unreadIds = notifications
            .filter(n => !n.isRead)
            .map(n => n.id);

        if (unreadIds.length === 0) return;

        try {
            const result = await notificationsRepository.markAllAsRead(unreadIds);

            if (result.isSuccess) {
                // Update local state
                setNotifications(prev =>
                    prev.map(n => ({ ...n, isRead: true }))
                );

                // Reset count
                setNotificationsCount(0);
            }
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    // Separate notifications by read status
    const unreadNotifications = notifications.filter(n => !n.isRead);
    const readNotifications = notifications.filter(n => n.isRead);

    return (
        <>
            <IconButton
                ref={badgeRef}
                onClick={handleClick}
                disabled={loading}
                sx={{
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.05)'
                    }
                }}
            >
                <Badge
                    badgeContent={notificationsCount}
                    color="error"
                    max={99}
                    sx={{
                        '& .MuiBadge-badge': {
                            fontSize: '0.75rem',
                            fontWeight: 600
                        }
                    }}
                >
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        width: 400,
                        maxWidth: '90vw',
                        borderRadius: 2,
                        mt: 1,
                        boxShadow: 3,
                        border: '1px solid',
                        borderColor: 'divider'
                    }
                }}
            >
                <Box sx={{ p: 2 }}>
                    {/* Header */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Notifications
                        </Typography>
                        {notificationsCount > 0 && (
                            <Button
                                size="small"
                                startIcon={<MarkAllReadIcon />}
                                onClick={handleMarkAllAsRead}
                                sx={{ fontSize: '0.75rem' }}
                            >
                                Mark all read
                            </Button>
                        )}
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Notifications List */}
                    {notifications.length === 0 ? (
                        <Box sx={{
                            textAlign: 'center',
                            py: 4,
                            color: 'text.secondary'
                        }}>
                            <NotificationsIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                            <Typography variant="body2">
                                No notifications yet
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{
                            maxHeight: 400,
                            overflow: 'auto',
                            transition: 'none',
                            '&::-webkit-scrollbar': {
                                width: 6,
                            },
                            '&::-webkit-scrollbar-track': {
                                background: 'transparent',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: 'rgba(0,0,0,0.2)',
                                borderRadius: 3,
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                background: 'rgba(0,0,0,0.3)',
                            },
                        }}>
                            {/* Unread Notifications */}
                            {unreadNotifications.length > 0 && (
                                <>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: 'block',
                                            fontWeight: 600,
                                            color: 'text.secondary',
                                            mb: 1,
                                            px: 1
                                        }}
                                    >
                                        New ({unreadNotifications.length})
                                    </Typography>
                                    <Stack spacing={0.5}>
                                        {unreadNotifications.map((notification) => (
                                            <NotificationCard
                                                key={notification.id}
                                                notification={notification}
                                                size="small"
                                                onMarkAsRead={handleMarkAsRead}
                                            />
                                        ))}
                                    </Stack>
                                </>
                            )}

                            {/* Divider between unread and read */}
                            {unreadNotifications.length > 0 && readNotifications.length > 0 && (
                                <Divider sx={{ my: 2 }} />
                            )}

                            {/* Read Notifications */}
                            {readNotifications.length > 0 && (
                                <>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: 'block',
                                            fontWeight: 600,
                                            color: 'text.secondary',
                                            mb: 1,
                                            px: 1
                                        }}
                                    >
                                        Earlier ({readNotifications.length})
                                    </Typography>
                                    <Stack spacing={0.5}>
                                        {readNotifications.map((notification) => (
                                            <NotificationCard
                                                key={notification.id}
                                                notification={notification}
                                                size="small"
                                                onMarkAsRead={handleMarkAsRead}
                                            />
                                        ))}
                                    </Stack>
                                </>
                            )}
                        </Box>
                    )}

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <>
                            <Divider sx={{ mt: 2, mb: 2 }} />
                            <Box sx={{ textAlign: 'center' }}>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={handleClose}
                                    sx={{ fontSize: '0.75rem' }}
                                >
                                    Close
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Popover>
        </>
    )
}

export default NotificationBadge;