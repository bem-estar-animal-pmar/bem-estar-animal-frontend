"use client";

import { useState, useEffect } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/translation-map";

import { Button, Input } from "@/src/components/ui";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";

import type { Pet } from "@/src/constants/interfaces";
import { GarbageIcon, PhotoUploadIcon } from "../../icons/outline";

interface UpdatePetPhotoFormProps {
    pet: Pet;
    onSuccess: () => void;
}

export const UpdatePetPhotoForm = ({ pet, onSuccess }: UpdatePetPhotoFormProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUpdatingImage, setIsUpdatingImage] = useState(false);

    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [selectedFile]);

    const handleUploadImage = async () => {
        if (!selectedFile) return;
        setIsUpdatingImage(true);

        try {
            const formData = new FormData();
            formData.append("image", selectedFile);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/${pet.id}/image`, {
                method: "PATCH",
                body: formData,
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.success("Foto do pet atualizada com sucesso.");
            onSuccess();
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details?.[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro ao enviar imagem", { message: "Tente novamente mais tarde." });
        } finally {
            setIsUpdatingImage(false);
        }
    };

    const handleRemoveImage = async () => {
        setIsUpdatingImage(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/${pet.id}/image`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.success("Foto do pet removida.");
            onSuccess();
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details?.[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro ao remover imagem", { message: "Tente novamente mais tarde." });
        } finally {
            setIsUpdatingImage(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 pt-4">
            <p className="text-sm text-muted-fg">
                Selecione uma nova foto para <strong>{pet.name}</strong>. Formatos aceitos: .jpg, .jpeg, .png, .webp (Máx: 5MB).
            </p>
            
            <div className="flex items-center justify-center py-2">
                {previewUrl ? (
                    <img 
                        src={previewUrl} 
                        alt="Preview da nova foto" 
                        className="w-32 h-32 object-cover rounded-full border-2 border-primary"
                    />
                ) : pet.image ? (
                    <div className="flex flex-col items-center gap-2">
                        <img 
                            src={pet.image} 
                            alt="Foto atual do pet" 
                            className="w-32 h-32 object-cover rounded-full border border-default-border opacity-70"
                        />
                        <span className="text-xs text-muted-fg">Foto atual</span>
                    </div>
                ) : (
                    <div className="w-32 h-32 rounded-full bg-card border border-dashed border-default-border flex items-center justify-center text-xs text-muted-fg text-center p-4">
                        Nenhuma foto selecionada
                    </div>
                )}
            </div>
            
            <Input 
                type="file" 
                accept="image/jpeg, image/jpg, image/png, image/webp" 
                variant="primary"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];

                    if (!file) {
                        return;
                    }

                    const MAX_FILE_SIZE = 5 * 1024 * 1024;

                    if (file.size > MAX_FILE_SIZE) {
                        toast.danger("Erro de validação", {
                            message: `A imagem deve ter no máximo ${MAX_FILE_SIZE / 1024 / 1024}MB`
                        });

                        e.target.value = "";
                        setSelectedFile(null);
                        return;
                    }

                    setSelectedFile(file);
                }}
            />

            <div className="flex justify-end gap-2 pt-2">
                {pet.image && (
                    <Button 
                        variant="outline" 
                        className="text-danger-fg border-danger-accent-border! hover:text-danger-fg! hover:bg-danger!"
                        onClick={handleRemoveImage} 
                        disabled={isUpdatingImage}
                    >
                        {isUpdatingImage && !selectedFile ? 
                            <span className="flex gap-1 items-center">
                                <SpinnerIcon /> Removendo...
                            </span> 
                            : 
                            <span className="flex gap-1 items-center">
                                <GarbageIcon /> Remover
                            </span> 
                        }
                    </Button>
                )}
                <Button 
                    variant="primary"
                    onClick={handleUploadImage} 
                    disabled={!selectedFile || isUpdatingImage}
                >
                    {isUpdatingImage && selectedFile ? 
                        <span className="flex gap-1 items-center">
                            <SpinnerIcon /> Salvando...
                        </span> 
                        : 
                        <span className="flex gap-1 items-center">
                            <PhotoUploadIcon /> Enviar
                        </span> 
                    }
                </Button>
            </div>
        </div>
    );
};