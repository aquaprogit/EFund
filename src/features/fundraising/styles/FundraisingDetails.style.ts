import { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent';
import { Theme } from '@mui/material';

export const getFundraisingDetailsStyles = (theme: Theme) => ({
    mainCard: {
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden'
    },
    cardMedia: {
        objectFit: 'cover',
    },
    contentBox: {
        p: 4
    },
    title: {
        fontWeight: 600,
        mb: 2,
        color: theme.palette.text.primary
    },
    tagsStack: {
        mb: 3,
        flexWrap: 'wrap',
        gap: 1
    },
    tag: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
        fontWeight: 500
    },
    metaStack: {
        mb: 3,
        transition: 'none'
    },
    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        transition: 'none',
        '&:hover': {
            transform: 'none !important'
        }
    },
    divider: {
        my: 3
    },
    description: {
        color: theme.palette.text.primary,
        whiteSpace: 'pre-wrap'
    },
    sideCard: {
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        position: 'sticky',
        top: 100
    },
    sideCardContent: {
        p: 3
    },
    progressSection: {
        mb: 3
    },
    amountText: {
        mb: 0.5,
        fontWeight: 600
    },
    goalText: {
        mb: 2
    },
    progressBar: {
        height: 8,
        borderRadius: 1,
        backgroundColor: theme.palette.action.hover,
        mb: 2,
        '& .MuiLinearProgress-bar': {
            borderRadius: 1,
        }
    },
    actionButtons: {
        spacing: 2
    },
    supportLink: {
        textDecoration: 'none'
    },
    button: {
        py: 1.5,
        fontWeight: 600
    },
    additionalInfo: {
        mt: 3
    },
    infoText: {
        mb: 1
    },
    container: {
        py: 4
    },
    reportsSection: {
        mt: 4,
        scrollMarginTop: 100,
        '& .MuiTimeline-root': {
            padding: 0,
            margin: 0,
            [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 0.2
            }
        }
    },
    reportsTitle: {
        fontWeight: 600,
        mb: 3,
        color: theme.palette.text.primary
    },
    timelineCard: {
        p: 2,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
    },
    timelineContent: {
        py: 1,
        px: 2
    },
    timelineDate: {
        color: theme.palette.text.secondary,
        fontSize: '0.875rem',
        mb: 1,
    },
    timelineDot: {
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main
    },
    timelineConnector: {
        backgroundColor: theme.palette.divider
    }
}); 