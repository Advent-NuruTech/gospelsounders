export const ADMIN_BASE_PATH = "/mg-sp";
export const ADMIN_LOGIN_PATH = `${ADMIN_BASE_PATH}/login`;

function cleanAdminSegment(path = "") {
  const trimmed = path.trim();
  if (!trimmed || trimmed === "/") return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function adminPath(path = "") {
  return `${ADMIN_BASE_PATH}${cleanAdminSegment(path)}`;
}

export const ADMIN_ROUTES = {
  dashboard: ADMIN_BASE_PATH,
  login: ADMIN_LOGIN_PATH,
  membersAdd: adminPath("/members/add-member"),
  membersEdit: adminPath("/members/edit-member"),
  sabbathSchool: adminPath("/sabbath-school"),
  sabbathSchoolAdd: adminPath("/sabbath-school/add-lesson"),
  sabbathSchoolEdit: adminPath("/sabbath-school/edit-lesson"),
  blogPost: adminPath("/blog/post"),
  blogDelete: adminPath("/blog/blog-delete"),
  bibleStudies: adminPath("/bible-studies"),
  uploadVideo: adminPath("/upload-video"),
  receivedPrayer: adminPath("/received-prayer"),
};
