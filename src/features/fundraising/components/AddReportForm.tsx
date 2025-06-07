import { ChangeEvent, useRef, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    IconButton,
    Stack,
    TextField,
    Avatar
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

interface AddReportFormProps {
    onClose: () => void;
    onSubmit: (title: string, description: string, files: File[]) => void;
}

const AddReportForm = ({ onClose, onSubmit }: AddReportFormProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(prev => [...prev, ...selectedFiles]);
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!title.trim() || !description.trim()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(title, description, files);
            onClose();
        } catch (error) {
            console.error('Error submitting report:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <AssessmentIcon />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Add Progress Report
                    </Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Stack spacing={3}>
                <TextField
                    label="Report Title"
                    variant="outlined"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a descriptive title for this report"
                    required
                />

                <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the progress, achievements, or updates..."
                    required
                />

                {/* File Upload Section */}
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Attachments
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<AttachFileIcon />}
                            onClick={() => fileInputRef.current?.click()}
                            sx={{ textTransform: 'none' }}
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

                    {files.length > 0 ? (
                        <Stack spacing={1}>
                            {files.map((file, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        bgcolor: 'grey.50'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <InsertDriveFileIcon color="primary" />
                                        <Typography variant="body2">{file.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </Typography>
                                    </Box>
                                    <IconButton size="small" onClick={() => removeFile(index)}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Stack>
                    ) : (
                        <Box sx={{
                            p: 3,
                            textAlign: 'center',
                            bgcolor: 'grey.50',
                            borderRadius: 1,
                            border: '1px dashed',
                            borderColor: 'grey.300'
                        }}>
                            <AttachFileIcon sx={{ fontSize: 32, color: 'grey.400', mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                No files selected. Click "Add Files" to attach documents, images, or other files.
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!title.trim() || !description.trim() || isSubmitting}
                        startIcon={<SaveIcon />}
                    >
                        {isSubmitting ? 'Adding...' : 'Add Report'}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

export default AddReportForm; 