// lib/tau/src/impl.ts
var is_array = Array.isArray;
var keys_of = (o) => {
  return Object.keys(o);
};
var for_each_key = (obj, f) => keys_of(obj).forEach((key) => f(key));
// lib/maoka-global-state/src/maoka-global-state.impl.ts
var init_global_state = () => {
  const global_state = {};
  const listeners = {};
  return {
    state: (use) => (key, initial_value, options) => {
      const internal_id = use.id();
      const refresh = use.refresh;
      if (global_state[key] == null)
        global_state[key] = initial_value;
      if (!listeners[key])
        listeners[key] = {};
      if (!listeners[key][internal_id])
        listeners[key][internal_id] = refresh;
      return [
        global_state[key],
        (f) => {
          global_state[key] = f(global_state[key]);
          if (!options || options.autorefresh == null || options.autorefresh === true)
            for_each_key(listeners[key], (id) => listeners[key][id]());
        }
      ];
    }
  };
};
// lib/maoka/src/maoka.impl.ts
var noop = () => {
  return;
};
var is_undefined = (x) => x == null;
var is_fn = (x) => typeof x === "function";
var is_string = (x) => typeof x === "string";
var is_array2 = Array.isArray;
var for_each_key2 = (obj, callback) => Object.keys(obj).forEach((key) => callback(key));
var init_create_component = ({
  create_element,
  create_text,
  hooks
}) => (name, attributes, callback) => () => {
  const internal_id = crypto.randomUUID();
  const on = { create: noop, mount: noop, refresh: noop, unmount: noop };
  const use = {
    id: () => internal_id,
    refresh: () => {
      requestAnimationFrame(() => {
        on.refresh();
        let children2 = callback({ use });
        if (!is_array2(children2))
          children2 = [is_fn(children2) ? children2() : children2];
        const nodes = [];
        children2.forEach((child) => {
          const node = typeof child === "function" ? child() : child;
          if (is_string(node))
            nodes.push(create_text(node));
          else
            nodes.push(node);
        });
        on.unmount();
        element.replaceChildren(...nodes);
      });
    },
    before_create: (f) => void (on.create = f),
    before_mount: (f) => void (on.mount = f),
    before_refresh: (f) => void (on.refresh = f),
    before_unmount: (f) => void (on.unmount = f)
  };
  if (hooks)
    for_each_key2(hooks, (key) => use[key] = hooks[key](use));
  on.create();
  const element = create_element(name);
  for_each_key2(attributes, (attribute) => {
    if (!attribute || !is_string(attribute) || is_undefined(attributes[attribute]))
      return;
    if (attribute.startsWith("on")) {
      element[attribute] = attributes[attribute];
    } else {
      element.setAttribute(attribute, String(attributes[attribute]));
    }
  });
  let children = callback({ use });
  if (!is_array2(children))
    children = [is_fn(children) ? children() : children];
  children.forEach((child) => {
    const node = is_fn(child) ? child() : child;
    if (is_string(node))
      element.appendChild(create_text(node));
    else
      element.appendChild(node);
  });
  on.mount();
  return element;
};

// lib/maoka/main.ts
var create_component = init_create_component({
  create_element: document.createElement.bind(document),
  create_text: document.createTextNode.bind(document),
  hooks: {
    ...init_global_state()
  }
});
var counter = create_component("div", {}, ({ use }) => {
  const [counter2, set_counter] = use.state("counter", 0);
  const interval = counter2 < 10 && setInterval(() => set_counter((v) => v + 1), 100);
  use.before_refresh(() => clearInterval(interval));
  return create_component("button", { onclick: () => set_counter((previous_count) => previous_count + 1) }, () => `${counter2}`);
});
var app = create_component("div", { class: "red", title: "123" }, counter);
document.querySelector("#app")?.appendChild(app());
