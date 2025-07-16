import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardHome() {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center rounded-2xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">
        Welcome To The <br className="hidden max-lg:block" />
        <span className="text-blue-500">DigiNote</span>
      </h1>

      <p className="text-base leading-relaxed mb-8 max-w-3xl">
        Empowering educators and learners through advanced AI solutions. <br />
        DigiNote delivers personalized learning paths, real-time academic
        assistance, and intelligent tools designed to streamline educational
        workflows and maximize outcomes.
      </p>

      <Link
        href="/workspace/create"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-medium shadow hover:bg-blue-700 transition"
      >
        <Plus size={18} />
        Make Digital Notebook
      </Link>
    </div>
  );
}
