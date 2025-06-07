import { Box, FormHelperText, TextField, Typography } from "@mui/material";

interface LimitedTextFieldProps {
    maxChar: number;
    maxRows?: number;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    multiline?: boolean;
    label?: string;
    fullWidth?: boolean;
    error?: boolean;
    helperText?: string;
}

const LimitedTextField = (props: LimitedTextFieldProps) => {
    const { value, onChange } = props;
    const limitReached = value.length === props.maxChar;

    const handleChange = (value: string) => {
        if (value.length <= props.maxChar) {
            onChange(value);
        }
    }

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '10px',
                width: '100%',
            }}>
                <TextField
                    maxRows={props.maxRows}
                    label={props.label}
                    placeholder={props.placeholder}
                    fullWidth={props.fullWidth}
                    multiline={props.multiline}
                    value={value}
                    error={props.error}
                    onChange={(e) => handleChange(e.target.value)}
                    variant="standard"
                    size="small" />
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'space-between', width: '100%', position: 'relative' }}>
                    {props.error && (
                        <FormHelperText sx={{ color: 'error.main', alignSelf: 'flex-start', marginTop: '-10px' }} error>{props.helperText}</FormHelperText>
                    )}
                    <Typography sx={{ position: 'absolute', right: 0, top: 0 }} variant="caption" color={limitReached ? 'text.primary' : 'text.secondary'} align="right">
                        {value.length}/{props.maxChar}
                    </Typography>
                </Box>
            </Box>

        </Box>
    );
};

export default LimitedTextField;