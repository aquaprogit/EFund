import { ChangeEvent, useRef, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    IconButton,
    Stack,
    Chip,
    Dialog
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { format } from 'date-fns';
import Report from '../../reports/models/Report';
import Attachment from '../../attachments/models/Attachment';

interface ReportCardProps {
    report: Report;
    onReportDelete: (id: string) => void;
    onAttachmentDelete: (reportId: string, attachmentId: string) => void;
    onAttachmentAdd: (reportId: string, files: FileList) => void;
}

const ReportCard = ({ report, onReportDelete, onAttachmentDelete, onAttachmentAdd }: ReportCardProps) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<{ type: 'report' | 'attachment', id: string, name?: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDeleteClick = (type: 'report' | 'attachment', id: string, name?: string) => {
        setDeleteItem({ type, id, name });
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteItem) {
            if (deleteItem.type === 'report') {
                onReportDelete(report.id);
            } else {
                onAttachmentDelete(report.id, deleteItem.id);
            }
        }
        setDeleteDialogOpen(false);
        setDeleteItem(null);
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onAttachmentAdd(report.id, files);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <Card elevation={2} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                {report.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {format(new Date(report.createdAt), 'MMM dd, yyyy \'at\' HH:mm')}
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton
                            onClick={() => handleDeleteClick('report', report.id)}
                            sx={{
                                color: 'error.main',
                                '&:hover': {
                                    bgcolor: 'error.50'
                                }
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                        {report.description}
                    </Typography>

                    {/* Attachments Section */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                Attachments ({report.attachments.length})
                            </Typography>
                            <Button
                                size="small"
                                startIcon={<AttachFileIcon />}
                                onClick={() => fileInputRef.current?.click()}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '0.875rem'
                                }}
                            >
                                Add Files
                            </Button>
                            <input
                                type="file"
                                multiple
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                                style={{ display: 'none' }}
                            />
                        </Box>

                        {report.attachments.length > 0 ? (
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {report.attachments.map((attachment: Attachment) => (
                                    <Chip
                                        key={attachment.id}
                                        icon={<InsertDriveFileIcon />}
                                        label={attachment.name}
                                        onClick={() => window.open(attachment.fileUrl, '_blank')}
                                        onDelete={() => handleDeleteClick('attachment', attachment.id, attachment.name)}
                                        clickable
                                        color="primary"
                                        variant="outlined"
                                        sx={{
                                            maxWidth: 200,
                                            '& .MuiChip-label': {
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }
                                        }}
                                    />
                                ))}
                            </Stack>
                        ) : (
                            <Box sx={{
                                p: 2,
                                textAlign: 'center',
                                bgcolor: 'grey.50',
                                borderRadius: 1,
                                border: '1px dashed',
                                borderColor: 'grey.300'
                            }}>
                                <AttachFileIcon sx={{ fontSize: 32, color: 'grey.400', mb: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                    No attachments yet
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Confirm Deletion
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        {deleteItem?.type === 'report'
                            ? `Are you sure you want to delete the report "${report.title}"? This action cannot be undone.`
                            : `Are you sure you want to delete the file "${deleteItem?.name}"? This action cannot be undone.`
                        }
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeleteConfirm}
                        >
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        </>
    );
};

export default ReportCard; 