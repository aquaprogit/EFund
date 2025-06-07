import '../../../styles/home-page.css';
import PageWrapper from '../../../shared/components/PageWrapper';
import { Typography, Button, Container, Grid, useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import StarIcon from '@mui/icons-material/Star';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useAuth } from '../../auth/store/auth.store';

const HomePage = () => {
    const { isAuth } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <PageWrapper>
            <Box
                className="hero-section"
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: theme.palette.primary.contrastText,
                    padding: '80px 0',
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Turn Your Ideas Into Reality
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                        Join our community of innovators and make your projects come to life
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => { isAuth ? navigate('/add-fundraising') : navigate('/sign-in') }}
                        sx={{
                            backgroundColor: theme.palette.common.white,
                            color: theme.palette.primary.main,
                            fontSize: '1.2rem',
                            padding: '12px 32px',
                            '&:hover': {
                                backgroundColor: theme.palette.grey[100]
                            }
                        }}
                    >
                        Start Your Project
                    </Button>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={3}>
                        <Box sx={{
                            textAlign: 'center',
                            p: 2,
                            height: '100%',
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 1
                        }}>
                            <RocketLaunchIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Quick Launch
                            </Typography>
                            <Typography color="text.secondary">
                                Create your fundraising campaign in minutes and start collecting funds immediately
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box sx={{
                            textAlign: 'center',
                            p: 2,
                            height: '100%',
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 1
                        }}>
                            <StarIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Trust Rating System
                            </Typography>
                            <Typography color="text.secondary">
                                Transparent creator ratings based on fundraising history and fund management performance
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box sx={{
                            textAlign: 'center',
                            p: 2,
                            height: '100%',
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 1
                        }}>
                            <AccountBalanceIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Direct Monobank Integration
                            </Typography>
                            <Typography color="text.secondary">
                                Link your Monobank account for direct, mediator-free transactions from supporters
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box sx={{
                            textAlign: 'center',
                            p: 2,
                            height: '100%',
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 1
                        }}>
                            <ReceiptLongIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Transparent Spending
                            </Typography>
                            <Typography color="text.secondary">
                                Share detailed expense reports with receipts and images to show exactly how funds are used
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box
                sx={{
                    backgroundColor: theme.palette.grey[50],
                    padding: '60px 0',
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h3" sx={{ mb: 3, color: theme.palette.text.primary }}>
                        Ready to Start?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, color: theme.palette.text.secondary }}>
                        Join thousands of successful projects and make your dream a reality
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/sign-up')}
                            color="primary"
                        >
                            Create Project
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/search')}
                            color="primary"
                        >
                            Explore Projects
                        </Button>
                    </Box>
                </Container>
            </Box>
        </PageWrapper>
    );
};

export default HomePage;