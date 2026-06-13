<template>
    <div class="space-y-2">
        <label :for="id" class="block text-sm font-medium text-font-color dark:text-gray-200">
            {{ label }}
        </label>
        <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Icon :icon="icon"
                    class="w-[18px] h-[18px] text-font-color/60 dark:text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
            </div>

            <input :id="id" :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
                :type="inputType" :required="required" :autocomplete="autocomplete" :placeholder="placeholder"
                :disabled="disabled"
                class="auth-input w-full pl-10 pr-12 py-3 rounded-xl text-sm text-font-color dark:text-white placeholder-font-color/55 dark:placeholder-gray-500 transition-all duration-200 focus:outline-none" />

            <button v-if="isPasswordType" type="button" @click="togglePassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-font-color/60 dark:text-gray-400 hover:text-font-color dark:hover:text-white transition-colors duration-200"
                tabindex="-1">
                <Icon :icon="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-[18px] h-[18px]" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = withDefaults(defineProps<{
    modelValue?: string | number
    id: string
    label: string
    type?: string
    icon: string
    placeholder?: string
    required?: boolean
    autocomplete?: string
    disabled?: boolean
}>(), {
    type: 'text',
    placeholder: '',
    required: false,
    autocomplete: 'off',
    disabled: false
});

defineEmits<{
    (e: 'update:modelValue', value: string | number): void
}>();

const showPassword = ref(false);

const isPasswordType = computed(() => props.type === 'password');

const inputType = computed(() => {
    if (isPasswordType.value) {
        return showPassword.value ? 'text' : 'password';
    }
    return props.type;
});

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};
</script>