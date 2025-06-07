import { Box, Skeleton, Typography, Theme } from "@mui/material";
import FundraisingCard from "./FundraisingCard";
import Fundraising from "../../models/Fundraising";

type FundraisingListProps = {
    pageSize: number
    theme: Theme
    page: number
    totalFundraisings: number
    fundraisings: Fundraising[]
    loading: boolean
}

const FundraisingList: React.FC<FundraisingListProps> = ({ pageSize, theme, page, totalFundraisings, fundraisings, loading }) => {
    return (
        <>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: { xs: 2, sm: 3 },
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary
                    }}
                >
                    Results
                </Typography>
                {!loading && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {fundraisings.length === 0
                            ? 'No fundraisings found'
                            : `Showing ${(page - 1) * pageSize + 1}-${(page - 1) * pageSize + fundraisings.length} of ${totalFundraisings} fundraisings`
                        }
                    </Typography>
                )}
            </Box>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(auto-fill, minmax(300px, 1fr))',
                    md: 'repeat(auto-fill, minmax(350px, 1fr))'
                },
                gap: { xs: 2, sm: 3 },
                mb: { xs: 3, sm: 4 }
            }}>
                {loading ? (
                    Array(pageSize).fill(0).map((_, index) => (
                        <Skeleton
                            key={index}
                            variant="rounded"
                            sx={{
                                height: 400,
                                borderRadius: 2
                            }}
                        />
                    ))
                ) : fundraisings.length === 0 ? (
                    <Box
                        sx={{
                            gridColumn: '1/-1',
                            textAlign: 'center',
                            py: { xs: 6, sm: 8 },
                            px: 2
                        }}
                    >
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            No fundraisings found
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Try adjusting your filters or search query
                        </Typography>
                    </Box>
                ) : (
                    fundraisings.map((fundraising) => (
                        <FundraisingCard
                            key={fundraising.id}
                            fundraising={fundraising}
                        />
                    ))
                )}
            </Box>
        </>
    );
};

export default FundraisingList;