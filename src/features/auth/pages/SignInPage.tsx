import { Paper, Typography, Box, Container, useTheme } from "@mui/material";
import SignInForm from "../components/SignInForm";
import { SignInFormFields } from "../models/AuthFormFields";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import { useAuth } from "../store/auth.store";
import { useToast } from "../../../contexts/ToastContext";
import PageWrapper from "../../../shared/components/PageWrapper";

const SignInPage = () => {
    const { refreshUser } = useUser();
    const { signIn } = useAuth();
    const { showError } = useToast();
    const navigate = useNavigate();
    const theme = useTheme();

    const onSubmit = async (fields: SignInFormFields) => {
        const error = await signIn(fields);
        if (error) {
            showError(error);
        } else {
            const user = await refreshUser();
            if (user) {
                navigate('/');
            } else {
                showError('Error during signing in');
            }
        }
    };

    return (
        <PageWrapper>
            <Container
                maxWidth="sm"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    py: 2
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Box sx={{ position: 'relative', mb: 3 }}>
                        <Typography
                            variant="h4"
                            textAlign="center"
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary
                            }}
                        >
                            Sign In
                        </Typography>
                    </Box>
                    <SignInForm onSubmit={onSubmit} />
                </Paper>
            </Container>
        </PageWrapper>
    );
};

export default SignInPage;