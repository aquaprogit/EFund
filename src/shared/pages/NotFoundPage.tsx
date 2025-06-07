import {
    Box,
    Container,
    Typography,
    Button,
    Stack,
    Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchOffIcon from '@mui/icons-material/SearchOff';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <PageWrapper>
            <Container maxWidth="md" sx={{ py: 2 }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 6,
                        borderRadius: 3,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                    }}
                >
                    <Stack spacing={4} alignItems="center">
                        <Box sx={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Typography
                                sx={{
                                    fontSize: { xs: '8rem', sm: '12rem', md: '16rem' },
                                    fontWeight: 700,
                                    color: 'primary.main',
                                    opacity: 0.1,
                                    lineHeight: 0.8,
                                    userSelect: 'none'
                                }}
                            >
                                404
                            </Typography>

                            {/* Search Icon Overlay */}
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}>
                                <SearchOffIcon
                                    sx={{
                                        fontSize: { xs: '4rem', sm: '6rem', md: '8rem' },
                                        color: 'primary.main',
                                        opacity: 0.8
                                    }}
                                />
                            </Box>
                        </Box>

                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontWeight: 600,
                                color: 'primary.main',
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                            }}
                        >
                            Page Not Found
                        </Typography>

                        <Typography
                            variant="h6"
                            component="p"
                            sx={{
                                color: 'text.secondary',
                                maxWidth: '500px',
                                lineHeight: 1.6,
                                fontSize: { xs: '1rem', sm: '1.25rem' }
                            }}
                        >
                            Oops! The page you're looking for seems to have wandered off.
                            It might have been moved, deleted, or you entered the wrong URL.
                        </Typography>

                        <Box sx={{
                            backgroundColor: 'primary.50',
                            borderRadius: 2,
                            p: 2,
                            border: 1,
                            borderColor: 'primary.200'
                        }}>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'primary.main',
                                    fontStyle: 'italic',
                                    fontWeight: 500
                                }}
                            >
                                💡 Don't worry, even the best explorers sometimes take a wrong turn!
                            </Typography>
                        </Box>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            sx={{ mt: 4 }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<HomeIcon />}
                                onClick={handleGoHome}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '1.1rem',
                                    px: 4,
                                    py: 1.5
                                }}
                            >
                                Go to Homepage
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                startIcon={<ArrowBackIcon />}
                                onClick={handleGoBack}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '1.1rem',
                                    px: 4,
                                    py: 1.5
                                }}
                            >
                                Go Back
                            </Button>
                        </Stack>

                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                mt: 3
                            }}
                        >
                            If you believe this is an error, please contact our support team.
                        </Typography>
                    </Stack>
                </Paper>
            </Container>
        </PageWrapper>
    );
};

export default NotFoundPage;