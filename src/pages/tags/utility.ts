import { getCollection } from 'astro:content';

export async function getUniqueTags() {
  const posts = await getCollection('post');
  const tags = posts.map(post => post.data.tags).filter(tags => !!tags).flat();
  const uniqueTags = new Set<string>();
  for (const tag of tags) {
    uniqueTags.add(tag);
  }
  const uniqueSortedTags = Array.from(uniqueTags).sort();
  return uniqueSortedTags;
}