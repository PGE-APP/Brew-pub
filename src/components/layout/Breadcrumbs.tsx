import { ChevronRight, Home } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
};

export type BreadcrumbsProps = {
  /** Ordered list of labels showing the current navigation path. */
  items: BreadcrumbItem[];
};

/**
 * Breadcrumb navigation indicator for the dashboard page.
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-ink-muted" aria-label="Breadcrumb">
      <Home className="h-4 w-4" />
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-ink">{item.label}</span>
        </div>
      ))}
    </nav>
  );
}
