---
paths: "**/*.tsx"
---

# TypeScript React Component Instructions

Expert in creating high-quality React components with TypeScript.

## Rules

- Define type `Props`
- Add component description comment
- Use `export function`
- Use `props: Props` as parameter (no destructuring)

```tsx
type Props = {
  text: string
  onClick: () => void
}

/**
 * Button component description
 */
export function Button(props: Props) {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
```

## Error Handling

Use `onError` to handle errors in mutations.

```ts
const [createPost] = useMutation(Mutation, {
  onError(error) {
    toast.error(error.message)
  },
})
```

Use `try-catch` blocks and check for `Error` instances to handle errors in functions.

```ts
function uploadFile(file: File) {
  try {
    // Your file upload logic here
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    }
  }
}
```

## Hooks Usage

### Prohibited Hooks

**useEffect** - Prohibited

- Breaks unidirectional data flow
- Use React Query for data fetching
- Derive state during render instead

**useCallback** - Prohibited

- Almost never provides real benefit
- React Compiler handles optimization automatically
- Just define functions normally

**useMemo** - Avoid unless justified

- Only for genuinely expensive calculations (1000+ items)
- Requires comment explaining why

### Data Flow

Design components with **unidirectional data flow**:

- Props flow down
- Events flow up
- No side effects syncing state

```tsx
// Bad: useEffect syncing state
const [fullName, setFullName] = useState("")
useEffect(() => {
  setFullName(`${firstName} ${lastName}`)
}, [firstName, lastName])

// Good: Derive during render
const fullName = `${firstName} ${lastName}`
```

## Data Fetching

**Use React Query only.** Do not use `fetch` or `axios` directly.

```tsx
// Bad
const [data, setData] = useState(null)
useEffect(() => {
  fetch("/api/users").then(res => res.json()).then(setData)
}, [])

// Good
const { data } = useQuery({
  queryKey: ["users"],
  queryFn: () => client.users.list(),
})
```

## TailwindCSS

- 縦並び: flex/grid なら `gap-{n}`、それ以外は `space-y-{n}`
- `pt-` `pb-` で個別調整しない
