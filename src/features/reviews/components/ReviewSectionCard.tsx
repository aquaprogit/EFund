import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    IconButton,
    Stack,
    Chip,
    useTheme,
    Divider,
    CardMedia,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Button,
    Link,
    Tooltip
} from "@mui/material";
import { useState } from "react";
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import ImageIcon from '@mui/icons-material/Image';
import AttachmentIcon from '@mui/icons-material/Attachment';
import DescriptionIcon from '@mui/icons-material/Description';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GetAppIcon from '@mui/icons-material/GetApp';

interface SectionContent {
    type: 'basic_info' | 'visual_content' | 'financial_setup' | 'documentation';
    data: any;
}

interface ReviewSectionCardProps {
    title: string;
    description: string;
    score: number;
    maxScore: number;
    comment: string;
    sectionContent?: SectionContent;
    onUpdate: (score: number, comment: string) => void;
}

const ReviewSectionCard = ({
    title,
    description,
    score,
    maxScore,
    comment,
    sectionContent,
    onUpdate
}: ReviewSectionCardProps) => {
    const theme = useTheme();
    const [localComment, setLocalComment] = useState(comment);

    // Convert score to star rating (0-5 stars)
    const starRating = Math.round((score / maxScore) * 5);

    const handleStarClick = (starIndex: number) => {
        // If clicking on the current star rating, reset to 0
        if (starIndex === starRating) {
            onUpdate(0, localComment);
        } else {
            const newScore = (starIndex * maxScore) / 5;
            onUpdate(newScore, localComment);
        }
    };

    const handleCommentChange = (newComment: string) => {
        setLocalComment(newComment);
        onUpdate(score, newComment);
    };

    const getScoreColor = () => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 80) return 'success.main';
        if (percentage >= 60) return 'warning.main';
        if (percentage >= 40) return 'orange';
        return 'error.main';
    };

    const getScoreLabel = () => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 80) return 'Excellent';
        if (percentage >= 60) return 'Good';
        if (percentage >= 40) return 'Fair';
        if (percentage > 0) return 'Poor';
        return 'Not Rated';
    };

    const formatCurrency = (amount: number, currencyCode: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatNumber = (num: number) => {
        const rounded = Math.round(num * 10) / 10;
        return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
    };

    const renderSectionContent = () => {
        if (!sectionContent) return null;

        const { type, data } = sectionContent;

        switch (type) {
            case 'basic_info':
                return (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                            Content to Review
                        </Typography>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Title:
                                </Typography>
                                <Typography variant="body1" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                    {data.title}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                    Description:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        p: 2,
                                        bgcolor: 'grey.50',
                                        borderRadius: 1,
                                        whiteSpace: 'pre-wrap',
                                        maxHeight: 150,
                                        overflow: 'auto'
                                    }}
                                >
                                    {data.description}
                                </Typography>
                            </Box>
                            {data.tags && data.tags.length > 0 && (
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                        Tags:
                                    </Typography>
                                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                        {data.tags.map((tag: string, index: number) => (
                                            <Chip
                                                key={index}
                                                label={tag}
                                                size="small"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Stack>
                                </Box>
                            )}
                        </Stack>
                    </Box>
                );

            case 'visual_content':
                return (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                            Visual Content to Review
                        </Typography>
                        <Card variant="outlined" sx={{ maxWidth: 400 }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={data.avatarUrl}
                                alt="Fundraising image"
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ p: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Main fundraising image
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                );

            case 'financial_setup':
                return (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                            Financial Setup to Review
                        </Typography>
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        Goal Amount:
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatCurrency(data.goal, data.currencyCode)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        Current Progress:
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatCurrency(data.balance, data.currencyCode)}
                                        ({formatNumber((data.balance / data.goal) * 100)}%)
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        Monobank Jar:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        <Link href={data.sendUrl} target="_blank" rel="noopener noreferrer">
                                            {data.sendUrl}
                                        </Link>
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Box>
                );

            case 'documentation':
                return (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                            Documentation to Review
                        </Typography>
                        {data.reports && data.reports.length > 0 ? (
                            <Box sx={{ maxHeight: 400, overflow: 'auto', border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                                <List dense>
                                    {data.reports.map((report: any, index: number) => (
                                        <ListItem key={index} sx={{ alignItems: 'flex-start', py: 2 }}>
                                            <ListItemIcon sx={{ mt: 1 }}>
                                                <DescriptionIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            Report #{index + 1}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {formatDate(report.createdAt)}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                                            {report.description}
                                                        </Typography>
                                                        {report.attachments && report.attachments.length > 0 && (
                                                            <Box>
                                                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                                                                    Attachments ({report.attachments.length}):
                                                                </Typography>
                                                                <Stack spacing={1}>
                                                                    {report.attachments.map((attachment: any, attachIndex: number) => (
                                                                        <Box key={attachIndex} sx={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 1,
                                                                            p: 1,
                                                                            bgcolor: 'grey.50',
                                                                            borderRadius: 1,
                                                                            border: '1px solid',
                                                                            borderColor: 'grey.200'
                                                                        }}>
                                                                            <AttachmentIcon fontSize="small" color="action" />
                                                                            <Typography variant="caption" sx={{ flex: 1, fontWeight: 500 }}>
                                                                                {attachment.fileName || attachment.name || `Attachment ${attachIndex + 1}`}
                                                                            </Typography>
                                                                            <Stack direction="row" spacing={0.5}>
                                                                                <Tooltip title="View attachment">
                                                                                    <IconButton
                                                                                        size="small"
                                                                                        onClick={() => window.open(attachment.url || attachment.fileUrl, '_blank')}
                                                                                        sx={{
                                                                                            color: 'primary.main',
                                                                                            '&:hover': { bgcolor: 'primary.light', color: 'white' }
                                                                                        }}
                                                                                    >
                                                                                        <OpenInNewIcon fontSize="small" />
                                                                                    </IconButton>
                                                                                </Tooltip>
                                                                            </Stack>
                                                                        </Box>
                                                                    ))}
                                                                </Stack>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        ) : (
                            <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    No progress reports submitted yet
                                </Typography>
                            </Box>
                        )}
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Card
            elevation={3}
            sx={{
                borderRadius: 3,
                border: score > 0 ? `2px solid ${getScoreColor()}` : '2px solid transparent',
                transition: 'all 0.2s ease-in-out'
            }}
        >
            <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {description}
                        </Typography>
                    </Box>
                    <Box sx={{ ml: 2, textAlign: 'center' }}>
                        <Chip
                            label={getScoreLabel()}
                            color={score > 0 ? 'primary' : 'default'}
                            sx={{
                                mb: 1,
                                fontWeight: 600,
                                backgroundColor: score > 0 ? getScoreColor() : undefined,
                                color: score > 0 ? 'white' : undefined
                            }}
                        />
                        <Typography variant="caption" display="block" color="text.secondary">
                            {formatNumber(score)} / {formatNumber(maxScore)}
                        </Typography>
                    </Box>
                </Box>

                {/* Section Content */}
                {renderSectionContent()}

                {sectionContent && <Divider sx={{ my: 3 }} />}

                {/* Star Rating */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Rating
                    </Typography>
                    <Stack direction="row" spacing={0.5}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <IconButton
                                key={star}
                                onClick={() => handleStarClick(star)}
                                sx={{
                                    p: 0.5,
                                    color: star <= starRating ? 'primary.main' : 'action.disabled',
                                    '&:hover': {
                                        color: 'primary.main',
                                        backgroundColor: 'transparent'
                                    }
                                }}
                            >
                                {star <= starRating ? (
                                    <StarIcon sx={{ fontSize: 28 }} />
                                ) : (
                                    <StarOutlineIcon sx={{ fontSize: 28 }} />
                                )}
                            </IconButton>
                        ))}
                        <Typography variant="body2" sx={{ ml: 2, alignSelf: 'center' }} color="text.secondary">
                            {starRating}/5 stars
                        </Typography>
                    </Stack>
                </Box>

                {/* Comment Field */}
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Comments & Feedback
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Leave constructive feedback or comments for improvement..."
                        value={localComment}
                        onChange={(e) => handleCommentChange(e.target.value)}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Your feedback helps improve future fundraising campaigns
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ReviewSectionCard; 