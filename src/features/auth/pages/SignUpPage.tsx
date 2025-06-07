import React from "react";
import SignUpForm from "../components/SignUpForm";
import { Box, Container, Paper, Step, StepLabel, Typography, useTheme } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import Stepper from '@mui/material/Stepper';
import EmailConfirmForm from "../components/EmailConfirmForm";
import '../../../styles/sign-up.css';
import { useUser } from "../../../contexts/UserContext";
import { useAuth } from "../store/auth.store";
import { transformSignUpData } from "../schemas/signUpSchema";
import { useToast } from "../../../contexts/ToastContext";
import PageWrapper from "../../../shared/components/PageWrapper";

const SignUpPage = () => {
    const theme = useTheme();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const adminToken = queryParams.get('adminToken') ?? undefined;

    const { refreshUser } = useUser();
    const { signUp, confirmEmail } = useAuth();
    const navigate = useNavigate();
    const { showError, showSuccess } = useToast();

    const handleSignUp = async (data: ReturnType<typeof transformSignUpData>) => {
        const { userId, error } = await signUp({ ...data, adminToken });
        if (userId) {
            setUserId(userId);
            showSuccess("Check your email for confirmation code");
        } else {
            showError(error ?? "Error during signing up");
        }
    }

    const handleConfirmEmail = async (code: string) => {
        if (!userId)
            return;

        const { success, error } = await confirmEmail({ userId, code });
        if (success) {
            const user = await refreshUser();
            if (user) {
                navigate('/');
            } else {
                showError(error ?? "Error during signing in");
            }
        } else {
            showError(error ?? "Error during confirming email");
        }
    }

    const [userId, setUserId] = React.useState<string | undefined>(undefined);
    const activeStep = userId ? 1 : 0;

    return (
        <PageWrapper>
            <Container
                maxWidth="sm"
                sx={{
                    py: { xs: 2, sm: 2, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, sm: 4 },
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{
                        mb: { xs: 3, sm: 4 },
                        mt: { xs: 2, sm: 1 }
                    }}>
                        <Typography
                            variant="h4"
                            align="center"
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                                mb: 1
                            }}
                        >
                            Sign Up
                        </Typography>
                        <Typography
                            variant="body1"
                            align="center"
                            color="text.secondary"
                        >
                            {activeStep === 0
                                ? "Create your account to start fundraising"
                                : "Enter the confirmation code sent to your email"
                            }
                        </Typography>
                    </Box>

                    <Box sx={{ mb: { xs: 4, sm: 5 } }}>
                        {!userId ? (
                            <SignUpForm onSubmit={handleSignUp} />
                        ) : (
                            <EmailConfirmForm onSubmit={handleConfirmEmail} />
                        )}
                    </Box>
                    <Stepper
                        activeStep={activeStep}
                        sx={{
                            '& .MuiStepLabel-label': {
                                typography: 'body2'
                            }
                        }}
                    >
                        <Step>
                            <StepLabel>Sign Up</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Confirm Email</StepLabel>
                        </Step>
                    </Stepper>
                </Paper>
            </Container>
        </PageWrapper>
    );
};

export default SignUpPage;