"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NavigationBar from "@/components/molecules/navigationbar/navigationbar";
import UserCard from "@/components/molecules/cards/user-card/user-card";
import TasksSection from "@/components/pages/division/all/tasks-section";
import { Resource as Resources } from "@/components/organisms/resources/resources";
import { useDivisionMembers } from "@/hooks/useDivisionMembers";
import { useDivisionTasks } from "@/hooks/useDivisionTasks";
import { getAuthState } from "@/utils/auth";

export default function AllDivision({
  imageSrc = "/assets/images/download.png",
  imageAlt = "All Division Landing Preview",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState("people");
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const items = [
    { key: "people", label: "People" },
    { key: "tasks", label: "Tasks" },
    { key: "resources", label: "Resources" },
  ];

  useEffect(() => {
    try {
      const { user } = getAuthState();
      const nextRole = user?.role === "admin" ? "admin" : "user";
      setRole(nextRole);
    } catch {
      setRole("user");
    }
  }, []);

  const yearParam = searchParams.get("year") || undefined;
  const { members, loading, error } = useDivisionMembers("all", yearParam);
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useDivisionTasks("all", yearParam);

  const handleViewDetail = (taskId: string | number) => {
    if (role === "admin") {
      router.push("/admin/DetailTaskAdmin");
      return;
    }
    router.push(`/main-Page/about/division-of/detail-task/${String(taskId)}`);
  };

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
            {!tasksLoading && !tasksError && (
              <TasksSection
                tasks={tasks}
                onViewDetail={handleViewDetail}
                emptyMessage="Tidak ada tugas untuk tahun ini."
              />
            )}
          </div>
        )}

        {tab === "resources" && <Resources />}
      </div>
    </div>
  );
}
