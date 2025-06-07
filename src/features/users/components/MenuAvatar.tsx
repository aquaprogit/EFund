import Logout from "@mui/icons-material/Logout";
import AddIcon from '@mui/icons-material/Add';
import Person2Icon from '@mui/icons-material/Person2';
import { Avatar, Divider, ListItemIcon, Menu, MenuItem, Typography, Box, useTheme, Badge } from '@mui/material';
import { useState } from "react";
import { stringAvatar } from "../../../shared/services/convert";
import { useUser } from "../../../contexts/UserContext";
import { CallToAction } from "@mui/icons-material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EmailIcon from '@mui/icons-material/Email';
import ReportIcon from '@mui/icons-material/Report';

interface MenuAvatarProps {
    onSignOut: () => void;
    onSettings: () => void;
    onProfile: () => void;
    onAdd: () => void;
    onMyFundraising: () => void;
    onUsers: () => void;
    onInviteUser: () => void;
    onComplaints: () => void;
    complaintsCount: number;
}

const MenuAvatar = (props: MenuAvatarProps) => {
    const { user } = useUser();
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    console.log(props.complaintsCount);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
                variant="subtitle1"
                sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 500
                }}
            >
                {user?.name}
            </Typography>
            <Avatar
                onClick={handleClick}
                {...stringAvatar(user?.name)}
                src={user?.avatarUrl ?? undefined}
                sx={{
                    cursor: 'pointer',
                    width: 40,
                    height: 40,
                    border: `2px solid ${theme.palette.primary.main}`,
                    '&:hover': {
                        borderColor: theme.palette.primary.dark
                    }
                }}
            />
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        width: 220,
                        overflow: 'visible',
                        mt: 1.5,
                        '& .MuiMenuItem-root': {
                            px: 2,
                            py: 1.5,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover
                            }
                        },
                        '& .MuiListItemIcon-root': {
                            color: theme.palette.primary.main,
                            minWidth: 36
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={props.onProfile}>
                    <ListItemIcon>
                        <Person2Icon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2">Profile</Typography>
                </MenuItem>
                {!user?.isAdmin && (
                    <>
                        <Divider />
                        <MenuItem onClick={props.onAdd}>
                            <ListItemIcon>
                                <AddIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="body2">Add fundraising</Typography>
                        </MenuItem>
                        <MenuItem onClick={props.onMyFundraising}>
                            <ListItemIcon>
                                <CallToAction fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="body2">My fundraising</Typography>
                        </MenuItem>
                    </>
                )}
                {user?.isAdmin && (
                    <>
                        <Divider />
                        <MenuItem onClick={props.onUsers}>
                            <ListItemIcon>
                                <PeopleAltIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="body2">Users</Typography>
                        </MenuItem>
                        <MenuItem onClick={props.onInviteUser}>
                            <ListItemIcon>
                                <EmailIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="body2">Invite admin</Typography>
                        </MenuItem>
                        <MenuItem onClick={props.onComplaints}>
                            <ListItemIcon>
                                <Badge badgeContent={props.complaintsCount} variant='standard' color="error">
                                    <ReportIcon fontSize="small" />
                                </Badge>
                            </ListItemIcon>
                            <Typography variant="body2">Complaints</Typography>
                        </MenuItem>
                    </>
                )}
                <Divider />
                <MenuItem onClick={props.onSignOut}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2">Logout</Typography>
                </MenuItem>
            </Menu>
        </Box>
    );
}

export default MenuAvatar;