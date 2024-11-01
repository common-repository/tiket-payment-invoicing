import React, { useState } from 'react'

interface Props {
	isOpenAsDefault?: boolean
	title?: string
	[key: string]: any
}
const Accordion = ({ title, isOpenAsDefault = false, ...rest }: Props) => {
	const [isOpen, setOpen] = useState<boolean>(isOpenAsDefault)
	const toggle = () => setOpen(!isOpen)

	return (
		<div
			id="health-check-site-status-critical"
			className="health-check-accordion issues"
		>
			<h4 className="health-check-accordion-heading" onClick={toggle}>
				<button
					aria-expanded={isOpen}
					className="health-check-accordion-trigger"
					aria-controls="health-check-accordion-block-dotorg_communication"
					type="button"
				>
					<span className="title">{title}</span>
					<span className="icon" />
				</button>
			</h4>
			<div
				id="health-check-accordion-block-dotorg_communication"
				className="health-check-accordion-panel"
				hidden={!isOpen}
				{...rest}
			/>
		</div>
	)
}

export default Accordion
