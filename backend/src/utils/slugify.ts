export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const generateUniqueSlug = async (
  text: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> => {
  let slug = slugify(text);
  let counter = 1;

  while (await checkExists(slug)) {
    slug = `${slugify(text)}-${counter}`;
    counter++;
  }

  return slug;
};
