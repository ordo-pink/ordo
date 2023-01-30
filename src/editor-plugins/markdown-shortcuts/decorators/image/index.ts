import createImageStrategy from "./image-strategy"
import Image from "../../components/image"

const createImageDecorator = () => ({
  strategy: createImageStrategy(),
  component: Image,
})

export default createImageDecorator
