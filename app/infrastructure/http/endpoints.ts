export const endpoints = {
    AUTH: {
        LOGIN: 'auth/login',
        LOGOUT: 'auth/logout',
        FORGOT_PASSWORD: 'auth/forgot-password',
        RESET_PASSWORD: 'auth/reset-password',
        VERIFY_EMAIL: 'auth/verify-email',
        ME: 'auth/me',
    },

    USER: {
        GET_ALL: 'users/',
        GET_BY_ID: (id: number) => `users/${id}`,
        CREATE: 'users/',
        UPDATE: (id: number) => `users/${id}`,
        DELETE: (id: number) => `users/${id}`,
        FOTO_PROFIL: (id: number) => `users/${id}/photo`,
        ACTIVE: (id: number) => `users/${id}/activate`,
    },

    CONTENT: {
        GET_ALL: 'contents/',
        GET_BY_ID: (id: number) => `contents/${id}`,
        CREATE: 'contents/',
        UPDATE: (id: number) => `contents/${id}`,
        DELETE: (id: number) => `contents/${id}`,
        GET_DRAFT: 'contents/draft',
    },

    JENIS_KAS: {
        GET_ALL: 'jenis-kas/',
        GET_BY_ID: (id: number) => `jenis-kas/${id}`,
        CREATE: 'jenis-kas/',
        UPDATE: (id: number) => `jenis-kas/${id}`,
        DELETE: (id: number) => `jenis-kas/${id}`,
        GET_DRAFT: 'jenis-kas/draft',
    },

    MEDIA_PEMBAYARAN: {
        GET_ALL: 'media-pembayaran/',
        GET_BY_ID: (id: number) => `media-pembayaran/${id}`,
        CREATE: 'media-pembayaran/',
        UPDATE: (id: number) => `media-pembayaran/${id}`,
        DELETE: (id: number) => `media-pembayaran/${id}`,
        GET_DRAFT: 'media-pembayaran/draft',
    },

    FAVORITE_TRANSAKSI: {
        GET_ALL: 'favorite-transaksi/',
        GET_BY_ID: (id: number) => `favorite-transaksi/${id}`,
        CREATE: 'favorite-transaksi/',
        UPDATE: (id: number) => `favorite-transaksi/${id}`,
        DELETE: (id: number) => `favorite-transaksi/${id}`,
        GET_DRAFT: 'favorite-transaksi/draft',
    },

    KELOMPOK_KURBAN: {
        GET_ALL: 'kelompok-kurban/',
        GET_BY_ID: (id: number) => `kelompok-kurban/${id}`,
        CREATE: 'kelompok-kurban/',
        UPDATE: (id: number) => `kelompok-kurban/${id}`,
        DELETE: (id: number) => `kelompok-kurban/${id}`,
        GET_DRAFT: 'kelompok-kurban/draft',
    },

    PESERTA_KURBAN: {
        GET_ALL: 'peserta-kurban/',
        GET_BY_ID: (id: number) => `peserta-kurban/${id}`,
        CREATE: 'peserta-kurban/',
        UPDATE: (id: number) => `peserta-kurban/${id}`,
        DELETE: (id: number) => `peserta-kurban/${id}`,
        GET_DRAFT: 'peserta-kurban/draft',
        GET_PUBLIC_YEARS: 'peserta-kurban/public/years',
        GET_PUBLIC_KURBAN: 'peserta-kurban/public/kurban',
    },

    TRANSAKSI: {
        GET_ALL: 'transaksi/',
        GET_BY_ID: (id: number) => `transaksi/${id}`,
        CREATE: 'transaksi/',
        UPDATE: (id: number) => `transaksi/${id}`,
        DELETE: (id: number) => `transaksi/${id}`,
        GET_DRAFT: 'transaksi/draft',
        GET_DASHBOARD: 'transaksi/dashboard',
        GET_PUBLIC_DASHBOARD: 'transaksi/public/dashboard',
        GET_PUBLIC_LIST: 'transaksi/public/list',
    },

    PREDICT: {
        INCOME: 'predict/income',
        EXPENSE: 'predict/expense',
        SAVE: 'predict/save',
        ALLOCATE: 'predict/allocate',
        SAVE_ALLOCATIONS: 'predict/save-allocations',
        HISTORY: 'predict/history',
        GET_BY_ID: (id: number) => `predict/${id}`,
        DELETE: (id: number) => `predict/${id}`
    }
} as const;