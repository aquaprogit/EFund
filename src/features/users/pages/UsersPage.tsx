import {
    Box,
    Container,
    Grid,
    Pagination,
    Skeleton,
    Typography,
    Paper,
    Divider,
    Card,
    CardContent
} from "@mui/material";
import PageWrapper from "../../../shared/components/PageWrapper";
import Search from "../../../shared/components/Search";
import { useEffect, useState } from "react";
import User from "../models/User";
import { userRepository } from "../api/userRepository";
import UserCard from "../components/UserCard";
import { useUser } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [refreshTrigger, setRefreshTrigger] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const pageSize = 6; // Increased for better grid layout
    const { user: currentUser, loading: userLoading } = useUser();
    const navigate = useNavigate();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = { page, pageSize, query: searchQuery };
            const response = await userRepository.getUsers(params, page, pageSize);

            if (response.isSuccess && response.data?.items) {
                const filteredUsers = currentUser
                    ? response.data.items.filter((user: User) => user.id !== currentUser.id)
                    : response.data.items;
                setUsers(filteredUsers);
                setTotalPages(response.data.totalPages);
            } else {
                setUsers([]);
                setTotalPages(1);
            }
        } catch (error) {
            setUsers([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const handleUserAction = () => {
        setRefreshTrigger(prev => prev === 'a' ? 'A' : 'a');
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setPage(1); // Reset to first page when searching
    };

    useEffect(() => {
        fetchUsers();
    }, [refreshTrigger, searchQuery, page, currentUser]);

    // Redirect non-admin users
    if (!userLoading && (!currentUser || !currentUser.isAdmin)) {
        navigate('/');
        return null;
    }

    // Show loading while checking user status
    if (userLoading) {
        return (
            <PageWrapper>
                <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                    <Typography>Loading...</Typography>
                </Container>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Header Section */}
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        color: 'primary.main',
                        textAlign: 'center',
                        mb: 4
                    }}
                >
                    User Management
                </Typography>

                {/* Search Section */}
                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 2
                    }}
                >
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            mb: 2
                        }}
                    >
                        Search Users
                    </Typography>
                    <Search
                        onSearch={handleSearchChange}
                        placeholder="Search by name or email..."
                    />
                </Paper>

                {/* Results Section */}
                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        borderRadius: 2
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3
                    }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: 'text.primary'
                            }}
                        >
                            Users ({loading ? '...' : users.length})
                        </Typography>

                        {searchQuery && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    fontStyle: 'italic'
                                }}
                            >
                                Searching for: "{searchQuery}"
                            </Typography>
                        )}
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Users Grid */}
                    {loading ? (
                        <Grid container spacing={3}>
                            {Array(pageSize).fill(0).map((_, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card elevation={1}>
                                        <CardContent>
                                            <Skeleton
                                                variant="circular"
                                                width={60}
                                                height={60}
                                                sx={{ mb: 2 }}
                                            />
                                            <Skeleton
                                                variant="text"
                                                height={30}
                                                sx={{ mb: 1 }}
                                            />
                                            <Skeleton
                                                variant="text"
                                                height={20}
                                                width="80%"
                                                sx={{ mb: 2 }}
                                            />
                                            <Skeleton
                                                variant="rectangular"
                                                height={36}
                                                width={100}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : users.length === 0 ? (
                        <Box sx={{
                            textAlign: 'center',
                            py: 8
                        }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'text.secondary',
                                    fontWeight: 500
                                }}
                            >
                                {searchQuery ? 'No users found matching your search' : 'No users found'}
                            </Typography>
                            {searchQuery && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        mt: 1
                                    }}
                                >
                                    Try adjusting your search terms
                                </Typography>
                            )}
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {users.map((user) => (
                                <Grid item xs={12} sm={6} md={4} key={user.id}>
                                    <UserCard
                                        user={user}
                                        onAction={handleUserAction}
                                        onSuccess={() => fetchUsers()}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <>
                            <Divider sx={{ mt: 4, mb: 3 }} />
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center'
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
                                            borderRadius: 2
                                        }
                                    }}
                                />
                            </Box>
                        </>
                    )}
                </Paper>
            </Container>
        </PageWrapper>
    );
};

export default UsersPage;