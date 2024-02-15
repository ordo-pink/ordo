import { DataRepository, FSID, PlainData } from "@ordo-pink/data"
import { GTD_DONE_LABEL, GTD_INBOX_LABEL, GTD_LABEL, GTD_PROJECT_LABEL } from "./gtd.constants"
import { Either } from "@ordo-pink/either"

export const GTDRepository = {
	getProjects: (data: PlainData[] | null) =>
		DataRepository.filterData(data, GTDRepository.isProject),
	getInbox: (data: PlainData[] | null) => DataRepository.filterData(data, GTDRepository.isInbox),
	getDone: (data: PlainData[] | null) => DataRepository.filterData(data, GTDRepository.isDone),
	isProject: (data: PlainData) =>
		[GTD_LABEL, GTD_PROJECT_LABEL].every(label => data.labels.includes(label)),
	isInbox: (data: PlainData) =>
		[GTD_LABEL, GTD_INBOX_LABEL].every(label => data.labels.includes(label)) &&
		!data.labels.includes(GTD_PROJECT_LABEL),
	isDone: (data: PlainData) => data.labels.includes(GTD_DONE_LABEL),
	getClosestProjectE: (data: PlainData[] | null, fsid: FSID) =>
		Either.fromNullable(DataRepository.getParentChain(data, fsid))
			.map(parentChain => parentChain.toReversed())
			.chain(parentChain =>
				Either.fromNullable(
					parentChain.length === 1 && GTDRepository.isProject(parentChain[0])
						? parentChain[0]
						: parentChain.reduce(
								(acc, v) => (!acc && GTDRepository.isProject(v) ? v : acc),
								null as PlainData | null,
							),
				),
			),
}
