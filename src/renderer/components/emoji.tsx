import React from "react"

export const Emoji: React.FC<{ icon: string }> = ({ icon, children }) => (
	<span>
		{icon}&nbsp;&nbsp;{children}
	</span>
)
