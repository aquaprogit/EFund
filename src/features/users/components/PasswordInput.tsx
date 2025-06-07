import React from 'react';
import TextField from "@mui/material/TextField";
import { InputAdornment } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { UseFormRegisterReturn } from 'react-hook-form';

type PasswordInputProps = {
    register: UseFormRegisterReturn;
    placeholder: string;
    error: any;
    label?: string;
};

const PasswordInput: React.FC<PasswordInputProps> = ({
    register,
    placeholder,
    error,
    label
}) => {
    const [isVisible, setIsVisible] = React.useState(false);

    const handleClickShowPassword = () => {
        setIsVisible((prevState) => !prevState);
    };

    const inputProps = {
        endAdornment: (
            <InputAdornment position="end">
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                    size="small"
                >
                    {isVisible ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </InputAdornment>
        ),
    };

    return (
        <TextField
            type={isVisible ? 'text' : 'password'}
            required={true}
            label={label || placeholder}
            placeholder={placeholder}
            variant="outlined"
            fullWidth
            InputProps={inputProps}
            error={!!error}
            helperText={error?.message}
            {...register}
        />
    );
};

export default PasswordInput;
