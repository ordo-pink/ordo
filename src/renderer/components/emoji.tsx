import React from "react"

type EmojiProps = {
	icon: string
}

export const Emoji: React.FC<EmojiProps> = ({ icon, children }) => (
	<span>
		{icon}&nbsp;&nbsp;{children}
	</span>
)
