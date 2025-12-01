const urlConstants = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
    verifyEmail: (token: string) => `/api/auth/verify-email/${token}`,
  },
  users: {
    getUsers: "/api/admin/users",
    updateUserStatus: (id: string) => `/api/admin/users/${id}/toggle-status`,
    deleteUser: (id: string) => `/api/admin/users/${id}`,
  },
  categories: {
    getCategories: "/api/categories",
    createCategory: "/api/categories",
    editCategory: (id: string) => `/api/categories/${id}`,
    deleteCategory: (id: string) => `/api/categories/${id}`,
  },
  artworks: {
    getArtworks: "/api/artworks",
    getArtworkById: (id: string) => `/api/artworks/${id}`,
    createArtwork: "/api/artworks",
    editArtwork: (id: string) => `/api/artworks/${id}`,
    deleteArtwork: (id: string) => `/api/artworks/${id}`,
  },
  siteContents: {
    getSiteContents: "/api/site-contents",
    createSiteContent: "/api/site-contents",
    editSiteContent: (id: string) => `/api/te-contents/${id}`,
    deleteSiteContent: (id: string) => `/api/te-contents/${id}`,
  },
  contact: "/api/contact",
};

export default urlConstants;
