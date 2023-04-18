import Image from "next/image"
import Link from "next/link"
import { DrupalNode } from "next-drupal"

import { absoluteUrl, formatDate } from "lib/utils"
import { NodeArticleTeaser } from "components/node--article--teaser"

interface NodeArticleProps {
  node: DrupalNode
}

export function NodeEdition({ node, ...props }: NodeArticleProps) {
  return (
    <article {...props}>

      <h1 className="mb-4 text-6xl  leading-tight">{node.title}</h1>


      <div className="mb-4 text-gray-600">

        <span>Created - {formatDate(node.created)}</span>
      </div>
      {node.field_image.uri && (
        <figure>
          <Image
            src={absoluteUrl(node.field_image.uri.url)}
            width={250}
            height={0}
            alt={node.field_image.resourceIdObjMeta.alt}
            priority
          />
          {node.field_image.resourceIdObjMeta.title && (
            <figcaption className="py-2 text-sm text-center text-gray-600">
              {node.field_image.resourceIdObjMeta.title}
            </figcaption>
          )}
        </figure>
      )}
      {node.body?.processed && (
        <div
          dangerouslySetInnerHTML={{ __html: node.body?.processed }}
          className="mt-6 font-serif text-xl leading-loose prose"
        />
      )}

      {node.field_essays && (
        <div>
          <h2 className="font-black text-4xl border-y my-2 py-2 border-black	">Essays</h2>
          <div className="mb-4 grid grid-cols-4 gap-4 leading-tight">
            {node.field_essays.map((article) => (
              <div key={article.id}>
                <NodeArticleTeaser node={article} />
              </div>
            ))}
          </div>
        </div>
      )}

      {node.field_nation_reviewed && (
        <div>
          <h2 className="font-black text-4xl border-y my-2 py-2 border-black	">The Nation Reviewed</h2>
          <div className="mb-4 grid grid-cols-4 gap-4 leading-tight">

            {node.field_nation_reviewed.map((article) => (
              <div key={article.id}>
                <NodeArticleTeaser node={article} />
              </div>
            ))}
          </div>
        </div>
      )}

      {node.field_arts_letters && (
        <div>
          <h2 className="font-black text-4xl border-y my-2 py-2 border-black">Arts & Letters</h2>
          <div className="mb-4 grid grid-cols-4 gap-4 leading-tight">

            {node.field_arts_letters.map((article) => (
              <div key={article.id}>
                <NodeArticleTeaser node={article} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* {node.field_cartoon && (
        <div>
          <h2 className="font-black text-4xl border-y my-2 py-2 border-black	">Cartoon</h2>
          <div className="mb-4  leading-tight">
            

            <div key={node.field_cartoon.id}>
                <NodeArticleTeaser node={node.field_cartoon} />
              </div>

          </div>
        </div>
      )} */}

      {node.field_noted && (
        <div>
          <h2 className="font-black text-4xl border-y my-2 py-2 border-black	">Noted</h2>
          <div className="mb-4 grid grid-cols-4 gap-4 leading-tight">

            {node.field_noted.map((article) => (
               <div key={article.id}>
               <NodeArticleTeaser node={article} />
             </div>

            ))}
          </div>
        </div>
      )}
      {node.field_vox && (
        <div>
          <h2 className="font-black text-4xl border-y my-2 py-2 border-black	">Vox</h2>
          <div className="mb-4 grid grid-cols-4 gap-4 leading-tight">

            {node.field_vox.map((article) => (
            <div key={article.id}>
              < NodeArticleTeaser node={article} />
            </div>

            ))}
          </div>
        </div>
      )}

    </article>
  )
}

