import React from "react";

const roleColors: Record<string, string> = {
  OWNER: "bg-purple-100 text-purple-800 border-purple-200",
  ORGANIZER: "bg-blue-100 text-blue-800 border-blue-200",
  CHECK_IN_OPERATOR: "bg-orange-100 text-orange-800 border-orange-200",
};

const UserRoleBadge: React.FC<{ role: string }> = ({ role }) => (
  <span
    className={`px-2 py-1 rounded-md text-xs font-bold border ${roleColors[role] || "bg-gray-100"}`}
  >
    {role.replace(/_/g, " ")}
  </span>
);

export default UserRoleBadge;
