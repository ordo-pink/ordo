// index.tsx
var TEXT_ELEMENT = "TEXT_ELEMENT";
var createTextElement = (text) => ({
  type: TEXT_ELEMENT,
  props: { nodeValue: text, children: [] }
});
var render = (element, container) => {
  const dom = element.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type);
  element.props.children.forEach((child) => render(child, dom));
  const isProperty = (key) => key !== "children";
  Object.keys(element.props).filter(isProperty).forEach((name) => {
    dom[name] = element.props[name];
  });
  container.appendChild(dom);
};
var h = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => typeof child === "object" ? child : createTextElement(child))
    }
  };
};
var Component = () => {
  return h("div", null, h("button", {
    onClick: console.log
  }, "hello 1"), h("div", null, "hello 2"));
};
render(h(Component, null), document.getElementById("app"));
