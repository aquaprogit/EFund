import {
    Box,
    Card,
    CardMedia,
    Container,
    Divider,
    Grid,
    Typography
} from "@mui/material";
import PageWrapper from "../../../../shared/components/PageWrapper";
import { useQuery } from "@tanstack/react-query";
import { fundraisingsRepository } from "../../repository/fundraisingsRepository";
import { getFundraisingDetailsStyles } from "../../styles/FundraisingDetails.style";
import { useRef, useState } from 'react';
import { useTheme } from "@mui/material";
import ReportDialog from '../../../rules/components/ReportDialog';
import { complaintRepository } from '../../../rules/repository/complaintRepository';
import { useToast } from '../../../../contexts/ToastContext';
import FundraisingHeader from './FundraisingHeader';
import FundraisingProgress from './FundraisingProgress';
import FundraisingActions from './FundraisingActions';
import FundraisingReports from './FundraisingReports';

interface FundraisingDetailsProps {
    fundraisingId: string;
}

export const FundraisingDetails = ({ fundraisingId }: FundraisingDetailsProps) => {
    const theme = useTheme();
    const styles = getFundraisingDetailsStyles(theme);
    const reportsRef = useRef<HTMLDivElement>(null);
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
    const { showToast } = useToast();

    const scrollToReports = () => {
        reportsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleReportSubmit = async (report: { violations: string[], description: string }) => {
        try {
            const response = await complaintRepository.createComplaint({
                fundraisingId,
                violationIds: report.violations,
                comment: report.description
            });

            if (response.isSuccess) {
                showToast('success', 'Report submitted successfully');
            } else {
                showToast('error', response.error?.message || 'Failed to submit report');
            }
        } catch (error) {
            showToast('error', 'Failed to submit report');
            throw error;
        }
    };

    const { data: response, isLoading, error } = useQuery({
        queryKey: ['fundraising', fundraisingId],
        queryFn: () => fundraisingsRepository.getFundraising(fundraisingId)
    });

    if (isLoading) {
        return (
            <PageWrapper>
                <Container>
                    <Typography>Loading...</Typography>
                </Container>
            </PageWrapper>
        );
    }

    if (error || !response || response.error || !response.data) {
        return (
            <PageWrapper>
                <Container>
                    <Typography color="error">
                        Error: {response?.error?.message || 'Failed to load fundraising'}
                    </Typography>
                </Container>
            </PageWrapper>
        );
    }

    const fundraising = response.data;

    return (
        <PageWrapper>
            <Container maxWidth="lg" sx={styles.container}>
                <Grid container spacing={4}>
                    {/* Left Column - Main Content */}
                    <Grid item xs={12} md={8}>
                        <Card
                            elevation={0}
                            sx={styles.mainCard}
                        >
                            <CardMedia
                                component="img"
                                height="400"
                                image={fundraising.avatarUrl}
                                alt={fundraising.title}
                                sx={styles.cardMedia}
                            />
                            <Box sx={styles.contentBox}>
                                <FundraisingHeader fundraising={fundraising} />

                                <Divider sx={styles.divider} />

                                {/* Description */}
                                <Typography
                                    variant="body1"
                                    sx={styles.description}
                                >
                                    {fundraising.description}
                                </Typography>

                                {/* Reports Section */}
                                <FundraisingReports
                                    ref={reportsRef}
                                    reports={fundraising.reports}
                                />
                            </Box>
                        </Card>
                    </Grid>

                    {/* Right Column - Side Card */}
                    <Grid item xs={12} md={4}>
                        <Card
                            elevation={0}
                            sx={styles.sideCard}
                        >
                            <Box sx={styles.sideCardContent}>
                                {/* Progress Section */}
                                <FundraisingProgress monobankJar={fundraising.monobankJar} />

                                {/* Action Buttons */}
                                <FundraisingActions
                                    fundraising={fundraising}
                                    fundraisingId={fundraisingId}
                                    onScrollToReports={scrollToReports}
                                    onOpenReportDialog={() => setIsReportDialogOpen(true)}
                                />
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

            <ReportDialog
                open={isReportDialogOpen}
                onClose={() => setIsReportDialogOpen(false)}
                fundraisingId={fundraisingId}
                onSubmit={handleReportSubmit}
            />
        </PageWrapper>
    );
};

export default FundraisingDetails;

