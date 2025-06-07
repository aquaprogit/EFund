import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";
import { fundraisingsRepository } from '../repository/fundraisingsRepository';
import PageWrapper from "../../../shared/components/PageWrapper";
import {
    Backdrop,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Dialog,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Stack,
    Grid,
    Paper,
    IconButton
} from "@mui/material";
import UploadImage from "../../users/components/UploadImage";
import LimitedTextField from "../../../shared/components/LimitedTextField";
import MultiSelectWithChips from '../../../shared/components/MultiSelectWithChips';
import Report from '../../reports/models/Report';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TagIcon from '@mui/icons-material/Tag';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fundraisingsReportsRepository } from '../../reports/repository/fundraisingsReportsRepository';

// Import separated components and hooks
import ReportCard from './ReportCard';
import AddReportForm from './AddReportForm';
import { useFundraisingData } from '../hooks/useFundraisingData';
import { useMonobankJars } from '../hooks/useMonobankJars';
import { useTags } from '../hooks/useTags';
import { useAuthorizationCheck } from '../hooks/useAuthorizationCheck';

interface EditFundraisingProps {
    fundraisingId: string;
}

const EditFundraising = ({ fundraisingId }: EditFundraisingProps) => {
    const defaultImage = 'http://localhost:8080/Uploads/Default/Fundraisings/avatar.png';

    const { data: fundraisingData, loading: dataLoading, refetch } = useFundraisingData(fundraisingId);
    const jars = useMonobankJars();
    const { allTags } = useTags();
    const existingTags = allTags.map(tag => tag.name); // Convert Tag objects to string array
    const user = useAuthorizationCheck(fundraisingData.createdByUserId, fundraisingId, dataLoading);

    // Local state
    const [formData, setFormData] = useState({
        imageUrl: defaultImage,
        title: '',
        description: '',
        monobankJar: '',
        monobankJarId: '',
        selectedTags: [] as string[]
    });
    const [reports, setReports] = useState<Report[]>([]);
    const [openJarsMenu, setOpenJarsMenu] = useState<null | HTMLElement>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const inputFile = useRef<HTMLInputElement | null>(null);
    const { showError, showSuccess } = useToast();
    const navigate = useNavigate();

    // Update form data when fundraising data changes
    useEffect(() => {
        if (fundraisingData) {
            setFormData({
                imageUrl: fundraisingData.imageUrl || defaultImage,
                title: fundraisingData.title,
                description: fundraisingData.description,
                monobankJar: fundraisingData.monobankJar,
                monobankJarId: fundraisingData.monobankJarId,
                selectedTags: fundraisingData.defaultTags
            });
            setReports(fundraisingData.reports);
        }
    }, [fundraisingData]);

    // Event handlers
    const handleJarMenuOpen = (event: React.SyntheticEvent) => {
        setOpenJarsMenu(event.currentTarget as HTMLElement);
    };

    const handleJarMenuClose = () => {
        setOpenJarsMenu(null);
    };

    const handleJarSelect = (jarTitle: string, jarId: string) => {
        setFormData(prev => ({
            ...prev,
            monobankJar: jarTitle,
            monobankJarId: jarId
        }));
    };

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length) {
            const response = await fundraisingsRepository.uploadImage(fundraisingId, files[0]);
            if (response.isSuccess) {
                showSuccess('Image uploaded successfully');
                refetch();
            } else {
                showError(response.error?.message || 'Failed to upload image');
            }
        }
    };

    const handleImageDelete = async () => {
        const response = await fundraisingsRepository.deleteImage(fundraisingId);
        if (response.isSuccess) {
            showSuccess('Image removed successfully');
            refetch();
        } else {
            showError(response.error?.message || 'Failed to remove image');
        }
    };

    const handleReportDelete = async (reportId: string) => {
        try {
            const response = await fundraisingsReportsRepository.deleteReport(reportId);
            if (response?.error) {
                showError(response.error.message);
            } else {
                setReports(prev => prev.filter(report => report.id !== reportId));
                showSuccess('Report deleted successfully');
            }
        } catch (error) {
            showError('Unexpected error while deleting report');
        }
    };

    const handleAttachmentDelete = async (reportId: string, attachmentId: string) => {
        try {
            const response = await fundraisingsReportsRepository.deleteAttachment(reportId, attachmentId);
            if (response?.error) {
                showError(response.error.message);
            } else {
                setReports(prev => prev.map(report => {
                    if (report.id === reportId) {
                        return {
                            ...report,
                            attachments: report.attachments.filter(attachment => attachment.id !== attachmentId)
                        };
                    }
                    return report;
                }));
                showSuccess('Attachment deleted successfully');
            }
        } catch (error) {
            showError('Unexpected error while deleting attachment');
        }
    };

    const handleAttachmentAdd = async (reportId: string, files: FileList) => {
        try {
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('files', file);
            });

            const response = await fundraisingsReportsRepository.addAttachments(reportId, formData);
            if (response?.error) {
                showError(response.error.message);
            } else {
                showSuccess('Attachments added successfully');
                refetch(); // Refresh to get updated attachments
            }
        } catch (error) {
            showError('Unexpected error while adding attachments');
        }
    };

    const handleReportAdd = async (title: string, description: string, files: File[]) => {
        try {
            const reportBody = {
                title,
                description,
                fundraisingId
            };

            const response = await fundraisingsReportsRepository.addReport(reportBody);
            if (response?.error) {
                showError(response.error.message);
                return;
            }

            if (response?.isSuccess && response?.data && files.length > 0) {
                const formData = new FormData();
                files.forEach(file => {
                    formData.append('files', file);
                });

                const attachmentResponse = await fundraisingsReportsRepository.addAttachments((response.data as any).id, formData);
                if (attachmentResponse?.error) {
                    showError(attachmentResponse.error.message);
                }
            }

            showSuccess('Report added successfully');
            refetch(); // Refresh to get updated reports
        } catch (error) {
            showError('Unexpected error while adding report');
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const requestBody = {
                title: formData.title,
                description: formData.description,
                monobankJarId: formData.monobankJarId,
                tags: formData.selectedTags,
            };

            const response = await fundraisingsRepository.updateFundraising(fundraisingId, requestBody);

            if (response?.error) {
                showError(response.error.message);
                return;
            }

            // Upload image if new file is selected
            const files = inputFile.current?.files;
            if (files?.length) {
                await fundraisingsRepository.uploadImage(fundraisingId, files[0]);
            }

            showSuccess('Fundraising has been successfully edited');
            navigate(`/fundraising/${fundraisingId}`);
        } catch (error) {
            showError('Unexpected error while editing fundraising');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (dataLoading) {
        return (
            <PageWrapper>
                <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Container>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Container maxWidth="lg">
                {/* Header Section */}
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
                                    <EditIcon sx={{ fontSize: 32 }} />
                                </Box>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                        Edit Fundraising
                                    </Typography>
                                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                        Update your fundraising campaign details
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton
                                onClick={() => navigate(`/fundraising/${fundraisingId}`)}
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
                            {/* Campaign Image & Basic Info */}
                            <Card elevation={3} sx={{ borderRadius: 3 }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <PhotoCameraIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            Campaign Image & Details
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={4}>
                                        <Grid item xs={12} md={4}>
                                            <UploadImage
                                                inputFile={inputFile}
                                                handleFileUpload={handleImageUpload}
                                                handleDeleteFile={handleImageDelete}
                                                url={formData.imageUrl}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <Stack spacing={3}>
                                                <LimitedTextField
                                                    label="Campaign Title"
                                                    maxChar={70}
                                                    value={formData.title}
                                                    fullWidth
                                                    onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
                                                    helperText="Create a compelling title that clearly describes your cause"
                                                />

                                                <LimitedTextField
                                                    label="Campaign Description"
                                                    maxRows={6}
                                                    maxChar={500}
                                                    fullWidth
                                                    value={formData.description}
                                                    onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                                                    multiline
                                                    helperText="Tell your story - why is this fundraising important?"
                                                />
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Payment & Tags */}
                            <Card elevation={3} sx={{ borderRadius: 3 }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <AccountBalanceIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            Payment & Classification
                                        </Typography>
                                    </Box>

                                    <Stack spacing={3}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel>Monobank Jar</InputLabel>
                                            <Select
                                                value={formData.monobankJar}
                                                label="Monobank Jar"
                                                onChange={(e) => setFormData(prev => ({ ...prev, monobankJar: e.target.value }))}
                                                open={Boolean(openJarsMenu)}
                                                onClose={handleJarMenuClose}
                                                onOpen={handleJarMenuOpen}
                                            >
                                                {jars.map((jar) => (
                                                    <MenuItem
                                                        key={jar.id}
                                                        value={jar.title}
                                                        onClick={() => handleJarSelect(jar.title, jar.id)}
                                                    >
                                                        {jar.title}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <TagIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    Tags
                                                </Typography>
                                            </Box>
                                            <MultiSelectWithChips
                                                freeSolo
                                                width="100%"
                                                limitTags={5}
                                                label="Select or create tags"
                                                defaultValues={formData.selectedTags}
                                                values={existingTags}
                                                onChange={(newTags) => setFormData(prev => ({ ...prev, selectedTags: newTags }))}
                                            />
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                Tags help people find your campaign. You can select existing tags or create new ones.
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Reports Section */}
                            <Card elevation={3} sx={{ borderRadius: 3 }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <AssessmentIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                Progress Reports
                                            </Typography>
                                        </Box>
                                        <Button
                                            startIcon={<AddIcon />}
                                            variant="contained"
                                            onClick={() => setDialogOpen(true)}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600
                                            }}
                                        >
                                            Add Report
                                        </Button>
                                    </Box>

                                    {reports.length > 0 ? (
                                        <Stack spacing={3}>
                                            {reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((report) => (
                                                <ReportCard
                                                    key={report.id}
                                                    report={report}
                                                    onReportDelete={handleReportDelete}
                                                    onAttachmentDelete={handleAttachmentDelete}
                                                    onAttachmentAdd={handleAttachmentAdd}
                                                />
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Box sx={{
                                            p: 4,
                                            textAlign: 'center',
                                            bgcolor: 'grey.50',
                                            borderRadius: 2,
                                            border: '2px dashed',
                                            borderColor: 'grey.300'
                                        }}>
                                            <AssessmentIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                                            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                                No reports yet
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Add progress reports to keep your supporters updated
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* Right Column - Actions & Help */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            {/* Save Changes */}
                            <Card elevation={3} sx={{ borderRadius: 3, position: 'sticky', top: 100 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                        Save Changes
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        startIcon={<SaveIcon />}
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: '1.1rem',
                                            py: 1.5
                                        }}
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </Button>

                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                                        Your changes will be visible immediately after saving
                                    </Typography>
                                </CardContent>
                            </Card>

                            {/* Edit Guidelines */}
                            <Card elevation={3} sx={{ borderRadius: 3 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                        Editing Guidelines
                                    </Typography>
                                    <Stack spacing={2}>
                                        <Typography variant="body2" color="text.secondary">
                                            • Keep your title clear and compelling
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Update your description to reflect current needs
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Add progress reports to build trust
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Use relevant tags to improve discoverability
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Upload high-quality images that tell your story
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>

                <Dialog
                    fullWidth
                    maxWidth="md"
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    PaperProps={{ sx: { borderRadius: 3 } }}
                >
                    <AddReportForm
                        onClose={() => setDialogOpen(false)}
                        onSubmit={handleReportAdd}
                    />
                </Dialog>

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isSubmitting}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Container>
        </PageWrapper>
    );
};

export default EditFundraising;