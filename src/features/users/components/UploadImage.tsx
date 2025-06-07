import React from 'react';
import { Avatar, Box, Button, IconButton } from "@mui/material";
import styles from './UploadImage.module.css';
import { UploadImageProps } from './UploadImage.types';


const UploadImage: React.FC<UploadImageProps> = (
    {
        inputFile,
        url,
        handleFileUpload,
        handleDeleteFile,
    }
) => {

    const avatarOverridingStyles = {
        height: '150px',
        width: '150px'
    }
    return (
        <Box className={styles.container}
        >
            <input
                style={{ display: "none" }}
                accept=".jpeg,.png,.jpg"
                ref={inputFile}
                onChange={handleFileUpload}
                type="file"
            />
            <IconButton
                onClick={() => (inputFile?.current as HTMLInputElement | null)?.click()}>
                <Avatar
                    className={styles.profileAvatar}
                    sx={avatarOverridingStyles}
                    src={url}
                    alt="Profile Avatar" />

            </IconButton>
            {!url.includes('Default') && (
                <Button
                    className={styles.deleteAvatarButton}
                    size="small" onClick={handleDeleteFile}>Delete Avatar</Button>
            )}
        </Box>

    );
};

export default UploadImage;