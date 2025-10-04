import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "@/shared/api/axiosBaseQuery"
import type {
    Conference,
    CreateAnnouncementFormData,
    CustomSpeaker,
    AnnouncementLocation,
    AnnouncementContactInfo,
} from "@/entities/announcement/model"

interface CreateConferencePayload {
    title: string
    description: string
    status: "pending" | "draft"
    format: "online" | "offline" | "hybrid"
    activeFrom?: string
    activeTo?: string
    organizerName?: string
    location?: AnnouncementLocation
    contactInfo?: AnnouncementContactInfo
    tags?: string[]
    isPromoted?: boolean
    customSpeakers?: Omit<CustomSpeaker, "bio">[]
    stages?: Array<{
        name: string
        description?: string
        date?: string
        maxParticipants?: number
        order: number
    }>
    program?: string
    scheduleUrl?: string
    registrationRequired?: boolean
    registrationLink?: string
    maxParticipants?: number
    price?: number
    price_type?: "free" | "paid"
    currency?: string
    categories?: string[]
    targetAudience?: string[]
    language?: string
    certificates?: boolean
    cmeCredits?: number
}

interface CreateConferenceResponse {
    success: boolean
    data: Conference
}

function mapFormDataToPayload(
    formData: CreateAnnouncementFormData,
    status: "pending" | "draft",
): CreateConferencePayload {
    console.log("Original form data:", formData)

    const customSpeakers = formData.speakers?.map((speaker) => ({
        name: speaker.name,
        role: speaker.eventRole,
        status: "confirmed" as const,
    }))

    const payload: CreateConferencePayload = {
        title: formData.title,
        description: formData.description,
        status,
        format: formData.format,
    }

    if (formData.activeFrom) payload.activeFrom = formData.activeFrom
    if (formData.activeTo) payload.activeTo = formData.activeTo
    if (formData.organizerName) payload.organizerName = formData.organizerName
    if (formData.location && (formData.location.address || formData.location.city)) {
        payload.location = formData.location
    }
    if (
        formData.contactInfo &&
        (formData.contactInfo.email || formData.contactInfo.phone || formData.contactInfo.website)
    ) {
        payload.contactInfo = formData.contactInfo
    }
    if (formData.tags && formData.tags.length > 0) payload.tags = formData.tags
    if (formData.isPromoted !== undefined) payload.isPromoted = formData.isPromoted
    if (customSpeakers && customSpeakers.length > 0) payload.customSpeakers = customSpeakers
    if (formData.stages && formData.stages.length > 0) payload.stages = formData.stages
    if (formData.program) payload.program = formData.program
    if (formData.registrationRequired !== undefined) payload.registrationRequired = formData.registrationRequired
    if (formData.registrationLink) payload.registrationLink = formData.registrationLink
    if (formData.maxParticipants) payload.maxParticipants = formData.maxParticipants
    if (formData.price !== undefined) payload.price = formData.price
    if (formData.price_type) payload.price_type = formData.price_type
    if (formData.currency) payload.currency = formData.currency
    if (formData.categories && formData.categories.length > 0) payload.categories = formData.categories
    if (formData.targetAudience && formData.targetAudience.length > 0) payload.targetAudience = formData.targetAudience
    if (formData.language) payload.language = formData.language
    if (formData.certificates !== undefined) payload.certificates = formData.certificates

    console.log("Final API payload:", payload)

    return payload
}

export const createConferenceApi = createApi({
    reducerPath: "createConferenceApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["Conferences"],
    endpoints: (builder) => ({
        createConference: builder.mutation<
            Conference,
            { formData: CreateAnnouncementFormData; status: "pending" | "draft" }
        >({
            query: ({ formData, status }) => {
                const payload = mapFormDataToPayload(formData, status)
                return {
                    url: "/conference",
                    method: "POST",
                    data: payload,
                }
            },
            transformResponse: (response: CreateConferenceResponse): Conference => {
                return response.data
            },
            transformErrorResponse: (response: any) => {
                if (response?.data?.error) {
                    return {
                        status: response.status,
                        data: { message: response.data.error },
                    }
                }
                return {
                    status: response?.status || 500,
                    data: { message: "Произошла ошибка при создании конференции" },
                }
            },
            invalidatesTags: ["Conferences"],
        }),
    }),
})

export const { useCreateConferenceMutation } = createConferenceApi
