type User = {
  username: string;
  email: string;
  role?: string;
  id?: string;
  createdAt?: string;
  isActive?: boolean;
};

type GetUserResopnse = {
  users: User[];
  pagination: Pagination;
};
