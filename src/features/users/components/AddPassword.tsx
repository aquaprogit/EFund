import React from 'react';
import ChangeCreds from "./ChangeCreds";
import { userRepository } from "../api/userRepository";
import { useToast } from "../../../contexts/ToastContext";
import PasswordInput from "./PasswordInput";
import { Box } from '@mui/material';
import { useUser } from '../../../contexts/UserContext';
import { addPasswordSchema, type AddPasswordFormData } from '../../auth/schemas/schemas';
import { useZodForm } from '../../../shared/hooks/useZodForm';
import LockIcon from '@mui/icons-material/Lock';

const AddPassword = (props: { onClose: () => void }) => {
    const { refreshUser } = useUser();
    const { showSuccess, showError } = useToast();
    const { handleSubmit, register, formState: { errors } } = useZodForm(addPasswordSchema);

    const onSubmit = async (data: AddPasswordFormData) => {
        try {
            const response = await userRepository.addPassword({ password: data.password });

            if (response.isSuccess) {
                showSuccess('Password has been successfully added');
                await refreshUser();
                props.onClose();
            } else if (response.error) {
                showError(response.error.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            showError('An error occurred while adding the password.');
        }
    };

    return (
        <ChangeCreds
            buttonLabel="Add Password"
            title="Add Password"
            description="Create a password for your account to enhance security"
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
                    register={register('password')}
                    label="Password"
                    placeholder="Enter your password"
                    error={errors['password']}
                />
                <PasswordInput
                    register={register('confirmPassword')}
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    error={errors['confirmPassword']}
                />
            </Box>
        </ChangeCreds>
    );
};

export default AddPassword;
