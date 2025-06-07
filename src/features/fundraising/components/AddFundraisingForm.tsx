import {
    Box,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    useTheme,
    Typography,
    Card,
    CardContent,
    Grid,
    Stack
} from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";
import { useZodForm } from "../../../shared/hooks/useZodForm";
import { createFundraisingSchema } from "../schemas/createFundraisingSchema";
import LimitedTextField from "../../../shared/components/LimitedTextField";
import MultiSelectWithChip from "../../../shared/components/MultiSelectWithChips";
import UploadImage from "../../users/components/UploadImage";
import Jar from "../../monobank/models/Jar";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TagIcon from '@mui/icons-material/Tag';

interface AddFundraisingFormData {
    title: string;
    description: string;
    monobankJarId: string;
    tags?: string[];
}

interface AddFundraisingFormProps {
    jars: Jar[];
    availableTags: string[];
    onSubmit: (data: AddFundraisingFormData, imageFile?: File) => Promise<void>;
    rulesAgreed: boolean;
}

const defaultImage = (process.env.REACT_APP_BACKEND_URL ?? '') + (process.env.REACT_APP_BASE_FUNDRAISING_IMG_URL ?? '/Uploads/Default/Fundraisings/avatar.png');

export const AddFundraisingForm = ({ jars, availableTags, onSubmit, rulesAgreed }: AddFundraisingFormProps) => {
    const theme = useTheme();
    const [imageUrl, setImageUrl] = useState<string>(defaultImage);
    const [openJarsMenu, setOpenJarsMenu] = useState(false);
    const inputFile = useRef<HTMLInputElement | null>(null);

    const { handleSubmit, setValue, formState: { errors }, watch } = useZodForm(createFundraisingSchema);
    const selectedTags = watch('tags') || [];

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target) {
                    setImageUrl(event.target.result as string);
                }
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const handleDeleteFile = () => {
        setImageUrl(defaultImage);
        if (inputFile.current) {
            inputFile.current.value = '';
            inputFile.current.files = new DataTransfer().files;
        }
    };

    const handleFormSubmit = async (data: AddFundraisingFormData) => {
        if (!rulesAgreed) return;
        const files = inputFile.current?.files;
        await onSubmit(data, files?.[0]);
    };

    return (
        <Box
            id="add-fundraising-form"
            component="form"
            onSubmit={handleSubmit(handleFormSubmit)}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4
            }}
        >
            {/* Campaign Image & Basic Info */}
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
                                handleFileUpload={handleFileUpload}
                                handleDeleteFile={handleDeleteFile}
                                url={imageUrl}
                            />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Stack spacing={3}>
                                <LimitedTextField
                                    label="Campaign Title"
                                    maxChar={70}
                                    value={watch('title') || ''}
                                    fullWidth
                                    onChange={(value) => setValue('title', value)}
                                    error={!!errors.title}
                                    helperText={errors.title?.message || "Create a compelling title that clearly describes your cause"}
                                />

                                <LimitedTextField
                                    label="Campaign Description"
                                    maxChar={500}
                                    value={watch('description') || ''}
                                    onChange={(value) => setValue('description', value)}
                                    multiline
                                    fullWidth
                                    error={!!errors.description}
                                    helperText={errors.description?.message || "Tell your story - why is this fundraising important?"}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Payment & Tags */}
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <AccountBalanceIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Payment & Classification
                        </Typography>
                    </Box>

                    <Stack spacing={3}>
                        <FormControl fullWidth error={!!errors.monobankJarId}>
                            <InputLabel id="monobank-jar-label">Monobank Jar</InputLabel>
                            <Select
                                labelId="monobank-jar-label"
                                id="monobank-jar"
                                value={watch('monobankJarId') || ''}
                                label="Monobank Jar"
                                onChange={(e) => setValue('monobankJarId', e.target.value)}
                                open={openJarsMenu}
                                onClose={() => setOpenJarsMenu(false)}
                                onOpen={() => setOpenJarsMenu(true)}
                                sx={{
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            borderRadius: 2,
                                            boxShadow: theme.shadows[8],
                                            mt: 1
                                        }
                                    }
                                }}
                            >
                                {jars.map((jar) => (
                                    <MenuItem
                                        key={jar.title}
                                        value={jar.id}
                                        sx={{
                                            borderRadius: 1,
                                            mx: 1,
                                            '&:hover': {
                                                bgcolor: theme.palette.action.hover
                                            }
                                        }}
                                    >
                                        {jar.title}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.monobankJarId && (
                                <FormHelperText>{errors.monobankJarId.message}</FormHelperText>
                            )}
                        </FormControl>

                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <TagIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Tags
                                </Typography>
                            </Box>
                            <MultiSelectWithChip
                                label='Select or create tags'
                                width="100%"
                                values={availableTags}
                                freeSolo
                                limitTags={2}
                                value={selectedTags}
                                onChange={(newTags) => setValue('tags', newTags)}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Tags help people find your campaign. You can select existing tags or create new ones.
                            </Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}; 