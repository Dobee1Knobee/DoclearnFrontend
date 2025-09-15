import { notFound } from "next/navigation"
import { getMockAnnouncementById } from "@/entities/announcement/model/mockData"
import { AnnouncementDetailPage } from "@/widgets/announcements/ui/AnnouncementDetailPage/AnnouncementDetailPage"

interface AnnouncementPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AnnouncementPage({ params }: AnnouncementPageProps) {
  const { id } = await params
  const announcement = getMockAnnouncementById(id)

  if (!announcement) {
    notFound()
  }

  return <AnnouncementDetailPage announcement={announcement} />
}

    // { id: "conf-1" },
    // { id: "conf-2" },
    // { id: "webinar-1" },
    // { id: "webinar-2" },
    // { id: "masterclass-1" },
    // { id: "masterclass-2" },