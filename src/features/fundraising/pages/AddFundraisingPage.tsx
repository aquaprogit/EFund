import {
    Card,
    Container,
    Typography,
    useTheme,
    Box,
    Paper,
    CardContent,
    IconButton,
    Grid,
    Stack,
    Button,
    Checkbox,
    FormControlLabel,
    Link,
    Backdrop,
    CircularProgress
} from "@mui/material";
import PageWrapper from "../../../shared/components/PageWrapper";
import { useEffect, useState } from "react";
import { monobankRepository } from "../../monobank/repository/monobankRepository";
import Jar from "../../monobank/models/Jar";
import { useToast } from "../../../contexts/ToastContext";
import { fundraisingsRepository } from "../repository/fundraisingsRepository";
import { useNavigate } from "react-router-dom";
import { tagsRepository } from "../../tags/repository/tagsRepository";
import { useUser } from "../../../contexts/UserContext";
import { Tag } from "../../tags/models/Tag";
import { AddFundraisingForm } from "../components/AddFundraisingForm";
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SaveIcon from '@mui/icons-material/Save';
import { Link as RouterLink } from "react-router-dom";

const AddFundraisingPage = () => {
    const theme = useTheme();
    const [jars, setJars] = useState<Jar[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rulesAgreed, setRulesAgreed] = useState(false);
    const { showError, showSuccess } = useToast();
    const navigate = useNavigate();
    const { user } = useUser();

    const getMonobankJars = async () => {
        try {
            const response = await monobankRepository.getJars();
            if (response?.data) {
                setJars(response.data as Jar[]);
            }
        } catch (e) {
            showError('Failed to fetch Monobank jars');
        }
    };

    const getTags = async () => {
        try {
            const response = await tagsRepository.getTags();
            if (response?.data) {
                setTags(response.data.map((tag: Tag) => tag.name));
            }
        } catch (e) {
            showError('Failed to fetch tags');
        }
    };

    const uploadImage = async (fundraisingId: string, file: File) => {
        try {
            const response = await fundraisingsRepository.uploadImage(fundraisingId, file);
            if (response.error) {
                throw new Error(response.error.message);
            }
        } catch (e) {
            throw new Error('Failed to upload image');
        }
    };

    const handleSubmit = async ({ title, description, monobankJarId, tags }: {
        title: string;
        description: string;
        monobankJarId: string;
        tags?: string[];
    }, imageFile?: File) => {
        setIsSubmitting(true);
        try {
            const response = await fundraisingsRepository.createFundraising({
                title,
                description,
                monobankJarId,
                tags: tags || []
            });

            if (response.error) {
                throw new Error(response.error.message);
            }

            if (imageFile && response.data) {
                await uploadImage(response.data.id, imageFile);
            }

            showSuccess('Fundraising has been successfully created');
            navigate('/');
        } catch (e) {
            showError(e instanceof Error ? e.message : 'Failed to create fundraising');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        getMonobankJars();
        getTags();
    }, []);

    if (!user?.hasMonobankToken) {
        navigate('/');
        return null;
    }

    return (
        <PageWrapper>
            <Container maxWidth="lg">
                {/* Header Section */}
                <Paper
                    elevation={4}
                    sx={{
                        mb: 4,
                        borderRadius: 4,
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        position: 'relative'
                    }}
                >
                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1 }}>
                        <Box sx={{
                            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                            width: '100%',
                            height: '100%'
                        }} />
                    </Box>
                    <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <AddIcon sx={{ fontSize: 32 }} />
                                </Box>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                        Create New Fundraising
                                    </Typography>
                                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                        Start your fundraising campaign and make a difference
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton
                                onClick={() => navigate('/')}
                                sx={{
                                    color: 'white',
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.3)'
                                    }
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        </Box>
                    </CardContent>
                </Paper>

                <Grid container spacing={4}>
                    {/* Left Column - Main Content */}
                    <Grid item xs={12} md={8}>
                        <Stack spacing={4}>
                            {/* Form Content */}
                            <AddFundraisingForm
                                jars={jars}
                                availableTags={tags}
                                onSubmit={handleSubmit}
                                rulesAgreed={rulesAgreed}
                            />
                        </Stack>
                    </Grid>

                    {/* Right Column - Actions & Help */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            {/* Terms Agreement & Submit */}
                            <Card elevation={3} sx={{ borderRadius: 3 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                        Create Campaign
                                    </Typography>

                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={rulesAgreed}
                                                onChange={(e) => setRulesAgreed(e.target.checked)}
                                                color="primary"
                                                sx={{
                                                    '&.Mui-checked': {
                                                        color: theme.palette.primary.main
                                                    }
                                                }}
                                            />
                                        }
                                        label={
                                            <Box component="span" sx={{ color: theme.palette.text.secondary, fontSize: '0.95rem' }}>
                                                I agree to the{' '}
                                                <Link
                                                    component={RouterLink}
                                                    to="/rules"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: theme.palette.primary.main,
                                                        textDecoration: 'none',
                                                        '&:hover': {
                                                            textDecoration: 'underline'
                                                        }
                                                    }}
                                                >
                                                    platform rules and guidelines
                                                </Link>
                                            </Box>
                                        }
                                        sx={{ alignItems: 'flex-start', mb: 3 }}
                                    />

                                    <Button
                                        type="submit"
                                        form="add-fundraising-form"
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        startIcon={<SaveIcon />}
                                        disabled={!rulesAgreed || isSubmitting}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: '1.1rem',
                                            py: 1.5,
                                            background: rulesAgreed && !isSubmitting
                                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                : theme.palette.action.disabledBackground,
                                            color: rulesAgreed && !isSubmitting ? 'white' : theme.palette.action.disabled,
                                            '&:hover': rulesAgreed && !isSubmitting ? {
                                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b4c93 100%)',
                                                transform: 'translateY(-1px)',
                                                boxShadow: theme.shadows[4]
                                            } : {},
                                            '&:disabled': {
                                                background: theme.palette.action.disabledBackground,
                                                color: theme.palette.action.disabled
                                            },
                                            transition: 'all 0.2s ease-in-out'
                                        }}
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create Fundraising'}
                                    </Button>

                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontSize: '0.85rem', textAlign: 'center' }}>
                                        By creating, you confirm that your fundraising campaign complies with our community standards.
                                    </Typography>
                                </CardContent>
                            </Card>

                            {/* Fundraising Guidelines */}
                            <Card elevation={3} sx={{ borderRadius: 3 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <HelpOutlineIcon sx={{ fontSize: 24, color: 'primary.main' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Fundraising Tips
                                        </Typography>
                                    </Box>
                                    <Stack spacing={2}>
                                        <Typography variant="body2" color="text.secondary">
                                            • Write a clear, compelling title that explains your cause
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Tell your story with emotion and specific details
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Upload high-quality images that connect with donors
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Use relevant tags to help people find your campaign
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Be transparent about how funds will be used
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            • Share regular updates to build trust with supporters
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Quick Help */}
                            <Card elevation={3} sx={{ borderRadius: 3 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                        Need Help?
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Creating your first fundraising campaign? Check out our guide for best practices and tips.
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        View Guide
                                    </Button>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isSubmitting}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Container>
        </PageWrapper>
    );
};

export default AddFundraisingPage;