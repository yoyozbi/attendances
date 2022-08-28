# Attendances
An app to manage who is present in meetings

## Example configuration
```docker-compose
version: "3.5"
services:
  app:
    image: ghcr.io/yoyozbi/Attendances
    environment:
      SESSION_SECRET: /run/secrets/SESSION_SECRET
secrets:
  SESSION_SECRET:
    external: true

```
