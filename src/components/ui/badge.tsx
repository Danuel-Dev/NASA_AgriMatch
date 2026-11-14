import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const badgeVariants = cva(
  "group/badge inline-flex min-h-7 w-fit max-w-full items-center justify-center gap-2 rounded-full border border-transparent px-3 py-1 text-sm font-semibold whitespace-normal transition-colors duration-150 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring motion-reduce:transition-none [&>svg]:pointer-events-none [&>svg]:size-4",
  {
    variants: {
      variant: {
        warning: "bg-warning-surface text-warning-foreground",
        success: "bg-success-surface text-success",
        info: "bg-secondary text-info",
        crop: "bg-accent text-accent-foreground",
        "rotation-blue": "bg-card text-chart-1 border-chart-1",
        "rotation-green": "bg-card text-chart-2 border-chart-2",
        "rotation-pink": "bg-card text-foreground border-chart-3",
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
