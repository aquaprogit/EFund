import { Box, Container, Paper, Typography, useTheme } from "@mui/material";
import PageWrapper from "../../../shared/components/PageWrapper";

const rules = [
    {
        title: "Fraudulent Activity",
        items: [
            "Using fake or stolen identities for fundraising",
            "Making false claims about illnesses or medical conditions",
            "Misusing or misappropriating donated funds",
            "Providing false documentation or verification materials",
            "Creating misleading or deceptive campaign content"
        ]
    },
    {
        title: "Hate Speech and Extremism",
        items: [
            "Content promoting religious discrimination or intolerance",
            "Materials supporting or promoting terrorism",
            "Discriminatory content targeting any protected group",
            "Extremist ideologies or propaganda",
            "Incitement to violence or hatred"
        ]
    },
    {
        title: "Harassment and Abuse",
        items: [
            "Bullying or intimidating behavior",
            "Stalking or persistent unwanted contact",
            "Personal attacks or targeted harassment",
            "Threatening or aggressive communication",
            "Coordinated harassment campaigns"
        ]
    },
    {
        title: "Content and Media Guidelines",
        items: [
            "No pornographic or sexually explicit content",
            "No graphic violence or gore",
            "No disturbing or offensive imagery",
            "No misleading or manipulated media",
            "Content must be appropriate for general audiences"
        ]
    },
    {
        title: "Misinformation and False Claims",
        items: [
            "False or unverified medical claims",
            "Fabricated emergency situations",
            "Deliberately misleading campaign information",
            "Unsubstantiated financial claims",
            "Spreading harmful misinformation"
        ]
    },
    {
        title: "Privacy and Data Protection",
        items: [
            "No sharing of personal information without consent",
            "Protection of donor privacy and data",
            "Respect for confidential information",
            "Secure handling of sensitive data",
            "Compliance with data protection regulations"
        ]
    },
    {
        title: "Platform Usage Rules",
        items: [
            "No spamming or excessive posting",
            "No submission of false reports",
            "No creation of multiple accounts",
            "No manipulation of platform features",
            "No automated or bot activity"
        ]
    },
    {
        title: "Legal Compliance",
        items: [
            "No fundraising for weapons or arms",
            "No campaigns involving drugs or contraband",
            "No support for criminal activities",
            "No fundraising for sanctioned individuals",
            "No support for organizations under EU sanctions"
        ]
    }
];

export const RulesPage = () => {
    const theme = useTheme();

    return (
        <PageWrapper>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 4 },
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Typography
                        variant="h3"
                        component="h1"
                        textAlign="center"
                        sx={{
                            mb: 4,
                            fontWeight: 700,
                            color: theme.palette.primary.main
                        }}
                    >
                        Platform Rules & Guidelines
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 6, textAlign: 'center' }}
                    >
                        To maintain trust and safety in our community, all fundraising campaigns must comply with these guidelines.
                        Violation of these rules may result in immediate campaign termination, account suspension, and potential legal action.
                    </Typography>

                    {rules.map((section, index) => (
                        <Box key={section.title} sx={{ mb: 5, '&:last-child': { mb: 0 } }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 2,
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                                    pb: 1
                                }}
                            >
                                {section.title}
                            </Typography>
                            <Box component="ul" sx={{
                                pl: 3,
                                '& li': {
                                    mb: 1,
                                    color: theme.palette.text.secondary,
                                    '&::marker': {
                                        color: theme.palette.primary.main
                                    }
                                }
                            }}>
                                {section.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>
                                        <Typography variant="body1">
                                            {item}
                                        </Typography>
                                    </li>
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Paper>
            </Container>
        </PageWrapper>
    );
};

export default RulesPage; 