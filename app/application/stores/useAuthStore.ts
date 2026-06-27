import { defineStore } from 'pinia';
import type { IUser } from '~/domain/models/IUser';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<IUser | null>(null);
    const isAuthenticated = computed(() => !!user.value);

    function setAuth(newUser: IUser) {
        user.value = newUser;
    }

    function setUser(newUser: IUser) {
        user.value = newUser;
    }

    function clearAuth() {
        user.value = null;
    }

    return { user, isAuthenticated, setAuth, setUser, clearAuth };
});