import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ProfileSectionProps {
    id: string;
    title: string;
    subtitle: string;
    expanded: string | false;
    onChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
    children: React.ReactNode;
}

export const ProfileSection = ({
    id,
    title,
    subtitle,
    expanded,
    onChange,
    children
}: ProfileSectionProps) => {
    return (
        <Accordion expanded={expanded === id} onChange={onChange(id)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${id}-content`}
                id={`${id}-header`}
            >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    {title}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                    {subtitle}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    );
}; 