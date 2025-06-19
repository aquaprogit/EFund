import { ChangeEvent, useRef } from 'react';
import { Box, Card, CardContent, Typography, Grid, Stack } from "@mui/material";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import UploadImage from "../../../users/components/UploadImage";
import LimitedTextField from "../../../../shared/components/LimitedTextField";

interface CampaignImageSectionProps {
    formData: {
        imageUrl: string;
        title: string;
        description: string;
    };
    onFormDataChange: (updates: Partial<CampaignImageSectionProps['formData']>) => void;
    onImageUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
    onImageDelete: () => Promise<void>;
}

const CampaignImageSection = ({
    formData,
    onFormDataChange,
    onImageUpload,
    onImageDelete
}: CampaignImageSectionProps) => {
    const inputFile = useRef<HTMLInputElement | null>(null);

    return (
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
                            handleFileUpload={onImageUpload}
                            handleDeleteFile={onImageDelete}
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
                                onChange={(value) => onFormDataChange({ title: value })}
                                helperText="Create a compelling title that clearly describes your cause"
                            />

                            <LimitedTextField
                                label="Campaign Description"
                                maxRows={6}
                                maxChar={500}
                                fullWidth
                                value={formData.description}
                                onChange={(value) => onFormDataChange({ description: value })}
                                multiline
                                helperText="Tell your story - why is this fundraising important?"
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default CampaignImageSection; 