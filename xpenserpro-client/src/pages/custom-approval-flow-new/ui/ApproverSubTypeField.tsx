import { useSelector } from 'react-redux';
import { z } from 'zod';

import {
    useLazyGetAllDepartmentsQuery,
    type Department
} from '@/entities/department';
import {
    useLazyGetAllProjectsQuery,
    type Project
} from '@/entities/project';
import {
    useLazyGetAllTeamsQuery,
    type Team
} from '@/entities/team';
import {
    useLazyGetAllUsersQuery,
    type User
} from '@/entities/user';

import {
    SelectFormField,
    SelectFormFieldWithLazyQuery
} from '@/features/form-field';


import newCustomApprovalFlowFormSchema from '../model/newCustomApprovalFlowFormSchema';

type ApproverSubTypeFieldProps = {
    className: string,
    index: number,
    type: string
}

export default function ApproverSubTypeField({
    className,
    index,
    type
}: ApproverSubTypeFieldProps) {
    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const [
        getAllDepartments,
        {
            data: allDepartmentsData
        }
    ] = useLazyGetAllDepartmentsQuery();

    const [
        getAllProjects,
        {
            data: allProjectsData
        }
    ] = useLazyGetAllProjectsQuery();

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

    if (type === 'departmentHead') {
        return (
            <SelectFormFieldWithLazyQuery<z.infer<typeof newCustomApprovalFlowFormSchema>, Department>
                className={className}
                data={allDepartmentsData}
                label='Department'
                name={`approvers.${index}.department`}
                mapFunction={(data: { departments: Department[] }) => data.departments.map((department) => ({
                    label: department.name,
                    value: department._id
                }))}
                triggerFunction={getAllDepartments}
                triggerFunctionArguments={organization._id}
            />
        );
    }

    if (type === 'hierarchy') {
        return (
            <SelectFormField<z.infer<typeof newCustomApprovalFlowFormSchema>>
                className={className}
                label='Level'
                name={`approvers.${index}.level`}
                items={[
                    {
                        label: '1',
                        value: '1'
                    },
                    {
                        label: '2',
                        value: '2'
                    },
                    {
                        label: '3',
                        value: '3'
                    },
                    {
                        label: '4',
                        value: '4'
                    },
                    {
                        label: '5',
                        value: '5'
                    }
                ]}
            />
        );
    }

    if (type === 'manual') {
        return (
            <SelectFormFieldWithLazyQuery<z.infer<typeof newCustomApprovalFlowFormSchema>, User>
                className={className}
                data={allUsersData}
                label='Approver'
                name={`approvers.${index}.approver`}
                mapFunction={(data: { users: User[] }) => data.users.map((user) => ({
                    label: `${user.firstName} ${user.lastName}`,
                    value: user._id
                }))}
                triggerFunction={getAllUsers}
                triggerFunctionArguments={{
                    organization: organization._id,
                    roles: ['administrator', 'approver']
                }}
            />
        );
    }

    if (type === 'projectHead') {
        return (
            <SelectFormFieldWithLazyQuery<z.infer<typeof newCustomApprovalFlowFormSchema>, Project>
                className={className}
                data={allProjectsData}
                label='Project'
                name={`approvers.${index}.project`}
                mapFunction={(data: { projects: Project[] }) => data.projects.map((project) => ({
                    label: project.name,
                    value: project._id
                }))}
                triggerFunction={getAllProjects}
                triggerFunctionArguments={organization._id}
            />
        );
    }

    if (type === 'teamHead') {
        return (
            <SelectFormFieldWithLazyQuery<z.infer<typeof newCustomApprovalFlowFormSchema>, Team>
                className={className}
                data={allTeamsData}
                label='Team'
                name={`approvers.${index}.team`}
                mapFunction={(data: { teams: Team[] }) => data.teams.map((team) => ({
                    label: team.name,
                    value: team._id
                }))}
                triggerFunction={getAllTeams}
                triggerFunctionArguments={organization._id}
            />
        );
    }
}