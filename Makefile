update:
	bunx --bun shadcn@latest add -a -o -y
	bunx --bun shadcn@latest migrate radix -y
	bunx npm-check-updates -u
	vp install
