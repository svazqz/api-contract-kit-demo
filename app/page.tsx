import { DemoClient } from './demo-client';

export default function Home() {
  return (
    <main>
      <h1>api-contract-kit demo</h1>
      <p>This project defines API contracts once and reuses them for Next.js handlers, typed client calls, and OpenAPI generation.</p>

      <section>
        <h2>Available endpoints</h2>
        <ul>
          <li>
            <code>GET /api/geo?latitude=19.4326&longitude=-99.1332</code>
          </li>
          <li>
            <code>POST /api/geo</code> with JSON body <code>{`{"latitude":19.43,"longitude":-99.13}`}</code>
          </li>
          <li>
            <code>GET /api/status/database?region=latam</code>
          </li>
        </ul>
      </section>

      <DemoClient />

      <section>
        <h2>OpenAPI docs</h2>
        <p>
          Run <code>npm run generate:openapi</code> to create the static OpenAPI artifact.
        </p>
        <p>
          In GitHub Actions, the workflow publishes that artifact to GitHub Pages at{' '}
          <code>/apps/openapi</code>.
        </p>
      </section>
    </main>
  );
}
