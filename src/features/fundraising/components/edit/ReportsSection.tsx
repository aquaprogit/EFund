import { Box, Card, CardContent, Typography, Button, Stack } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Report from '../../../reports/models/Report';
import ReportCard from '../ReportCard';

interface ReportsSectionProps {
    reports: Report[];
    onAddReportClick: () => void;
    onReportDelete: (reportId: string) => Promise<void>;
    onAttachmentDelete: (reportId: string, attachmentId: string) => Promise<void>;
    onAttachmentAdd: (reportId: string, files: FileList) => Promise<void>;
}

const ReportsSection = ({
    reports,
    onAddReportClick,
    onReportDelete,
    onAttachmentDelete,
    onAttachmentAdd
}: ReportsSectionProps) => {
    return (
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
                        onClick={onAddReportClick}
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
                        {reports
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((report) => (
                                <ReportCard
                                    key={report.id}
                                    report={report}
                                    onReportDelete={onReportDelete}
                                    onAttachmentDelete={onAttachmentDelete}
                                    onAttachmentAdd={onAttachmentAdd}
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
    );
};

export default ReportsSection; 