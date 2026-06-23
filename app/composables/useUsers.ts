import { UserService } from '~/application/services/UserServices';
import type { ICreateUserPayload, IUpdateUserPayload, IUpdateUserFotoPayload } from '~/domain/models/IUser';
import type { IPaginationQuery } from '~/domain/types/IPaginationQuery';

export const useUser = () => {
    const fetchUsers = (params: Ref<IPaginationQuery>) => {
        return useAsyncData(
            'users-list',
            () => UserService.getAllUsers(params.value),
            { watch: [params] }
        );
    };

    const fetchUserById = (id: number) => {
        return useAsyncData(
            `user-detail-${id}`,
            () => UserService.getUserById(id)
        );
    };

    const createUser = async (payload: ICreateUserPayload) => {
        return await UserService.createUser(payload);
    };

    const updateUser = async (id: number, payload: IUpdateUserPayload) => {
        return await UserService.updateUser(id, payload);
    };

    const deleteUser = async (id: number) => {
        return await UserService.deleteUser(id);
    };

    const updateFotoProfil = async (id: number, payload: IUpdateUserFotoPayload) => {
        return await UserService.updateFotoProfil(id, payload);
    };

    const toggleActivateUser = async (id: number) => {
        return await UserService.isActivateUser(id);
    };

    return {
        fetchUsers,
        fetchUserById,
        createUser,
        updateUser,
        deleteUser,
        updateFotoProfil,
        toggleActivateUser,
    };
};