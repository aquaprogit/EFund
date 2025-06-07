import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

interface RatingSliderProps {
    rating: number;
    size?: 'small' | 'medium' | 'large';
    showLabels?: boolean;
    showValue?: boolean;
}

const RatingSlider: React.FC<RatingSliderProps> = ({
    rating,
    size = 'medium',
    showLabels = true,
    showValue = true
}) => {
    const theme = useTheme();

    const clampedRating = Math.max(-3, Math.min(3, rating));

    const position = ((clampedRating + 3) / 6) * 100;

    const getRatingColor = (rating: number): string => {
        if (rating <= -2) return '#f44336';
        if (rating <= -1) return '#ff5722';
        if (rating <= 0) return '#ff9800';
        if (rating <= 1) return '#ffc107';
        if (rating <= 2) return '#8bc34a';
        return '#4caf50';
    };

    const circleColor = getRatingColor(clampedRating);

    const sizeConfig = {
        small: { height: 6, circleSize: 16, fontSize: '0.75rem' },
        medium: { height: 8, circleSize: 20, fontSize: '0.875rem' },
        large: { height: 10, circleSize: 24, fontSize: '1rem' }
    };

    const config = sizeConfig[size];

    return (
        <Box sx={{ width: '100%', py: 0.5 }}>
            {showValue && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1, pointerEvents: 'none' }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 700,
                            fontSize: config.fontSize,
                            color: circleColor
                        }}
                    >
                        {clampedRating.toFixed(1)}
                    </Typography>
                </Box>
            )}

            <Box sx={{ position: 'relative', width: '100%', height: '20px !important', alignContent: 'center', pointerEvents: 'none' }}>
                <Box
                    sx={{
                        height: `${config.height}px !important`,
                        borderRadius: config.height / 2,
                        background: 'linear-gradient(90deg, #f44336 0%, #ff5722 16.67%, #ff9800 33.33%, #ffc107 50%, #8bc34a 66.67%, #4caf50 100%)',
                        position: 'relative',
                        boxShadow: `inset 0 1px 3px rgba(0,0,0,0.2)`,
                    }}
                />

                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: `${position}%`,
                        transform: 'translate(-50%, -50%)',
                        width: `${config.circleSize}px !important`,
                        height: `${config.circleSize}px !important`,
                        borderRadius: '50%',
                        backgroundColor: circleColor,
                        border: '2px solid white',
                        boxShadow: theme.shadows[3],
                        zIndex: 1,
                        pointerEvents: 'none',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: config.circleSize - 8,
                            height: config.circleSize - 8,
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            opacity: 0.3,
                        }
                    }}
                />
            </Box>

            {showLabels && (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 1,
                    px: 0.5,
                    pointerEvents: 'none'
                }}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: '#f44336',
                            fontWeight: 600,
                            fontSize: config.fontSize === '1rem' ? '0.875rem' : '0.75rem'
                        }}
                    >
                        -3
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.secondary',
                            fontSize: config.fontSize === '1rem' ? '0.875rem' : '0.75rem'
                        }}
                    >
                        0
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: '#4caf50',
                            fontWeight: 600,
                            fontSize: config.fontSize === '1rem' ? '0.875rem' : '0.75rem'
                        }}
                    >
                        +3
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default RatingSlider; 