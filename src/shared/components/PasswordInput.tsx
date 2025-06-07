import { IconButton, InputAdornment, TextField, TextFieldProps } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface PasswordInputProps extends Omit<TextFieldProps, 'type'> {
    registration?: UseFormRegisterReturn;
}

const PasswordInput = ({ registration, ...props }: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <TextField
            {...props}
            {...registration}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
                ...props.InputProps,
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label={showPassword ? "hide password" : "show password"}
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="medium"
                            sx={{
                                color: 'text.secondary',
                                '&:hover': {
                                    color: 'text.primary',
                                }
                            }}
                        >
                            {showPassword ? (
                                <Visibility sx={{ fontSize: 20 }} />
                            ) : (
                                <VisibilityOff sx={{ fontSize: 20 }} />
                            )}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                },
                ...props.sx
            }}
        />
    );
};

export default PasswordInput; 