import { createRouter, createWebHashHistory } from "vue-router";
import Dashboard from "@/views/Dashboard.vue";
import Tables from "@/views/Tables.vue";
import Profile from "@/views/Profile.vue";
import polarity from "@/views/polarity.vue";
import sentiment from "@/views/sentiment.vue";
import concept from "@/views/concept.vue";
import emotion from "@/views/emotion.vue";

import store from "../store";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/polarity",
    name: "Polarity",
    component: polarity,
  },
  {
    path: "/sentiment",
    name: "Sentiment",
    component: sentiment,
  },
  {
    path: "/concept",
    name: "Concept",
    component: concept,
  },
  {
    path: "/emotions",
    name: "Emotions",
    component: emotion,
  },
  {
    path: "/upload",
    name: "Upload",
    component: Tables,
  },
  {
    path: "/documentation",
    name: "Documentation",
    component: Profile,
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

router.beforeEach((to, from) => {
  let keys = Object.keys(store.state.excelData).filter(key => store.state.excelData[key].status);
  if (keys.length === 0 && to.name !== 'Upload') {
    return { name: 'Upload' }
  }
});

export default router;
