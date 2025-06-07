import {
    Box,
    LinearProgress,
    Typography,
    useTheme
} from "@mui/material";
import { getFundraisingDetailsStyles } from "../../styles/FundraisingDetails.style";

interface FundraisingProgressProps {
    monobankJar: {
        balance: number;
        goal: number;
        currencyCode: string;
    };
}

export const FundraisingProgress = ({ monobankJar }: FundraisingProgressProps) => {
    const theme = useTheme();
    const styles = getFundraisingDetailsStyles(theme);

    const progressPercentage = Math.min((monobankJar.balance / monobankJar.goal) * 100, 100);

    return (
        <Box sx={styles.progressSection}>
            <Typography variant="h4" sx={styles.amountText}>
                {monobankJar.balance} {monobankJar.currencyCode}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={styles.goalText}>
                raised of {monobankJar.goal} {monobankJar.currencyCode} goal
            </Typography>
            <LinearProgress
                variant="determinate"
                value={progressPercentage}
                sx={styles.progressBar}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                {progressPercentage.toFixed(1)}% of goal reached
            </Typography>
        </Box>
    );
};

export default FundraisingProgress; 