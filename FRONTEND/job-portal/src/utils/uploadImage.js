import axiosInstance from "./axiosInstance";
import { API_PATHS } from "./apiPaths";

/**
 * Upload an image file to the server and return the URL
 * @param {File} imageFile
 * @returns {Promise<string>} image URL
 */
const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axiosInstance.post(API_PATHS.AUTH.UPLOAD_IMAGE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.imageUrl;
};

export default uploadImage;
