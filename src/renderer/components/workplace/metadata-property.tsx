import React from "react"

type MetadataPropertyProps = {
	name: string
	value: string
}

export const MetadataProperty: React.FC<MetadataPropertyProps> = ({ name, value }) => (
	<div className="flex justify-between text-sm text-gray-500 leading-7">
		<div className="w-4/12">{name}</div>
		<div className="w-8/12">{value}</div>
	</div>
)
