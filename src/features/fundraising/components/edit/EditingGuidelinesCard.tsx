import { Card, CardContent, Typography, Stack } from "@mui/material";

const EditingGuidelinesCard = () => {
    return (
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
    );
};

export default EditingGuidelinesCard; 