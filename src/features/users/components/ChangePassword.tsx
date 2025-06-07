import ChangeCreds from "./ChangeCreds";
import { userRepository } from "../api/userRepository";
import { useToast } from "../../../contexts/ToastContext";
import PasswordInput from "./PasswordInput";
import { Box } from "@mui/material";
import { changePasswordSchema, type ChangePasswordFormData } from "../../auth/schemas/schemas";
import { useZodForm } from "../../../shared/hooks/useZodForm";
import LockIcon from '@mui/icons-material/Lock';

const ChangePassword = (props: { onClose: () => void }) => {
    const { showSuccess, showError } = useToast();
    const { register, handleSubmit, formState: { errors } } = useZodForm(changePasswordSchema);

    const onSubmit = async (data: ChangePasswordFormData) => {
        try {
            const response = await userRepository.changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            });

            if (response.isSuccess) {
                showSuccess('Password has been successfully changed');
                props.onClose();
            } else if (response.error) {
                showError(response.error.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            showError('An error occurred while changing the password.');
        }
    };

    return (
        <ChangeCreds
            buttonLabel="Change Password"
            title="Change Password"
            description="Enter your current password and choose a new one"
            buttonHandler={handleSubmit(onSubmit)}
            onClose={props.onClose}
            icon={<LockIcon />}
        >
            <Box
                component="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(onSubmit)(e);
                }}
                sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
            >
                <PasswordInput
                    register={register('oldPassword')}
                    label="Current Password"
                    placeholder="Enter your current password"
                    error={errors['oldPassword']}
                />
                <PasswordInput
                    register={register('newPassword')}
                    label="New Password"
                    placeholder="Enter your new password"
                    error={errors['newPassword']}
                />
                <PasswordInput
                    register={register('confirmPassword')}
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    error={errors['confirmPassword']}
                />
            </Box>
        </ChangeCreds>
    );
};

export default ChangePassword;
