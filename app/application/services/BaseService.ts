import { useNuxtApp } from '#app';

export class BaseService {
    protected static get api() {
        try {
            const { $api } = useNuxtApp();
            if ($api) return $api as typeof $fetch;
        } catch (e) {
            // Fallback for cases outside Nuxt context
        }
        return $fetch;
    }
}