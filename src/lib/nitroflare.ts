/**
 * Nitroflare File Upload Service
 * Uploads files to Nitroflare cloud storage
 */

const NITROFLARE_API_KEY = process.env.NITROFLARE_API_KEY || ''
const NITROFLARE_UPLOAD_URL = 'http://nitroflare.com/plugins/fileupload/getServer'

export interface NitroflareUploadResult {
    success: boolean
    url?: string
    fileName?: string
    error?: string
}

/**
 * Upload a file to Nitroflare
 * @param file - File buffer or base64 string
 * @param fileName - Name for the uploaded file
 * @returns Upload result with file URL
 */
export async function uploadToNitroflare(
    file: Buffer | string,
    fileName: string
): Promise<NitroflareUploadResult> {
    try {
        if (!NITROFLARE_API_KEY) {
            return {
                success: false,
                error: 'Nitroflare API key not configured'
            }
        }

        // Step 1: Get upload server
        const serverResponse = await fetch(NITROFLARE_UPLOAD_URL)
        const serverData = await serverResponse.json()

        if (!serverData.result || !serverData.result.url) {
            return {
                success: false,
                error: 'Failed to get upload server'
            }
        }

        const uploadUrl = serverData.result.url

        // Step 2: Prepare file for upload
        const formData = new FormData()

        // Convert buffer or base64 to Blob
        let fileBlob: Blob
        if (Buffer.isBuffer(file)) {
            fileBlob = new Blob([file as any])
        } else {
            // Assume base64 string
            const base64Data = file.replace(/^data:image\/\w+;base64,/, '')
            const binaryData = Buffer.from(base64Data, 'base64')
            fileBlob = new Blob([binaryData as any])
        }

        formData.append('files', fileBlob, fileName)
        formData.append('user', NITROFLARE_API_KEY)

        // Step 3: Upload file
        const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        })

        const uploadData = await uploadResponse.json()

        if (uploadData.result && uploadData.result.files && uploadData.result.files.length > 0) {
            const uploadedFile = uploadData.result.files[0]
            return {
                success: true,
                url: uploadedFile.url,
                fileName: uploadedFile.name
            }
        }

        return {
            success: false,
            error: 'Upload failed - no file returned'
        }

    } catch (error) {
        console.error('Nitroflare upload error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

/**
 * Upload image from URL to Nitroflare
 * @param imageUrl - URL of the image to upload
 * @param fileName - Name for the uploaded file
 */
export async function uploadImageFromUrl(
    imageUrl: string,
    fileName: string
): Promise<NitroflareUploadResult> {
    try {
        // Download image
        const response = await fetch(imageUrl)
        const buffer = Buffer.from(await response.arrayBuffer())

        // Upload to Nitroflare
        return await uploadToNitroflare(buffer, fileName)
    } catch (error) {
        console.error('Error uploading image from URL:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to download image'
        }
    }
}
