import axios from 'axios';
import type { AxiosError } from 'axios';

import type { ApiError } from '@remindme/contracts/common/errors';

export class ApiClientError extends Error {
    constructor(
        message: string,
        public readonly statusCode?: number,
        public readonly code?: string,
        public readonly messageKey?: string,
        public readonly fieldErrors?: Array<{ field: string; message: string }>,
    ) {
        super(message);
        this.name = 'ApiClientError';
    }
}

function normalizeError(error: unknown): ApiClientError {
    if (error instanceof ApiClientError) {
        return error;
    }

    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;
        const data = axiosError.response?.data;

        if (data?.message) {
            return new ApiClientError(data.message, axiosError.response?.status, data.code, data.messageKey, data.errors);
        }

        return new ApiClientError(axiosError.message || 'Request failed', axiosError.response?.status);
    }

    if (error instanceof Error) {
        return new ApiClientError(error.message);
    }

    return new ApiClientError('Something went wrong');
}

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

/** Client IANA timezone, sent as `X-Timezone`. */
export const CLIENT_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        // Lets the API bucket Player Done/Skip into the user's local day (daily activity chart)
        'X-Timezone': CLIENT_TIME_ZONE,
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(normalizeError(error)),
);
