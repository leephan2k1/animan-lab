import { defineAsyncComponent } from "vue";
import { AUTH_LAYOUT } from "@/constants";
import { PUBLIC_LAYOUT } from "@/constants";

export default function assignGlobalComponents(app) {
  app.component(
    `${PUBLIC_LAYOUT}-layout`,
    defineAsyncComponent(() => import("@/layouts/default"))
  );

  app.component(
    `${AUTH_LAYOUT}-layout`,
    defineAsyncComponent(() => import("@/layouts/auth"))
  );
}
