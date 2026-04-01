"use client"

import { ReactNode } from 'react';
import { toastStore } from '@/src/lib/toast-store';
import { Button } from '@/src/components/ui/Button'

import { InfoIcon, SuccessIcon, AlertIcon, DangerIcon  } from '@/src/components/icons/solid/';
import { XIcon } from '@/src/components/icons/outline/';

interface ToastProps {
    id: string;
    title: string;
    message?: string;
    variant?: 'success' | 'danger' | 'warning' | 'info';
    icon?: ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const defaultIcons = {
    success: (
        <span className="text-success-fg"> 
            <SuccessIcon size={24}/>
        </span>
    ),
    danger: (
        <span className="text-danger-fg"> 
            <DangerIcon size={24}/>
        </span>
    ),
    warning: (
        <span className="text-alert-fg"> 
            <AlertIcon size={24}/>
        </span>
    ),
    info: (
        <span className="text-default-fg"> 
            <InfoIcon size={24}/>
        </span>
    ),
};

export function Toast({ id, title, message, variant = 'info', icon, action }: ToastProps) {

    const styles = {
        success: 'bg-card border-success-fg text-default-fg',
        danger: 'bg-card border-danger-fg text-default-fg',
        warning: 'bg-card border-alert-fg text-default-fg',
        info: 'bg-card border-default-border text-default-fg',
    };

    return (
        <div className={`w-full p-4 border rounded-md flex gap-4 ${styles[variant]}`}>
            <div className="flex items-center">
                {icon || defaultIcons[variant]}
            </div>

            <div className="flex flex-col w-full gap-1 justify-center">
                <div className="flex justify-between items-center">
                    <h1 className="font-medium text-sm text-default-fg">{title}</h1>
                    <button 
                        onClick={() => toastStore.dismiss(id)}
                        className="text-muted-fg hover:text-default-fg cursor-pointer transition-colors focus:outline-none"
                        aria-label="Fechar Toast"
                    >
                       <XIcon size={20} />
                    </button>
                </div>

                
                {message && 
                    <p className="text-sm text-muted-fg">{message}</p>
                }

                {action && (
                    <div className="flex w-full">
                        <Button 
                            onClick={() => {
                                action.onClick();
                                toastStore.dismiss(id); 
                            }}
                            size="sm"
                            variant="default"
                        >
                            {action.label}
                        </Button>
                    </div>
                )}
            </div>

        </div>
    );
}