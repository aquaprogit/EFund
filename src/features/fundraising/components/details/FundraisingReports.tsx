import {
    Box,
    Chip,
    Stack,
    Typography,
    useTheme
} from "@mui/material";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent';
import ArticleIcon from '@mui/icons-material/Article';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { format } from 'date-fns';
import { forwardRef } from 'react';
import { getFundraisingDetailsStyles } from "../../styles/FundraisingDetails.style";

interface Report {
    createdAt: string;
    description: string;
    attachments?: Array<{
        name: string;
        fileUrl: string;
    }>;
}

interface FundraisingReportsProps {
    reports?: Report[];
}

export const FundraisingReports = forwardRef<HTMLDivElement, FundraisingReportsProps>(
    ({ reports }, ref) => {
        const theme = useTheme();
        const styles = getFundraisingDetailsStyles(theme);

        return (
            <Box ref={ref} sx={styles.reportsSection}>
                <Typography variant="h5" sx={styles.reportsTitle}>
                    Reports
                </Typography>
                {!reports || reports.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            No reports have been added yet.
                        </Typography>
                    </Box>
                ) : (
                    <Timeline
                        sx={{
                            [`& .${timelineOppositeContentClasses.root}`]: {
                                flex: 0.2,
                            },
                        }}
                    >
                        {reports.map((report, index) => (
                            <TimelineItem key={index}>
                                <TimelineOppositeContent>
                                    <Typography sx={styles.timelineDate}>
                                        {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                                    </Typography>
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot sx={styles.timelineDot}>
                                        <ArticleIcon fontSize="small" />
                                    </TimelineDot>
                                    {index < reports.length - 1 && (
                                        <TimelineConnector sx={styles.timelineConnector} />
                                    )}
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2">
                                            {report.description}
                                        </Typography>
                                        {report.attachments && report.attachments.length > 0 && (
                                            <Box sx={{ mt: 1 }}>
                                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                    {report.attachments.map((attachment, attachmentIndex) => (
                                                        <a
                                                            key={attachmentIndex}
                                                            href={attachment.fileUrl}
                                                            download={attachment.name}
                                                            target='_blank'
                                                            rel='noreferrer'
                                                            style={{ textDecoration: 'none' }}
                                                        >
                                                            <Chip
                                                                clickable
                                                                color='info'
                                                                label={attachment.name}
                                                                sx={{
                                                                    cursor: 'pointer',
                                                                    padding: 1.2,
                                                                    '&:hover': {
                                                                        backgroundColor: 'info.light'
                                                                    }
                                                                }}
                                                                icon={<InsertDriveFileIcon />}
                                                            />
                                                        </a>
                                                    ))}
                                                </Stack>
                                            </Box>
                                        )}
                                    </Box>
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </Timeline>
                )}
            </Box>
        );
    }
);

FundraisingReports.displayName = 'FundraisingReports';

export default FundraisingReports; 