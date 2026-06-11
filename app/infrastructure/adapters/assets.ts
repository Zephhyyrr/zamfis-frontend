import { useRuntimeConfig } from '#app';
export const resolveAssetUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
        return path;
    }

    const config = useRuntimeConfig();
    let baseUrl = config.public.apiBaseUrl || 'http://localhost:3000';
    // Remove trailing slash if exists
    if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
    }
    // Remove /api if exists at the end
    if (baseUrl.endsWith('/api')) {
        baseUrl = baseUrl.slice(0, -4);
    }

    const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const isUploads = path.startsWith('/uploads') || path.startsWith('uploads/');
    const pathPrefix = isUploads ? '/' : '/uploads/';
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

    return `${normalizedBase}${pathPrefix}${normalizedPath}`;
};
