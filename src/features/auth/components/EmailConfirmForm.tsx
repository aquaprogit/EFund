import { Box, Button, TextField } from "@mui/material";
import { useZodForm } from "../../../shared/hooks/useZodForm";
import { confirmEmailSchema } from "../schemas/confirmEmailSchema";

interface EmailConfirmFormProps {
    onSubmit: (code: string) => void;
}

const EmailConfirmForm = (props: EmailConfirmFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useZodForm(confirmEmailSchema);

    return (
        <Box
            component="form"
            onSubmit={handleSubmit((data) => props.onSubmit(data.code))}
            sx={{
                width: '100%',
                maxWidth: 450,
                mx: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 3
            }}
        >
            <TextField
                fullWidth
                id="code"
                label="Confirmation Code"
                {...register('code')}
                error={!!errors.code}
                helperText={errors.code?.message}
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
                Confirm Email
            </Button>
        </Box>
    );
};

export default EmailConfirmForm;