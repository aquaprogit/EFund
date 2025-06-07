import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useCallback,
} from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";

type ToastInfo = {
	message: string;
	severity: AlertColor;
};

type ToastContextType = {
	showToast: (severity: AlertColor, message: string) => void;
	showSuccess: (message: string) => void;
	showError: (message: string) => void;
	showWarning: (message: string) => void;
	showInfo: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
	const [open, setOpen] = useState(false);
	const [info, setInfo] = useState<ToastInfo>({
		message: "",
		severity: "info",
	});

	const showToast = useCallback((severity: AlertColor, message: string) => {
		setInfo({ message, severity });
		setOpen(true);
	}, []);

	const showSuccess = useCallback(
		(message: string) => showToast("success", message),
		[showToast]
	);
	const showError = useCallback(
		(message: string) => showToast("error", message),
		[showToast]
	);
	const showWarning = useCallback(
		(message: string) => showToast("warning", message),
		[showToast]
	);
	const showInfo = useCallback(
		(message: string) => showToast("info", message),
		[showToast]
	);

	const handleClose = (_: unknown, reason?: string) => {
		if (reason !== "clickaway") {
			setOpen(false);
		}
	};

	return (
		<ToastContext.Provider
			value={{ showToast, showSuccess, showError, showWarning, showInfo }}
		>
			{children}
			<Snackbar
				open={open}
				autoHideDuration={3000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
			>
				<Alert
					variant="filled"
					onClose={handleClose}
					severity={info.severity}
					sx={{ width: "100%" }}
				>
					{info.message}
				</Alert>
			</Snackbar>
		</ToastContext.Provider>
	);
};

export const useToast = (): ToastContextType => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}; 