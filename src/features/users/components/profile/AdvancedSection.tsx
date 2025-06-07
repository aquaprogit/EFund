import { Box, Button } from "@mui/material";
import { ProfileSection } from "./ProfileSection";

interface AdvancedSectionProps {
    hasMonobankToken: boolean;
    expanded: string | false;
    onChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
    onOpenDialog: (dialog: string) => void;
}

export const AdvancedSection = ({
    hasMonobankToken,
    expanded,
    onChange,
    onOpenDialog
}: AdvancedSectionProps) => {
    return (
        <ProfileSection
            id="advanced"
            title="Advanced Settings"
            subtitle="Configure advanced features and integrations"
            expanded={expanded}
            onChange={onChange}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    onClick={() => onOpenDialog('linkToken')}
                >
                    {hasMonobankToken ? 'Update Token' : 'Link Token'}
                </Button>
            </Box>
        </ProfileSection>
    );
}; 