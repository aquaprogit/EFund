import {
    Box,
    Button,
    Link as MuiLink,
    Stack,
    Typography,
    useTheme
} from "@mui/material";
import ReceiptIcon from '@mui/icons-material/Receipt';
import FlagIcon from '@mui/icons-material/Flag';
import { Link } from 'react-router-dom';
import { useUser } from "../../../../contexts/UserContext";
import { getFundraisingDetailsStyles } from "../../styles/FundraisingDetails.style";

interface FundraisingActionsProps {
    fundraising: {
        monobankJar: {
            sendUrl: string;
        };
        userId: string;
    };
    fundraisingId: string;
    onScrollToReports: () => void;
    onOpenReportDialog: () => void;
}

export const FundraisingActions = ({
    fundraising,
    fundraisingId,
    onScrollToReports,
    onOpenReportDialog
}: FundraisingActionsProps) => {
    const theme = useTheme();
    const styles = getFundraisingDetailsStyles(theme);
    const { user } = useUser();

    return (
        <Box>
            {/* Action Buttons */}
            <Stack spacing={2}>
                <MuiLink
                    href={fundraising.monobankJar.sendUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={styles.supportLink}
                >
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={styles.button}
                    >
                        Support Now
                    </Button>
                </MuiLink>
                <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    size="large"
                    startIcon={<ReceiptIcon />}
                    sx={styles.button}
                    onClick={onScrollToReports}
                >
                    View Reports
                </Button>
                {user?.id !== fundraising.userId ? (
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        size="large"
                        startIcon={<FlagIcon />}
                        sx={styles.button}
                        onClick={onOpenReportDialog}
                    >
                        Report Fundraising
                    </Button>
                ) : (
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        sx={styles.button}
                        component={Link}
                        to={`/fundraising/${fundraisingId}/edit`}
                    >
                        Edit Fundraising
                    </Button>
                )}
            </Stack>

            {/* Additional Info */}
            <Box sx={styles.additionalInfo}>
                <Typography variant="body2" color="text.secondary" sx={styles.infoText}>
                    All donations are processed securely through Monobank
                </Typography>
            </Box>
        </Box>
    );
};

export default FundraisingActions; 