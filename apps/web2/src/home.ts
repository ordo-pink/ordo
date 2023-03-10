import { createExtension } from "./create-extension"

export default createExtension("home", ({ executeCommand, registerCommand }) => {
  registerCommand("home.test", (str) => console.log(str))

  return {
    init: () => ({
      activities: [
        {
          name: "homepage",
          routes: ["/"],
          render: ({ container }) => {
            container.innerHTML = "HELLO WORLD"
          },
          renderIcon: ({ container }) => {
            container.innerHTML = "A"
          },
        },
      ],
    }),
  }
})
