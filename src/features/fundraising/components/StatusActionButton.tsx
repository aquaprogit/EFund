import { Button, Typography, Box, Tooltip, SvgIconProps } from "@mui/material";
import {
    Lock as LockIcon,
    LockOpen as LockOpenIcon,
    Delete as DeleteIcon,
    Restore as RestoreIcon,
    Assessment as AssessmentIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { StatusAction } from '../utils/statusTransitions';

interface StatusActionButtonProps {
    action: StatusAction;
    onClick: () => void;
    disabled?: boolean;
    variant?: 'outlined' | 'contained' | 'text';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    showDescription?: boolean;
}

const StatusActionButton = ({
    action,
    onClick,
    disabled = false,
    variant = 'outlined',
    size = 'medium',
    fullWidth = false,
    showDescription = true
}: StatusActionButtonProps) => {
    const getActionIcon = (iconName: string) => {
        const iconProps: SvgIconProps = {
            fontSize: size === 'small' ? 'small' : 'medium'
        };

        switch (iconName) {
            case 'Lock': return <LockIcon {...iconProps} />;
            case 'LockOpen': return <LockOpenIcon {...iconProps} />;
            case 'Delete': return <DeleteIcon {...iconProps} />;
            case 'Restore': return <RestoreIcon {...iconProps} />;
            case 'Assessment': return <AssessmentIcon {...iconProps} />;
            default: return <InfoIcon {...iconProps} />;
        }
    };

    const buttonContent = showDescription ? (
        <Box sx={{ flex: 1, textAlign: 'left' }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {action.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {action.description}
            </Typography>
        </Box>
    ) : (
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {action.label}
        </Typography>
    );

    const button = (
        <Button
            variant={variant}
            color={action.color}
            startIcon={getActionIcon(action.icon)}
            onClick={onClick}
            disabled={disabled}
            fullWidth={fullWidth}
            size={size}
            sx={{
                justifyContent: showDescription ? 'flex-start' : 'center',
                textAlign: 'left',
                borderRadius: 2,
                ...(showDescription && { p: 2 }),
                textTransform: 'none'
            }}
        >
            {buttonContent}
        </Button>
    );

    // Wrap with tooltip if confirmation is required
    if (action.confirmationRequired && action.confirmationMessage) {
        return (
            <Tooltip title={action.confirmationMessage} arrow placement="top">
                {button}
            </Tooltip>
        );
    }

    return button;
};

export default StatusActionButton; 