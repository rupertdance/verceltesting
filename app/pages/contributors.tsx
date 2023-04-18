import Head from "next/head"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"

import { DrupalNode } from "next-drupal"

import { drupal } from "lib/drupal"
import { Layout } from "components/layout"
import { NodeContributorTeaser } from "components/node--contributor--teaser"
import Link from "next/link"

interface ContributorsPageProps {
  nodes: DrupalNode[]
  sort: any
}

export default function ContributorsPage({ nodes, sort }: ContributorsPageProps) {
  return (
    <Layout>
      <Head>
        <title>Next The Monthly</title>
        <meta
          name="description"
          content="A Next.js site powered by a Drupal backend."
        />
      </Head>
      <div className="font-black pr-4">Sort By</div>
      <Link href={"?sort=newest"} className="inline-flex items-center px-3 py-1 border border-gray-600 rounded-full hover:bg-gray-100"> Recent </Link>
      <Link href={"?sort=oldest"} className="inline-flex items-center px-3 py-1 border border-gray-600 rounded-full hover:bg-gray-100"> Oldest </Link>
    
      <div>
        <h1 className="mb-10 text-6xl font-black">{sort.text_human} Contributors.</h1>
        {nodes?.length ? (
          nodes.map((node) => (
            <div key={node.id}>
              <NodeContributorTeaser node={node} />
              <hr className="my-20" />
            </div>
          ))
        ) : (
          <p className="py-4">No nodes found</p>
        )}
      </div>
    </Layout>
  )
}


export async function getServerSideProps(
  context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<ContributorsPageProps>> {
  console.log(context.query.sort)
  
  let sort = { text: '-created', text_human: 'Newest'}
  if(context.query.sort == 'newest'){
    sort = { text: '-created', text_human: 'Newest'}
  }else if(context.query.sort == 'oldest'){
    sort = { text: 'created', text_human: 'Oldest'}
  }
  // console.log(context.params)
  const nodes = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
    "node--contributor",
    context,
    {
      params: {
        "filter[status]": 1,
        "fields[node--contributor]": "title,body,path,field_image,uid,created",
        include: "field_image,uid",
        sort: sort.text
      }
      
    }
  )

  return {
    props: {
      nodes,
      sort
    },
  }
}
