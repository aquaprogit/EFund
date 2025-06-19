import { Button, Card, CardContent, Typography } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';

interface SaveChangesCardProps {
    onSubmit: () => Promise<void>;
    isSubmitting: boolean;
}

const SaveChangesCard = ({ onSubmit, isSubmitting }: SaveChangesCardProps) => {
    return (
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
                    onClick={onSubmit}
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
    );
};

export default SaveChangesCard; 