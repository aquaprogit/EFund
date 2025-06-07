import { Box, Stack, Typography, useTheme } from "@mui/material";

interface TrustScaleProps {
    rating: number;
}

const getTrustColor = (rating: number) => {
    if (rating > 1) return '#4CAF50';
    if (rating > -1) return '#FFD700';
    return '#f44336';
};

export const TrustScale = ({ rating }: TrustScaleProps) => {
    const theme = useTheme();

    return (
        <Box sx={{ mb: 3, p: 2, bgcolor: theme.palette.background.paper, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Stack direction='row' spacing={1} alignItems="center" sx={{ mb: 0 }}>
                <Typography variant="body2" color="text.secondary">
                    Trust Rating:
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 600,
                        color: getTrustColor(rating)
                    }}
                >
                    {rating > 0 ? '+' : ''}{rating.toFixed(1)}
                </Typography>
            </Stack>
            <Box
                sx={{
                    width: 200,
                    height: 120,
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Box sx={{ position: 'relative', width: 200, height: 100 }}>
                    <svg
                        width="120"
                        height="100"
                        viewBox="0 0 120 100"
                        style={{ overflow: 'visible' }}
                    >
                        <defs>
                            <linearGradient id="trustGradient" gradientUnits="userSpaceOnUse" x1="30" y1="85" x2="170" y2="85">
                                <stop offset="0%" stopColor={theme.palette.error.light} />
                                <stop offset="50%" stopColor="#FFD700" />
                                <stop offset="100%" stopColor="#4CAF50" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M 30 85 A 70 70 0 0 1 170 85"
                            fill="none"
                            stroke="url(#trustGradient)"
                            strokeWidth="10"
                            strokeLinecap="round"
                            style={{ pointerEvents: 'none' }}
                        />
                        <circle
                            cx={100 + (70 * Math.cos(Math.PI + (rating + 3) * Math.PI / 6))}
                            cy={85 + (70 * Math.sin(Math.PI + (rating + 3) * Math.PI / 6))}
                            r="10"
                            fill={getTrustColor(rating)}
                            stroke={theme.palette.background.paper}
                            strokeWidth="2"
                            filter="drop-shadow(0 2px 3px rgba(0,0,0,0.2))"
                        />
                    </svg>
                </Box>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                        width: '100%',
                        px: 2,
                        mt: -1
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.primary"
                    >
                        -3
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.primary"
                    >
                        +3
                    </Typography>
                </Stack>
            </Box>
        </Box>
    );
};

export default TrustScale;