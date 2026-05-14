<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="modelValue"
                class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 overflow-y-auto">

                <div class="absolute inset-0" @click="close"></div>

                <Transition name="zoom" appear>
                    <div v-if="modelValue"
                        :class="['relative w-full bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col', maxWidth]" role="dialog">

                        <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div v-if="icon" :class="iconContainerClass">
                                    <Icon :icon="icon" class="w-5 h-5" />
                                </div>
                                <h3 class="text-lg font-semibold text-secondary">{{ title }}</h3>
                            </div>
                            <button @click="close"
                                class="text-font-color/50 hover:text-font-color hover:bg-gray-100 p-2 rounded-full transition-colors">
                                <Icon icon="lucide:x" class="w-5 h-5" />
                            </button>
                        </div>

                        <div class="px-6 py-6 text-font-color text-sm leading-relaxed overflow-y-auto min-h-0">
                            <div v-if="isLoading" class="flex items-center justify-center py-8">
                                <Icon icon="lucide:loader-circle" class="w-8 h-8 animate-spin text-primary" />
                            </div>
                            <div v-else>
                                <slot></slot>
                            </div>
                        </div>

                        <div class="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 rounded-b-2xl">
                            <slot name="footer">
                                <button @click="close" :disabled="isLoading"
                                    class="px-4 py-2 text-sm font-medium text-font-color hover:bg-gray-200 bg-gray-100 rounded-xl transition-colors outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                                    Batal
                                </button>

                                <BaseButton @click="confirm" :text="confirmText"
                                    :variant="type === 'info' ? 'primary' : type" :fullWidth="false" :disabled="isLoading" />
                            </slot>
                        </div>

                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    title: { type: String, default: 'Informasi' },
    icon: { type: String, default: '' },
    confirmText: { type: String, default: 'Lanjutkan' },
    type: { type: String, default: 'info' },
    maxWidth: { type: String, default: 'max-w-md' },
    isLoading: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const close = () => {
    emit('update:modelValue', false);
    emit('cancel');
};

const confirm = () => {
    emit('confirm');
    emit('update:modelValue', false);
};

const iconContainerClass = computed(() => {
    switch (props.type) {
        case 'success': return 'w-10 h-10 rounded-full flex items-center justify-center bg-success/10 text-success';
        case 'danger': return 'w-10 h-10 rounded-full flex items-center justify-center bg-error/10 text-error';
        case 'warning': return 'w-10 h-10 rounded-full flex items-center justify-center bg-warning/10 text-warning';
        default: return 'w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary';
    }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.zoom-enter-active,
.zoom-leave-active {
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.zoom-enter-from,
.zoom-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
}
</style>