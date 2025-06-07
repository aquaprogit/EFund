import { Box, Dialog, Link, TextField, Button, Typography, DialogTitle, Container, useTheme, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuAvatar from "../../features/users/components/MenuAvatar";
import { ReactNode, useEffect, useState } from "react";
import '../../styles/page-wrapper.css';
import { useUser } from "../../contexts/UserContext";
import { useToast } from "../../contexts/ToastContext";
import { userRepository } from "../../features/users/api/userRepository";
import { pageWrapperStyles } from "./PageWrapper.styles";
import FundraisingSearchDropDown from "../../features/fundraising/components/FundraisingSearchDropDown";
import { complaintRepository } from "../../features/rules/repository/complaintRepository";
import NotificationBadge from "../../features/notifications/components/NotificationBadge";

interface PageWrapperProps {
    children: ReactNode;
    searchAvailable?: boolean;
    showBackButton?: boolean;
}

const PageWrapper = ({ children, searchAvailable = true, showBackButton = false }: PageWrapperProps) => {
    const { user, loading, updateUser, refreshUser } = useUser();
    const navigate = useNavigate();

    const { showWarning, showSuccess, showError } = useToast();
    const theme = useTheme();

    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [complaintsCount, setComplaintsCount] = useState(0);

    useEffect(() => {
        refreshUser();

        if (user?.isAdmin) {
            const fetchComplaintsCount = async () => {
                const result = await complaintRepository.getComplaintsTotals();

                if (result.isSuccess) {
                    setComplaintsCount(result.data?.Pending ?? 0);
                }
            }

            fetchComplaintsCount();
        }
    }, []);

    const handleBackClick = () => {
        window.history.back();
    };

    console.log(complaintsCount);

    return (
        <Box className='page-wrapper'>
            <Box
                component="header"
                sx={pageWrapperStyles.header(theme)}
            >
                <Container maxWidth="lg">
                    <Box sx={pageWrapperStyles.headerContainer}>
                        {/* Left Section - Back Button */}
                        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '64px' }}>
                            {showBackButton && (
                                <IconButton
                                    onClick={handleBackClick}
                                    sx={{
                                        color: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: 'primary.light',
                                            color: 'primary.dark'
                                        }
                                    }}
                                    aria-label="Go back to previous page"
                                >
                                    <ArrowBackIcon />
                                </IconButton>
                            )}
                        </Box>

                        {/* Center Section - Logo and Search */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                            <Link
                                href='/'
                                variant="h5"
                                color="primary"
                                sx={pageWrapperStyles.logo(theme)}
                            >
                                EFund
                            </Link>

                            {searchAvailable && (
                                <FundraisingSearchDropDown />
                            )}
                        </Box>

                        {/* Right Section - User Actions */}
                        <Box sx={pageWrapperStyles.headerActions}>
                            {loading ? (
                                <></>
                            ) : (
                                user ? (
                                    <>
                                        <NotificationBadge />
                                        <MenuAvatar
                                            complaintsCount={complaintsCount}
                                            onInviteUser={() => setOpen(true)}
                                            onUsers={() => navigate('/users')}
                                            onSignOut={() => updateUser(null)}
                                            onSettings={() => navigate('/settings')}
                                            onProfile={() => navigate('/profile')}
                                            onAdd={() => {
                                                if (!user!.hasMonobankToken) {
                                                    showWarning('Please link monobank token to your account to get access to this functionality');
                                                }
                                                else {
                                                    navigate('/add-fundraising');
                                                }
                                            }}
                                            onMyFundraising={() => {
                                                navigate(`/search?userId=${user?.id}`);
                                                navigate(0);
                                            }}
                                            onComplaints={() => navigate('/complaints')}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            color="primary"
                                            onClick={() => navigate('/sign-in')}
                                        >
                                            Sign In
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => navigate('/sign-up')}
                                        >
                                            Sign Up
                                        </Button>
                                    </>
                                )
                            )}
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Box component="main" sx={pageWrapperStyles.main}>
                {children}
            </Box>

            <Box
                component="footer"
                sx={pageWrapperStyles.footer(theme)}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={pageWrapperStyles.footerText}
                    >
                        © {new Date().getFullYear()} EFund. All rights reserved.
                    </Typography>
                </Container>
            </Box>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: pageWrapperStyles.dialog
                }}
            >
                <DialogTitle sx={pageWrapperStyles.dialogTitle}>
                    Invite Admin
                </DialogTitle>
                <Box sx={pageWrapperStyles.dialogContent}>
                    <TextField
                        fullWidth
                        label="Email"
                        value={email}
                        error={!!email && !email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i)}
                        helperText={!!email && !email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i) ? 'Invalid email' : ''}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={async () => {
                            const result = await userRepository.inviteAdmin(email);
                            if (result.isSuccess) {
                                showSuccess('User invited successfully');
                            }
                            else {
                                showError('Error during inviting user');
                            }
                            setOpen(false);
                        }}
                    >
                        Invite
                    </Button>
                </Box>
            </Dialog>
        </Box>
    );
};

export default PageWrapper;