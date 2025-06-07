import { Box, TextField, Button, useTheme } from "@mui/material";
import AuthGoogleButton from './SignInGoogle';
import { useZodForm } from "../../../shared/hooks/useZodForm";
import { SignUpFormData, signUpSchema, transformSignUpData } from "../schemas/signUpSchema";
import PasswordInput from "../../../shared/components/PasswordInput";

interface SignUpFormProps {
    onSubmit: (data: ReturnType<typeof transformSignUpData>) => void;
}

const SignUpForm = (props: SignUpFormProps) => {
    const theme = useTheme();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useZodForm(signUpSchema);

    const handleFormSubmit = (data: SignUpFormData) => {
        props.onSubmit(transformSignUpData(data));
    };

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 450,
                mx: 'auto'
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit(handleFormSubmit)}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                }}
            >
                <TextField
                    fullWidth
                    id="name"
                    label="Name"
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    variant="outlined"
                    autoComplete='off'
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 1
                        }
                    }}
                />
                <TextField
                    fullWidth
                    id="email"
                    label="Email"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    variant="outlined"
                    autoComplete='off'
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
                />
                <PasswordInput
                    fullWidth
                    id="passwordConfirm"
                    label="Confirm Password"
                    registration={register('confirmPassword')}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    variant="outlined"
                />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                        mt: 1
                    }}
                >
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={isSubmitting}
                        fullWidth
                        sx={{
                            py: 1.5,
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: 'none'
                            }
                        }}
                    >
                        Sign Up
                    </Button>
                    <AuthGoogleButton type="sign-up" label="Sign up with Google" />
                </Box>
            </Box>
        </Box>
    );
};

export default SignUpForm;