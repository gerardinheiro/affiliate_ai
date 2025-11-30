"use client"

import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Upload, X, FileImage, Loader2 } from "lucide-react"
import { uploadToNitroflare } from "@/lib/nitroflare"

interface UploadDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onUploadComplete?: () => void
}

interface FileWithPreview {
    file: File
    preview: string
    progress: number
    status: 'pending' | 'uploading' | 'success' | 'error'
    error?: string
}

export function UploadDialog({ open, onOpenChange, onUploadComplete }: UploadDialogProps) {
    const [files, setFiles] = useState<FileWithPreview[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const droppedFiles = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith('image/')
        )

        addFiles(droppedFiles)
    }, [])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files)
            addFiles(selectedFiles)
        }
    }

    const addFiles = (newFiles: File[]) => {
        const filesWithPreview: FileWithPreview[] = newFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            status: 'pending'
        }))

        setFiles(prev => [...prev, ...filesWithPreview])
    }

    const removeFile = (index: number) => {
        setFiles(prev => {
            const newFiles = [...prev]
            URL.revokeObjectURL(newFiles[index].preview)
            newFiles.splice(index, 1)
            return newFiles
        })
    }

    const uploadFiles = async () => {
        setIsUploading(true)

        for (let i = 0; i < files.length; i++) {
            if (files[i].status !== 'pending') continue

            // Update status to uploading
            setFiles(prev => {
                const newFiles = [...prev]
                newFiles[i].status = 'uploading'
                return newFiles
            })

            try {
                // Try to upload to Nitroflare (optional)
                const buffer = await files[i].file.arrayBuffer()
                const fileBuffer = Buffer.from(buffer)
                const nitroflareResult = await uploadToNitroflare(fileBuffer, files[i].file.name)

                // Create FormData for file upload
                const formData = new FormData()
                formData.append('file', files[i].file)
                if (nitroflareResult.url) {
                    formData.append('nitroflareUrl', nitroflareResult.url)
                }

                // Save to database with file upload
                const response = await fetch('/api/nitroflare/upload', {
                    method: 'POST',
                    body: formData // Send as FormData instead of JSON
                })

                if (response.ok) {
                    setFiles(prev => {
                        const newFiles = [...prev]
                        newFiles[i].status = 'success'
                        newFiles[i].progress = 100
                        return newFiles
                    })
                } else {
                    const errorData = await response.json().catch(() => ({}))
                    throw new Error(errorData.error || 'Failed to save to database')
                }
            } catch (error) {
                console.error('Upload error:', error)
                setFiles(prev => {
                    const newFiles = [...prev]
                    newFiles[i].status = 'error'
                    newFiles[i].error = error instanceof Error ? error.message : 'Upload failed'
                    return newFiles
                })
            }
        }

        setIsUploading(false)

        // Check if all uploads were successful
        const allSuccess = files.every(f => f.status === 'success')
        if (allSuccess && onUploadComplete) {
            onUploadComplete()
            onOpenChange(false)
            setFiles([])
        }
    }

    const handleClose = () => {
        if (!isUploading) {
            files.forEach(f => URL.revokeObjectURL(f.preview))
            setFiles([])
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] bg-black border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-white">Upload de Arquivos</DialogTitle>
                    <DialogDescription>
                        Faça upload de imagens para sua galeria Nitroflare
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Drop Zone */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                            ? 'border-indigo-500 bg-indigo-500/10'
                            : 'border-white/20 hover:border-white/40'
                            }`}
                    >
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-white mb-2">Arraste arquivos aqui ou clique para selecionar</p>
                        <p className="text-sm text-gray-400 mb-4">Suporta: JPG, PNG, GIF, WebP</p>
                        <Label htmlFor="file-upload">
                            <div className="inline-flex items-center px-4 py-2 bg-indigo-500/10 border border-indigo-500/50 text-indigo-400 rounded-md hover:bg-indigo-500/20 transition-colors cursor-pointer">
                                Selecionar Arquivos
                            </div>
                        </Label>
                        <Input
                            id="file-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelect}
                            disabled={isUploading}
                        />
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {files.map((fileItem, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                                >
                                    <img
                                        src={fileItem.preview}
                                        alt={fileItem.file.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">{fileItem.file.name}</p>
                                        <p className="text-xs text-gray-400">
                                            {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        {fileItem.status === 'uploading' && (
                                            <Progress value={fileItem.progress} className="mt-1" />
                                        )}
                                        {fileItem.status === 'error' && (
                                            <p className="text-xs text-red-400 mt-1">{fileItem.error}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {fileItem.status === 'success' && (
                                            <div className="text-green-400">✓</div>
                                        )}
                                        {fileItem.status === 'uploading' && (
                                            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                                        )}
                                        {fileItem.status === 'error' && (
                                            <div className="text-red-400">✗</div>
                                        )}
                                        {!isUploading && fileItem.status === 'pending' && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeFile(index)}
                                                className="h-8 w-8 p-0"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isUploading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={uploadFiles}
                        disabled={files.length === 0 || isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            `Enviar ${files.length} ${files.length === 1 ? 'arquivo' : 'arquivos'}`
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
