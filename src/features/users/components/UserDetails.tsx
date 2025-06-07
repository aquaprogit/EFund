import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    Grid,
    LinearProgress,
    Stack,
    Typography,
    useTheme,
    Paper,
    IconButton,
    Badge,
    Tooltip
} from "@mui/material";
import PageWrapper from "../../../shared/components/PageWrapper";
import { useEffect, useState } from "react";
import { userRepository } from "../api/userRepository";
import { UserDetails as UserDetailsType } from "../models/UserDetails";
import { format } from 'date-fns';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Link } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import RatingSlider from "../../../shared/components/RatingSlider";
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VerifiedIcon from '@mui/icons-material/Verified';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export const UserDetails = ({ userId }: { userId: string }) => {
    const theme = useTheme();
    const [user, setUser] = useState<UserDetailsType | null>(null);

    const getBadgeColor = (badge: string) => {
        switch (badge.toLowerCase()) {
            case 'verified':
                return {
                    color: theme.palette.success.main,
                    backgroundColor: theme.palette.success.light
                };
            case 'trusted':
                return {
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.primary.light
                };
            case 'admin':
                return {
                    color: theme.palette.warning.main,
                    backgroundColor: theme.palette.warning.light
                };
            default:
                return {
                    color: theme.palette.text.secondary,
                    backgroundColor: theme.palette.action.hover
                };
        }
    };

    const getBadgeIcon = (badge: string) => {
        switch (badge.toLowerCase()) {
            case 'verified':
                return <VerifiedIcon sx={{ fontSize: 16 }} />;
            case 'admin':
                return <AdminPanelSettingsIcon sx={{ fontSize: 16 }} />;
            default:
                return null;
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            const response = await userRepository.getUser(userId);
            if (response.data) {
                setUser(response.data);
            }
        }

        fetchUser();
    }, [userId]);

    if (!user) {
        return (
            <PageWrapper showBackButton>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                Loading user details...
                            </Typography>
                        </Paper>
                    </Box>
                </Container>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper showBackButton>
            <Container maxWidth="lg">
                {/* Hero Section */}
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
                                <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'center' } }}>
                                    <Avatar
                                        sx={{
                                            width: 150,
                                            height: 150,
                                            border: 2,
                                            borderColor: 'primary.main'
                                        }}
                                        alt={user.name}
                                        src={user.avatarUrl ?? undefined}
                                    >
                                        <PersonIcon sx={{ fontSize: 40 }} />
                                    </Avatar>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                                            {user.name}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <EmailIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                                {user.email}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {user.badges && user.badges.length > 0 && (
                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                            {user.badges.map((badge, index) => {
                                                const badgeIcon = getBadgeIcon(badge.title);
                                                return (
                                                    <Tooltip title={badge.description}>
                                                        <Chip
                                                            key={index}
                                                            icon={badgeIcon || undefined}
                                                            label={badge.title}
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
                                                    </Tooltip>
                                                );
                                            })}
                                        </Stack>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Stack spacing={2}>
                                    <Button
                                        component={Link}
                                        to={`/search?userId=${userId}`}
                                        variant="contained"
                                        size="large"
                                        startIcon={<SearchIcon />}
                                        sx={{
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            color: 'white',
                                            fontWeight: 600,
                                            py: 1.5,
                                            borderRadius: 3,
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,0.3)',
                                            }
                                        }}
                                    >
                                        View Fundraisings
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Paper>

                <Grid container spacing={4}>
                    {/* Left Column - Main Content */}
                    <Grid item xs={12} md={8}>
                        <Stack spacing={4}>
                            {/* Rating Section */}
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
                                            <TrendingUpIcon sx={{ fontSize: 24 }} />
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                            Trust Rating
                                        </Typography>
                                    </Box>
                                </Box>
                                <CardContent sx={{ px: 12, py: 2, height: 'max-content !important' }}>
                                    <RatingSlider
                                        rating={user.rating}
                                        size='medium'
                                        showLabels={true}
                                        showValue={true}
                                    />
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                                        Based on fundraising history and community feedback
                                    </Typography>
                                </CardContent>
                            </Card>

                            {/* About Section */}
                            <Card elevation={3} sx={{ borderRadius: 3 }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <AccountBoxIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            About
                                        </Typography>
                                    </Box>

                                    {user.description ? (
                                        <Typography variant="body1" sx={{
                                            lineHeight: 1.7,
                                            color: 'text.secondary'
                                        }}>
                                            {user.description}
                                        </Typography>
                                    ) : (
                                        <Box sx={{
                                            p: 3,
                                            textAlign: 'center',
                                            bgcolor: 'background.default',
                                            borderRadius: 2,
                                            border: '2px dashed',
                                            borderColor: 'divider'
                                        }}>
                                            <Typography variant="body2" color="text.secondary">
                                                This user hasn't added a description yet.
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Activity Statistics */}
                            <Card elevation={3} sx={{ borderRadius: 3 }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                                        Activity Overview
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6} sm={3}>
                                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                                    0
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Fundraisings
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                                                    0
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Completed
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                                <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                                                    0
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Supporters
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                                <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                                                    {user.badges?.length || 0}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Badges
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* Right Column - Info Cards */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            {/* Profile Info */}
                            <Card elevation={3} sx={{ borderRadius: 3 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                        Profile Information
                                    </Typography>

                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <CalendarTodayIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Member since
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                    {format(new Date(user.createdAt), 'MMMM yyyy')}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Divider />

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <EmailIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Email
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>
                                                    {user.email}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Divider />

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <TrendingUpIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Trust Level
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 600 }} color={user.rating >= 2 ? 'success.main' :
                                                    user.rating >= 0 ? 'primary.main' :
                                                        user.rating >= -1 ? 'warning.main' : 'error.main'}>
                                                    {user.rating >= 2 ? 'Highly Trusted' :
                                                        user.rating >= 0 ? 'Trusted' :
                                                            user.rating >= -1 ? 'Neutral' : 'Needs Improvement'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Badges */}
                            {user.badges && user.badges.length > 0 && (
                                <Card elevation={3} sx={{ borderRadius: 3 }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                            Achievements
                                        </Typography>
                                        <Stack spacing={2}>
                                            {user.badges.map((badge, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        p: 2,
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        borderRadius: 2,
                                                        bgcolor: 'background.default'
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                        {getBadgeIcon(badge.title)}
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                            {badge.title}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {badge.description}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </PageWrapper>
    );
};