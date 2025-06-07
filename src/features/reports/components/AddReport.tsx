import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { AddReportBody, fundraisingsReportsRepository } from "../repository/fundraisingsReportsRepository";
import { useToast } from "../../../contexts/ToastContext";
import LimitedTextField from "../../../shared/components/LimitedTextField";

const AddReport = ({
	onClose,
	fundraisingId,
}: {
	onClose: () => void;
	fundraisingId: string;
}) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [files, setFiles] = useState<Array<File>>([]);
	const { showSuccess, showError } = useToast();
	const createFormData = () => {
		const formData = new FormData();

		files.forEach((file) => {
			formData.append(`files`, file);
		});

		return formData;
	};
	const addReport = async () => {
		try {
			const body: AddReportBody = {
				title,
				description,
				fundraisingId: fundraisingId,
			};
			const response: any = await fundraisingsReportsRepository.addReport(body);
			if (response) {
				if (response.error) {
					showError(response.error.message);
				} else if (response.success) {
					const formData = createFormData();
					const attachaments =
						await fundraisingsReportsRepository.addAttachments(
							response.data.id,
							formData
						);
					if (attachaments!.isSuccess) {
						showSuccess("Report has been added");
						onClose();
					} else if (attachaments!.error) {
						showError(attachaments!.error.message);
					}
				}
			}
		} catch (e: any) {
			showError(e.message);
		}
	};
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: "10px",
				width: "100%",
				padding: "20px 10px",
			}}
		>
			<Typography variant={"h4"}>Adding report</Typography>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					padding: "30px",
					pb: "10px",
					gap: 1,
					width: "100%",
				}}
			>
				<LimitedTextField
					fullWidth
					placeholder="Title"
					value={title}
					onChange={setTitle}
					maxChar={50}
				/>
				<LimitedTextField
					label="Description"
					maxChar={500}
					maxRows={3}
					fullWidth
					value={description}
					onChange={setDescription}
					multiline
				/>
			</Box>
			{/* <FileUpload
                value={files}
                onChange={setFiles}
                maxFiles={4}
                accept={'.jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx'}
                multiple /> */}
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					gap: "10px",
					width: "100%",
					justifyContent: "flex-end",
				}}
			>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					variant="contained"
					onClick={() => {
						addReport();
						onClose();
					}}
				>
					Add
				</Button>
			</Box>
		</Box>
	);
};

export default AddReport;
