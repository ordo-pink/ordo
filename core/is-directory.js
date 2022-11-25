module.exports = (x) =>
  Boolean(x) && x.children != null && Array.isArray(x.children);
