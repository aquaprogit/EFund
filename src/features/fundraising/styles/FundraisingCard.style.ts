import { Theme } from '@mui/material';

export const getFundraisingCardStyles = (theme: Theme) => ({
    card: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[4],
        }
    },
    cardMedia: {
        objectFit: 'cover',
    },
    cardContent: {
        p: 3,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    menuContainer: {
        position: 'absolute',
        right: 0,
        top: -1
    },
    title: {
        fontWeight: 600,
        mb: 1,
        color: theme.palette.text.primary,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    description: {
        mb: 2,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        flexGrow: 1
    },
    tagsContainer: {
        mb: 2,
        flexWrap: 'wrap',
        gap: 1
    },
    tag: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
        fontWeight: 500,
        fontSize: '0.75rem'
    },
    progressContainer: {
        mt: 'auto'
    },
    progressBar: {
        height: 8,
        borderRadius: 1,
        backgroundColor: theme.palette.action.hover,
        mb: 1,
        '& .MuiLinearProgress-bar': {
            borderRadius: 1,
        }
    },
    progressValues: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    supportButton: {
        py: 1,
        textTransform: 'none',
        fontWeight: 600
    },
    supportLink: {
        textDecoration: 'none',
        width: '100%'
    },
    supportButtonContainer: {
        mt: 2,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 1
    },
    detailsButton: {
        py: 1,
        textTransform: 'none',
        fontWeight: 600
    },
    detailsLink: {
        textDecoration: 'none',
        width: '100%'
    }
}); 