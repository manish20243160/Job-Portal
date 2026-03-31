export const BASE_URL = "https://job-portal-3s8v.onrender.com";

export const API_PATHS = {
  AUTH: {
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGIN: `${BASE_URL}/api/auth/login`,
    GET_ME: `${BASE_URL}/api/auth/me`,
    UPLOAD_IMAGE: `${BASE_URL}/api/auth/upload-image`,
  },
  USER: {
    GET_PROFILE: `${BASE_URL}/api/user/profile`,
    UPDATE_PROFILE: `${BASE_URL}/api/user/profile`,
    GET_PUBLIC_PROFILE: (id) => `${BASE_URL}/api/user/public/${id}`,
    DELETE_RESUME: `${BASE_URL}/api/user/profile/resume`,
  },
  JOBS: {
    GET_ALL: `${BASE_URL}/api/jobs`,
    GET_BY_ID: (id) => `${BASE_URL}/api/jobs/${id}`,
    GET_MY_JOBS: `${BASE_URL}/api/jobs/my-jobs`,
    CREATE: `${BASE_URL}/api/jobs`,
    UPDATE: (id) => `${BASE_URL}/api/jobs/${id}`,
    DELETE: (id) => `${BASE_URL}/api/jobs/${id}`,
    TOGGLE_STATUS: (id) => `${BASE_URL}/api/jobs/${id}/toggle-status`,
  },
  APPLICATIONS: {
    APPLY: (jobId) => `${BASE_URL}/api/applications/${jobId}/apply`,
    MY_APPLICATIONS: `${BASE_URL}/api/applications/my-applications`,
    EMPLOYER_APPLICATIONS: `${BASE_URL}/api/applications/employer-applications`,
    GET_BY_ID: (id) => `${BASE_URL}/api/applications/detail/${id}`,
    JOB_APPLICATIONS: (jobId) => `${BASE_URL}/api/applications/${jobId}`,
    UPDATE_STATUS: (id) => `${BASE_URL}/api/applications/${id}/status`,
  },
  SAVED_JOBS: {
    GET_ALL: `${BASE_URL}/api/saved-jobs`,
    SAVE: (jobId) => `${BASE_URL}/api/saved-jobs/${jobId}`,
    UNSAVE: (jobId) => `${BASE_URL}/api/saved-jobs/${jobId}`,
  },
  ANALYTICS: {
    EMPLOYER: `${BASE_URL}/api/analytics/employer`,
    JOBSEEKER: `${BASE_URL}/api/analytics/jobseeker`,
  },
};
