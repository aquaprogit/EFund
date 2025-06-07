import { ChangeEvent, useRef, useState } from "react";
import {
    Box,
    Dialog,
    Paper,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Avatar,
    Button,
    IconButton,
    Stack,
    Chip,
    useTheme,
    TextField
} from "@mui/material";
import PageWrapper from "../../../shared/components/PageWrapper";
import { userRepository } from "../api/userRepository";
import { useUser } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import ChangePassword from "../components/ChangePassword";
import LinkToken from "../components/LinkToken";
import AddPassword from "../components/AddPassword";
import ChangeEmail from "../components/ChangeEmail";
import { useToast } from "../../../contexts/ToastContext";
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedIcon from '@mui/icons-material/Verified';
import RatingSlider from "../../../shared/components/RatingSlider";
import LockIcon from '@mui/icons-material/Lock';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const ProfilePage = () => {
    const theme = useTheme();
    const [openedDialog, setOpenedDialog] = useState<string | false>(false);
    const { user, refreshUser } = useUser();
    const navigate = useNavigate();
    const inputFile = useRef<HTMLInputElement>(null);
    const { showSuccess, showError } = useToast();

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length) {
            const response = await userRepository.uploadAvatar(files[0]);
            if (response.isSuccess) {
                await refreshUser();
                showSuccess('Avatar updated successfully');
            } else {
                showError(response.error?.message || 'Failed to update avatar');
            }
        }
    };

    const handleDeleteFile = async () => {
        const response = await userRepository.deleteAvatar();
        if (response.isSuccess) {
            await refreshUser();
            showSuccess('Avatar removed successfully..!!');
        } else {
            showError(response.error?.message || 'Failed to remove avatar');
        }
    };

    const handleUpdateProfile = async (field: string, value: string) => {
        if (!user) return;

        const response = await userRepository.updateInfo({ name: user.name, description: user.description, [field]: value } as any);
        if (response.isSuccess) {
            await refreshUser();
            showSuccess(`${field} updated successfully`);
        } else {
            showError(response.error?.message || `Failed to update ${field}`);
        }
    };

    if (!user) {
        navigate('/');
        return null;
    }

    return (
        <PageWrapper showBackButton>
            <Container maxWidth="lg">
                {/* Hero Section - Profile Header */}
                <Paper
                    elevation={4}
                    sx={{
                        mb: 4,
                        borderRadius: 4,
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        position: 'relative'
                    }}
                >
                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1 }}>
                        <Box sx={{
                            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                            width: '100%',
                            height: '100%'
                        }} />
                    </Box>
                    <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={3}>
                                <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, position: 'relative' }}>
                                    <Box sx={{ position: 'relative' }}>
                                        <Avatar
                                            src={user.avatarUrl}
                                            alt={user.name}
                                            sx={{
                                                width: 140,
                                                height: 140,
                                                border: '4px solid rgba(255,255,255,0.3)',
                                                boxShadow: theme.shadows[8]
                                            }}
                                        >
                                            <PersonIcon sx={{ fontSize: 60 }} />
                                        </Avatar>
                                        <IconButton
                                            onClick={() => inputFile.current?.click()}
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                backgroundColor: 'rgba(255,255,255,0.9)',
                                                color: 'primary.main',
                                                '&:hover': {
                                                    backgroundColor: 'white',
                                                },
                                                boxShadow: theme.shadows[4]
                                            }}
                                        >
                                            <PhotoCameraIcon />
                                        </IconButton>
                                        {user.avatarUrl && (
                                            <IconButton
                                                onClick={handleDeleteFile}
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    backgroundColor: 'rgba(244, 67, 54, 0.9)',
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor: 'error.main',
                                                    },
                                                    boxShadow: theme.shadows[4]
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                        <input
                                            type="file"
                                            ref={inputFile}
                                            onChange={handleFileUpload}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                                            {user.name}
                                        </Typography>
                                        <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                                            {user.email}
                                        </Typography>
                                    </Box>

                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                        <Chip
                                            icon={<EditIcon sx={{ fontSize: 16 }} />}
                                            label="Edit Mode"
                                            size="medium"
                                            sx={{
                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                                color: 'white',
                                                fontWeight: 600,
                                                '& .MuiChip-icon': {
                                                    color: 'white'
                                                }
                                            }}
                                        />
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Typography variant="h6" sx={{ opacity: 0.9, textAlign: 'center', mb: 1 }}>
                                    Complete your profile
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8, textAlign: 'center' }}>
                                    Fill out your information to build trust with supporters
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Paper>

                <Grid container spacing={4}>
                    {/* Left Column - Main Editing Sections */}
                    <Grid item xs={12} md={8}>
                        <Stack spacing={4}>
                            {/* Trust Rating Display */}
                            <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                                <Box sx={{
                                    p: 3,
                                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                    borderBottom: '1px solid',
                                    borderColor: 'divider'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Box sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: 'primary.main',
                                            color: 'white'
                                        }}>
                                            <VerifiedIcon sx={{ fontSize: 24 }} />
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                            Your Trust Rating
                                        </Typography>
                                    </Box>
                                </Box>
                                <CardContent sx={{ p: 3 }}>
                                    <RatingSlider
                                        rating={user.rating || 0}
                                        size='medium'
                                        showLabels={true}
                                        showValue={true}
                                    />
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                                        Complete your profile and maintain good fundraising practices to improve your rating
                                    </Typography>
                                </CardContent>
                            </Card>

                            {/* Personal Information */}
                            <Card elevation={3} sx={{ borderRadius: 3 }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <PersonIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            Personal Information
                                        </Typography>
                                    </Box>

                                    <Stack spacing={3}>
                                        <TextField
                                            label="Full Name"
                                            variant="outlined"
                                            fullWidth
                                            defaultValue={user.name}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleUpdateProfile('name', (e.target as HTMLInputElement).value);
                                                }
                                            }}
                                            onBlur={(e) => {
                                                if (e.target.value !== user.name) {
                                                    handleUpdateProfile('name', e.target.value);
                                                }
                                            }}
                                        />

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyItems: 'center' }}>
                                            <TextField
                                                label="Email Address"
                                                variant="outlined"
                                                fullWidth
                                                value={user.email}
                                                disabled
                                                helperText="You will be sent verification code to change your email address"
                                            />
                                            <Button
                                                variant="outlined"
                                                onClick={() => setOpenedDialog('changeEmail')}
                                                sx={{ minWidth: 120, alignSelf: 'start', mt: 1.5 }}
                                            >
                                                Change
                                            </Button>
                                        </Box>

                                        <TextField
                                            label="About You"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            defaultValue={user.description || ''}
                                            placeholder="Tell supporters about yourself, your background, and why your fundraising matters..."
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleUpdateProfile('description', (e.target as HTMLInputElement).value);
                                                }
                                            }}
                                            onBlur={(e) => {
                                                if (e.target.value !== (user.description || '')) {
                                                    handleUpdateProfile('description', e.target.value);
                                                }
                                            }}
                                            helperText="A compelling story helps build trust with potential supporters"
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Security Settings */}
                            <Card elevation={3} sx={{ borderRadius: 3 }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <SecurityIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            Security & Privacy
                                        </Typography>
                                    </Box>

                                    <Stack spacing={3}>
                                        <Box sx={{
                                            p: 3,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 2,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <LockIcon sx={{ color: 'text.secondary' }} />
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                        Password
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {user.hasPassword ? 'Password is set' : 'No password set - using social login only'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                variant={user.hasPassword ? "outlined" : "contained"}
                                                color={user.hasPassword ? "primary" : "warning"}
                                                onClick={() => setOpenedDialog(user.hasPassword ? 'changePassword' : 'addPassword')}
                                            >
                                                {user.hasPassword ? 'Change' : 'Add Password'}
                                            </Button>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Advanced Settings */}
                            <Card elevation={3} sx={{ borderRadius: 3 }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <SettingsIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            Payment Integration
                                        </Typography>
                                    </Box>

                                    <Stack spacing={3}>
                                        <Box sx={{
                                            p: 3,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 2,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <AccountBalanceIcon sx={{ color: 'text.secondary' }} />
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                        Monobank Integration
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {user.hasMonobankToken ? 'Connected - Ready to receive donations' : 'Connect your Monobank account to start fundraising'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                variant={user.hasMonobankToken ? "outlined" : "contained"}
                                                color={user.hasMonobankToken ? "success" : "primary"}
                                                onClick={() => setOpenedDialog('linkToken')}
                                            >
                                                {user.hasMonobankToken ? 'Reconnect' : 'Connect'}
                                            </Button>
                                        </Box>

                                        {!user.hasMonobankToken && (
                                            <Box sx={{
                                                p: 2,
                                                bgcolor: 'warning.50',
                                                borderRadius: 2,
                                                border: '1px solid',
                                                borderColor: 'warning.main'
                                            }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.main' }}>
                                                    ⚠️ Payment integration required
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    You need to connect your Monobank account before you can create fundraising campaigns.
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* Right Column - Profile Completion & Help */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            {/* Profile Completion */}
                            <Card elevation={3} sx={{ borderRadius: 3, position: 'sticky', top: 100 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                        Profile Completion
                                    </Typography>

                                    <Stack spacing={2}>
                                        <Box sx={{
                                            p: 2,
                                            bgcolor: user.name ? 'success.50' : 'background.default',
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: user.name ? 'success.main' : 'divider'
                                        }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: user.name ? 'success.main' : 'text.primary' }}>
                                                ✓ Basic Information
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Name and email verified
                                            </Typography>
                                        </Box>

                                        <Box sx={{
                                            p: 2,
                                            bgcolor: user.avatarUrl ? 'success.50' : 'background.default',
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: user.avatarUrl ? 'success.main' : 'divider'
                                        }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: user.avatarUrl ? 'success.main' : 'text.primary' }}>
                                                {user.avatarUrl ? '✓' : '○'} Profile Photo
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Add a professional photo
                                            </Typography>
                                        </Box>

                                        <Box sx={{
                                            p: 2,
                                            bgcolor: user.description ? 'success.50' : 'background.default',
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: user.description ? 'success.main' : 'divider'
                                        }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: user.description ? 'success.main' : 'text.primary' }}>
                                                {user.description ? '✓' : '○'} About Section
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Tell your story
                                            </Typography>
                                        </Box>

                                        <Box sx={{
                                            p: 2,
                                            bgcolor: user.hasMonobankToken ? 'success.50' : 'background.default',
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: user.hasMonobankToken ? 'success.main' : 'divider'
                                        }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: user.hasMonobankToken ? 'success.main' : 'text.primary' }}>
                                                {user.hasMonobankToken ? '✓' : '○'} Payment Integration
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Connect Monobank for fundraising
                                            </Typography>
                                        </Box>

                                        <Box sx={{
                                            p: 2,
                                            bgcolor: user.hasPassword ? 'success.50' : 'warning.50',
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: user.hasPassword ? 'success.main' : 'warning.main'
                                        }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: user.hasPassword ? 'success.main' : 'warning.main' }}>
                                                {user.hasPassword ? '✓' : '!'} Account Security
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {user.hasPassword ? 'Password protected' : 'Add password for security'}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Help & Tips */}
                            <Card elevation={3} sx={{ borderRadius: 3 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                        Tips for Success
                                    </Typography>
                                    <Stack spacing={2}>
                                        <Typography variant="body2" color="text.secondary">
                                            • Complete all profile sections to build trust
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Use a clear, professional profile photo
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Write a compelling personal story
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Keep your contact information up to date
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Connect payment methods for easy fundraising
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>

                {/* Dialogs */}
                <Dialog
                    open={!!openedDialog}
                    onClose={() => setOpenedDialog(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: { borderRadius: 3 }
                    }}
                >
                    {(() => {
                        switch (openedDialog) {
                            case 'changePassword':
                                return <ChangePassword onClose={() => setOpenedDialog(false)} />;
                            case 'addPassword':
                                return <AddPassword onClose={() => setOpenedDialog(false)} />;
                            case 'changeEmail':
                                return <ChangeEmail onClose={() => setOpenedDialog(false)} />;
                            case 'linkToken':
                                return <LinkToken onClose={() => setOpenedDialog(false)} />;
                            default:
                                return null;
                        }
                    })()}
                </Dialog>
            </Container>
        </PageWrapper>
    );
};

export default ProfilePage; 