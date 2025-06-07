import React, { useState } from 'react';
import ChangeCreds from "./ChangeCreds";
import TextField from "@mui/material/TextField";
import { monobankRepository } from "../../monobank/repository/monobankRepository";
import { Link, Typography, Box } from '@mui/material';
import { useUser } from '../../../contexts/UserContext';
import { useToast } from '../../../contexts/ToastContext';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const LinkToken = (props: { onClose: () => void }) => {
    const [token, setToken] = useState('')
    const { refreshUser } = useUser();
    const { showError, showSuccess } = useToast();

    const onSubmit = async () => {
        if (!token.trim()) return;

        try {
            const response = await monobankRepository.linkToken(token);
            if (response && response.error) {
                showError(response.error.message);
            } else if (response && response.isSuccess) {
                showSuccess('Token has been successfully linked');
                await refreshUser();
                props.onClose();
            }
        } catch (e) {
            showError('Unexpected error');
        }
    }

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setToken(event.target.value);
    }

    return (
        <ChangeCreds
            buttonLabel="Link Account"
            title="Connect Monobank"
            description="Link your Monobank account to start receiving donations"
            buttonHandler={onSubmit}
            onClose={props.onClose}
            icon={<AccountBalanceIcon />}
        >
            <TextField
                label="Monobank Token"
                variant="outlined"
                fullWidth
                value={token}
                onChange={onChangeHandler}
                placeholder="Enter your Monobank API token"
                required
                helperText={
                    <Box component="span">
                        You can get your token from the{' '}
                        <Link
                            underline="hover"
                            href="https://api.monobank.ua/"
                            target="_blank"
                            rel="noreferrer"
                            sx={{ fontWeight: 600 }}
                        >
                            Monobank API portal
                        </Link>
                    </Box>
                }
            />
            <Box sx={{
                p: 2,
                bgcolor: 'info.50',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'info.main'
            }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'info.main', mb: 1 }}>
                    ℹ️ How to get your token:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    1. Visit the Monobank API portal<br />
                    2. Generate your personal token<br />
                    3. Copy and paste it here<br />
                    4. Your token will be securely stored and encrypted
                </Typography>
            </Box>
        </ChangeCreds>
    );
};

export default LinkToken;