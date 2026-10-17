import { slugifyWithCounter } from '@sindresorhus/slugify'
import { toString } from 'mdast-util-to-string'
import { mdxAnnotations } from 'mdx-annotations'
import { visit } from 'unist-util-visit'

// h2 ids must match the hashes the search index builds in search.mjs.
function rehypeSlugify() {
  return (tree) => {
    let slugify = slugifyWithCounter()
    visit(tree, 'element', (node) => {
      if (node.tagName === 'h2' && !node.properties.id) {
        node.properties.id = slugify(toString(node))
      }
    })
  }
}

export const rehypePlugins = [mdxAnnotations.rehype, rehypeSlugify]
