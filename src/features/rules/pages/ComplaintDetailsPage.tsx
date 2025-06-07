import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Paper,
    Typography,
    Box,
    Chip,
    Grid,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    TextField,
    Button,
    Stack,
    CircularProgress,
    IconButton,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText
} from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { Complaint } from "../models/Complaint";
import { ComplaintStatus } from "../models/ComplaintStatus";
import { complaintRepository } from "../repository/complaintRepository";
import { useToast } from "../../../contexts/ToastContext";
import PageWrapper from "../../../shared/components/PageWrapper";
import UserPreviewTooltip from "../../../shared/components/UserPreviewTooltip";
import FundraisingPreview from "../../fundraising/components/FundraisingPreview";

const ComplaintDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedViolations, setSelectedViolations] = useState<{ [key: string]: boolean }>({});
    const [totalPenalty, setTotalPenalty] = useState(0);
    const [nextComplaintId, setNextComplaintId] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'accept' | 'reject' | 'changes'>('accept');
    const [actionComment, setActionComment] = useState('');

    useEffect(() => {
        if (id) {
            fetchComplaint(id);
            fetchNextPendingComplaint();
        }
    }, [id]);

    const fetchComplaint = async (complaintId: string) => {
        try {
            setLoading(true);
            const result = await complaintRepository.getComplaint(complaintId);

            if (result.isSuccess && result.data) {
                const complaintData = result.data;
                setComplaint(complaintData);

                const initialSelections: { [key: string]: boolean } = {};
                complaintData.violations.forEach(violation => {
                    initialSelections[violation.id] = true;
                });
                setSelectedViolations(initialSelections);

                // Calculate initial total penalty
                const estimatedPenalty = complaintData.violations.reduce((sum, violation) => sum + violation.ratingImpact, 0);
                setTotalPenalty(estimatedPenalty);

            } else if (result.error?.code === 401) {
                showError("You are not authorized to access this complaint");
                navigate("/complaints");
            } else if (result.error?.code === 404) {
                showError("Complaint not found");
                navigate("/complaints");
            } else {
                showError(result.error?.message || "Failed to fetch complaint details");
            }
        } catch (error) {
            console.error('Failed to fetch complaint:', error);
            showError("An unexpected error occurred while fetching complaint details");
        } finally {
            setLoading(false);
        }
    };



    const fetchNextPendingComplaint = async () => {
        try {
            const result = await complaintRepository.getComplaints(ComplaintStatus.Pending, 1, 100);
            if (result.isSuccess && result.data) {
                const pendingComplaints = result.data.items.filter(c => c.id !== id);
                if (pendingComplaints.length > 0) {
                    setNextComplaintId(pendingComplaints[0].id);
                }
            }
        } catch (error) {
            console.error('Failed to fetch next pending complaint:', error);
        }
    };

    const handleViolationToggle = (violationId: string, checked: boolean) => {
        setSelectedViolations(prev => ({
            ...prev,
            [violationId]: checked
        }));

        // Recalculate penalty based on selected violations
        if (complaint) {

            // Calculate penalty for all selected violations
            const allSelectedPenalty = complaint.violations
                .filter(violation => violation.id === violationId ? checked : selectedViolations[violation.id])
                .reduce((sum, violation) => sum + violation.ratingImpact, 0);

            setTotalPenalty(allSelectedPenalty);
        }
    };

    const handlePenaltyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value) || 0;
        setTotalPenalty(Math.max(0, value));
    };

    const openActionDialog = (action: 'accept' | 'reject' | 'changes') => {
        setDialogType(action);
        setActionComment('');
        setDialogOpen(true);
    };

    const handleActionConfirm = async () => {
        if (!complaint) return;

        try {
            setProcessing(true);
            let result;

            switch (dialogType) {
                case 'accept':
                    result = await complaintRepository.acceptComplaint({
                        complaintId: complaint.id,
                        ratingChange: totalPenalty
                    });
                    break;
                case 'reject':
                    result = await complaintRepository.rejectComplaint({
                        complaintId: complaint.id
                    });
                    break;
                case 'changes':
                    result = await complaintRepository.requestChanges({
                        complaintId: complaint.id,
                        message: actionComment || 'Changes requested'
                    });
                    break;
            }

            if (result?.isSuccess) {
                showSuccess(`Complaint ${dialogType === 'accept' ? 'accepted' : dialogType === 'reject' ? 'rejected' : 'marked for changes'} successfully`);
                setDialogOpen(false);

                // Navigate to next pending complaint or back to list
                if (nextComplaintId) {
                    navigate(`/complaint/${nextComplaintId}`);
                } else {
                    navigate('/complaints');
                }
            } else {
                showError(result?.error?.message || `Failed to ${dialogType} complaint`);
            }
        } catch (error) {
            console.error(`Failed to ${dialogType} complaint:`, error);
            showError(`An unexpected error occurred while ${dialogType}ing the complaint`);
        } finally {
            setProcessing(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
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

    if (loading) {
        return (
            <PageWrapper showBackButton>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                        <CircularProgress size={50} />
                    </Box>
                </Container>
            </PageWrapper>
        );
    }

    if (!complaint) {
        return (
            <PageWrapper showBackButton>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Alert severity="error">Complaint not found</Alert>
                </Container>
            </PageWrapper>
        );
    }

    const isPending = complaint.status === ComplaintStatus.Pending;

    return (
        <PageWrapper showBackButton>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main', flexGrow: 1 }}>
                        Complaint {complaint.number}
                    </Typography>
                    <Chip
                        label={getStatusLabel(complaint.status)}
                        color={getStatusColor(complaint.status) as any}
                        variant="filled"
                        sx={{ fontWeight: 600, fontSize: '1rem', px: 2, py: 1 }}
                    />
                </Box>

                <Grid container spacing={3}>
                    {/* Left Column - Complaint Details */}
                    <Grid item xs={12} md={8}>
                        {/* Basic Information */}
                        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Complaint Details
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">Reported by:</Typography>
                                        <UserPreviewTooltip userId={complaint.requestedBy}>
                                            <Typography sx={{ textDecoration: 'underline', fontWeight: 'bold' }}
                                                color="primary" onClick={() => navigate(`/user/${complaint.requestedBy}`)} variant="body2">{complaint.requestedByUserName}</Typography>
                                        </UserPreviewTooltip>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">Reported against:</Typography>
                                        <UserPreviewTooltip userId={complaint.requestedFor}>
                                            <Typography sx={{ textDecoration: 'underline', fontWeight: 'bold' }}
                                                color="primary" onClick={() => navigate(`/user/${complaint.requestedFor}`)} variant="body2">{complaint.requestedForUserName}</Typography>
                                        </UserPreviewTooltip>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <AccessTimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">Submitted:</Typography>
                                        <Typography variant="body2">{formatDate(complaint.requestedAt)}</Typography>
                                    </Box>
                                </Grid>
                                {complaint.reviewedAt && (
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <AccessTimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">Reviewed:</Typography>
                                            <Typography variant="body2">{formatDate(complaint.reviewedAt)}</Typography>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>

                            {complaint.comment && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                        Description:
                                    </Typography>
                                    <Typography variant="body2" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                        {complaint.comment}
                                    </Typography>
                                </Box>
                            )}
                        </Paper>

                        {/* Fundraising Preview */}
                        {complaint.fundraisingId && (
                            <FundraisingPreview fundraisingId={complaint.fundraisingId} />
                        )}

                        {/* Violations */}
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Violations ({complaint.violations.length})
                            </Typography>

                            <Stack spacing={2}>
                                {complaint.violations.map((violation) => (
                                    <Card key={violation.id} elevation={1} sx={{ borderRadius: 2 }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                {isPending && (
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={selectedViolations[violation.id] || false}
                                                                onChange={(e) => handleViolationToggle(violation.id, e.target.checked)}
                                                                color="primary"
                                                            />
                                                        }
                                                        label=""
                                                        sx={{ m: 0 }}
                                                    />
                                                )}
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                                        {violation.title}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                                                        <Chip
                                                            label={`Penalty: ${violation.ratingImpact} points`}
                                                            color="error"
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* Right Column - Actions */}
                    <Grid item xs={12} md={4}>
                        {/* Penalty Summary */}
                        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Penalty Summary
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Estimated Penalty:
                                </Typography>
                                <Typography variant="h4" color="error.main" sx={{ fontWeight: 600 }}>
                                    {complaint.violations.reduce((sum, violation) => sum + violation.ratingImpact, 0)} points
                                </Typography>
                            </Box>

                            {isPending && (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Final Penalty:
                                    </Typography>
                                    <TextField
                                        type="number"
                                        value={totalPenalty}
                                        onChange={handlePenaltyChange}
                                        fullWidth
                                        size="small"
                                        inputProps={{ min: 0 }}
                                        sx={{ mb: 2 }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        You can adjust the final penalty based on your review
                                    </Typography>
                                </Box>
                            )}
                        </Paper>

                        {/* Actions */}
                        {isPending && (
                            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Actions
                                </Typography>

                                <Stack spacing={2}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckCircleIcon />}
                                        onClick={() => openActionDialog('accept')}
                                        fullWidth
                                        size="large"
                                        disabled={processing}
                                    >
                                        Accept Complaint
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<CancelIcon />}
                                        onClick={() => openActionDialog('reject')}
                                        fullWidth
                                        size="large"
                                        disabled={processing}
                                    >
                                        Reject Complaint
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="info"
                                        startIcon={<EditIcon />}
                                        onClick={() => openActionDialog('changes')}
                                        fullWidth
                                        size="large"
                                        disabled={processing}
                                    >
                                        Request Changes
                                    </Button>
                                </Stack>
                            </Paper>
                        )}

                        {/* Navigation */}
                        {nextComplaintId && (
                            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Navigation
                                </Typography>

                                <Button
                                    variant={isPending ? "outlined" : "contained"}
                                    endIcon={<ArrowForwardIcon />}
                                    onClick={() => navigate(`/complaint/${nextComplaintId}`)}
                                    fullWidth
                                    size="large"
                                >
                                    Next Pending Complaint
                                </Button>
                            </Paper>
                        )}
                    </Grid>
                </Grid>

                {/* Action Confirmation Dialog */}
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {dialogType === 'accept' ? 'Accept Complaint' :
                            dialogType === 'reject' ? 'Reject Complaint' :
                                'Request Changes'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ mb: 2 }}>
                            {dialogType === 'accept' ?
                                `Are you sure you want to accept this complaint with a penalty of ${totalPenalty} points?` :
                                dialogType === 'reject' ?
                                    'Are you sure you want to reject this complaint?' :
                                    'Are you sure you want to request changes for this complaint?'}
                        </DialogContentText>

                        <TextField
                            autoFocus
                            margin="dense"
                            label="Comment (optional)"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            value={actionComment}
                            onChange={(e) => setActionComment(e.target.value)}
                            placeholder="Add a comment explaining your decision..."
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 1 }}>
                        <Button onClick={() => setDialogOpen(false)} disabled={processing}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleActionConfirm}
                            variant="contained"
                            color={dialogType === 'accept' ? 'success' : dialogType === 'reject' ? 'error' : 'info'}
                            disabled={processing}
                            startIcon={processing ? <CircularProgress size={16} /> : null}
                        >
                            {processing ? 'Processing...' :
                                dialogType === 'accept' ? 'Accept' :
                                    dialogType === 'reject' ? 'Reject' :
                                        'Request Changes'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </PageWrapper>
    );
};

export default ComplaintDetailsPage;
