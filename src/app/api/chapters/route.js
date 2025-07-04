import connectDB from "@/lib/mongodb";
import Chapter from "@/models/Chapter";

export async function POST(req) {
  await connectDB();
  const { name } = await req.json();
  const newChapter = await Chapter.create({ name });
  return Response.json(newChapter);
}

export async function GET() {
  await connectDB();
  const chapters = await Chapter.find();
  return Response.json(chapters);
}
