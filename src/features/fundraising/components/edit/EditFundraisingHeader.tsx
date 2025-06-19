import { Box, Paper, CardContent, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface EditFundraisingHeaderProps {
    fundraisingId: string;
}

const EditFundraisingHeader = ({ fundraisingId }: EditFundraisingHeaderProps) => {
    const navigate = useNavigate();

    return (
        <Paper
            elevation={4}
            sx={{
                mb: 4,
                borderRadius: 4,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative'
            }}
        >
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1 }}>
                <Box sx={{
                    background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                    width: '100%',
                    height: '100%'
                }} />
            </Box>
            <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{
                            p: 2,
                            borderRadius: 3,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <EditIcon sx={{ fontSize: 32 }} />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                Edit Fundraising
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                Update your fundraising campaign details
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton
                        onClick={() => navigate(`/fundraising/${fundraisingId}`)}
                        sx={{
                            color: 'white',
                            bgcolor: 'rgba(255,255,255,0.2)',
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.3)'
                            }
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </Box>
            </CardContent>
        </Paper>
    );
};

export default EditFundraisingHeader; 