import { createRootRoute, Outlet } from "@tanstack/react-router"
import { CustomErrorComponent } from "@/components/custom-error-component"
import { NotFoundComponent } from "@/components/not-found-component"

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: CustomErrorComponent,
  notFoundComponent: NotFoundComponent,
})

function RootComponent() {
  return <Outlet />
}
