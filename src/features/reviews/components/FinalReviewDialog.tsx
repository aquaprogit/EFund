import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    Stack,
    Divider,
    LinearProgress,
    IconButton,
    Chip
} from "@mui/material";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface FinalReviewDialogProps {
    open: boolean;
    onClose: () => void;
    totalScore: number;
    maxTotalScore: number;
    generatedMessage: string;
    finalComment: string;
    onFinalCommentChange: (comment: string) => void;
    onSubmit: () => void;
    submitting: boolean;
}

const FinalReviewDialog = ({
    open,
    onClose,
    totalScore,
    maxTotalScore,
    generatedMessage,
    finalComment,
    onFinalCommentChange,
    onSubmit,
    submitting
}: FinalReviewDialogProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localComment, setLocalComment] = useState(finalComment);

    const percentage = (totalScore / maxTotalScore) * 100;

    const formatNumber = (num: number) => {
        const rounded = Math.round(num * 10) / 10;
        return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
    };

    const getRatingLevel = () => {
        if (percentage >= 80) return { label: 'Excellent', color: 'success' };
        if (percentage >= 60) return { label: 'Good', color: 'primary' };
        if (percentage >= 40) return { label: 'Fair', color: 'warning' };
        return { label: 'Needs Improvement', color: 'error' };
    };

    const rating = getRatingLevel();

    const handleSave = () => {
        onFinalCommentChange(localComment);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setLocalComment(finalComment);
        setIsEditing(false);
    };

    const handleSubmit = () => {
        if (isEditing) {
            handleSave();
        }
        onSubmit();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle sx={{ pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Final Review Summary
                    </Typography>
                    <IconButton
                        onClick={onClose}
                        disabled={submitting}
                        sx={{ color: 'text.secondary' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ px: 3, py: 2 }}>
                <Stack spacing={3}>
                    {/* Rating Overview */}
                    <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                            {formatNumber(percentage)}%
                        </Typography>
                        <Chip
                            label={rating.label}
                            color={rating.color as any}
                            sx={{ mb: 2, fontWeight: 600 }}
                        />
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            Total Score: {formatNumber(totalScore)} / {formatNumber(maxTotalScore)}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    bgcolor: percentage >= 70 ? 'success.main' : percentage >= 40 ? 'warning.main' : 'error.main'
                                }
                            }}
                        />
                    </Box>

                    <Divider />

                    {/* Generated Review Message */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Generated Review Message
                            </Typography>
                            <Button
                                startIcon={<VisibilityIcon />}
                                size="small"
                                variant="outlined"
                                sx={{ textTransform: 'none' }}
                            >
                                Preview
                            </Button>
                        </Box>
                        <Box sx={{
                            p: 2,
                            bgcolor: 'grey.50',
                            borderRadius: 2,
                            maxHeight: 200,
                            overflow: 'auto',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            lineHeight: 1.6
                        }}>
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                {generatedMessage}
                            </pre>
                        </Box>
                    </Box>

                    <Divider />

                    {/* Additional Comments */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Additional Comments (Optional)
                            </Typography>
                            {!isEditing && (
                                <Button
                                    startIcon={<EditIcon />}
                                    size="small"
                                    variant="outlined"
                                    onClick={() => setIsEditing(true)}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Edit
                                </Button>
                            )}
                        </Box>

                        {isEditing ? (
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder="Add any additional comments, recommendations, or specific feedback for the user..."
                                    value={localComment}
                                    onChange={(e) => setLocalComment(e.target.value)}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={handleCancel}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={handleSave}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Save
                                    </Button>
                                </Box>
                            </Stack>
                        ) : (
                            <Box sx={{
                                p: 2,
                                bgcolor: finalComment ? 'grey.50' : 'transparent',
                                borderRadius: 2,
                                border: finalComment ? 'none' : '2px dashed',
                                borderColor: 'grey.300',
                                minHeight: 60,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {finalComment ? (
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {finalComment}
                                    </Typography>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                        No additional comments added
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Box>

                    {/* Impact Notice */}
                    <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 2, color: 'info.contrastText' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                            Review Impact
                        </Typography>
                        <Typography variant="body2">
                            This review will contribute to the user's trust rating and overall reputation on the platform.
                            The rating points ({formatNumber(totalScore)}) will be added to their account.
                        </Typography>
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button
                    onClick={onClose}
                    disabled={submitting}
                    variant="outlined"
                    sx={{ textTransform: 'none' }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={submitting || totalScore === 0}
                    variant="contained"
                    startIcon={<SendIcon />}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        minWidth: 140
                    }}
                >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FinalReviewDialog; 