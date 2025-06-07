import {
    Card,
    CardMedia,
    Typography,
    LinearProgress,
    Box,
    CardContent,
    Button,
    Chip,
    Link,
    useTheme,
    Stack
} from '@mui/material';
import Fundraising from '../../models/Fundraising';
import { useNavigate } from "react-router-dom";
import { getFundraisingCardStyles } from '../../styles/FundraisingCard.style';
import FundraisingStatusChip from '../FundraisingStatusChip';
import { MapToPublicStatus } from '../../models/FundraisingStatus';

interface FundraisingCardProps {
    fundraising: Fundraising;
}

const FundraisingCard = (props: FundraisingCardProps) => {
    const theme = useTheme();
    const styles = getFundraisingCardStyles(theme);
    const { balance, goal, currencyCode, sendUrl } = props.fundraising.monobankJar;
    const progress = (balance / goal) * 100;
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/fundraising/${props.fundraising.id}`);
    };

    return (
        <Card
            onClick={handleClick}
            elevation={0}
            sx={styles.card}
        >
            <CardMedia
                component="img"
                height="200"
                image={props.fundraising.avatarUrl}
                alt={props.fundraising.title}
                sx={styles.cardMedia}
            />
            <CardContent sx={styles.cardContent}>
                <Box sx={{ position: 'relative', mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography
                        variant="h6"
                        sx={{
                            ...styles.title,
                        }}
                    >
                        {props.fundraising.title}
                    </Typography>
                    <FundraisingStatusChip status={MapToPublicStatus(props.fundraising.status)} />
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={styles.description}
                >
                    {props.fundraising.description}
                </Typography>

                {props.fundraising.tags.length > 0 && (
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={styles.tagsContainer}
                    >
                        {props.fundraising.tags.map((tag: string, index: number) => (
                            <Chip
                                key={index}
                                label={tag}
                                size="small"
                                sx={styles.tag}
                            />
                        ))}
                    </Stack>
                )}

                <Box sx={styles.progressContainer}>
                    <Box sx={{ mb: 1 }}>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={styles.progressBar}
                        />
                        <Box sx={styles.progressValues}>
                            <Typography variant="body2" color="text.secondary">
                                {balance} {currencyCode}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {goal} {currencyCode}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={styles.supportButtonContainer}>
                        <Link
                            href={sendUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            sx={styles.supportLink}
                        >
                            <Button
                                fullWidth
                                variant="outlined"
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.palette.secondary.main; e.currentTarget.style.color = 'white' }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'inherit' }}
                                color='secondary'
                                sx={styles.supportButton}
                            >
                                Support
                            </Button>
                        </Link>
                        <Button
                            fullWidth
                            variant="contained"
                            color='primary'
                            onClick={() => navigate(`/fundraising/${props.fundraising.id}`)}
                            sx={styles.detailsButton}
                        >
                            Details
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default FundraisingCard;