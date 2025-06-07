import React, { useState } from 'react';
import ChangeCreds from "./ChangeCreds";
import TextField from "@mui/material/TextField";
import { userRepository } from "../api/userRepository";
import { useToast } from "../../../contexts/ToastContext";
import ConfirmChangeEmail from './ConfirmChangeEmail';
import EmailIcon from '@mui/icons-material/Email';

const ChangeEmail = (props: { onClose: () => void }) => {
    const [newEmail, setNewEmail] = useState('');
    const error = !!newEmail && !!!newEmail.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    const [confirmationSent, setConfirmationSent] = useState(false);
    const { showError } = useToast();

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmail(event.target.value);
    }

    const onSubmit = async () => {
        if (error || !newEmail) return;

        try {
            const response = await userRepository.changeEmail(newEmail);
            if (!response.isSuccess) {
                showError(response.error?.message || 'Failed to change email');
            } else {
                setConfirmationSent(true);
            }
        } catch (e) {
            showError('Unexpected error')
        }
    }

    return (
        confirmationSent
            ? <ConfirmChangeEmail newEmail={newEmail} onClose={props.onClose} />
            : <ChangeCreds
                buttonLabel="Send Verification Code"
                title="Change Email Address"
                description="Enter your new email address and we'll send you a verification code"
                buttonHandler={onSubmit}
                onClose={props.onClose}
                icon={<EmailIcon />}
            >
                <TextField
                    label="New Email Address"
                    variant="outlined"
                    fullWidth
                    type="email"
                    placeholder="Enter your new email address"
                    value={newEmail}
                    onChange={onChangeHandler}
                    error={error}
                    helperText={error ? 'Please enter a valid email address' : 'You will receive a verification code at this email'}
                    required
                />
            </ChangeCreds>
    );
};

export default ChangeEmail;