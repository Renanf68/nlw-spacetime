import { fetchData } from "@/lib/api";
import dayjs from "dayjs";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

interface Memory {
  id: string;
  coverUrl: string;
  content: string;
  createdAt: string;
}

async function loadMemory(
  memoryId: string,
  token?: string
): Promise<Memory | null> {
  const response = await fetchData(`/memories/${memoryId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!response) {
    return null;
  }
  return response.json();
}

type PageProps = { params: { id: string } };

export default async function Memory({ params }: PageProps) {
  const { id } = params;
  const token = cookies().get("token")?.value;
  const memory = await loadMemory(id, token);
  if (!memory) {
    return (
      <div className="flex flex-1 flex-col gap-8">
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
        >
          <ChevronLeft className="w-4 h-4" />
          voltar à timeline
        </Link>
        <div className="w-full h-full items-center justify-center">
          <p className="text-body text-sm text-gray-100">
            Memória não encontrada
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col gap-8">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="w-4 h-4" />
        voltar à timeline
      </Link>
      <div key={memory.id} className="space-y-4">
        <time className="-ml-16 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
          {dayjs(memory.createdAt).format("D[ de ]MMMM[, ]YYYY")}
        </time>
        <Image
          src={memory.coverUrl}
          width={592}
          height={288}
          alt="capa da memória"
          className="aspect-video w-full rounded-lg object-cover"
        />
        <p className="text-lg leading-relaxed text-gray-100">
          {memory.content}
        </p>
      </div>
    </div>
  );
}
