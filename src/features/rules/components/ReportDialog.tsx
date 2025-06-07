import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
    TextField,
    Typography,
    Box
} from '@mui/material';
import { useEffect, useState } from 'react';
import { violationsRepository } from '../repository/violationsRepository';
import { ViolationGroup } from "../models/ViolationGroup";
import { useToast } from '../../../contexts/ToastContext';

interface ReportDialogProps {
    open: boolean;
    onClose: () => void;
    fundraisingId: string;
    onSubmit: (report: { violations: string[], description: string }) => Promise<void>;
}

export const ReportDialog = ({ open, onClose, fundraisingId, onSubmit }: ReportDialogProps) => {
    const [selectedViolations, setSelectedViolations] = useState<string[]>([]);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [violationGroups, setViolationGroups] = useState<ViolationGroup[]>([]);
    const { showError } = useToast();


    const handleViolationToggle = (value: string) => {
        setSelectedViolations(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
    };

    const handleSubmit = async () => {
        if (selectedViolations.length === 0) return;

        setIsSubmitting(true);
        try {
            await onSubmit({
                violations: selectedViolations,
                description
            });
            onClose();
        } catch (error) {
            console.error('Failed to submit report:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedViolations([]);
        setDescription('');
        onClose();
    };

    useEffect(() => {
        async function fetchViolations() {
            const response = await violationsRepository.getViolationsGroups();

            if (response.data) {
                setViolationGroups(response.data);
            }

            if (response.error) {
                showError(response.error.message);
                handleClose();
            }
        }

        fetchViolations();
    }, []);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Report Fundraising
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Please select all violations that apply to this fundraising campaign:
                </Typography>
                <FormControl component="fieldset" fullWidth>
                    {violationGroups.map((group) => (
                        <Box key={group.id} sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                                {group.title}
                            </Typography>
                            <FormGroup>
                                {group.violations.map((violation) => (
                                    <FormControlLabel
                                        key={violation.id}
                                        control={
                                            <Checkbox
                                                checked={selectedViolations.includes(violation.id)}
                                                onChange={() => handleViolationToggle(violation.id)}
                                            />
                                        }
                                        label={violation.title}
                                    />
                                ))}
                            </FormGroup>
                        </Box>
                    ))}
                </FormControl>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Additional Details"
                    placeholder="Please provide any additional information about the violations..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={selectedViolations.length === 0 || isSubmitting}
                >
                    Submit Report
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReportDialog; 