# Security policy

Please report security issues privately to the repository owner rather than opening a public issue. A dedicated security contact will be added when the public repository is created.

## Operational guidance

- Keep DataHub and GitHub tokens in environment variables.
- Use least-privilege, short-lived credentials where possible.
- Do not point the demo at repositories containing secrets.
- Treat generated patches as untrusted until validation and human review complete.
- Keep DataHub mutations disabled unless the operator explicitly approves the writeback.
