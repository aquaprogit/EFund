import React, {ChangeEventHandler, MouseEventHandler} from "react";

export type UploadImageProps = {
    inputFile: React.MutableRefObject<any> | null,
    handleFileUpload: ChangeEventHandler,
    handleDeleteFile: MouseEventHandler,
    url: string,
}