import { Pagination, Theme } from "@mui/material"
import { Box } from "@mui/material"
import { Paper } from "@mui/material"

interface PaginationPaperProps {
    totalPages: number;
    page: number;
    setPage: (page: number) => void;
    theme: Theme;
}

const PaginationPaper = ({ totalPages, page, setPage, theme }: PaginationPaperProps) => {
    return (
        <>
            {totalPages > 1 && (
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 3 },
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                            color="primary"
                            size="large"
                            showFirstButton
                            showLastButton
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    borderRadius: 1,
                                }
                            }}
                        />
                    </Box>
                </Paper>
            )}
        </>
    )
}

export default PaginationPaper;