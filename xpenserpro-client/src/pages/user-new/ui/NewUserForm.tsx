import { zodResolver } from '@hookform/resolvers/zod';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

// shadcn/ui

import { Form } from '@/shared/ui/form';
import { Separator } from '@/shared/ui/separator';

import { useLazyGetAllDepartmentsQuery } from '@/entities/department';
import Levels from '@/entities/levels';
import { useLazyGetAllPoliciesQuery } from '@/entities/policy';
import Roles from '@/entities/roles';
import { useLazyGetAllTeamsQuery } from '@/entities/team';
import {
    useInviteUserMutation,
    useUpdateUserMutation,
    useLazyGetAllUsersQuery
} from '@/entities/user';

import {
    ComboboxFormField,
    InputFormField,
    SelectFormField
} from '@/features/form-field';

import LoadingButton from '@/widgets/button-loading';

import newUserFormSchema from '../model/newUserFormSchema';

export default function NewUserForm({
    user
}) {
    const defaultValues = {
        approver: user?.approver?._id ?? '',
        department: user?.department?._id ?? '',
        email: user?.email ?? '',
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        level: String(user?.level ?? '1'),
        policy: user?.policy?._id ?? '',
        role: user?.role ?? 'approver',
        team: user?.team?._id ?? ''
    }

    const newUserForm = useForm<z.infer<typeof newUserFormSchema>>({
        defaultValues,
        resolver: zodResolver(newUserFormSchema)
    });

    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const [
        inviteUser,
        {
            isLoading: inviteUserIsLoading,
            isSuccess: inviteUserIsSuccess
        }
    ] = useInviteUserMutation();

    const [
        updateUser,
        {
            isLoading: updateUserIsLoading,
            isSuccess: updateUserIsSuccess
        }
    ] = useUpdateUserMutation();

    const [
        getAllDepartments,
        {
            data: allDepartmentsData
        }
    ] = useLazyGetAllDepartmentsQuery();

    const [
        getAllPolicies,
        {
            data: allPoliciesData
        }
    ] = useLazyGetAllPoliciesQuery();

    const [
        getAllTeams,
        {
            data: allTeamsData
        }
    ] = useLazyGetAllTeamsQuery();

    const [
        getAllUsers,
        {
            data: allUsersData
        }
    ] = useLazyGetAllUsersQuery();

    const navigate = useNavigate();

    function handleInviteUser(data: z.infer<typeof newUserFormSchema>) {
        const body = {
            ...data,
            organization: organization._id
        };

        inviteUser(body);
    }

    function handleUpdateUser(data: z.infer<typeof newUserFormSchema>) {
        const body = data;

        console.log(body);

        updateUser({
            body,
            userId: user._id
        });
    }

    useEffect(() => {
        if (inviteUserIsSuccess) {
            toast.success('User is invited.');

            navigate('/administrator/settings/users')
        }

        if (updateUserIsSuccess) {
            toast.success('User is updated.');

            navigate('/administrator/settings/users')
        }
    }, [
        inviteUserIsSuccess,
        updateUserIsSuccess
    ]);

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='font-medium text-2xl'
            >
                {user ? 'Update User' : 'New User'}
            </h1>

            <Separator />

            <Form
                {...newUserForm}
            >
                <form
                    className='gap-6 grid grid-cols-2'
                    onSubmit={newUserForm.handleSubmit(
                        user
                            ? handleUpdateUser
                            : handleInviteUser
                    )}
                >
                    <InputFormField<z.infer<typeof newUserFormSchema>>
                        label='First Name'
                        name='firstName'
                    />

                    <InputFormField<z.infer<typeof newUserFormSchema>>
                        label='Last Name'
                        name='lastName'
                    />

                    <InputFormField<z.infer<typeof newUserFormSchema>>
                        label='Email'
                        name='email'
                    />

                    <SelectFormField<z.infer<typeof newUserFormSchema>>
                        items={Roles}
                        label='Role'
                        name='role'
                    />

                    <ComboboxFormField<z.infer<typeof newUserFormSchema>>
                        data={allUsersData}
                        defaultFieldValue={`${user?.approver?.firstName} ${user?.approver?.lastName}`}
                        label='Approver'
                        mapFunction={(data) => data.users.map((approver, index) => ({
                            label: `${approver.firstName} ${approver.lastName}`,
                            value: approver._id
                        }))}
                        name='approver'
                        triggerFunction={getAllUsers}
                        triggerFunctionArguments={{
                            organization: organization._id,
                            roles: ['administrator', 'approver']
                        }}
                    />

                    <SelectFormField<z.infer<typeof newUserFormSchema>>
                        items={Levels}
                        label='Level'
                        name='level'
                    />

                    <ComboboxFormField<z.infer<typeof newUserFormSchema>>
                        data={allTeamsData}
                        defaultFieldValue={user?.team?.name}
                        label='Team'
                        mapFunction={(data) => data.teams.map((team, index) => ({
                            label: team.name,
                            value: team._id
                        }))}
                        name='team'
                        triggerFunction={getAllTeams}
                        triggerFunctionArguments={organization._id}
                    />

                    <ComboboxFormField<z.infer<typeof newUserFormSchema>>
                        data={allDepartmentsData}
                        defaultFieldValue={user?.department?.name}
                        label='Department'
                        mapFunction={(data) => data.departments.map((department, index) => ({
                            label: department.name,
                            value: department._id
                        }))}
                        name='department'
                        triggerFunction={getAllDepartments}
                        triggerFunctionArguments={organization._id}
                    />

                    <ComboboxFormField<z.infer<typeof newUserFormSchema>>
                        data={allPoliciesData}
                        defaultFieldValue={user?.policy?.name}
                        label='Policy'
                        mapFunction={(data) => data.policies.map((policy, index) => ({
                            label: policy.name,
                            value: policy._id
                        }))}
                        name='policy'
                        triggerFunction={getAllPolicies}
                        triggerFunctionArguments={organization._id}
                    />

                    <LoadingButton
                        loading={inviteUserIsLoading || updateUserIsLoading}
                    >
                        Save
                    </LoadingButton>
                </form>
            </Form>
        </div>
    );
}