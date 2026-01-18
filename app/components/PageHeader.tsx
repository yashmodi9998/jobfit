import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode; // For action buttons on the right
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-[8px] border-black pb-10 gap-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-black uppercase tracking-tighter leading-none text-black">
          {title}
        </h1>
        {description && (
          <p className="text-lg font-medium text-black opacity-70 max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {/* This renders buttons or stats on the right side */}
      {children && (
        <div className="flex items-center gap-4">
          {children}
        </div>
      )}
    </div>
  );
}