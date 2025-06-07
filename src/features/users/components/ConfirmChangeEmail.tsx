import React, { useState } from 'react';
import { Box, Button, Typography } from "@mui/material";
import styles from './ChangeEmail.module.css';
import TextField from "@mui/material/TextField";
import { userRepository } from '../api/userRepository';
import { useToast } from "../../../contexts/ToastContext";
import { useUser } from "../../../contexts/UserContext";

const ConfirmChangeEmail = (props: { newEmail: string, onClose: () => void }) => {
    const [code, setCode] = useState('');
    const { user, refreshUser } = useUser();
    const { showSuccess, showError } = useToast();

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCode(event.target.value);
    }
    const onSubmit: React.MouseEventHandler<HTMLButtonElement> = async () => {
        try {
            const response = await userRepository.confirmChangeEmail({ newEmail: props.newEmail, code: parseInt(code, 10) });
            if (!response.isSuccess) {
                showError(response.error?.message || 'Failed to confirm email change');
            } else {
                showSuccess('Email has been successfully changed');
                await refreshUser();
                props.onClose();
            }
        }
        catch (e) {
            showError('Unexpected error')
        }
    }
    const resendConfirmationCode = async () => {
        try {
            const response = await userRepository.resendConfirmationCode({ userId: user!.id });
            if (response.isSuccess) {
                showSuccess('Confirmation code has been resent');
            } else {
                showError(response.error?.message || 'Failed to resend confirmation code');
            }
        }
        catch (e) {
            showError('Unexpected error')
        }
    }
    return (
        <Box className={styles.wrapper}>
            <Typography variant={'h5'}>Enter confirmation code</Typography>
            <Box className={styles.validation}>
                <TextField
                    size={"small"}
                    placeholder={'Confirmation code'}
                    value={code}
                    onChange={onChangeHandler}
                />
                <Button size='small' onClick={resendConfirmationCode}>Resend code</Button>
            </Box>
            <Button size={'large'} onClick={onSubmit}>Submit</Button>
        </Box>
    );
};

export default ConfirmChangeEmail;