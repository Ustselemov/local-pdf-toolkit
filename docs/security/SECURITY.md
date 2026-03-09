# Security

This project was generated with the assistance of Codex AI and prompted by Ustselemov.

## Secrets

The current build does not require runtime secrets.

## Recommended Configuration

- Keep secrets in local untracked `.env` files only if the project grows new integrations.
- Never hardcode credentials, API keys, tokens, or private certificates in source files.
- Preserve `.env.example` as a template with placeholder values only.

## Repository Safety

- `.env` files are ignored
- key and certificate file patterns are ignored
- development logs are ignored
- dependency directories are ignored

## User Data Handling

- files are processed locally in the browser session
- there is no backend upload path in the current product
- contributors should preserve this privacy model unless the architecture is intentionally changed

## Potential Risks

- browser extensions or compromised local environments can still observe local activity
- multiple automatic downloads may be restricted by browser security settings
- very large documents can increase memory pressure inside the browser process

## Safe Deployment Practices

- publish the repository without secrets or sample private documents
- document any future network behavior before introducing it
- if a hosted version is ever introduced, explicitly document what data leaves the client
