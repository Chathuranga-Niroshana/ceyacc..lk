import axios from 'axios'
const cloudName = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET_FOR_LOGOS;
const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

const cloudinaryInstance = async (file, setUploadProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset);

    try {
        const response = await axios.post(cloudinaryUploadUrl, formData, {
            onUploadProgress: (progressEvent) => {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setUploadProgress(progress)
            },
        },
        )
        return response.data.secure_url
    } catch (error) {
        return null
    }
}

export default cloudinaryInstance