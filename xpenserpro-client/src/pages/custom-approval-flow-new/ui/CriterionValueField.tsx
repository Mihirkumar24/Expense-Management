import { useSelector } from 'react-redux';

import ExpenseCategories from '@/entities/expense-categories';

import { useLazyGetAllDepartmentsQuery } from '@/entities/department';
import { useLazyGetAllProjectsQuery } from '@/entities/project';
import { useLazyGetAllTeamsQuery } from '@/entities/team';

import {
    InputFormField,
    SelectFormField,
    SelectFormFieldWithLazyQuery
} from '@/features/form-field';

type Department = {
    _id: string,
    name: string
}

type Project = {
    _id: string,
    name: string
}

type Team = {
    _id: string,
    name: string
}

type CriterionValueFieldProps = {
    className: string,
    field: 'amount' | 'department' | 'expense_category' | 'project' | 'team'
    index: number
}

export default function CriterionValueField({
    className,
    field,
    index
}: CriterionValueFieldProps) {
    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const [
        getAllDepartments,
        { data: allDepartmentsData }
    ] = useLazyGetAllDepartmentsQuery();

    const [
        getAllProjects,
        { data: allProjectsData }
    ] = useLazyGetAllProjectsQuery();

    const [
        getAllTeams,
        { data: allTeamsData }
    ] = useLazyGetAllTeamsQuery();

    if (field === 'amount') {
        return (
            <InputFormField
                className={className}
                label='Value'
                name={`criteria.${index}.value`}
            />
        );
    }

    if (field === 'expense_category') {
        return (
            <SelectFormField
                className={className}
                label='Value'
                name={`criteria.${index}.value`}
                items={ExpenseCategories}
            />
        );
    }

    if (field === 'department') {
        return (
            <SelectFormFieldWithLazyQuery
                className={className}
                label='Value'
                data={allDepartmentsData}
                mapFunction={(data: { departments: Department[] }) => data.departments.map((department) => ({
                    label: department.name,
                    value: department._id
                }))}
                name={`criteria.${index}.value`}
                triggerFunction={getAllDepartments}
                triggerFunctionArguments={organization._id}
            />
        );
    }

    if (field === 'project') {
        return (
            <SelectFormFieldWithLazyQuery
                className={className}
                label='Value'
                data={allProjectsData}
                mapFunction={(data: { projects: Project[] }) => data.projects.map((project) => ({
                    label: project.name,
                    value: project._id
                }))}
                name={`criteria.${index}.value`}
                triggerFunction={getAllProjects}
                triggerFunctionArguments={organization._id}
            />
        );
    }

    if (field === 'team') {
        return (
            <SelectFormFieldWithLazyQuery
                className={className}
                label='Value'
                data={allTeamsData}
                mapFunction={(data: { teams: Team[] }) => data.teams.map((team) => ({
                    label: team.name,
                    value: team._id
                }))}
                name={`criteria.${index}.value`}
                triggerFunction={getAllTeams}
                triggerFunctionArguments={organization._id}
            />
        );
    }

}