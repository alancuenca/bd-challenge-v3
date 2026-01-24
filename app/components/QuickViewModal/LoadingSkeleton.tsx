"use client";

export const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
      <div className="skeleton aspect-4/5 w-full rounded-2xl" />
      <div className="flex flex-col gap-4">
        <div className="skeleton h-4 w-32 rounded-full" />
        <div className="skeleton h-8 w-3/4 rounded-full" />
        <div className="skeleton h-4 w-40 rounded-full" />
        <div className="skeleton h-4 w-28 rounded-full" />
        <div className="skeleton mt-6 h-12 w-48 rounded-full" />
      </div>
    </div>
  );
};
