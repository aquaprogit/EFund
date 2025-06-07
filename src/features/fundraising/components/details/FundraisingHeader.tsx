import {
    Box,
    Chip,
    Stack,
    Typography,
    useTheme
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../../../contexts/UserContext";
import UserPreviewTooltip from "../../../../shared/components/UserPreviewTooltip";
import { getFundraisingDetailsStyles } from "../../styles/FundraisingDetails.style";
import { FundraisingStatus, MapToPublicStatus } from "../../models/FundraisingStatus";
import FundraisingStatusChip from "../FundraisingStatusChip";

interface FundraisingHeaderProps {
    fundraising: {
        title: string;
        tags: string[];
        createdAt: string;
        userId: string;
        userName: string;
        status: FundraisingStatus;
    };
}

export const FundraisingHeader = ({ fundraising }: FundraisingHeaderProps) => {
    const theme = useTheme();
    const styles = getFundraisingDetailsStyles(theme);
    const { user } = useUser();
    const navigate = useNavigate();

    return (
        <Box>
            {/* Status Chip */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'end', gap: 1 }}>
                <FundraisingStatusChip status={MapToPublicStatus(fundraising.status)} />
                {
                    user?.id === fundraising.userId && fundraising.status !== MapToPublicStatus(fundraising.status) && (
                        <FundraisingStatusChip status={fundraising.status} />
                    )
                }
            </Box>

            {/* Title */}
            <Typography
                variant="h4"
                sx={styles.title}
            >
                {fundraising.title}
            </Typography>

            {/* Tags */}
            {fundraising.tags.length > 0 && (
                <Stack
                    direction="row"
                    spacing={1}
                    sx={styles.tagsStack}
                >
                    {fundraising.tags.map((tag: string, index: number) => (
                        <Chip
                            key={index}
                            label={tag}
                            size="small"
                            sx={styles.tag}
                        />
                    ))}
                </Stack>
            )}

            {/* Meta Information */}
            <Stack
                direction="row"
                spacing={3}
                sx={styles.metaStack}
            >
                <Box sx={styles.metaItem}>
                    <AccessTimeIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ transition: 'none', '&:hover': { transition: 'none', transform: 'none' } }}>
                        Created {format(new Date(fundraising.createdAt), 'MMM dd, yyyy')}
                    </Typography>
                </Box>
                <Box sx={styles.metaItem}>
                    <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, transition: 'none', '&:hover': { transition: 'none', transform: 'none !important' } }}>
                        <Typography variant="body2" color="text.secondary">By</Typography>
                        {user?.id === fundraising.userId
                            ? <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold', fontStyle: 'italic' }} onClick={() => navigate(`/profile`)}>you</Typography>
                            : <UserPreviewTooltip userId={fundraising.userId}>
                                <Typography sx={{ textDecoration: 'underline', fontWeight: 'bold' }}
                                    color="primary" onClick={() => navigate(`/user/${fundraising.userId}`)} variant="body2">{fundraising.userName}</Typography>
                            </UserPreviewTooltip>}
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
};

export default FundraisingHeader; 