export type RoleKey = "owner" | "editor" | "viewer";

export type RoleFlyweight = Readonly<{
  key: RoleKey;
  label: string;
  description: string;
}>;

const roleDefinitions: Record<RoleKey, Omit<RoleFlyweight, "key">> = Object.freeze({
  owner: {
    label: "Owner",
    description: "Full control over the playlist and collaborators.",
  },
  editor: {
    label: "Editor",
    description: "Can edit playlist content and manage entries.",
  },
  viewer: {
    label: "Viewer",
    description: "Read-only access to playlist content.",
  },
});

const roleCache = new Map<RoleKey, RoleFlyweight>();

export const getRole = (key: RoleKey): RoleFlyweight => {
  const cached = roleCache.get(key);
  if (cached) return cached;
  const role = Object.freeze({ key, ...roleDefinitions[key] });
  roleCache.set(key, role);
  return role;
};

const supportedRoleKeys = Object.freeze(Object.keys(roleDefinitions) as RoleKey[]);
const supportedRoles = Object.freeze(supportedRoleKeys.map((key) => getRole(key)));

export const getSupportedRoleKeys = () => supportedRoleKeys;
export const getSupportedRoles = () => supportedRoles;
