import { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Avatar,
    Stack,
    Divider,
    Link
} from '@mui/material';
import {
    Notification,
    NotificationReason
} from '../models/Notification';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReportIcon from '@mui/icons-material/Report';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface NotificationCardProps {
    notification: Notification;
    size?: 'small' | 'full';
    onMarkAsRead?: (notificationId: string) => void;
    onClose?: () => void;
}

const NotificationCard = ({
    notification,
    size = 'small',
    onMarkAsRead,
    onClose
}: NotificationCardProps) => {
    const [fullSizeOpen, setFullSizeOpen] = useState(false);
    const navigate = useNavigate();

    const getNotificationIcon = (reason: NotificationReason) => {
        switch (reason) {
            case NotificationReason.ComplaintAccepted:
                return <CheckCircleIcon sx={{ color: 'success.main' }} />;
            case NotificationReason.FundraisingComplaintAccepted:
                return <ReportIcon sx={{ color: 'error.main' }} />;
            case NotificationReason.FundraisingNeedChanges:
                return <EditIcon sx={{ color: 'info.main' }} />;
            default:
                return <NotificationsIcon sx={{ color: 'primary.main' }} />;
        }
    };

    const getNotificationTitle = (reason: NotificationReason) => {
        switch (reason) {
            case NotificationReason.ComplaintAccepted:
                return 'Complaint Accepted';
            case NotificationReason.FundraisingComplaintAccepted:
                return 'Fundraising Complaint Accepted';
            case NotificationReason.FundraisingNeedChanges:
                return 'Fundraising Needs Changes';
            default:
                return 'Notification';
        }
    };

    const getNotificationContent = (notification: Notification) => {
        switch (notification.reason) {
            case NotificationReason.ComplaintAccepted:
                return 'Your complaint has been reviewed and accepted by our team.';

            case NotificationReason.FundraisingComplaintAccepted:
                const fundraisingArgs = notification.args as any;
                return {
                    short: (
                        <span>
                            Your fundraising "
                            <Link
                                component="button"
                                variant="body2"
                                onClick={(e) => handleFundraisingClick(fundraisingArgs.fundraisingId, e)}
                                sx={{
                                    textDecoration: 'underline',
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontSize: 'inherit'
                                }}
                            >
                                {fundraisingArgs.fundraisingTitle}
                            </Link>
                            " has received a complaint.
                        </span>
                    ),
                    full: (
                        <Box>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Your fundraising
                                <Link
                                    component="button"
                                    variant="body1"
                                    onClick={(e) => handleFundraisingClick(fundraisingArgs.fundraisingId, e)}
                                    sx={{
                                        display: 'inline-block',
                                        mx: 1,
                                        textDecoration: 'underline',
                                        color: 'primary.main',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {fundraisingArgs.fundraisingTitle}
                                </Link>
                                has received a complaint that has been accepted by our moderation team.
                            </Typography>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                Violations found:
                            </Typography>
                            <Stack spacing={1} sx={{
                                flexWrap: 'wrap',
                                gap: 1
                            }}>
                                {fundraisingArgs.violations?.map((violation: string, index: number) => (
                                    <Chip
                                        key={index}
                                        label={violation}
                                        size="small"
                                        color="error"
                                        variant="outlined"
                                        sx={{
                                            width: 'max-content',
                                            flexShrink: 0,
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    )
                };

            case NotificationReason.FundraisingNeedChanges:
                const changesArgs = notification.args as any;
                return {
                    short: (
                        <span>
                            Changes required for "
                            <Link
                                component="button"
                                variant="body2"
                                onClick={(e) => handleFundraisingClick(changesArgs.fundraisingId, e)}
                                sx={{
                                    textDecoration: 'underline',
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontSize: 'inherit'
                                }}
                            >
                                {changesArgs.fundraisingTitle}
                            </Link>
                            "
                        </span>
                    ),
                    full: (
                        <Box>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Your fundraising "
                                <Link
                                    component="button"
                                    variant="body1"
                                    onClick={(e) => handleFundraisingClick(changesArgs.fundraisingId, e)}
                                    sx={{
                                        textDecoration: 'underline',
                                        color: 'primary.main',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {changesArgs.fundraisingTitle}
                                </Link>
                                " requires changes before it can be approved.
                            </Typography>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                Required changes:
                            </Typography>
                            <Typography variant="body2" sx={{
                                p: 2,
                                bgcolor: 'warning.50',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'warning.200'
                            }}>
                                {changesArgs.message}
                            </Typography>
                        </Box>
                    )
                };

            default:
                return 'You have a new notification.';
        }
    };

    const handleCardClick = () => {
        if (size === 'small') {
            setFullSizeOpen(true);
        }
    };

    const handleMarkAsRead = () => {
        if (onMarkAsRead) {
            onMarkAsRead(notification.id);
        }
        if (size === 'full' && onClose) {
            onClose();
        }
        setFullSizeOpen(false);
    };

    const handleFundraisingClick = (fundraisingId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent card click when clicking the link
        navigate(`/fundraising/${fundraisingId}`);
    };

    const content = getNotificationContent(notification);
    const displayContent = typeof content === 'object' ? content.short : content;
    const fullContent = typeof content === 'object' ? content.full : content;

    if (size === 'small') {
        return (
            <>
                <Card
                    elevation={notification.isRead ? 1 : 3}
                    onClick={handleCardClick}
                    sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        opacity: notification.isRead ? 0.7 : 1,
                        border: notification.isRead ? '1px solid' : '1px solid',
                        borderColor: notification.isRead ? 'divider' : 'primary.main',
                        '&:hover': {
                            backgroundColor: notification.isRead ? 'grey.400' : 'primary.light',
                            // transform: 'translateY(-1px)',
                            boxShadow: 4
                        }
                    }}
                >
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <Avatar sx={{
                                width: 28,
                                height: 28,
                                bgcolor: 'transparent',
                                // bgcolor: notification.isRead ? 'grey.100' : 'primary.light',
                                '&:hover': {
                                    // bgcolor: notification.isRead ? 'white' : 'white',
                                    boxShadow: 4
                                }
                            }}>
                                {getNotificationIcon(notification.reason)}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 0.25,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {getNotificationTitle(notification.reason)}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        mb: 0.5,
                                        fontSize: '0.75rem',
                                        lineHeight: 1.3
                                    }}
                                >
                                    {displayContent}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                    {format(new Date(), 'MMM dd, HH:mm')}
                                </Typography>
                            </Box>
                            {!notification.isRead && (
                                <Box sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    mt: 0.25,
                                    flexShrink: 0
                                }} />
                            )}
                        </Box>
                    </CardContent>
                </Card>

                {/* Full Size Dialog */}
                <Dialog
                    open={fullSizeOpen}
                    onClose={() => setFullSizeOpen(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{ sx: { borderRadius: 3 } }}
                >
                    <DialogTitle sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        pb: 1
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'transparent' }}>
                                {getNotificationIcon(notification.reason)}
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {getNotificationTitle(notification.reason)}
                            </Typography>
                        </Box>
                        <IconButton onClick={() => setFullSizeOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <Divider />

                    <DialogContent sx={{ pt: 3 }}>
                        <Box sx={{ mb: 3 }}>
                            {fullContent}
                        </Box>

                        <Typography variant="caption" color="text.secondary">
                            Received: {format(new Date(), 'MMMM dd, yyyy \'at\' HH:mm')}
                        </Typography>
                    </DialogContent>

                    <DialogActions sx={{ p: 3, pt: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setFullSizeOpen(false)}
                        >
                            Close
                        </Button>
                        {!notification.isRead && (
                            <Button
                                variant="contained"
                                startIcon={<CheckCircleIcon />}
                                onClick={handleMarkAsRead}
                            >
                                Mark as Read
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            </>
        );
    }

    // Full size mode (when size === 'full')
    return (
        <Card elevation={2} sx={{ width: '100%' }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#000' }}>
                        {getNotificationIcon(notification.reason)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {getNotificationTitle(notification.reason)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {format(new Date(), 'MMMM dd, yyyy \'at\' HH:mm')}
                        </Typography>
                    </Box>
                    {onClose && (
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    )}
                </Box>

                <Box sx={{ mb: 3 }}>
                    {fullContent}
                </Box>

                {!notification.isRead && (
                    <Button
                        variant="contained"
                        startIcon={<CheckCircleIcon />}
                        onClick={handleMarkAsRead}
                        fullWidth
                    >
                        Mark as Read
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default NotificationCard; 