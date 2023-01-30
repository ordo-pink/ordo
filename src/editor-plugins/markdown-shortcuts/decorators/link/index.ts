import createLinkStrategy from "./link-strategy"
import Link from "../../components/link"

const createLinkDecorator = () => ({
  strategy: createLinkStrategy(),
  component: Link,
})

export default createLinkDecorator
