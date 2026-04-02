import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/Register.vue"),

    meta: { title: "注册", requiresAuth: false },
  },
  // 公开新闻页面
  {
    path: "/news",
    component: () => import("@/layouts/PublicLayout.vue"),
    meta: { requiresAuth: false },
    children: [
      {
        path: "",
        name: "PublicNewsHome",
        component: () => import("@/views/news/public/index.vue"),
        meta: { title: "新闻首页" },
      },
      {
        path: "detail/:id",
        name: "PublicNewsDetail",
        component: () => import("@/views/news/public/detail.vue"),
        meta: { title: "新闻详情" },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/Home.vue"),
        meta: { title: "首页" },
      },
      // 新闻管理
      {
        path: "news/list",
        name: "NewsList",
        component: () => import("@/views/news/index.vue"),
        meta: { title: "新闻列表" },
      },
      {
        path: "news/create",
        name: "NewsCreate",
        component: () => import("@/views/news/editor.vue"),
        meta: { title: "创建新闻" },
      },
      {
        path: "news/edit/:id",
        name: "NewsEdit",
        component: () => import("@/views/news/editor.vue"),
        meta: { title: "编辑新闻" },
      },
      // 角色权限管理
      {
        path: "roles",
        name: "Role",
        component: () => import("@/views/role/index.vue"),
        meta: { title: "角色管理" },
      },
      {
        path: "roles/permission-assignment/:id",
        name: "PermissionAssignment",
        component: () => import("@/views/role/permission-assignment.vue"),
        meta: { title: "权限分配" },
      },
      // 个人中心
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/views/profile/index.vue"),
        meta: { title: "个人中心" },
      },
      // 分类管理
      {
        path: "categories",
        name: "Category",
        component: () => import("@/views/category/index.vue"),
        meta: { title: "分类管理" },
      },
      // 标签管理
      {
        path: "tags",
        name: "Tag",
        component: () => import("@/views/tag/index.vue"),
        meta: { title: "标签管理" },
      },
      // 文件管理
      {
        path: "files",
        name: "File",
        component: () => import("@/views/file/index.vue"),
        meta: { title: "文件管理" },
      },
      // 操作日志
      {
        path: "logs",
        name: "Log",
        component: () => import("@/views/log/index.vue"),
        meta: { title: "操作日志" },
      },
      // 用户管理
      {
        path: "users",
        name: "User",
        component: () => import("@/views/user/index.vue"),
        meta: { title: "用户管理" },
      },
      {
        path: "users/role-assignment/:id",
        name: "RoleAssignment",
        component: () => import("@/views/user/role-assignment.vue"),
        meta: { title: "角色分配" },
      },
    ],
  },
  {
    path: "/403",
    name: "Forbidden",
    component: () => import("@/views/error/403.vue"),
    meta: { title: "无权限" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/error/404.vue"),
    meta: { title: "页面不存在" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = (to.meta.title as string) || "论坛系统";

  const token = localStorage.getItem("accessToken");
  const requiresAuth = to.meta.requiresAuth !== false;

  if (requiresAuth && (!token || token === "")) {
    // 存储重定向路径到localStorage
    localStorage.setItem('redirect', to.fullPath);
    // 重定向到新闻首页，用户可以通过页面上的登录按钮打开登录模态框
    next({ name: "PublicNewsHome" });
  } else {
    next();
  }
});

export default router;
