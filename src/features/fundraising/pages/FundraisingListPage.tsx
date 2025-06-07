import { Container, Box, Paper, Pagination, useTheme, Theme } from "@mui/material"
import PageWrapper from "../../../shared/components/PageWrapper"
import FilterSection from "../components/search/FilterSection"
import { useFundraisingSearch } from "../hooks/useFundraisingSearch"
import { useSearchParams } from "react-router-dom"
import FundraisingList from "../components/search/FundraisingList"
import PaginationPaper from "../../../shared/components/PaginationPaper"

const FundraisingListPage = () => {
    const theme = useTheme();
    const pageSize = 6;

    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId');
    const searchQuery = searchParams.get('keyword') ?? '';

    const {
        fundraisings,
        loading,
        page,
        totalPages,
        allTags,
        selectedStatuses,
        setPage,
        setSearchQuery,
        setSelectedTags,
        setSelectedStatuses,
        setSelectedUser,
        selectedUser,
        totalFundraisings
    } = useFundraisingSearch({ initialSearchQuery: searchQuery, pageSize: pageSize, userId: userId ?? undefined });

    return (
        <PageWrapper searchAvailable={false}>
            <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 2, sm: 3 }
                }}>
                    <FilterSection
                        searchInitialValue={searchQuery}
                        onSearchChange={setSearchQuery}
                        onTagsChange={setSelectedTags}
                        allTags={allTags}
                        onUserChange={setSelectedUser}
                        selectedUser={selectedUser}
                        onStatusChange={setSelectedStatuses}
                        selectedStatuses={selectedStatuses}
                    />

                    <Box>
                        <FundraisingList
                            pageSize={pageSize}
                            theme={theme}
                            page={page}
                            totalFundraisings={totalFundraisings}
                            fundraisings={fundraisings}
                            loading={loading}
                        />
                        <PaginationPaper
                            totalPages={totalPages}
                            page={page}
                            setPage={setPage}
                            theme={theme}
                        />
                    </Box>
                </Box>
            </Container>
        </PageWrapper>
    )
}

export default FundraisingListPage;