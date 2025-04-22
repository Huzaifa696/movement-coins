import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface CoinRowProps {
  id: number;
  date: string;
  status: "approved" | "pending" | "launched" | "rejected";
  link?: string;
}

export default function CoinRow({ id, date, status, link }: CoinRowProps) {
  const statusStyles = {
    approved: "text-green",
    pending: "text-yellow-500",
    launched: "text-purple",
    rejected: "text-red",
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "pending":
        return "Pending";
      case "launched":
        return "Active";
      case "rejected":
        return "Inactive (not approved)";
      default:
        return "";
    }
  };

  return (
    <div className="grid grid-cols-4 items-center border-b border-fuchsia-50 pb-3">
      <div className="text-sm text-white">#{id}</div>
      <div className="text-xs text-gray-400">{date}</div>
      <div className={`text-xs ${statusStyles[status.toLowerCase()]}`}>{getStatusText(status)}</div>
      <div>
        {link ? (
          <Link href={link} className="flex items-center text-sm text-white hover:underline">
            {link} <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        ) : (
          "-"
        )}
      </div>
    </div>
  );
}
