import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

type PlayerEntityBreadcrumbProps = {
    categoryName: string;
    topicName: string;
};

/** Non-clickable "Category > Topic" trail showing where the current entity comes from. */
export const PlayerEntityBreadcrumb = ({ categoryName, topicName }: PlayerEntityBreadcrumbProps) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <span className='max-w-[300px] truncate'>{categoryName}</span>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <span className='max-w-[300px] truncate'>{topicName}</span>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
};
