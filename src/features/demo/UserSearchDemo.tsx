import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Alert, Card, CardContent } from '@mui/material';
import UserSearchDropdown from '../users/components/UserSearchDropdown';
import { UserDetails } from '../users/models/UserDetails';

const UserSearchDemo: React.FC = () => {
    const [selectedUser1, setSelectedUser1] = useState<UserDetails | null>(null);
    const [selectedUser2, setSelectedUser2] = useState<UserDetails | null>(null);
    const [selectedUser3, setSelectedUser3] = useState<UserDetails | null>(null);

    return (
        <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
                User Search Dropdown Demo
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                Search and select users with autocomplete functionality
            </Typography>

            {/* Basic Usage */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Basic Usage
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <UserSearchDropdown
                            selectedUser={selectedUser1}
                            onUserSelect={setSelectedUser1}
                            label="Search Users"
                            placeholder="Type to search..."
                        />
                        {selectedUser1 && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                Selected: <strong>{selectedUser1.name}</strong> ({selectedUser1.email})
                            </Alert>
                        )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <UserSearchDropdown
                            selectedUser={selectedUser2}
                            onUserSelect={setSelectedUser2}
                            label="Assign User"
                            placeholder="Search by name or email..."
                            size="small"
                        />
                        {selectedUser2 && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Selected: <strong>{selectedUser2.name}</strong>
                            </Alert>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            {/* Form Integration */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Form Integration Example
                </Typography>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>Create New Task</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <UserSearchDropdown
                                    selectedUser={selectedUser3}
                                    onUserSelect={setSelectedUser3}
                                    label="Assign to User"
                                    placeholder="Search team members..."
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{
                                    p: 2,
                                    border: '1px dashed',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    bgcolor: 'background.default'
                                }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Other form fields would go here...
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        {selectedUser3 && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                Task will be assigned to: <strong>{selectedUser3.name}</strong>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </Paper>

            {/* Feature List */}
            <Paper elevation={1} sx={{ p: 3, borderRadius: 3, bgcolor: 'primary.50' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Component Features
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    • <strong>Search on Type:</strong> Only searches when user enters text (not on dropdown open)
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    • <strong>Debounced Search:</strong> 300ms delay to prevent excessive API calls
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    • <strong>Rich Display:</strong> Shows user avatar, name, email, and badges
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    • <strong>Loading States:</strong> Visual feedback during search operations
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    • <strong>Customizable:</strong> Flexible props for different use cases
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    • <strong>Form Ready:</strong> Supports validation, sizing, and accessibility
                </Typography>
                <Typography variant="body2">
                    • <strong>Error Handling:</strong> Gracefully handles API failures and empty results
                </Typography>
            </Paper>

            {/* Usage Code Example */}
            <Paper elevation={2} sx={{ p: 3, mt: 4, borderRadius: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Usage Example
                </Typography>
                <Box component="pre" sx={{
                    bgcolor: 'background.paper',
                    p: 2,
                    borderRadius: 1,
                    overflow: 'auto',
                    fontSize: '0.875rem'
                }}>
                    {`import UserSearchDropdown from '../components/UserSearchDropdown';

const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);

<UserSearchDropdown
    selectedUser={selectedUser}
    onUserSelect={setSelectedUser}
    label="Search Users"
    placeholder="Type to search..."
    required
    size="medium"
/>`}
                </Box>
            </Paper>
        </Box>
    );
};

export default UserSearchDemo; 