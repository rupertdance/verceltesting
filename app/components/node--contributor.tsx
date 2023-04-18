import { DrupalNode } from "next-drupal"
import { NodeArticleTeaser } from "./node--article--teaser"

interface NodeBasicPageProps {
  node: DrupalNode
}

export function NodeContributor({ node, ...props }: NodeBasicPageProps) {
  return (
    <article {...props}>
      <div className="border p-4">
        <h1 className="mb-4 text-6xl font-black leading-tight">{node.title}</h1>
        {node.body?.processed && (
          <div
            dangerouslySetInnerHTML={{ __html: node.body?.processed }}
            className="mt-6 font-serif text-xl leading-loose prose "
          />
        )}
      </div>
      <div>
        <h1 className="mb-10 mt-10 text-4xl font-black">All articles by {node.title}.</h1>
        {node.articles?.length ? (
          node.articles.map((node) => (
            <div key={node.id}>
              <NodeArticleTeaser node={node} />
              <hr className="my-20" />
            </div>
          ))
        ) : (
          <p className="py-4">No nodes found</p>
        )}
      </div>
    </article>
  )
}
