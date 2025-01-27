export const roleSeed: string[] = ['Giảng Viên', 'Văn Thư', 'Thủ Trưởng'];
export const permissionSeed: { code: string; name: string }[] = [
  {
    code: 'letter_received_read',
    name: 'Read the received letter',
  },
  {
    code: 'letter_received_create',
    name: 'Create the received letter',
  },
  {
    code: 'letter_received_update',
    name: 'Update the received letter',
  },
  {
    code: 'letter_received_delete',
    name: 'Delete the received letter',
  },
  {
    code: 'letter_received_approval',
    name: 'Approval the received letter',
  },
  {
    code: 'letter_received_shared',
    name: 'Share task for the received letter',
  },
  {
    code: 'letter_sent_read',
    name: 'Read the sent letter',
  },
  {
    code: 'letter_sent_create',
    name: 'Create the sent letter',
  },
  {
    code: 'letter_sent_update',
    name: 'Update the sent letter',
  },
  {
    code: 'letter_sent_delete',
    name: 'Delete the sent letter',
  },
  {
    code: 'letter_sent_approval',
    name: 'Approval the sent letter',
  },
  {
    code: 'letter_sent_shared',
    name: 'Share task for the sent letter',
  },
  {
    code: 'user_read',
    name: 'Read the user',
  },
  {
    code: 'user_create',
    name: 'Create the user',
  },
  {
    code: 'user_update',
    name: 'Update the user',
  },
  {
    code: 'user_delete',
    name: 'Delete the user',
  },
  {
    code: 'role_read',
    name: 'Read the role',
  },
  {
    code: 'role_create',
    name: 'Create the role',
  },
  {
    code: 'role_update',
    name: 'Update the role',
  },
  {
    code: 'role_delete',
    name: 'Delete the role',
  },
  {
    code: 'category_read',
    name: 'Read the category',
  },
  {
    code: 'category_create',
    name: 'Create the category',
  },
  {
    code: 'category_update',
    name: 'Update the category',
  },
  {
    code: 'category_delete',
    name: 'Delete the category',
  },
  {
    code: 'apartment_read',
    name: 'Read the apartment',
  },
  {
    code: 'apartment_create',
    name: 'Create the apartment',
  },
  {
    code: 'apartment_update',
    name: 'Update the apartment',
  },
  {
    code: 'apartment_delete',
    name: 'Delete the apartment',
  },
];

export const thutruongPermissions = permissionSeed.map(
  (permission) => permission.code,
);

export const vanthuPermissions = [
  'letter_received_read',
  'letter_received_create',
  'letter_received_update',
  'letter_sent_read',
  'letter_sent_create',
  'letter_sent_update',
  'user_read',
  'user_create',
  'user_update',
  'user_delete',
  'role_read',
  'category_read',
  'category_create',
  'category_update',
  'category_delete',
  'apartment_read',
  'apartment_create',
  'apartment_update',
  'apartment_delete',
];

export const giangvienPermissions = [
  'letter_received_read',
  'letter_sent_read',
  'user_read',
  'role_read',
  'category_read',
  'apartment_read',
];

export const adminRole = {
  email: 'admin@eduflow.com',
  role: 'Thủ Trưởng',
};
