'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { uploadImage } from '@/lib/mediaApi';

/**
 * Props for MediaUpload component
 */
type MediaUploadProps = {
    onUploaded: (url: string) => void;
};

/**
 * Upload state type
 */
type UploadState = 'idle' | 'uploading' | 'error';

/**
 * MediaUpload Component
 * Handles file selection, validation, and upload to MinIO storage
 */
export default function MediaUpload({ onUploaded }: MediaUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadState, setUploadState] = useState<UploadState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    /**
     * Handle file selection
     */
    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        // Reset error state
        setError(null);

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            setError('Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.');
            setSelectedFile(null);
            setPreview(null);
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            setError('File size exceeds 5MB limit. Please choose a smaller file.');
            setSelectedFile(null);
            setPreview(null);
            return;
        }

        // Set selected file
        setSelectedFile(file);

        // Generate preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    /**
     * Handle upload button click
     */
    const handleUpload = async () => {
        if (!selectedFile) {
            return;
        }

        try {
            setUploadState('uploading');
            setError(null);

            // Call uploadImage API
            const response = await uploadImage(selectedFile);

            // Reset state
            setUploadState('idle');
            setSelectedFile(null);
            setPreview(null);

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Call onUploaded callback with URL
            onUploaded(response.url);
        } catch (err: any) {
            setUploadState('error');
            setError(err.message || 'Failed to upload image. Please try again.');
        }
    };

    /**
     * Handle clear selection
     */
    const handleClear = () => {
        setSelectedFile(null);
        setPreview(null);
        setError(null);
        setUploadState('idle');

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const isUploading = uploadState === 'uploading';

    return (
        <div className="space-y-4">
            {/* File Input */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    className="hidden"
                    id="file-upload"
                    aria-label="Select image file to upload"
                />
                <label
                    htmlFor="file-upload"
                    className={`cursor-pointer inline-flex flex-col items-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    <svg
                        className="w-12 h-12 text-gray-400 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Click to select an image
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        JPEG, PNG, WebP, or GIF (max 5MB)
                    </span>
                </label>
            </div>

            {/* Preview */}
            {preview && (
                <div className="relative">
                    <img
                        src={preview}
                        alt={`Preview of ${selectedFile?.name || 'selected image'}`}
                        className="w-full h-48 object-contain rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                    {!isUploading && (
                        <button
                            onClick={handleClear}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            aria-label="Clear selection"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                aria-label={isUploading ? 'Uploading image' : 'Upload selected image'}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${!selectedFile || isUploading
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
            >
                {isUploading ? (
                    <span className="flex items-center justify-center">
                        <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Uploading...
                    </span>
                ) : (
                    'Upload Image'
                )}
            </button>
        </div>
    );
}
