import { Box, Button, Typography } from "@mui/material";
import { ProfileSection } from "./ProfileSection";
import User from "../../models/User";
import { EditableInfoField } from "./EditableInfoField";

interface PersonalDataSectionProps {
    name: string;
    email: string;
    description: string | null;
    expanded: string | false;
    onChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
    onRefresh: () => Promise<User | null>;
    onOpenEmailDialog: () => void;
}

export const PersonalDataSection = ({
    name,
    email,
    description,
    expanded,
    onChange,
    onRefresh,
    onOpenEmailDialog
}: PersonalDataSectionProps) => {
    return (
        <ProfileSection
            id="personal-data"
            title="Personal Data"
            subtitle="Manage your personal information"
            expanded={expanded}
            onChange={onChange}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <EditableInfoField
                    label="Name"
                    value={name}
                    fieldName="name"
                    placeholder="Enter your name"
                    onRefresh={onRefresh}
                />

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'center',
                }}>
                    <Typography variant="body1">Email:</Typography>
                    <Typography variant="body1">{email}</Typography>
                    <Button size="small" onClick={onOpenEmailDialog}>
                        Change Email
                    </Button>
                </Box>

                <EditableInfoField
                    label="Description"
                    value={description || ''}
                    fieldName="description"
                    multiline
                    rows={4}
                    placeholder="Tell us about yourself..."
                    onRefresh={onRefresh}
                />
            </Box>
        </ProfileSection>
    );
}; 