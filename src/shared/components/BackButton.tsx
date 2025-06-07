import { IconButton, Tooltip } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
    to?: string;
    tooltipText?: string;
}

const BackButton = ({ to = '/', tooltipText = 'Back to home' }: BackButtonProps) => {
    const navigate = useNavigate();

    return (
        <Tooltip placement="top" title={tooltipText}>
            <IconButton
                onClick={() => navigate(to)}
                sx={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px'
                }}
            >
                <ArrowBackIcon />
            </IconButton>
        </Tooltip>
    );
};

export default BackButton; 