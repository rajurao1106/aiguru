import connectDB from "@/lib/mongodb";
import Chapter from "@/models/Chapter";

export async function POST(req) {
  await connectDB();
  const { chapterId, topicName } = await req.json();

  const chapter = await Chapter.findById(chapterId);
  chapter.topics.push({ name: topicName });
  await chapter.save();

  return Response.json(chapter);
}
