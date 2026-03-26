"use client";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
}

export default function Loading({ message }: LoadingProps) {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      <span className="ml-3 text-lg font-medium text-gray-700">
        {message || "Loading..."}
      </span>
    </div>
  );
}
