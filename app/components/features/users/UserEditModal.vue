<template>
    <BaseModal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" title="Edit Pengguna"
        icon="lucide:user" type="info" confirmText="Simpan Perubahan" @confirm="submitEditUser" :isLoading="isLoading">
        <div v-if="editData" class="space-y-4 text-left mt-2">
            <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input v-model="editData.nama" type="text"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
            </div>
            <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Alamat Email</label>
                <input v-model="editData.email" type="email" readonly
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-gray-100" />
            </div>
            <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Role</label>
                <select v-model="editData.role"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                    <option value="superadmin">Super Admin</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div>
                <label class="block mb-1 text-sm font-medium text-gray-700">Status</label>
                <select v-model="editData.isActive"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                    <option :value="true">Active</option>
                    <option :value="false">Inactive</option>
                </select>
            </div>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useUser } from '~/composables/useUsers';
import type { IUser, IUpdateUserPayload } from '~/domain/models/IUser';

const props = defineProps<{
    modelValue: boolean;
    user: IUser | null;
}>();

const emit = defineEmits(['update:modelValue', 'success']);
const isLoading = ref(false);
let userDetailRefresh: any = null;
const { updateUser, fetchUserById } = useUser();

type EditUserForm = IUpdateUserPayload & { id: number };
const editData = ref<EditUserForm | null>(null);

watch(() => props.modelValue, async (isOpen) => {
    if (isOpen && props.user?.id) {
        isLoading.value = true;
        try {
            const result = fetchUserById(props.user.id);
            userDetailRefresh = result.refresh;
            const { data, pending } = result;
            while (pending.value) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            const freshData = data.value?.data || data.value;
            populateFormWithData(freshData);
        } catch (error) {
            console.error('Error fetching user detail:', error);
            populateFormWithData(props.user);
        } finally {
            isLoading.value = false;
        }
    }
});

const populateFormWithData = (newVal: any) => {
    if (newVal) {
        editData.value = {
            id: newVal.id,
            nama: newVal.nama || '',
            email: newVal.email || '',
            role: newVal.role,
            isActive: newVal.isActive ?? true
        };
    }
};

const submitEditUser = async () => {
    if (!editData.value) return;
    try {
        await updateUser(editData.value.id, editData.value);
        // Clear cache agar next edit fetch fresh data
        if (userDetailRefresh) await userDetailRefresh();
        emit('update:modelValue', false)
        emit('success', 'Pengguna Diperbarui', `Data pengguna ${editData.value.nama} berhasil diupdate.`);
    } catch (error) {
        console.error('Gagal mengupdate user:', error);
    }
};
</script>