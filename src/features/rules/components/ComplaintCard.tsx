import { Box } from "@mui/material";
import { Card, CardContent, Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import { Complaint } from "../models/Complaint";
import { formatDate } from "date-fns";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { ComplaintStatus } from "../models/ComplaintStatus";
import { useNavigate } from "react-router-dom";
import UserPreviewTooltip from "../../../shared/components/UserPreviewTooltip";

interface ComplaintCardProps {
    complaint: Complaint;
    key: string;
}

const ComplaintCard = ({ complaint, key }: ComplaintCardProps) => {
    const navigate = useNavigate();

    const getStatusLabel = (status: ComplaintStatus) => {
        switch (status) {
            case ComplaintStatus.Pending:
                return 'Pending';
            case ComplaintStatus.Accepted:
                return 'Accepted';
            case ComplaintStatus.Rejected:
                return 'Rejected';
            case ComplaintStatus.RequestedChanges:
                return 'Changes Requested';
            default:
                return 'Unknown';
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const getStatusColor = (status: ComplaintStatus) => {
        switch (status) {
            case ComplaintStatus.Pending:
                return 'warning';
            case ComplaintStatus.Accepted:
                return 'success';
            case ComplaintStatus.Rejected:
                return 'error';
            case ComplaintStatus.RequestedChanges:
                return 'info';
            default:
                return 'default';
        }
    };

    const handleCardClick = () => {
        navigate(`/complaint/${complaint.id}`);
    };

    return (
        <Grid item xs={12} md={6} lg={4} key={key}>
            <Card
                elevation={1}
                onClick={handleCardClick}
                sx={{
                    height: '100%',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        elevation: 3,
                        transform: 'translateY(-2px)',
                    }
                }}
            >
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Header with ID and Status */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: 'text.primary',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                flex: 1,
                                mr: 1
                            }}
                        >
                            Complaint {complaint.number}
                        </Typography>
                        <Chip
                            label={getStatusLabel(complaint.status)}
                            size="small"
                            color={getStatusColor(complaint.status) as any}
                            variant="filled"
                            sx={{ fontWeight: 500 }}
                        />
                    </Box>

                    {complaint.comment && (
                        <Box sx={{ mb: 2, flexGrow: 1 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.primary',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 4,
                                    WebkitBoxOrient: 'vertical',
                                    lineHeight: 1.5,
                                    fontWeight: 400
                                }}
                            >
                                {complaint.comment}
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ mt: 'auto' }}>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    By:
                                </Typography>
                                <UserPreviewTooltip userId={complaint.requestedBy}>
                                    <Typography sx={{ textDecoration: 'underline' }} color="text.secondary" onClick={() => navigate(`/user/${complaint.requestedBy}`)} variant="body2">{complaint.requestedByUserName}</Typography>
                                </UserPreviewTooltip>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    For:
                                </Typography>
                                <UserPreviewTooltip userId={complaint.requestedFor}>
                                    <Typography sx={{ textDecoration: 'underline' }} color="text.secondary" onClick={() => navigate(`/user/${complaint.requestedFor}`)} variant="body2">{complaint.requestedForUserName}</Typography>
                                </UserPreviewTooltip>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {formatDate(complaint.requestedAt)}
                                </Typography>
                            </Box>
                            {complaint.reviewedAt && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        Reviewed: {formatDate(complaint.reviewedAt)}
                                    </Typography>
                                </Box>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 800 }}>
                                <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 800 }}>
                                    Estimated Rating Penalty: {complaint.violations.reduce((sum, violation) => sum + violation.ratingImpact, 0)}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default ComplaintCard;