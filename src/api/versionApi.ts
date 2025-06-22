import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { VERSION_CHECK_CONFIG } from '../config/version';

export interface VersionInfo {
    version: string;
}

export const checkVersion = async (): Promise<VersionInfo> => {
    try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}${VERSION_CHECK_CONFIG.ENDPOINT}`, {
            timeout: API_CONFIG.TIMEOUT,
            headers: API_CONFIG.DEFAULT_HEADERS,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to check version:', error);
        throw error;
    }
}; 