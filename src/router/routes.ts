import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
	{
		path: "/",

		component: () => import("layouts/MainLayout.vue"),
		children: [
			{ path: "", name: "index", component: () => import("pages/IndexPage.vue") },
			{
				path: "/admin",
				name: "admin",
				component: () => import("pages/AdminPage.vue"),
				meta: { requiresAuth: true },
			},
		],
		meta: { requiresAuth: true },
	},

	{
		path: "/login",
		component: () => import("layouts/MainLayout.vue"),
		children: [{ path: "", name: "login", component: () => import("pages/LoginPage.vue") }],
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: "/:catchAll(.*)*",
		component: () => import("pages/ErrorNotFound.vue"),
	},
];

export default routes;
