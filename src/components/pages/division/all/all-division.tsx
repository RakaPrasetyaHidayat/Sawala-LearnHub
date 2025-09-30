"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NavigationBar from "@/components/molecules/navigationbar/navigationbar";
import UserCard from "@/components/molecules/cards/user-card/user-card";
import TaskCard from "@/components/molecules/cards/task-card/task-card";
import { Resource as Resources } from "@/components/organisms/resources/resources";
import { useDivisionMembers } from "@/hooks/useDivisionMembers";
import { useDivisionTasks } from "@/hooks/useDivisionTasks";

export default function AllDivision({
  imageSrc = "/assets/images/download.png",
  imageAlt = "All Division Landing Preview",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState("people");
  const items = [
    { key: "people", label: "People" },
    { key: "tasks", label: "Tasks" },
    { key: "resources", label: "Resources" },
  ];

  const yearParam = searchParams.get("year") || undefined;
  const { members, loading, error } = useDivisionMembers("all", yearParam);
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useDivisionTasks("all", yearParam);

  const peopleSection = useMemo(() => {
    if (loading)
      return (
        <div className="mt-4 text-sm text-gray-600">Loading members...</div>
      );
    if (error)
      return (
        <div className="mt-4 text-sm text-red-600">
          Failed to load members: {error}
        </div>
      );
    if (!members.length)
      return (
        <div className="mt-4 text-sm text-gray-600">
          Tidak ada member untuk tahun ini.
        </div>
      );

    return (
      <div className="mt-4 space-y-3">
        {members.map((m) => (
          <UserCard
            key={m.id}
            username={m.username}
            division={m.division || "Member"}
            school={m.school}
            avatarSrc={m.avatarSrc}
          />
        ))}
      </div>
    );
  }, [loading, error, members]);

  return (
    <div className="w-full relative">
      <div className="mx-auto w-full max-w-4xl px-4">
        <div className="overflow-hidden shadow-md">
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>

        <NavigationBar
          items={items}
          value={tab}
          onChange={setTab}
          className="mt-4"
        />

        {tab === "people" && peopleSection}

        {tab === "tasks" && (
          <div className="mt-4 space-y-3">
            {tasksLoading && (
              <div className="text-sm text-gray-600">Loading tasks...</div>
            )}
            {tasksError && (
              <div className="text-sm text-red-600">
                Failed to load tasks: {tasksError}
              </div>
            )}
            {!tasksLoading && !tasksError && tasks.length === 0 && (
              <div className="text-sm text-gray-600">
                Tidak ada tugas untuk tahun ini.
              </div>
            )}
            {!tasksLoading &&
              !tasksError &&
              tasks.map((t) => (
                <TaskCard
                  key={t.id}
                  status={t.status}
                  title={t.title}
                  deadline={t.deadline}
                  unread={t.unread}
                  statusIcons={{
                    submitted: "/assets/icons/submitted.png",
                    revision: "/assets/icons/revisi.png",
                    approved: "/assets/icons/approved.png",
                  }}
                  onViewDetail={() =>
                    router.push("/main-Page/about/division-of/detail-task")
                  }
                />
              ))}

            {!tasksLoading && !tasksError && (
              <button
                onClick={() => {
                  const params = new URLSearchParams();
                  const yearValue = searchParams.get("year");
                  const divisionId = searchParams.get("division_id");

                  if (divisionId) params.set("division_id", divisionId);
                  if (yearValue) params.set("year", yearValue);

                  router.push(
                    `/admin/about/division-of/detail-task/create-task?${params.toString()}`,
                  );
                }}
                className="fixed bottom-20 right-6 h-12 w-12 rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700 flex items-center justify-center text-3xl"
                aria-label="Create new task"
              >
                +
              </button>
            )}
          </div>
        )}

        {tab === "resources" && <Resources />}
      </div>
    </div>
  );
}
