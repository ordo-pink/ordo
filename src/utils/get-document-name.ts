export const getDocumentName = (name: string = "") => {
  return name.endsWith(".md") ? name.slice(0, -3) : name;
};
