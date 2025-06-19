import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";
import { fundraisingsRepository } from '../repository/fundraisingsRepository';
import PageWrapper from "../../../shared/components/PageWrapper";
import {
    Backdrop,
    CircularProgress,
    Container,
    Dialog,
    Stack,
    Grid
} from "@mui/material";
import Report from '../../reports/models/Report';
import { fundraisingsReportsRepository } from '../../reports/repository/fundraisingsReportsRepository';

// Import separated components
import {
    EditFundraisingHeader,
    CampaignImageSection,
    PaymentAndTagsSection,
    ReportsSection,
    SaveChangesCard,
    EditingGuidelinesCard,
    StatusManagementSection
} from './edit';
import AddReportForm from './AddReportForm';

// Import hooks
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
    const existingTags = allTags.map(tag => tag.name);
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

    // Form data update helper
    const updateFormData = (updates: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    // Event handlers
    const handleJarMenuOpen = (event: React.SyntheticEvent) => {
        setOpenJarsMenu(event.currentTarget as HTMLElement);
    };

    const handleJarMenuClose = () => {
        setOpenJarsMenu(null);
    };

    const handleJarSelect = (jarTitle: string, jarId: string) => {
        updateFormData({ monobankJar: jarTitle, monobankJarId: jarId });
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
                refetch();
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
            refetch();
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
                <EditFundraisingHeader fundraisingId={fundraisingId} />

                <Grid container spacing={4}>
                    {/* Left Column - Main Content */}
                    <Grid item xs={12} md={8}>
                        <Stack spacing={4}>
                            <CampaignImageSection
                                formData={{
                                    imageUrl: formData.imageUrl,
                                    title: formData.title,
                                    description: formData.description
                                }}
                                onFormDataChange={updateFormData}
                                onImageUpload={handleImageUpload}
                                onImageDelete={handleImageDelete}
                            />

                            <StatusManagementSection
                                currentStatus={fundraisingData.status}
                                fundraisingId={fundraisingId}
                                fundraisingTitle={formData.title}
                                onStatusChange={refetch}
                            />

                            <PaymentAndTagsSection
                                formData={{
                                    monobankJar: formData.monobankJar,
                                    monobankJarId: formData.monobankJarId,
                                    selectedTags: formData.selectedTags
                                }}
                                onFormDataChange={updateFormData}
                                jars={jars}
                                existingTags={existingTags}
                                openJarsMenu={openJarsMenu}
                                onJarMenuOpen={handleJarMenuOpen}
                                onJarMenuClose={handleJarMenuClose}
                                onJarSelect={handleJarSelect}
                            />

                            <ReportsSection
                                reports={reports}
                                onAddReportClick={() => setDialogOpen(true)}
                                onReportDelete={handleReportDelete}
                                onAttachmentDelete={handleAttachmentDelete}
                                onAttachmentAdd={handleAttachmentAdd}
                            />
                        </Stack>
                    </Grid>

                    {/* Right Column - Actions & Help */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            <SaveChangesCard
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                            />

                            <EditingGuidelinesCard />
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