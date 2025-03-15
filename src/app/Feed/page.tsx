import { demoData } from "@/entities/post/model/mocks"
import { PostFeed } from "@/widgets/PostFeed/ui/PostFeed"

export default function FeedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div style={{ marginTop: "7rem" }}>
        <PostFeed initialPosts={demoData} />
      </div>
    </div>
  )
}

