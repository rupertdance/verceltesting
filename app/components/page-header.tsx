// import classNames from "classnames"
import { BreadcrumbsProps, Breadcrumbs } from "components/breadcrumbs"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string
  breadcrumbs?: BreadcrumbsProps["items"]
}

export function PageHeader({
  heading,
  breadcrumbs,
  children,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div className="container">
      {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      <div
        className="flex items-center py-10 text-text">
        <h1 className="max-w-4xl font-serif text-2xl text-center md:text-5xl lg:text-4xl">
          {heading}
        </h1>
        {children}
      </div>
    </div>
  )
}
