import { Box, Button, Dialog, Divider, TextField, Typography, useTheme, DialogContent, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthGoogleButton from "./SignInGoogle";
import { useZodForm } from "../../../shared/hooks/useZodForm";
import { SignInFormData, signInSchema } from "../schemas/signInSchema";
import { userRepository } from '../../users/api/userRepository';
import { useToast } from "../../../contexts/ToastContext";
import PasswordInput from "../../../shared/components/PasswordInput";

interface SignInFormProps {
    onSubmit: (data: SignInFormData) => void;
}

const SignInForm = (props: SignInFormProps) => {
    const { register, handleSubmit, getValues, formState: { errors } } = useZodForm(signInSchema);
    const theme = useTheme();
    const { showSuccess, showError } = useToast();
    const [dialogOpened, setDialogOpened] = useState<boolean>(false);
    const navigate = useNavigate();

    return (
        <Box sx={{ width: '100%' }}>
            <Box
                display="flex"
                flexDirection="column"
                gap={3}
                component="form"
                onSubmit={handleSubmit(props.onSubmit)}
            >
                <TextField
                    fullWidth
                    id="email"
                    label="Email"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 1
                        }
                    }}
                />
                <PasswordInput
                    fullWidth
                    id="password"
                    label="Password"
                    registration={register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 1
                        }
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    Sign In
                </Button>
            </Box>

            <Box sx={{ my: 3 }}>
                <Divider>
                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.palette.text.secondary,
                            px: 2
                        }}
                    >
                        Or continue with
                    </Typography>
                </Divider>
            </Box>

            <Box sx={{ mb: 3 }}>
                <AuthGoogleButton type="sign-in" label="Sign in with Google" />
            </Box>

            <Divider />

            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                mt: 3
            }}>
                <Button
                    sx={{
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline'
                        }
                    }}
                    variant="text"
                    onClick={() => navigate('/sign-up')}
                >
                    <Typography
                        variant="body2"
                        color="primary"
                        fontWeight={500}
                    >
                        Don't have an account?
                    </Typography>
                </Button>
                <Button
                    sx={{
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline'
                        }
                    }}
                    variant="text"
                    onClick={() => setDialogOpened(true)}
                >
                    <Typography
                        variant="body2"
                        color="primary"
                        fontWeight={500}
                    >
                        Forgot password?
                    </Typography>
                </Button>
            </Box>

            <Dialog
                onClose={() => setDialogOpened(false)}
                open={dialogOpened}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        width: '100%',
                        maxWidth: 400
                    }
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                    Forgot Password
                </DialogTitle>
                <DialogContent>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        pt: 1
                    }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            textAlign="center"
                        >
                            Enter your email address and we will send you a link to reset your password.
                        </Typography>
                        <TextField
                            fullWidth
                            id="email"
                            label="Email"
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1
                                }
                            }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={async () => {
                                const result = await userRepository.forgotPassword(getValues('email'));
                                if (result.isSuccess) {
                                    showSuccess('Check your email for further instructions');
                                } else {
                                    showError(result.error?.message ?? 'Error during sending email');
                                }
                                setDialogOpened(false);
                            }}
                            sx={{
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            Send Reset Link
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default SignInForm;