import { DrupalNode, DrupalTaxonomyTerm } from "next-drupal"
// import { useTranslation } from "next-i18next"

import { Breadcrumbs } from "components/breadcrumbs"
import { PageHeader } from "components/page-header"
import { NodeArticleTeaser } from "./node--article--teaser"
import { resourceLimits } from "worker_threads"
import Link from "next/link"

export interface TaxonomyTermTopicProps {
  term: DrupalTaxonomyTerm

}

export function TaxonomyTermTopic({
  term,

}: TaxonomyTermTopicProps) {
  

  return (
    <div className="container">
      <p>Taxonomy topic</p>
      <Breadcrumbs
        items={[
          {
            title: term.name,
          },
        ]}
      />
      <PageHeader heading={term.name} />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {term.articles.map((article) => (
          <NodeArticleTeaser key={article.id} node={article} />
        ))}
      </div>
      {/* all the topics are below... */}
     
      <h1 className="my-2 py-2 max-w-4xl font-sans text-2xl ">All topics</h1>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-8 mt-6">
     
        {term.tags.map((tag) => (
          <Link key={tag.id}  href={tag.path.alias} className="inline-flex items-center text-xs px-2  py-2 border border-gray-600 rounded-full hover:bg-gray-100"
          > {tag.name}</Link>
        ))}
      </div>
    </div>
  )
}
