import { ReactNode } from 'react';

/* props used at toast calling methods for user experience */
export interface ToastOptions {
    message?: string;
    action?: { label: string; onClick: () => void };
    icon?: ReactNode; 
}

/* needed props for toast component to exist */
export interface ToastData extends ToastOptions {
    id: string;
    title: string;
    variant: 'success' | 'danger' | 'warning' | 'info';
}

/* array of current active toasts */
let toasts: ToastData[] = [];

/* array of their timeout close listener for cleaning up after dismiss */
let listeners: Array<() => void> = [];

/* function to generate random ids */
const randomizeId = () => 'toast-' + Math.random().toString(36).slice(2, 8);

export const toastStore = {
	getSnapshot: () => toasts,

	subscribe: (listener: () => void) => {
		listeners.push(listener);
		return () => { listeners = listeners.filter((l) => l !== listener); };
	},
	
	add: (data: ToastData) => {
		toasts = [{ ...data }, ...toasts]; 
		listeners.forEach((l) => l());
		setTimeout(() => toastStore.dismiss(data.id), 4000);
	},
	
	dismiss: (id: string) => {
		toasts = toasts.filter((t) => t.id !== id);
		listeners.forEach((l) => l());
	},
};

export const toast = {
	success: (title: string, options?: ToastOptions) => toastStore.add({ id: randomizeId(), title, variant: 'success', ...options }),
	danger: (title: string, options?: ToastOptions) => toastStore.add({ id: randomizeId(), title, variant: 'danger', ...options }),
	warning: (title: string, options?: ToastOptions) => toastStore.add({ id: randomizeId(), title, variant: 'warning', ...options }),
	info: (title: string, options?: ToastOptions) => toastStore.add({ id: randomizeId(), title, variant: 'info', ...options }),
};

/* usage example:

	const callToast = () => {
		toast.warning("Alerta!", {
			message: "DASD",
			action: {
				label: "aa", 
				onClick: () => { console.log("A"); } // Added "onClick:" here
			},
			icon: <GoogleIcon/>
		});
	}
*/