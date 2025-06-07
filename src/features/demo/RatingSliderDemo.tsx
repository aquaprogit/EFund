import React from 'react';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';
import RatingSlider from '../../shared/components/RatingSlider';

const RatingSliderDemo: React.FC = () => {
    const demoRatings = [
        { value: -3, label: 'Minimum Rating' },
        { value: -2, label: 'Poor Rating' },
        { value: -1, label: 'Below Average' },
        { value: 0, label: 'Neutral Rating' },
        { value: 1, label: 'Above Average' },
        { value: 2, label: 'Good Rating' },
        { value: 3, label: 'Maximum Rating' },
        { value: 1.7, label: 'Sample User Rating' },
        { value: -0.5, label: 'Slightly Negative' },
    ];

    return (
        <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
                Rating Slider Component Demo
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                Interactive rating visualization from -3 to +3 with gradient colors
            </Typography>

            {/* Size Variations */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Size Variations
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                Small Size
                            </Typography>
                            <RatingSlider rating={1.5} size="small" />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                Medium Size
                            </Typography>
                            <RatingSlider rating={1.5} size="medium" />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                Large Size
                            </Typography>
                            <RatingSlider rating={1.5} size="large" />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Display Options */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Display Options
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                Without Labels
                            </Typography>
                            <RatingSlider rating={0.8} showLabels={false} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                Without Value
                            </Typography>
                            <RatingSlider rating={0.8} showValue={false} />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Rating Examples */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Rating Examples
                </Typography>
                <Grid container spacing={2}>
                    {demoRatings.map((demo, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box sx={{
                                p: 2,
                                bgcolor: 'background.default',
                                borderRadius: 2,
                                height: '100%'
                            }}>
                                <Typography variant="subtitle2" sx={{
                                    mb: 1,
                                    fontWeight: 600,
                                    textAlign: 'center'
                                }}>
                                    {demo.label}
                                </Typography>
                                <RatingSlider
                                    rating={demo.value}
                                    size="medium"
                                    showLabels={true}
                                    showValue={true}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* Usage Information */}
            <Paper elevation={1} sx={{ p: 3, mt: 4, borderRadius: 3, bgcolor: 'primary.50' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Component Features
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    • <strong>Rating Scale:</strong> -3 (worst) to +3 (best)
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    • <strong>Color Coding:</strong> Red for negative, yellow/orange for neutral, green for positive
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    • <strong>Responsive Design:</strong> Three size options (small, medium, large)
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    • <strong>Customizable:</strong> Show/hide labels and values
                </Typography>
                <Typography variant="body2">
                    • <strong>Smooth Transitions:</strong> Animated circle indicator with gradient background
                </Typography>
            </Paper>
        </Box>
    );
};

export default RatingSliderDemo; 