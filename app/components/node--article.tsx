import Image from "next/image"
import Link from "next/link"

import { DrupalNode } from "next-drupal"

import { absoluteUrl, formatDate } from "lib/utils"

interface NodeArticleProps {
  node: DrupalNode
}

export function NodeArticle({ node, ...props }: NodeArticleProps) {
  return (
    <article {...props}>
      <section className="header-zone ">

        
        <Link href={node.field_edition?.path?.alias} className="no-underline hover:text-blue-600">
          <span className="mb-4 text-md font-black leading-tight">{node.field_edition.title} </span>
        </Link>
        {/* <Link href={node.field_edition_section?.path?.alias} className="no-underline hover:text-blue-600"> */}
          <span className="mb-4 text-md leading-tight "> {node.field_edition_section.name}</span>
        {/* </Link> */}
        
        <h1 className="mb-4 text-6xl font-black leading-tight">{node.title}</h1>
        <div className="mb-4 text-gray-600">
          By {" "}
          {node.field_contributor.map((author) => (
            <span key={author.id}>
              <Link href={author.path.alias} className="no-underline hover:text-blue-600">
                <span className="font-semibold">{author.title} </span>
              </Link>
            </span>
          ))}

        </div>
        {node.field_image && (
          <figure>
            <Image
              src={absoluteUrl(node.field_image.uri.url)}
              width={768}
              height={400}
              alt={node.field_image.resourceIdObjMeta.alt}
              priority
            />
            {node.field_image_caption && (
              <figcaption className="py-2 text-sm text-gray-600">
                {node.field_image_caption.processed}
              </figcaption>
            )}
          </figure>
        )}
      </section>
      <section className="body-zone grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <div className="mt-6 font-sans text-2xl font-semibold	">{node.field_subtitle.value}</div>
          {node.body?.processed && (
            <div
              dangerouslySetInnerHTML={{ __html: node.body?.processed }}
              className="mt-6 font-serif text-xl leading-loose prose"
            />
          )}
          <div className="mt-6 leading-loose">
            {node.field_contributor.map((author) => (
              <span key={author.id}>
                <Link href={author.path.alias} className="no-underline hover:text-blue-600">
                  <p className="font-semibold">{author.title} </p>
                </Link>
                  <div className="font-normal"  dangerouslySetInnerHTML={{ __html: author.body?.processed }} />
              
              </span>
            ))}
          </div>

        </div>
        <div className="col-span-1">
          <div className="mt-6 mb-6"> <span > Published on {formatDate(node.created)}</span></div>
          <div>
            <span className="mb-4 text-md leading-tight">From the {node.field_edition.title} issue</span>
            {node.field_edition.field_image && (
              <Link href={node.field_edition?.path?.alias}>
                <figure>
                    <Image
                      src={absoluteUrl(node.field_edition.field_image.uri.url)}
                      width={150}
                      height={200}
                      alt={node.field_edition.field_image.resourceIdObjMeta.alt}
                      priority
                    />
                    {node.field_edition.field_image.resourceIdObjMeta.title && (
                      <figcaption className="py-2 text-sm text-center text-gray-600">
                        {node.field_edition.field_image.resourceIdObjMeta.title}
                      </figcaption>
                    )}
                  </figure>
              </Link>
            )}
          </div>
        </div>
      </section>
    </article>
  )
}
