import { ArrowLeft } from "lucide-react";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from "react-icons/tb";

export default function Header({ onBack, isSidebarOpen, toggleSidebar }) {
  return (
    <div className="w-full flex justify-between">
      <button onClick={onBack} className="p-2 hover:bg-gray-500/20 rounded-full">
        <ArrowLeft size={20} />
      </button>
      <button onClick={toggleSidebar} className="text-2xl">
        {isSidebarOpen ? <TbLayoutSidebarLeftCollapse /> : <TbLayoutSidebarRightCollapse />}
      </button>
    </div>
  );
}
