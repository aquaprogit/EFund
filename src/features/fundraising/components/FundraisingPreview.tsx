import { useEffect, useState } from "react";
import {
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Chip,
    Button,
    Grid,
    Alert,
    Stack,
    LinearProgress,
    Avatar,
    Skeleton
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LaunchIcon from '@mui/icons-material/Launch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from "react-router-dom";
import Fundraising from "../models/Fundraising";
import { fundraisingsRepository } from "../repository/fundraisingsRepository";
import UserPreviewTooltip from "../../../shared/components/UserPreviewTooltip";

interface FundraisingPreviewProps {
    fundraisingId: string;
}

const FundraisingPreview = ({ fundraisingId }: FundraisingPreviewProps) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);
    const [fundraising, setFundraising] = useState<Fundraising | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchFundraising = async (fundraisingId: string) => {
        try {
            setLoading(true);
            const result = await fundraisingsRepository.getFundraising(fundraisingId);

            if (result?.isSuccess && result.data) {
                setFundraising(result.data);
            } else {
                console.error('Failed to fetch fundraising:', result?.error);
            }
        } catch (error) {
            console.error('Failed to fetch fundraising:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const calculateProgress = () => {
        if (!fundraising?.monobankJar?.goal || !fundraising?.monobankJar?.balance) return 0;
        return Math.min((fundraising.monobankJar.balance / fundraising.monobankJar.goal) * 100, 100);
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 100) return 'success';
        if (progress >= 75) return 'info';
        if (progress >= 50) return 'warning';
        return 'error';
    };

    useEffect(() => {
        fetchFundraising(fundraisingId);
    }, [fundraisingId]);

    const progress = calculateProgress();
    const reportsCount = fundraising?.reports?.length || 0;

    return (
        <Paper
            elevation={4}
            sx={{
                mb: 3,
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            {/* Header */}
            <Box sx={{
                p: 3,
                pb: 2,
                background: 'rgba(255, 255, 255, 0.95)',
                borderBottom: '1px solid',
                borderColor: 'divider'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        pointerEvents: 'none',
                        '&:hover': {
                            transform: 'none',
                            zIndex: 'auto'
                        }
                    }}>
                        <Box sx={{
                            p: 1.5,
                            borderRadius: 3,
                            bgcolor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <TrendingUpIcon sx={{ fontSize: 24 }} />
                        </Box>
                        <Box sx={{
                            '&:hover': {
                                transform: 'none',
                                zIndex: 'auto'
                            }
                        }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 700,
                                color: 'primary.main',
                                mb: 0.5,
                                '&:hover': {
                                    transform: 'none',
                                    zIndex: 'auto'
                                }
                            }}>
                                Related Fundraising
                            </Typography>
                            {reportsCount > 0 && (
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    '&:hover': {
                                        transform: 'none',
                                        zIndex: 'auto'
                                    }
                                }}>
                                    <WarningIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                                    <Typography variant="caption" sx={{
                                        color: 'warning.main',
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        '&:hover': {
                                            transform: 'none',
                                            zIndex: 'auto'
                                        }
                                    }}>
                                        {reportsCount} report{reportsCount !== 1 ? 's' : ''} filed
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        size="medium"
                        endIcon={<LaunchIcon />}
                        onClick={() => navigate(`/fundraising/${fundraisingId}`)}
                        sx={{
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            boxShadow: 2,
                        }}
                    >
                        View Details
                    </Button>
                </Box>
            </Box>

            {/* Content */}
            <Box sx={{ p: 3 }}>
                {loading ? (
                    <Card elevation={1} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <Skeleton variant="text" width="80%" height={32} />
                                    <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
                                    <Skeleton variant="text" width="90%" height={20} />
                                    <Box sx={{ mt: 3 }}>
                                        <Skeleton variant="text" width="60%" height={20} />
                                        <Skeleton variant="rectangular" width="100%" height={8} sx={{ mt: 1, borderRadius: 1 }} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                ) : fundraising ? (
                    <Card
                        elevation={2}
                        sx={{
                            borderRadius: 3,
                            overflow: 'hidden',
                        }}
                    >
                        <CardContent sx={{ p: 0 }}>
                            <Grid container>
                                <Grid item xs={12} sm={4}>
                                    <Box sx={{ position: 'relative', height: { xs: 200, sm: '100%' }, minHeight: 160 }}>
                                        {fundraising.avatarUrl && !imageError ? (
                                            <Box
                                                component="img"
                                                src={fundraising.avatarUrl}
                                                alt={fundraising.title}
                                                onError={() => setImageError(true)}
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transform: 'none !important'
                                                }}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    bgcolor: 'primary.main',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white'
                                                }}
                                            >
                                                <Typography variant="h3" sx={{ fontWeight: 700, opacity: 0.8 }}>
                                                    {fundraising.title.charAt(0).toUpperCase()}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={8}>
                                    <Box sx={{ p: 3 }}>
                                        <Typography variant="h5" sx={{
                                            fontWeight: 700,
                                            mb: 1,
                                            color: 'text.primary',
                                            lineHeight: 1.3
                                        }}>
                                            {fundraising.title}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 2,
                                                color: 'text.secondary',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                lineHeight: 1.5
                                            }}
                                        >
                                            {fundraising.description}
                                        </Typography>
                                        {/* Tags */}
                                        {fundraising.tags && fundraising.tags.length > 0 && (
                                            <Box sx={{ mb: 2, height: 'fit-content !important', transform: 'none !important' }}>
                                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                    {fundraising.tags.slice(0, 4).map((tag, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={tag}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                            sx={{
                                                                fontSize: '0.75rem',
                                                                fontWeight: 500,
                                                            }}
                                                        />
                                                    ))}
                                                    {fundraising.tags.length > 4 && (
                                                        <Chip
                                                            label={`+${fundraising.tags.length - 4}`}
                                                            size="small"
                                                            variant="filled"
                                                            color="primary"
                                                            sx={{
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600,
                                                            }}
                                                        />
                                                    )}
                                                </Stack>
                                            </Box>
                                        )}
                                        {/* Progress Section */}
                                        {fundraising.monobankJar && (
                                            <Box sx={{ mb: 3, height: 'fit-content !important', transform: 'none !important' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, height: 'fit-content !important', transform: 'none !important' }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                        Funding Progress
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Chip
                                                            label={`${Math.round(progress)}% Funded`}
                                                            size="small"
                                                            color={getProgressColor(progress)}
                                                            variant="filled"
                                                            sx={{
                                                                fontWeight: 700,
                                                                fontSize: '0.75rem'
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={progress}
                                                    color={getProgressColor(progress)}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 4,
                                                        bgcolor: 'grey.200',
                                                        '& .MuiLinearProgress-bar': {
                                                            borderRadius: 4,
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        )}

                                        {/* Creator and Date Info */}
                                        <Grid container spacing={2} sx={{ height: 'fit-content !important' }}>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body2" color="text.primary">Created by</Typography>
                                                    <UserPreviewTooltip userId={fundraising.userId}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                            {fundraising.userName}
                                                        </Typography>
                                                    </UserPreviewTooltip>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        <b>At</b> {formatDate(fundraising.createdAt)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                ) : (
                    <Alert
                        severity="warning"
                        sx={{
                            borderRadius: 3,
                        }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Fundraising details could not be loaded
                        </Typography>
                    </Alert>
                )}
            </Box>
        </Paper>
    );
};

export default FundraisingPreview; 