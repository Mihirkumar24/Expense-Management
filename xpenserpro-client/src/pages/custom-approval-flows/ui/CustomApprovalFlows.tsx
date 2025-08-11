import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
    ArrowUpDown,
    GripVertical,
    LoaderCircle,
    Plus
} from 'lucide-react';
import {
    useEffect,
    useState
} from 'react';
import { useNavigate } from 'react-router';

// shadcn/ui

import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';

import { cn } from '@/shared/lib/utils';

import { useGetAllCustomApprovalFlowsQuery } from '@/entities/custom-apprval-flow';

import Loader from '@/widgets/loader';
import { useUpdateSettingMutation } from '@/entities/setting';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

export function SortableItem({
    isChangingPriority,
    customApprovalFlow
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: customApprovalFlow._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const navigate = useNavigate();

    return (
        <div
            className={cn(
                'border-b flex flex-row gap-3 items-center hover:bg-accent last:border-none',
                !isChangingPriority && 'p-1.5'
            )}
            ref={setNodeRef}
            onClick={() => navigate(`${customApprovalFlow._id}`)}
            style={style}
        >
            {isChangingPriority && (
                <Button
                    {...attributes}
                    {...listeners}
                    className='text-muted-foreground hover:bg-transparent'
                    size='icon'
                    variant='ghost'
                >
                    <GripVertical />
                </Button>
            )}

            {customApprovalFlow.name}
        </div>
    );
}

export default function customApprovalFlows() {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [isChangingPriority, setIsChangingPriority] = useState(false);
    const [sortableCustomApprovalFlows, setSortableCustomApprovalFlows] = useState(undefined);

    const {
        user: {
            organization: {
                setting
            }
        }
    } = useSelector((state) => state.authentication);

    const {
        data: allCustomApprovalFlowsData
    } = useGetAllCustomApprovalFlowsQuery();
    const customApprovalFlows = allCustomApprovalFlowsData?.customApprovalFlows;

    const [
        updateSetting,
        {
            isLoading: updateSettingIsLoading,
            isSuccess: updateSettingIsSuccess
        }
    ] = useUpdateSettingMutation();

    const navigate = useNavigate();

    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = sortableCustomApprovalFlows.findIndex(
                (customApprovalFlow) => customApprovalFlow.id === active.id
            );

            const newIndex = sortableCustomApprovalFlows.findIndex(
                (customApprovalFlow) => customApprovalFlow.id === over.id
            );

            setSortableCustomApprovalFlows(
                (customApprovalFlow) => arrayMove(sortableCustomApprovalFlows, oldIndex, newIndex)
            );
        }
    }

    function handleUpdateSetting() {
        const body = {
            customApprovalFlows: sortableCustomApprovalFlows
        };

        updateSetting({
            body,
            settingId: setting._id
        });
    }

    useEffect(() => {
        if (customApprovalFlows) {
            setSortableCustomApprovalFlows(
                customApprovalFlows.map((customApprovalFlow) => (
                    {
                        ...customApprovalFlow,
                        id: customApprovalFlow._id
                    }
                ))
            );
        }

        if (updateSettingIsSuccess) {
            toast.success('Priority is changed.');

            navigate(0);
        }
    }, [
        customApprovalFlows,
        updateSettingIsSuccess
    ]);

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='font-medium text-2xl'
            >
                Custom Approval Flows
            </h1>

            <Separator />

            <div
                className='flex flex-row-reverse gap-3'
            >
                <Button
                    onClick={() => navigate('new')}
                >
                    <Plus />

                    New Custom Approval Flow
                </Button>

                <Button
                    disabled={sortableCustomApprovalFlows
                        ? sortableCustomApprovalFlows.length === 0
                        : true
                    }
                    onClick={() => setIsChangingPriority(true)}
                    variant='outline'
                >
                    <ArrowUpDown />

                    Change Priority
                </Button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                {sortableCustomApprovalFlows ? (
                    sortableCustomApprovalFlows.length ? (
                        <SortableContext
                            items={sortableCustomApprovalFlows}
                            strategy={verticalListSortingStrategy}
                        >
                            <div
                                className='border rounded-md'
                            >
                                {sortableCustomApprovalFlows.map((customApprovalFlow, index) => (
                                    <SortableItem
                                        isChangingPriority={isChangingPriority}
                                        customApprovalFlow={customApprovalFlow}
                                        index={index}
                                        key={index}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    ) : (
                        <p
                            className='text-center text-muted-foreground'
                        >
                            You have no custom approval flows.
                        </p>
                    )
                ) : (
                    <Loader />
                )}
            </DndContext >

            {isChangingPriority && (
                <div
                    className='flex flex-row gap-3'
                >
                    <Button
                        onClick={() => setIsChangingPriority(false)}
                        variant='outline'
                    >
                        Cancel
                    </Button>

                    <Button
                        disabled={updateSettingIsLoading}
                        onClick={handleUpdateSetting}
                    >
                        {updateSettingIsLoading && (
                            <LoaderCircle
                                className='animate-spin'
                            />
                        )}

                        Save
                    </Button>
                </div>
            )}
        </div>
    );
}