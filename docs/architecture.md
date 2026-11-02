# Architecture Notes

## Responsibilities
- Client: accessible page structure, interaction, presentation, and user-facing errors.
- Server: HTTP API, validation, business rules, and future persistence.
- Docs: architecture decisions, audit methodology, evidence, and findings.
- Tests: automated regression checks for API, UI, and accessibility.

## Dependency direction
The browser client communicates with the server through HTTP endpoints. The server must not depend on React components. Test boundaries independently and cover important end-to-end flows.

## First vertical slice
`React App → GET /health → FastAPI route → JSON response → accessible status message`

## Future decisions
Document persistence, authentication (if required), API versioning, error formats, and CI accessibility checks before implementing them.
