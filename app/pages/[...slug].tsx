import { GetServerSidePropsContext, GetServerSidePropsResult, GetStaticPathsResult, GetStaticPropsResult } from "next"
import Head from "next/head"
import { DrupalNode } from "next-drupal"

import { drupal } from "lib/drupal"
import { NodeArticle } from "components/node--article"
import { NodeEdition } from "components/node--edition"
import { NodeContributor } from "components/node--contributor"

import { NodeBasicPage } from "components/node--basic-page"
import { Layout } from "components/layout"

import {DrupalJsonApiParams} from 'drupal-jsonapi-params';


// const RESOURCE_TYPES = ["node--page", "node--article"]

interface NodePageProps {
  resource: DrupalNode
}

export default function NodePage({ resource }: NodePageProps) {
  if (!resource) return null

  return (
    <Layout>
      {/* should this metatag head stuff live here? surely somewhere else right? -test two */}
      <Head>
        <title>{resource.title} </title>
        {resource.metatag?.length ? (
          resource.metatag.map((tag, index) => {
            if (tag.attributes.rel === "canonical") {
              return null
            }

            if (tag.attributes.name === "title") {
              return (
                <title key={tag.attributes.name}>{tag.attributes.content}</title>
              )
            }
            const Tag = tag.tag as keyof JSX.IntrinsicElements
            return <Tag key={index} {...tag.attributes}></Tag>
          })
        ): ''}
      </Head>
      {/* node types here */}
      {resource.type === "node--page" && <NodeBasicPage node={resource} />}
      {resource.type === "node--article" && <NodeArticle node={resource} />}
      {resource.type === "node--edition" && <NodeEdition node={resource as DrupalNode} />}
      {resource.type === "node--contributor" && <NodeContributor node={resource} />}
    </Layout>
  )
}

// export async function getStaticPaths(context): Promise<GetStaticPathsResult> {
//   return {
//     paths: await drupal.getStaticPathsFromContext(RESOURCE_TYPES, context),
//     fallback: "blocking",
//   }
// }

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<NodePageProps>> {

  const path = await drupal.translatePathFromContext(context)

  if (!path) {
    return {
      notFound: true,
    }
  }

  const params = new DrupalJsonApiParams()
  const type = path.jsonapi.resourceName





  // let params = {}
  if (type === "node--article") {
    // params.addFields("node--article", ["title", "path", "body", "created", "field_image", "field_contributor", "field_subtitle", "field_main_topic", "field_edition", "field_edition_section"])
    params.addInclude(['field_main_topic', 'uid', 'field_contributor', 'field_image', "field_edition_section", "field_edition"])
          .addFields("node--edition", ["title", "path", "body",  "created", "field_image"]) // Limit to ONLY these fields (efficiency++)
          .addInclude(['field_edition.field_image']) // Include the image info (not by default there...?)
    // params = {
    //   include: "field_image,uid, field_contributor, field_edition, field_edition_section",
    // }
  }

  if (type === "node--edition") {
    params.addFields("node--edition", ["title", "path", "body", "uid", "created", "field_image", "field_essays", "field_nation_reviewed",  "field_arts_letters",  "field_cartoon",  "field_noted",  "field_vox"])
          .addFields("node--article", ["title", "path", "field_image", "created", "field_main_topic", "field_subtitle", "field_contributor"]) //get only these from Articles (majority)
          .addInclude(["field_image",  "field_essays",  
          "field_essays.field_image", 
          "field_nation_reviewed.field_image", 
          "field_arts_letters.field_image", 
          "field_cartoon.field_image", 
          "field_noted.field_image", 
          "field_vox.field_image", 
          "field_nation_reviewed", 
          "field_arts_letters", 
          "field_cartoon", 
          "field_noted", 
          "field_vox"]) 
        .addInclude([
          "field_essays.field_main_topic", 
          "field_nation_reviewed.field_main_topic", 
          "field_arts_letters.field_main_topic", 
          "field_noted.field_main_topic", 
          "field_vox.field_main_topic" ])
        .addInclude([
          "field_essays.field_contributor", 
          "field_nation_reviewed.field_contributor", 
          "field_arts_letters.field_contributor", 
          "field_noted.field_contributor", 
          "field_vox.field_contributor" ])
  }


  if (type === "node--contributor") {
    params.addFields("node--article", ["title", "path", "body", "created", "field_image", "field_contributor", "field_subtitle", "field_main_topic", "field_edition", "field_edition_section"])
  }

  // how best to do taxonomy here
  // if (type === "taxonomy_term--topic") {
  //   params.addFields("node--article", ["title", "path", "body", "created", "field_image", "field_contributor", "field_subtitle", "field_main_topic", "field_edition", "field_edition_section"])
  // }


  // TODO - this feels odd - what is best practice!
  // this needs to be below edidtion and article but above taxonomy topic and contributor, in order for the `resource.id` stuff to work ... why?
  const resource = await drupal.getResourceFromContext<DrupalNode>(
    path,
    context,
    {
      params: params.getQueryObject(),
    }
  )


  // ADDITIONAL RESOURCES
  // if are contributor and need extra info, this comes after `resource` is declared?
  if (type === "node--contributor") {
    const articles = await drupal.getResourceCollection(
      "node--article",
      {
        params: new DrupalJsonApiParams()
        .addFields("node--article", [
          "title",
          "path",
          "status",
          "created",
          "field_image",
          "field_contributor",
          "field_main_topic"
        ])
        .addInclude(["field_image", "field_contributor"]) // this is referencing SELF probably not neccesary
        .addFilter("field_contributor.id", resource.id, "IN")
        .addSort("created", "DESC")
        .getQueryObject(),
      }
    )

    resource.articles = articles
  }
  // if taxonomy etc...



  // At this point, we know the path exists and it points to a resource.
  // If we receive an error, it means something went wrong on Drupal.
  // We throw an error to tell revalidation to skip this for now.
  // Revalidation can try again on next request.
  if (!resource) {
    throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`)
  }

  // If we're not in preview mode and the resource is not published,
  // Return page not found.
  if (!context.preview && resource?.status === false) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      resource,
    },
  }
}
