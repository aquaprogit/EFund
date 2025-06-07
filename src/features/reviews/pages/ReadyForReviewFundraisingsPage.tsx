import {
    Container,
    Box,
    Paper,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Chip,
    Avatar,
    Stack,
    LinearProgress,
    Skeleton,
    useTheme,
    IconButton,
    Tooltip
} from "@mui/material";
import { useEffect, useState } from "react";
import { fundraisingsRepository } from "../../fundraising/repository/fundraisingsRepository";
import Fundraising from "../../fundraising/models/Fundraising";
import { FundraisingStatus } from "../../fundraising/models/FundraisingStatus";
import PageWrapper from "../../../shared/components/PageWrapper";
import { useNavigate } from "react-router-dom";
import Search from "../../../shared/components/Search";
import MultiSelectWithChip from "../../../shared/components/MultiSelectWithChips";
import { useTags } from "../../fundraising/hooks/useTags";
import { useFundraisingFilters } from "../../fundraising/hooks/useFundraisingFilters";
import { usePagination } from "../../fundraising/hooks/usePagination";
import PaginationPaper from "../../../shared/components/PaginationPaper";

// Icons
import ReviewsIcon from '@mui/icons-material/Reviews';
import SearchIcon from '@mui/icons-material/Search';
import TagIcon from '@mui/icons-material/Tag';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const ReadyForReviewFundraisingsPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { allTags } = useTags();
    const pageSize = 12;

    const filters = useFundraisingFilters({
        defaultStatuses: [FundraisingStatus.ReadyForReview]
    });

    const pagination = usePagination({ pageSize });

    const [fundraisings, setFundraisings] = useState<Fundraising[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchFundraisings = async () => {
        setLoading(true);
        try {
            const response = await fundraisingsRepository.getFundraisings(
                {
                    title: filters.searchQuery,
                    tags: filters.selectedTags,
                    statuses: [FundraisingStatus.ReadyForReview],
                    userId: filters.selectedUser
                },
                pagination.page,
                pagination.pageSize
            );

            if (response?.data) {
                setFundraisings(response.data.items);
                pagination.updatePaginationData(
                    response.data.totalPages,
                    response.data.totalCount
                );
            } else {
                setFundraisings([]);
                pagination.resetPagination();
            }
        } catch (error) {
            console.error('Failed to fetch fundraisings:', error);
            setFundraisings([]);
            pagination.resetPagination();
        } finally {
            setLoading(false);
        }
    };

    // Reset to first page when filters change
    useEffect(() => {
        pagination.goToFirstPage();
    }, [filters.searchQuery, filters.selectedTags, filters.selectedUser]);

    // Fetch data when dependencies change
    useEffect(() => {
        fetchFundraisings();
    }, [
        filters.searchQuery,
        filters.selectedTags,
        filters.selectedUser,
        pagination.page
    ]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number, currencyCode: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode
        }).format(amount);
    };

    return (
        <PageWrapper searchAvailable={false} >
            <Container maxWidth="lg" >
                {/* Header Section */}
                < Paper
                    elevation={4}
                    sx={{
                        mb: 4,
                        borderRadius: 4,
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        position: 'relative'
                    }
                    }
                >
                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1 }}>
                        <Box sx={
                            {
                                background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                                width: '100%',
                                height: '100%'
                            }
                        } />
                    </Box>
                    < CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Box sx={
                                {
                                    p: 2,
                                    borderRadius: 3,
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }
                            }>
                                <ReviewsIcon sx={{ fontSize: 32 }} />
                            </Box>
                            < Box >
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                    Admin Review Panel
                                </Typography>
                                < Typography variant="h6" sx={{ opacity: 0.9 }}>
                                    Review fundraising campaigns ready for approval
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Paper>

                {/* Search & Filters */}
                < Card elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <FilterListIcon />
                            </Avatar>
                            < Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Search & Filters
                            </Typography>
                        </Box>

                        < Grid container spacing={3} >
                            <Grid item xs={12} md={6} >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                                    < Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        Search Campaigns
                                    </Typography>
                                </Box>
                                < Search
                                    onSearch={filters.setSearchQuery}
                                    initialValue={filters.searchQuery}
                                    placeholder="Search by title or description..."
                                />
                            </Grid>

                            < Grid item xs={12} md={6} >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <TagIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                                    < Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        Filter by Tags
                                    </Typography>
                                </Box>
                                < MultiSelectWithChip
                                    limitTags={3}
                                    width="100%"
                                    label="Select tags"
                                    values={allTags.map((tag) => tag.name)}
                                    onChange={filters.setSelectedTags}
                                />
                            </Grid>
                        </Grid>

                        < Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                <strong>{pagination.totalCount} </strong> fundraising campaigns are ready for review
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                {/* Fundraising List */}
                <Box sx={{ mb: 4 }}>
                    <Grid container spacing={3} >
                        {
                            loading ? (
                                Array(pageSize).fill(0).map((_, index) => (
                                    <Grid item xs={12} sm={6} lg={4} key={index} >
                                        <Skeleton
                                            variant="rounded"
                                            sx={{
                                                height: 350,
                                                borderRadius: 3
                                            }}
                                        />
                                    </Grid>
                                ))
                            ) : fundraisings.length === 0 ? (
                                <Grid item xs={12} >
                                    <Box
                                        sx={
                                            {
                                                textAlign: 'center',
                                                py: 8,
                                                px: 2
                                            }
                                        }
                                    >
                                        <ReviewsIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                                        < Typography
                                            variant="h6"
                                            color="text.secondary"
                                            sx={{ mb: 1 }}
                                        >
                                            No fundraisings ready for review
                                        </Typography>
                                        < Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Try adjusting your filters or check back later
                                        </Typography>
                                    </Box>
                                </Grid>
                            ) : (
                                fundraisings.map((fundraising) => {
                                    const { balance, goal, currencyCode } = fundraising.monobankJar;
                                    const progress = Math.min((balance / goal) * 100, 100);

                                    return (
                                        <Grid item xs={12} sm={6} lg={4} key={fundraising.id} >
                                            <Card
                                                elevation={2}
                                                sx={{
                                                    borderRadius: 3,
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&:hover': {
                                                        elevation: 8,
                                                        transform: 'translateY(-2px)'
                                                    }
                                                }
                                                }
                                            >
                                                <Box
                                                    sx={{
                                                        height: 200,
                                                        backgroundImage: `url(${fundraising.avatarUrl})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        position: 'relative'
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 12,
                                                            right: 12
                                                        }}
                                                    >
                                                        <Chip
                                                            label="Ready for Review"
                                                            color="warning"
                                                            size="small"
                                                            sx={{ fontWeight: 600 }}
                                                        />
                                                    </Box>
                                                </Box>

                                                < CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 700,
                                                            mb: 1,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }}
                                                    >
                                                        {fundraising.title}
                                                    </Typography>

                                                    < Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            mb: 2,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 3,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            flexGrow: 1
                                                        }}
                                                    >
                                                        {fundraising.description}
                                                    </Typography>

                                                    {/* Creator Info */}
                                                    < Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                        <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                        < Typography variant="caption" color="text.secondary" >
                                                            Created by {fundraising.userName}
                                                        </Typography>
                                                    </Box>

                                                    {/* Created Date */}
                                                    < Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                        <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                        < Typography variant="caption" color="text.secondary" >
                                                            Created {formatDate(fundraising.createdAt)}
                                                        </Typography>
                                                    </Box>

                                                    {/* Tags */}
                                                    {
                                                        fundraising.tags.length > 0 && (
                                                            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }
                                                            }>
                                                                {
                                                                    fundraising.tags.slice(0, 3).map((tag: string, index: number) => (
                                                                        <Chip
                                                                            key={index}
                                                                            label={tag}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            sx={{
                                                                                fontSize: '0.75rem',
                                                                                height: 24
                                                                            }}
                                                                        />
                                                                    ))}
                                                                {
                                                                    fundraising.tags.length > 3 && (
                                                                        <Chip
                                                                            label={`+${fundraising.tags.length - 3}`}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            color="primary"
                                                                            sx={{
                                                                                fontSize: '0.75rem',
                                                                                height: 24
                                                                            }
                                                                            }
                                                                        />
                                                                    )}
                                                            </Stack>
                                                        )}

                                                    {/* Progress */}
                                                    <Box sx={{ mb: 3 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                {formatCurrency(balance, currencyCode)}
                                                            </Typography>
                                                            < Typography variant="body2" color="text.secondary" >
                                                                {formatCurrency(goal, currencyCode)}
                                                            </Typography>
                                                        </Box>
                                                        < LinearProgress
                                                            variant="determinate"
                                                            value={progress}
                                                            sx={{
                                                                height: 8,
                                                                borderRadius: 4,
                                                                bgcolor: 'grey.200',
                                                                '& .MuiLinearProgress-bar': {
                                                                    borderRadius: 4,
                                                                    bgcolor: progress >= 100 ? 'success.main' : 'primary.main'
                                                                }
                                                            }}
                                                        />
                                                        < Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                                            {progress.toFixed(1)} % funded
                                                        </Typography>
                                                    </Box>

                                                    {/* Action Buttons */}
                                                    <Stack direction="row" spacing={1} >
                                                        <Tooltip title="View Details" >
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => navigate(`/fundraising/${fundraising.id}`)}
                                                                sx={{
                                                                    bgcolor: 'grey.100',
                                                                    '&:hover': { bgcolor: 'grey.200' }
                                                                }}
                                                            >
                                                                <VisibilityIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        < Button
                                                            variant="contained"
                                                            fullWidth
                                                            startIcon={< ReviewsIcon />}
                                                            onClick={() => navigate(`/review/${fundraising.id}`)}
                                                            sx={{
                                                                borderRadius: 2,
                                                                fontWeight: 600,
                                                                textTransform: 'none'
                                                            }}
                                                        >
                                                            Review
                                                        </Button>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })
                            )}
                    </Grid>
                </Box>

                {/* Pagination */}
                {
                    pagination.totalPages > 1 && (
                        <PaginationPaper
                            totalPages={pagination.totalPages}
                            page={pagination.page}
                            setPage={pagination.setPage}
                            theme={theme}
                        />
                    )
                }
            </Container>
        </PageWrapper>
    );
};

export default ReadyForReviewFundraisingsPage;