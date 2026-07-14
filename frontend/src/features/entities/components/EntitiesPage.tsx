import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'

import { AppHeader } from '@/components/layout/AppHeader'
import { PageContainer } from '@/components/layout/PageContainer'
import { AppBreadcrumbs } from '@/components/shared/AppBreadcrumbs'
import { AddEntityButton } from '@/features/entities/components/AddEntityButton'
import { EmptyEntityPrompt } from '@/features/entities/components/EmptyEntityPrompt'
import { EntityList } from '@/features/entities/components/EntityList'
import { getCategoryById, getEntitiesByTopicId, getTopicById } from '@/features/entities/demo-data'
import type { Entity } from '@/features/entities/types'

export function EntitiesPage() {
    const navigate = useNavigate()
    const { categoryId, topicId } = useParams({
        from: '/_app/categories/$categoryId/topics/$topicId/',
    })

    const category = getCategoryById(categoryId)
    const topic = getTopicById(topicId)

    const topicName = topic?.name ?? ''
    const [entities, setEntities] = useState<Entity[]>(() => getEntitiesByTopicId(topicId))

    if (!category || !topic) {
        return (
            <div className='min-h-screen bg-background'>
                <AppHeader />
                <PageContainer className='flex flex-col gap-4 py-8'>
                    <div className='flex flex-col gap-1'>
                        <h1 className='font-heading text-2xl font-semibold tracking-tight'>Topic not found</h1>
                        <AppBreadcrumbs category={category ? { id: categoryId, name: category.name } : undefined} />
                    </div>
                    <p className='text-muted-foreground'>Topic not found.</p>
                </PageContainer>
            </div>
        )
    }

    function handleEditEntity(id: string) {
        navigate({
            to: '/categories/$categoryId/topics/$topicId/entities/$entityId',
            params: { categoryId, topicId, entityId: id },
        })
    }

    function handleRemoveEntity(id: string) {
        const entity = entities.find((item) => item.id === id)
        if (!entity) return

        const confirmed = window.confirm(`Remove "${entity.title}"?`)
        if (!confirmed) return

        setEntities((current) => current.filter((item) => item.id !== id))
    }

    const hasEntities = entities.length > 0

    return (
        <div className='min-h-screen bg-background'>
            <AppHeader />

            <PageContainer className='py-8'>
                <div className='flex flex-col gap-6'>
                    {hasEntities ? (
                        <>
                            <div className='flex items-start justify-between gap-4'>
                                <div className='flex flex-col gap-1'>
                                    <div className='flex items-center gap-2'>
                                        <h1 className='font-heading text-2xl font-semibold tracking-tight'>Entities</h1>
                                    </div>
                                    <AppBreadcrumbs category={{ id: categoryId, name: category.name }} topic={{ id: topicId, name: topicName }} />
                                </div>
                                <AddEntityButton categoryId={categoryId} topicId={topicId} />
                            </div>

                            <EntityList entities={entities} onEdit={handleEditEntity} onRemove={handleRemoveEntity} />
                        </>
                    ) : (
                        <>
                            <div className='flex items-start justify-between gap-4'>
                                <div className='flex flex-col gap-1'>
                                    <h1 className='font-heading text-2xl font-semibold tracking-tight'>{topicName}</h1>
                                    <AppBreadcrumbs category={{ id: categoryId, name: category.name }} topic={{ id: topicId, name: topicName }} />
                                </div>
                                <AddEntityButton categoryId={categoryId} topicId={topicId} />
                            </div>
                            <EmptyEntityPrompt categoryId={categoryId} topicId={topicId} />
                        </>
                    )}
                </div>
            </PageContainer>
        </div>
    )
}
