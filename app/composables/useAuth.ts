import { AuthService } from '~/application/services/AuthService';
import { useAuthStore } from '~/application/stores/useAuthStore';
import type { ILoginPayload } from '~/domain/models/IAuth';

export const useAuth = () => {
    const authStore = useAuthStore();
    const router = useRouter();

    const login = async (payload: ILoginPayload) => {
        const response = await AuthService.login(payload);
        if (response.success && response.data) {
            authStore.setAuth(response.data.user, response.data.token);
        }
        return response;
    };

    const logout = async () => {
        await AuthService.logout();
        authStore.clearAuth();
        router.push('/');
    };

    const me = async () => {
        const response = await AuthService.getMe();
        if (response.success && response.data) {
            const payload = response.data as any;
            const nextUser = payload?.user ?? payload;

            if (nextUser?.email || nextUser?.nama) {
                authStore.setUser(nextUser);
            }
        }
        return response;
    };

    return {
        login,
        logout,
        me,
        forgotPassword: (payload: any) => AuthService.forgotPassword(payload),
        resetPassword: (payload: any) => AuthService.resetPassword(payload),
        verifyEmail: (payload: any) => AuthService.verifyEmail(payload),
        isAuthenticated: computed(() => authStore.isAuthenticated),
        user: computed(() => authStore.user)
    };
};