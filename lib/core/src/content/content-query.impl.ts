export const ContentQuery: Ordo.Content.QueryStatic = {
	Of: (repo: Ordo.Content.RepositoryAsync) => ({
		get: id => repo.get(id, ""),
	}),
}
