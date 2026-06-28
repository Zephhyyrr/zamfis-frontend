<template>
    <div class="max-w-4xl mx-auto pb-12">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">Profil Pengguna</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Kelola informasi profil dan keamanan akun Anda.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-1 space-y-8">
                <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-emerald-100 dark:border-gray-700">
                    <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                        <Icon icon="lucide:image" class="text-emerald-600 dark:text-emerald-400" />
                        Foto Profil
                    </h2>
                    
                    <div class="flex flex-col items-center">
                        <div class="relative w-32 h-32 mb-4 group cursor-pointer" @click="triggerFileInput">
                            <img :src="previewFoto || getAvatarUrl(user?.fotoProfile)" 
                                class="w-full h-full object-cover rounded-full border-4 border-emerald-50 dark:border-gray-700 shadow-md"
                                alt="Foto Profil" />
                            <div class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Icon icon="lucide:camera" class="w-8 h-8 text-white" />
                            </div>
                        </div>
                        
                        <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
                        
                        <BaseButton v-if="selectedFile" @click="uploadFoto" :isLoading="isUploading" text="Simpan Foto" icon="lucide:upload" class="w-full" />
                        <p v-else class="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">Klik foto untuk mengganti.<br>Maks. ukuran 10MB.</p>

                        <div v-if="fotoMessage" class="mt-4 text-sm text-center" :class="isFotoError ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'">
                            {{ fotoMessage }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-2 space-y-8">
                <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-emerald-100 dark:border-gray-700">
                    <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                        <Icon icon="lucide:user" class="text-emerald-600 dark:text-emerald-400" />
                        Data Pribadi
                    </h2>
                    
                    <form @submit.prevent="updateProfile" class="space-y-5">
                        <BaseInput id="nama" v-model="profileForm.nama" label="Nama Lengkap" icon="lucide:user" :required="true" />
                        <BaseInput id="email" v-model="profileForm.email" type="email" label="Alamat Email" icon="lucide:mail" disabled />
                        
                        <div v-if="profileMessage" class="p-3 rounded-lg text-sm font-medium" :class="isProfileError ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'">
                            {{ profileMessage }}
                        </div>

                        <div class="flex justify-end pt-2">
                            <BaseButton type="submit" :isLoading="isProfileUpdating" text="Simpan Perubahan" icon="lucide:save" />
                        </div>
                    </form>
                </div>

                <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-emerald-100 dark:border-gray-700">
                    <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                        <Icon icon="lucide:lock" class="text-emerald-600 dark:text-emerald-400" />
                        Ubah Password
                    </h2>
                    
                    <form @submit.prevent="updatePassword" class="space-y-5">
                        <BaseInput id="new-password" v-model="passwordForm.password" type="password" label="Password Baru" icon="lucide:key" :required="true" placeholder="Masukkan password baru" />
                        <BaseInput id="confirm-password" v-model="passwordForm.confirmPassword" type="password" label="Konfirmasi Password" icon="lucide:key" :required="true" placeholder="Ulangi password baru" />
                        
                        <div v-if="passwordMessage" class="p-3 rounded-lg text-sm font-medium" :class="isPasswordError ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'">
                            {{ passwordMessage }}
                        </div>

                        <div class="flex justify-end pt-2">
                            <BaseButton type="submit" :isLoading="isPasswordUpdating" text="Perbarui Password" icon="lucide:shield-check" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    
    <FeaturesSettingsProfileCropperModal v-model="showCropper" :imageUrl="tempImageUrl" @cropped="onCropped" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { definePageMeta, useRuntimeConfig } from '#imports';
import { useAuth } from '~/composables/useAuth';
import { UserService } from '~/application/services/UserServices';
import { resolveAssetUrl } from '~/infrastructure/adapters/assets';

definePageMeta({
    layout: 'dashboard'
});

const { user, me } = useAuth();
const config = useRuntimeConfig();

// Form States
const profileForm = reactive({
    nama: '',
    email: ''
});

const passwordForm = reactive({
    password: '',
    confirmPassword: ''
});

// UI States
const isProfileUpdating = ref(false);
const profileMessage = ref('');
const isProfileError = ref(false);

const isPasswordUpdating = ref(false);
const passwordMessage = ref('');
const isPasswordError = ref(false);

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const previewFoto = ref<string | null>(null);
const isUploading = ref(false);
const fotoMessage = ref('');
const isFotoError = ref(false);

const showCropper = ref(false);
const tempImageUrl = ref('');

// Initialize Data
const initData = () => {
    if (user.value) {
        profileForm.nama = user.value.nama || '';
        profileForm.email = user.value.email || '';
    }
};

onMounted(() => {
    initData();
});

watch(() => user.value, () => {
    initData();
}, { deep: true });

// Methods
const getAvatarUrl = (path: string | null | undefined) => {
    if (path && path !== 'null' && path.trim() !== '') {
        return resolveAssetUrl(path);
    }
    return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.value?.nama || 'User') + '&background=10b981&color=fff';
};

const triggerFileInput = () => {
    fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        const file = target.files[0];
        if (!file) return;
        
        // Validate size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            fotoMessage.value = 'Ukuran file maksimal 10MB.';
            isFotoError.value = true;
            target.value = '';
            return;
        }

        tempImageUrl.value = URL.createObjectURL(file);
        showCropper.value = true;
        target.value = '';
    }
};

const onCropped = async (blob: Blob) => {
    const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
    selectedFile.value = file;
    previewFoto.value = URL.createObjectURL(blob);
    fotoMessage.value = '';
    
    // Langsung otomatis unggah (simpan)
    await uploadFoto();
};

const uploadFoto = async () => {
    if (!selectedFile.value || !user.value?.id) return;
    
    isUploading.value = true;
    fotoMessage.value = '';
    
    try {
        const response = await UserService.updateFotoProfil(user.value.id, { fotoProfile: selectedFile.value as File });
        if (response.success) {
            fotoMessage.value = 'Foto profil berhasil diperbarui!';
            isFotoError.value = false;
            selectedFile.value = null; // Hide button
            await me(); // Refresh user data in layout
        } else {
            fotoMessage.value = response.message || 'Gagal mengunggah foto.';
            isFotoError.value = true;
        }
    } catch (err: any) {
        fotoMessage.value = err?.data?.message || 'Terjadi kesalahan sistem.';
        isFotoError.value = true;
    } finally {
        isUploading.value = false;
    }
};

const updateProfile = async () => {
    if (!user.value?.id) return;
    
    isProfileUpdating.value = true;
    profileMessage.value = '';
    
    try {
        const response = await UserService.updateUser(user.value.id, {
            nama: profileForm.nama,
            email: profileForm.email,
            role: user.value.role
        });
        
        if (response.success) {
            profileMessage.value = 'Profil berhasil diperbarui!';
            isProfileError.value = false;
            await me(); // Refresh layout
        } else {
            profileMessage.value = response.message || 'Gagal memperbarui profil.';
            isProfileError.value = true;
        }
    } catch (err: any) {
        profileMessage.value = err?.data?.message || 'Terjadi kesalahan sistem.';
        isProfileError.value = true;
    } finally {
        isProfileUpdating.value = false;
    }
};

const updatePassword = async () => {
    if (!user.value?.id) return;
    
    if (passwordForm.password !== passwordForm.confirmPassword) {
        passwordMessage.value = 'Konfirmasi password tidak cocok.';
        isPasswordError.value = true;
        return;
    }

    if (passwordForm.password.length < 6) {
        passwordMessage.value = 'Password minimal 6 karakter.';
        isPasswordError.value = true;
        return;
    }
    
    isPasswordUpdating.value = true;
    passwordMessage.value = '';
    
    try {
        const response = await UserService.updateUser(user.value.id, {
            email: user.value.email,
            nama: user.value.nama,
            role: user.value.role,
            password: passwordForm.password
        });
        
        if (response.success) {
            passwordMessage.value = 'Password berhasil diubah!';
            isPasswordError.value = false;
            passwordForm.password = '';
            passwordForm.confirmPassword = '';
        } else {
            passwordMessage.value = response.message || 'Gagal mengubah password.';
            isPasswordError.value = true;
        }
    } catch (err: any) {
        passwordMessage.value = err?.data?.message || 'Terjadi kesalahan sistem.';
        isPasswordError.value = true;
    } finally {
        isPasswordUpdating.value = false;
    }
};
</script>
