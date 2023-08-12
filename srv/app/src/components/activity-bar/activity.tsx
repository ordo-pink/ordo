type Props = any

export default function Activity({ name }: Props) {
	return <div>{name.slice(0, 1)}</div>
}
