# Netlify build verification

Netlify must install build dependencies even when `NODE_ENV=production` is set in the hosting environment. `netlify.toml` sets `NPM_FLAGS="--include=dev"` because Next.js checks the repository's TypeScript test files during its build. Vitest and Playwright remain development dependencies.

The JWT role schema lives in `src/types/auth.ts`. Session verification imports that file directly. Importing the role schema through the CRM domain module also loaded Prisma's CommonJS runtime in the proxy. Netlify's Edge bundler rejected that import with `Failed to load external module @prisma/client`. Database-backed CRM schemas continue to use Prisma in the server application.

Verification on 2026-11-19:

- Session and authentication unit tests: 5 passed.
- A clean checkout passed the local Netlify build and both function bundlers with Next.js 16.4.6 and adapter 5.16.8.
- Commit `2d49a9c822e56e34c6a095435c7e50b1101ec9f9` deployed successfully: [Netlify deploy](https://app.netlify.com/projects/pt-region-companyprofile-project2-nda/deploys/6afe846efadca3d3b6af8709).
- Anonymous preview requests return HTTP 401 from Netlify's preview access protection. Successful publishing verifies the build and deployment; it does not establish authenticated application behavior in the hosted preview.
