import { useEffect, useState } from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    CircularProgress,
    Grid,
    Tabs,
    Tab,
    Pagination,
    Divider
} from "@mui/material";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

import AllInboxIcon from '@mui/icons-material/AllInbox';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import { Complaint } from "../models/Complaint";
import { ComplaintStatus } from "../models/ComplaintStatus";
import { complaintRepository } from "../repository/complaintRepository";
import ComplaintCard from "./ComplaintCard";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";
import { ComplaintsCount } from "../models/ComplaintsCount";

interface CachedTabData {
    complaints: Complaint[];
    totalPages: number;
    totalCount: number;
    currentPage: number;
    lastFetched: number;
}

interface ComplaintsCache {
    [key: string]: {
        [page: number]: CachedTabData;
    };
}

const ComplaintsList = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<ComplaintStatus | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [complaintsCache, setComplaintsCache] = useState<ComplaintsCache>({});
    const [complaintsCount, setComplaintsCount] = useState<ComplaintsCount>();
    const navigate = useNavigate();
    const { showError } = useToast();

    const pageSize = 12; // Number of complaints per page
    const cacheExpirationTime = 10 * 1000; // 10 seconds in milliseconds

    const getTabKey = (status: ComplaintStatus | undefined): string => {
        return status === undefined ? 'all' : status.toString();
    };

    const isCacheValid = (tabData: CachedTabData): boolean => {
        return Date.now() - tabData.lastFetched < cacheExpirationTime;
    };

    const getCachedData = (status: ComplaintStatus | undefined, page: number): CachedTabData | null => {
        const tabKey = getTabKey(status);
        const tabCache = complaintsCache[tabKey];
        if (tabCache && tabCache[page] && isCacheValid(tabCache[page])) {
            return tabCache[page];
        }
        return null;
    };

    const setCachedData = (status: ComplaintStatus | undefined, page: number, data: CachedTabData) => {
        const tabKey = getTabKey(status);
        setComplaintsCache(prev => ({
            ...prev,
            [tabKey]: {
                ...prev[tabKey],
                [page]: data
            }
        }));
    };

    useEffect(() => {
        const fetchComplaints = async () => {
            // Check cache first
            const cachedData = getCachedData(activeTab, currentPage);
            if (cachedData) {
                console.log(`Using cached data for tab ${getTabKey(activeTab)}, page ${currentPage}`);
                setComplaints(cachedData.complaints);
                setTotalPages(cachedData.totalPages);
                setTotalCount(cachedData.totalCount);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log(`Fetching fresh data for tab ${getTabKey(activeTab)}, page ${currentPage}`);
                const result = await complaintRepository.getComplaints(activeTab, currentPage, pageSize);

                if (result.isSuccess && result.data) {
                    const newData: CachedTabData = {
                        complaints: result.data.items,
                        totalPages: result.data.totalPages,
                        totalCount: result.data.totalCount,
                        currentPage: currentPage,
                        lastFetched: Date.now()
                    };

                    // Update state
                    setComplaints(result.data.items);
                    setTotalPages(result.data.totalPages);
                    setTotalCount(result.data.totalCount);

                    // Cache the data
                    setCachedData(activeTab, currentPage, newData);

                    console.log(`Cached data for tab ${getTabKey(activeTab)}, page ${currentPage}`);
                } else if (result.error?.code === 401) {
                    showError("You are not authorized to access this page");
                    navigate("/login");
                } else if (result.error) {
                    showError(result.error.message || "Failed to fetch complaints");
                }
            } catch (error) {
                console.error('Failed to fetch complaints:', error);
                showError("An unexpected error occurred while fetching complaints");
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, [activeTab, currentPage]);

    // Separate useEffect for fetching counts to ensure it runs on mount
    useEffect(() => {
        const fetchComplaintsCount = async () => {
            try {
                const result = await complaintRepository.getComplaintsTotals();
                if (result.isSuccess && result.data) {
                    setComplaintsCount(result.data);
                } else {
                    console.error('Failed to fetch complaints count - API error:', result.error);
                    // Fallback: fetch all complaints to calculate counts manually
                    console.log('Attempting fallback count calculation...');
                    await fallbackCountCalculation();
                }
            } catch (error) {
                console.error('Failed to fetch complaints count - Exception:', error);
                // Fallback: fetch all complaints to calculate counts manually
                console.log('Attempting fallback count calculation due to exception...');
                await fallbackCountCalculation();
            }
        };

        const fallbackCountCalculation = async () => {
            try {
                const result = await complaintRepository.getComplaintsTotals();
                if (result.isSuccess && result.data) {
                    const counts = {
                        All: result.data.All,
                        Pending: result.data.Pending,
                        Accepted: result.data.Accepted,
                        Rejected: result.data.Rejected,
                        RequestedChanges: result.data.RequestedChanges,
                    };
                    console.log('Fallback counts calculated:', counts);
                    setComplaintsCount(counts);
                } else {
                    console.error('Fallback count calculation failed:', result.error);
                    showError("Failed to load complaints overview");
                }
            } catch (error) {
                console.error('Fallback count calculation exception:', error);
                showError("Failed to load complaints overview");
            }
        };

        fetchComplaintsCount();
    }, [showError]); // Run only once on mount

    const handleTabChange = (event: React.SyntheticEvent, newValue: ComplaintStatus | undefined) => {
        setActiveTab(newValue);

        // Check if we have cached data for the first page of the new tab
        const cachedData = getCachedData(newValue, 1);
        if (cachedData) {
            // If we have cached data, set the current page to what was cached
            setCurrentPage(1);
        } else {
            // If no cached data, start from page 1
            setCurrentPage(1);
        }
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    // Clear expired cache entries periodically
    useEffect(() => {
        const clearExpiredCache = () => {
            const now = Date.now();
            setComplaintsCache(prev => {
                const newCache: ComplaintsCache = {};
                Object.keys(prev).forEach(tabKey => {
                    const tabCache = prev[tabKey];
                    const filteredTabCache: { [page: number]: CachedTabData } = {};
                    Object.keys(tabCache).forEach(pageKey => {
                        const pageNum = parseInt(pageKey);
                        const pageData = tabCache[pageNum];
                        if (now - pageData.lastFetched < cacheExpirationTime) {
                            filteredTabCache[pageNum] = pageData;
                        }
                    });
                    if (Object.keys(filteredTabCache).length > 0) {
                        newCache[tabKey] = filteredTabCache;
                    }
                });
                return newCache;
            });
        };

        // Clear expired cache every minute
        const interval = setInterval(clearExpiredCache, 60000);
        return () => clearInterval(interval);
    }, [cacheExpirationTime]);

    const getTabIcon = (status: ComplaintStatus | undefined) => {
        const iconSize = { fontSize: 18 };
        switch (status) {
            case undefined:
                return <AllInboxIcon sx={iconSize} />;
            case ComplaintStatus.Pending:
                return <PendingIcon sx={iconSize} />;
            case ComplaintStatus.Accepted:
                return <CheckCircleIcon sx={iconSize} />;
            case ComplaintStatus.Rejected:
                return <CancelIcon sx={iconSize} />;
            case ComplaintStatus.RequestedChanges:
                return <EditIcon sx={iconSize} />;
            default:
                return <AllInboxIcon sx={iconSize} />;
        }
    };

    const getTabLabel = (status: ComplaintStatus | undefined) => {
        switch (status) {
            case undefined:
                return `All (${complaintsCount?.All})`;
            case ComplaintStatus.Pending:
                return `Pending (${complaintsCount?.Pending})`;
            case ComplaintStatus.Accepted:
                return `Accepted (${complaintsCount?.Accepted})`;
            case ComplaintStatus.Rejected:
                return `Rejected (${complaintsCount?.Rejected})`;
            case ComplaintStatus.RequestedChanges:
                return `Requested Changes (${complaintsCount?.RequestedChanges})`;
            default:
                return 'All';
        }
    };

    const getTabValue = (status: ComplaintStatus | undefined): string => {
        return status === undefined ? 'all' : status.toString();
    };

    const getStatusFromTabValue = (value: string): ComplaintStatus | undefined => {
        if (value === 'all') return undefined;
        return parseInt(value) as ComplaintStatus;
    };

    const tabs = [
        { status: undefined, label: 'All' },
        { status: ComplaintStatus.Pending, label: 'Pending' },
        { status: ComplaintStatus.Accepted, label: 'Accepted' },
        { status: ComplaintStatus.Rejected, label: 'Rejected' },
        { status: ComplaintStatus.RequestedChanges, label: 'Changes Requested' }
    ];

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <CircularProgress size={50} />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
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
                Complaints Management
            </Typography>

            {/* Overview Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}
                >
                    Overview
                </Typography>
                <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                    <Grid item xs={6} sm={2}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                {complaintsCount?.All}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Total Complaints
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                                {complaintsCount?.Pending}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Pending
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                                {complaintsCount?.Accepted}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Accepted
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: 'error.main' }}>
                                {complaintsCount?.Rejected}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Rejected
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: 'info.main' }}>
                                {complaintsCount?.RequestedChanges}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Changes Requested
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Results Section with Compact Tabs */}
            <Paper elevation={2} sx={{ borderRadius: 2 }}>
                {/* Compact Status Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={getTabValue(activeTab)}
                        onChange={(event, newValue) => handleTabChange(event, getStatusFromTabValue(newValue))}
                        aria-label="complaint status tabs"
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            minHeight: 48,
                            '& .MuiTabs-indicator': {
                                height: 2,
                            },
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                minHeight: 48,
                                px: 2,
                                py: 1
                            }
                        }}
                    >
                        {tabs.map((tab, index) => (
                            <Tab
                                key={getTabValue(tab.status)}
                                value={getTabValue(tab.status)}
                                icon={getTabIcon(tab.status)}
                                iconPosition="start"
                                label={getTabLabel(tab.status)}
                                sx={{
                                    '&.Mui-selected': {
                                        fontWeight: 600,
                                        color: tab.status === ComplaintStatus.Pending ? 'warning.main' :
                                            tab.status === ComplaintStatus.Accepted ? 'success.main' :
                                                tab.status === ComplaintStatus.Rejected ? 'error.main' :
                                                    tab.status === ComplaintStatus.RequestedChanges ? 'info.main' :
                                                        'primary.main'
                                    }
                                }}
                            />
                        ))}
                    </Tabs>
                </Box>

                {/* Tab Content */}
                <Box sx={{ p: 3 }}>
                    {/* Results Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {getTabLabel(activeTab).split(' (')[0]} Complaints
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Showing {complaints.length} of {totalCount} results
                        </Typography>
                    </Box>

                    {complaints.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <ReportProblemIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                            <Typography
                                variant="h6"
                                sx={{ color: 'text.secondary', fontWeight: 500 }}
                            >
                                No {activeTab === undefined ? '' : getTabLabel(activeTab).split(' (')[0].toLowerCase()} complaints found
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                {activeTab === undefined
                                    ? 'All complaints will appear here when submitted'
                                    : `${getTabLabel(activeTab).split(' (')[0]} complaints will appear here`
                                }
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <Grid container spacing={3}>
                                {complaints.map((complaint) => (
                                    <ComplaintCard key={complaint.id} complaint={complaint} />
                                ))}
                            </Grid>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <>
                                    <Divider sx={{ my: 4 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Pagination
                                            count={totalPages}
                                            page={currentPage}
                                            onChange={handlePageChange}
                                            color="primary"
                                            size="large"
                                            showFirstButton
                                            showLastButton
                                            sx={{
                                                '& .MuiPaginationItem-root': {
                                                    borderRadius: 2,
                                                }
                                            }}
                                        />
                                    </Box>
                                </>
                            )}
                        </>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default ComplaintsList;