import { Box, Card, CardContent, Typography, Stack, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TagIcon from '@mui/icons-material/Tag';
import MultiSelectWithChips from '../../../../shared/components/MultiSelectWithChips';

interface PaymentAndTagsSectionProps {
    formData: {
        monobankJar: string;
        monobankJarId: string;
        selectedTags: string[];
    };
    onFormDataChange: (updates: Partial<PaymentAndTagsSectionProps['formData']>) => void;
    jars: Array<{ id: string; title: string }>;
    existingTags: string[];
    openJarsMenu: HTMLElement | null;
    onJarMenuOpen: (event: React.SyntheticEvent) => void;
    onJarMenuClose: () => void;
    onJarSelect: (jarTitle: string, jarId: string) => void;
}

const PaymentAndTagsSection = ({
    formData,
    onFormDataChange,
    jars,
    existingTags,
    openJarsMenu,
    onJarMenuOpen,
    onJarMenuClose,
    onJarSelect
}: PaymentAndTagsSectionProps) => {
    return (
        <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <AccountBalanceIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Payment & Classification
                    </Typography>
                </Box>

                <Stack spacing={3}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Monobank Jar</InputLabel>
                        <Select
                            value={formData.monobankJar}
                            label="Monobank Jar"
                            onChange={(e) => onFormDataChange({ monobankJar: e.target.value })}
                            open={Boolean(openJarsMenu)}
                            onClose={onJarMenuClose}
                            onOpen={onJarMenuOpen}
                        >
                            {jars.map((jar) => (
                                <MenuItem
                                    key={jar.id}
                                    value={jar.title}
                                    onClick={() => onJarSelect(jar.title, jar.id)}
                                >
                                    {jar.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <TagIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Tags
                            </Typography>
                        </Box>
                        <MultiSelectWithChips
                            freeSolo
                            width="100%"
                            limitTags={5}
                            label="Select or create tags"
                            defaultValues={formData.selectedTags}
                            values={existingTags}
                            onChange={(newTags) => onFormDataChange({ selectedTags: newTags })}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Tags help people find your campaign. You can select existing tags or create new ones.
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default PaymentAndTagsSection; 