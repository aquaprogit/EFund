import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Container,
    Grid,
    Typography,
    useTheme,
    Paper,
    Stack,
    Divider,
    Button,
    Chip,
    LinearProgress,
    IconButton,
    Alert
} from "@mui/material";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { fundraisingsRepository } from "../../fundraising/repository/fundraisingsRepository";
import PageWrapper from "../../../shared/components/PageWrapper";
import { useToast } from "../../../contexts/ToastContext";

// Icons
import ReviewsIcon from '@mui/icons-material/Reviews';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';

// Rating Components
import ReviewSectionCard from '../components/ReviewSectionCard';
import FinalReviewDialog from '../components/FinalReviewDialog';

interface SectionRating {
    title: string;
    description: string;
    score: number;
    comment: string;
    maxScore: number;
}

const ReviewFundraisingPage = () => {
    const { id } = useParams<{ id: string }>();
    const theme = useTheme();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    // Review state
    const [sectionRatings, setSectionRatings] = useState<Record<string, SectionRating>>({
        basic_info: {
            title: 'Basic Information',
            description: 'Title, description, and overall presentation quality',
            score: 0,
            comment: '',
            maxScore: 0.3
        },
        visual_content: {
            title: 'Visual Content',
            description: 'Image quality, appropriateness, and relevance',
            score: 0,
            comment: '',
            maxScore: 0.2
        },
        financial_setup: {
            title: 'Financial Setup',
            description: 'Monobank jar configuration and goal appropriateness',
            score: 0,
            comment: '',
            maxScore: 0.2
        },
        documentation: {
            title: 'Documentation & Reports',
            description: 'Progress reports, transparency, and documentation quality',
            score: 0,
            comment: '',
            maxScore: 0.3
        }
    });

    const [finalDialogOpen, setFinalDialogOpen] = useState(false);
    const [finalComment, setFinalComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Fetch fundraising data
    const { data: response, isLoading, error } = useQuery({
        queryKey: ['fundraising-review', id],
        queryFn: () => fundraisingsRepository.getFundraising(id!),
        enabled: !!id
    });

    if (!id) {
        navigate('/admin/reviews');
        return null;
    }

    if (isLoading) {
        return (
            <PageWrapper searchAvailable={false}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Typography>Loading fundraising details...</Typography>
                </Container>
            </PageWrapper>
        );
    }

    if (error || !response || response.error || !response.data) {
        return (
            <PageWrapper searchAvailable={false}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Alert severity="error">
                        Failed to load fundraising details: {response?.error?.message || 'Unknown error'}
                    </Alert>
                </Container>
            </PageWrapper>
        );
    }

    const fundraising = response.data;

    // Calculate total score
    const totalScore = Object.values(sectionRatings).reduce((sum, section) => sum + section.score, 0);
    const maxTotalScore = Object.values(sectionRatings).reduce((sum, section) => sum + section.maxScore, 0);

    // Update section rating
    const updateSectionRating = (sectionKey: string, score: number, comment: string) => {
        setSectionRatings(prev => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                score: Math.min(score, prev[sectionKey].maxScore),
                comment
            }
        }));
    };

    // Generate final review message
    const generateFinalMessage = () => {
        const completedSections = Object.entries(sectionRatings)
            .filter(([_, section]) => section.score > 0 || section.comment.trim() !== '')
            .map(([key, section]) => {
                const percentage = formatNumber(section.score / section.maxScore * 100);
                return `${section.title}: ${percentage}% (${formatNumber(section.score)}/${formatNumber(section.maxScore)})${section.comment ? `\n- ${section.comment}` : ''}`;
            });

        return `Review Summary for "${fundraising.title}"\n\nTotal Rating: ${formatNumber(totalScore / maxTotalScore * 100)}% (${formatNumber(totalScore)}/${formatNumber(maxTotalScore)})\n\nSection Breakdown:\n${completedSections.join('\n\n')}`;
    };

    // Submit review
    const handleSubmitReview = async () => {
        setSubmitting(true);
        try {
            // Here you would call the review submission API
            // const response = await reviewRepository.submitReview({
            //     fundraisingId: id,
            //     totalScore,
            //     sectionRatings,
            //     finalComment
            // });

            showSuccess('Review submitted successfully');
            navigate('/admin/reviews');
        } catch (error) {
            showError('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number, currencyCode: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        const rounded = Math.round(num * 10) / 10;
        return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
    };

    return (
        <PageWrapper searchAvailable={false}>
            <Container maxWidth="lg">
                {/* Header */}
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
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <ReviewsIcon sx={{ fontSize: 32 }} />
                                </Box>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                        Review Fundraising Campaign
                                    </Typography>
                                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                        {fundraising.title}
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton
                                onClick={() => navigate('/admin/reviews')}
                                sx={{
                                    color: 'white',
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.3)'
                                    }
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        </Box>
                    </CardContent>
                </Paper>

                <Grid container spacing={4}>
                    {/* Left Column - Main Content */}
                    <Grid item xs={12} md={8}>
                        <Stack spacing={4}>
                            {/* Basic Information Section */}
                            <Card elevation={3} sx={{ borderRadius: 3 }}>
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={fundraising.avatarUrl}
                                    alt={fundraising.title}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                                        {fundraising.title}
                                    </Typography>

                                    {/* Tags */}
                                    {fundraising.tags.length > 0 && (
                                        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap' }}>
                                            {fundraising.tags.map((tag: string, index: number) => (
                                                <Chip
                                                    key={index}
                                                    label={tag}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Stack>
                                    )}

                                    {/* Meta Information */}
                                    <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PersonIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {fundraising.userName}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AccessTimeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDate(fundraising.createdAt)}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Divider sx={{ my: 3 }} />

                                    {/* Description */}
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
                                        {fundraising.description}
                                    </Typography>

                                    {/* Progress Information */}
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                            Financial Progress
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {formatCurrency(fundraising.monobankJar.balance, fundraising.monobankJar.currencyCode)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {formatCurrency(fundraising.monobankJar.goal, fundraising.monobankJar.currencyCode)}
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min((fundraising.monobankJar.balance / fundraising.monobankJar.goal) * 100, 100)}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                bgcolor: 'grey.200',
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 4
                                                }
                                            }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Review Sections */}
                            {Object.entries(sectionRatings).map(([key, section]) => {
                                // Prepare section-specific content
                                let sectionContent;
                                switch (key) {
                                    case 'basic_info':
                                        sectionContent = {
                                            type: 'basic_info' as const,
                                            data: {
                                                title: fundraising.title,
                                                description: fundraising.description,
                                                tags: fundraising.tags
                                            }
                                        };
                                        break;
                                    case 'visual_content':
                                        sectionContent = {
                                            type: 'visual_content' as const,
                                            data: {
                                                avatarUrl: fundraising.avatarUrl
                                            }
                                        };
                                        break;
                                    case 'financial_setup':
                                        sectionContent = {
                                            type: 'financial_setup' as const,
                                            data: {
                                                goal: fundraising.monobankJar.goal,
                                                balance: fundraising.monobankJar.balance,
                                                currencyCode: fundraising.monobankJar.currencyCode,
                                                sendUrl: fundraising.monobankJar.sendUrl
                                            }
                                        };
                                        break;
                                    case 'documentation':
                                        sectionContent = {
                                            type: 'documentation' as const,
                                            data: {
                                                reports: fundraising.reports || []
                                            }
                                        };
                                        break;
                                }

                                return (
                                    <ReviewSectionCard
                                        key={key}
                                        title={section.title}
                                        description={section.description}
                                        score={section.score}
                                        maxScore={section.maxScore}
                                        comment={section.comment}
                                        sectionContent={sectionContent}
                                        onUpdate={(score, comment) => updateSectionRating(key, score, comment)}
                                    />
                                );
                            })}

                            {/* Reports Section */}
                            {fundraising.reports && fundraising.reports.length > 0 && (
                                <Card elevation={3} sx={{ borderRadius: 3 }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                            Progress Reports ({fundraising.reports.length})
                                        </Typography>
                                        <Stack spacing={2}>
                                            {fundraising.reports.map((report: any, index: number) => (
                                                <Box key={index} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        {formatDate(report.createdAt)}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {report.description}
                                                    </Typography>
                                                    {report.attachments && report.attachments.length > 0 && (
                                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                            {report.attachments.length} attachment(s)
                                                        </Typography>
                                                    )}
                                                </Box>
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )}
                        </Stack>
                    </Grid>

                    {/* Right Column - Review Summary */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            {/* Review Summary Card */}
                            <Card elevation={3} sx={{ borderRadius: 3 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                        Review Summary
                                    </Typography>

                                    {/* Total Score */}
                                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                            {formatNumber(totalScore / maxTotalScore * 100)}%
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Rating ({formatNumber(totalScore)}/{formatNumber(maxTotalScore)})
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={totalScore / maxTotalScore * 100}
                                            sx={{
                                                mt: 1,
                                                height: 8,
                                                borderRadius: 4,
                                                bgcolor: 'grey.200',
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 4,
                                                    bgcolor: totalScore >= 0.7 ? 'success.main' : totalScore >= 0.4 ? 'warning.main' : 'error.main'
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Divider sx={{ my: 3 }} />

                                    {/* Section Breakdown */}
                                    <Stack spacing={2} sx={{ mb: 3 }}>
                                        {Object.entries(sectionRatings).map(([key, section]) => (
                                            <Box key={key}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {section.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formatNumber(section.score / section.maxScore * 100)}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={section.score / section.maxScore * 100}
                                                    sx={{
                                                        height: 4,
                                                        borderRadius: 2,
                                                        bgcolor: 'grey.200',
                                                        '& .MuiLinearProgress-bar': {
                                                            borderRadius: 2
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                    </Stack>

                                    {/* Submit Review Button */}
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        startIcon={<SendIcon />}
                                        onClick={() => setFinalDialogOpen(true)}
                                        disabled={totalScore === 0}
                                        sx={{
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            py: 1.5
                                        }}
                                    >
                                        Submit Review
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Guidelines Card */}
                            <Card elevation={3} sx={{ borderRadius: 3 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                        Review Guidelines
                                    </Typography>
                                    <Stack spacing={1}>
                                        <Typography variant="body2" color="text.secondary">
                                            • Rate each section based on quality and completeness
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Consider clarity, appropriateness, and professionalism
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Leave constructive comments for improvement
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Total rating affects user's trust score
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>

                {/* Final Review Dialog */}
                <FinalReviewDialog
                    open={finalDialogOpen}
                    onClose={() => setFinalDialogOpen(false)}
                    totalScore={totalScore}
                    maxTotalScore={maxTotalScore}
                    generatedMessage={generateFinalMessage()}
                    finalComment={finalComment}
                    onFinalCommentChange={setFinalComment}
                    onSubmit={handleSubmitReview}
                    submitting={submitting}
                />
            </Container>
        </PageWrapper>
    );
};

export default ReviewFundraisingPage; 