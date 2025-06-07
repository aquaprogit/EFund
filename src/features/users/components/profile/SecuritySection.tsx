import { Box, Button } from "@mui/material";
import { ProfileSection } from "./ProfileSection";

interface SecuritySectionProps {
    hasPassword: boolean;
    expanded: string | false;
    onChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
    onOpenDialog: (dialog: string) => void;
}

export const SecuritySection = ({
    hasPassword,
    expanded,
    onChange,
    onOpenDialog
}: SecuritySectionProps) => {
    return (
        <ProfileSection
            id="security"
            title="Security"
            subtitle="Manage your security settings"
            expanded={expanded}
            onChange={onChange}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'center'
            }}>
                {hasPassword ? (
                    <Button
                        onClick={() => onOpenDialog('changePassword')}
                    >
                        Change Password
                    </Button>
                ) : (
                    <Button
                        onClick={() => onOpenDialog('addPassword')}
                    >
                        Add Password
                    </Button>
                )}
                <Button
                    onClick={() => onOpenDialog('changeEmail')}
                >
                    Change Email
                </Button>
            </Box>
        </ProfileSection>
    );
}; 