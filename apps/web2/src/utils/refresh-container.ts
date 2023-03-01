const createContainer = (parent: HTMLElement, id: string) => {
  const container = document.createElement("div")
  container.id = id

  parent.appendChild(container)

  return container
}

const removeContainer = (id: string) => {
  const container = document.getElementById(id)

  container?.remove()
}

export const refreshContainer = (parent: HTMLElement, id: string) => {
  removeContainer(id)

  return createContainer(parent, id)
}
