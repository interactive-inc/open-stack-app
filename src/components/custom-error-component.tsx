import type { ErrorComponentProps } from "@tanstack/react-router"
import { ErrorComponent, Link, rootRouteId, useMatch, useRouter } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function CustomErrorComponent(props: ErrorComponentProps) {
  const router = useRouter()

  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  return (
    <div className="flex h-svh min-w-0 flex-1 flex-col items-center justify-center p-2">
      <Card className="w-full max-w-md gap-y-2 p-2">
        <Card className="rounded-md p-2">
          <ErrorComponent error={props.error} />
        </Card>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size={"sm"}
            onClick={() => {
              router.invalidate()
            }}
          >
            {"Try Again"}
          </Button>
          {isRoot ? (
            <Link to="/">
              <Button variant={"secondary"} size={"sm"}>
                {"Home"}
              </Button>
            </Link>
          ) : (
            <Link
              to="/"
              onClick={(e) => {
                e.preventDefault()
                window.history.back()
              }}
            >
              <Button variant={"secondary"} size={"sm"}>
                {"Go Back"}
              </Button>
            </Link>
          )}
        </div>
      </Card>
    </div>
  )
}
