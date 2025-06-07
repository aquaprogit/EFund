import React from 'react';
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Divider,
    IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

type ChangeCredsProps = {
    title: string,
    buttonLabel: string,
    children: React.ReactNode,
    buttonHandler: React.MouseEventHandler<HTMLButtonElement>,
    onClose?: () => void,
    icon?: React.ReactNode,
    description?: string
}

const ChangeCreds: React.FC<ChangeCredsProps> = (
    {
        title,
        buttonLabel,
        children,
        buttonHandler,
        onClose,
        icon,
        description
    }
) => {
    return (
        <>
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {icon && (
                        <Box sx={{
                            width: 60,
                            height: 60,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: 'primary.main',
                            color: 'white'
                        }}>
                            {icon}
                        </Box>
                    )}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            {title}
                        </Typography>
                        {description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {description}
                            </Typography>
                        )}
                    </Box>
                    {onClose && (
                        <IconButton
                            onClick={onClose}
                            sx={{
                                color: 'text.secondary',
                                '&:hover': {
                                    color: 'text.primary'
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    )}
                </Box>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 3, pb: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {children}
                </Box>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 3, gap: 2 }}>
                {onClose && (
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{ minWidth: 100 }}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    variant="contained"
                    onClick={buttonHandler}
                    sx={{ minWidth: 120 }}
                >
                    {buttonLabel}
                </Button>
            </DialogActions>
        </>
    );
};

export default ChangeCreds;