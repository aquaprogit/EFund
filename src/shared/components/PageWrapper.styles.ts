import { Theme } from "@mui/material";

export const pageWrapperStyles = {
    header: (theme: Theme) => ({
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: 'sticky' as const,
        top: 0,
        zIndex: 1100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }),

    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2
    },

    logo: (theme: Theme) => ({
        fontWeight: 'bold',
        textDecoration: 'none',
        '&:hover': {
            color: theme.palette.primary.dark
        }
    }),

    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: 3
    },

    searchContainer: {
        position: 'relative' as const,
        flex: 1,
        maxWidth: 400,
        mx: 2
    },

    searchDropdown: (theme: Theme) => ({
        position: 'absolute' as const,
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[4],
        borderRadius: 1,
        zIndex: 1200,
        maxHeight: 300,
        overflow: 'auto'
    }),

    searchResultItem: (theme: Theme) => ({
        p: 1.5,
        cursor: 'pointer',
        borderBottom: `1px solid ${theme.palette.divider}`,
        '&:hover': {
            backgroundColor: theme.palette.action.hover
        },
        '&:last-child': {
            borderBottom: 'none'
        }
    }),

    searchSkeletonItem: (theme: Theme) => ({
        p: 1.5,
        borderBottom: `1px solid ${theme.palette.divider}`,
        '&:last-child': {
            borderBottom: 'none'
        }
    }),

    searchNoResults: (theme: Theme) => ({
        p: 2,
        textAlign: 'center' as const,
        color: theme.palette.text.secondary,
        fontSize: '0.875rem'
    }),

    searchResultTitle: {
        fontSize: '0.875rem',
        fontWeight: 'medium',
        mb: 0.5,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const
    },

    searchResultDescription: (theme: Theme) => ({
        fontSize: '0.75rem',
        color: theme.palette.text.secondary,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const
    }),

    main: {
        flexGrow: 1
    },

    footer: (theme: Theme) => ({
        backgroundColor: theme.palette.grey[100],
        py: 4,
        mt: 'auto'
    }),

    footerText: {
        textAlign: 'center' as const
    },

    dialog: {
        borderRadius: 2,
        p: 2
    },

    dialogTitle: {
        textAlign: 'center' as const
    },

    dialogContent: {
        width: '500px',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: 3,
        p: 4
    }
}; 