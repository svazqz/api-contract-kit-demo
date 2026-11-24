import { useEffect, useMemo, useState } from 'react'
import { createHighlighter } from 'shiki'
import { ShikiMagicMove } from 'shiki-magic-move/react'
import 'shiki-magic-move/dist/style.css'
import './App.css'

type CodeLang = 'ts' | 'json' | 'bash'

type SingleFrame = {
  kind: 'single'
  title: string
  goal: string
  lang: CodeLang
  code: string
  highlights: string[]
  narration: string
  output?: string
}

type SyncPanel = {
  title: string
  lang: CodeLang
  code: string
  status: 'ok' | 'warning' | 'error'
  statusText: string
}

type SyncFrame = {
  kind: 'sync'
  title: string
  goal: string
  highlights: string[]
  narration: string
  panels: [SyncPanel, SyncPanel, SyncPanel]
  errors?: string[]
}

type Frame = SingleFrame | SyncFrame

const frames: Frame[] = [
  {
    kind: 'single',
    title: '01. Contract as single source of truth',
    goal: 'Define once and derive server, client, and docs from the same contract.',
    lang: 'ts',
    code: `import { z } from 'zod'
import { createAPIDefinition } from '@svazqz/api-contract-kit/dist/api-contract-kit'

const Coordinates = z.object({
  latitude: z.number(),
  longitude: z.number(),
})

const LocationData = z.object({
  city: z.string(),
  state: z.string(),
  country: z.string(),
})

export const getGeoData = createAPIDefinition({
  method: 'get',
  path: '/geo-data',
  schemas: {
    queryParams: Coordinates,
    response: LocationData,
  },
  openapi: {
    summary: 'Get geo data',
    operationId: 'getGeoData',
    tags: ['geo'],
  },
})`,
    highlights: [
      'Contract, validation, and docs metadata live in one place.',
      'Schema changes propagate to every adapter and consumer.',
      'No duplicate DTO interfaces across layers.',
    ],
    narration:
      'Start with one strongly typed contract. Every downstream artifact comes from this definition.',
  },
  {
    kind: 'single',
    title: '02. Backend adapter with typed handler',
    goal: 'Use the contract in the server and get typed query/payload/response.',
    lang: 'ts',
    code: `import { nextAdapter } from '@svazqz/api-contract-kit/dist/server'
import { getGeoData } from './contracts'

export const GET = nextAdapter(getGeoData, async (_request, query) => {
  const lat = query.latitude
  const lon = query.longitude

  const response = await fetch(\`https://geocode.xyz/\${lat},\${lon}?json=1\`)
  const json = await response.json()
  const full = json.standard || json

  return {
    city: full.city,
    state: full.state,
    country: full.country,
    timezone: full.timezone,
  }
})`,
    highlights: [
      'Handler input is typed from query schema.',
      'Return value is checked against response schema.',
      'Missing fields fail immediately during development.',
    ],
    narration:
      'The adapter turns the contract into compile-time guarantees for route handlers.',
  },
  {
    kind: 'single',
    title: '03. Frontend consumer with synced types',
    goal: 'Call the same contract from frontend without duplicate DTO interfaces.',
    lang: 'ts',
    code: `import { createClient } from '@svazqz/api-contract-kit/dist/client'
import { getGeoData } from './contracts'

const client = createClient({ baseUrl: 'https://my-api.example.com' })

const data = await client.call(getGeoData, {
  query: { latitude: 40.71, longitude: -74.0 },
})

data.city
data.state
data.country
data.timezone`,
    highlights: [
      'Request payload shape is inferred from contract schemas.',
      'Response fields are auto-completed and type-safe.',
      'Frontend receives refactor-safe contracts, not stringly APIs.',
    ],
    narration:
      'The client consumes the same API contract, so request and response types never drift.',
  },
  {
    kind: 'sync',
    title: '04. Schema + server + client fully in sync',
    goal: 'Visualize all three code surfaces side by side when everything is aligned.',
    highlights: [
      'Schema is the source, server implementation follows it, client consumes it.',
      'Green state means no type drift across layers.',
      'This is the baseline before contract evolution.',
    ],
    narration:
      'All three columns are synchronized: contract, server implementation, and client usage.',
    panels: [
      {
        title: 'Schema',
        lang: 'ts',
        status: 'ok',
        statusText: 'Type-safe',
        code: `const LocationData = z.object({
  city: z.string(),
  state: z.string(),
  country: z.string(),
})`,
      },
      {
        title: 'Server',
        lang: 'ts',
        status: 'ok',
        statusText: 'Matches schema',
        code: `return {
  city: full.city,
  state: full.state,
  country: full.country,
}`,
      },
      {
        title: 'Client',
        lang: 'ts',
        status: 'ok',
        statusText: 'Safe reads',
        code: `const data = await client.call(getGeoData, {
  query: { latitude: 40.71, longitude: -74.0 },
})

data.city
data.country`,
      },
    ],
  },
  {
    kind: 'sync',
    title: '05. Contract changes and types catch drift instantly',
    goal: 'Schema evolves first, then server/client show type errors until updated.',
    highlights: [
      'Schema now requires timezone.',
      'Server return payload and client reads are out of sync.',
      'Red state signals compile-time failures before runtime.',
    ],
    narration:
      'As soon as the contract changes, both server and client show precise type errors.',
    panels: [
      {
        title: 'Schema',
        lang: 'ts',
        status: 'ok',
        statusText: 'Updated contract',
        code: `const LocationData = z.object({
  city: z.string(),
  state: z.string(),
  country: z.string(),
  timezone: z.string(),
})`,
      },
      {
        title: 'Server',
        lang: 'ts',
        status: 'error',
        statusText: 'Type error',
        code: `return {
  city: full.city,
  state: full.state,
  country: full.country,
}`,
      },
      {
        title: 'Client',
        lang: 'ts',
        status: 'error',
        statusText: 'Type error',
        code: `const data = await client.call(getGeoData, {
  query: { latitude: 40.71, longitude: -74.0 },
})

data.city
data.timezone`,
      },
    ],
    errors: [
      "server-route.ts: Property 'timezone' is missing in returned object.",
      "geo-widget.tsx: Property 'timezone' does not exist on stale response type.",
    ],
  },
  {
    kind: 'sync',
    title: '06. Resync server and client from schema',
    goal: 'Update implementation and usage to restore full type-safe flow.',
    highlights: [
      'Server includes timezone in returned payload.',
      'Client safely reads the new field.',
      'All layers return to green after alignment.',
    ],
    narration:
      'After updating the server and client, type errors disappear and the contract is synchronized again.',
    panels: [
      {
        title: 'Schema',
        lang: 'ts',
        status: 'ok',
        statusText: 'Stable contract',
        code: `const LocationData = z.object({
  city: z.string(),
  state: z.string(),
  country: z.string(),
  timezone: z.string(),
})`,
      },
      {
        title: 'Server',
        lang: 'ts',
        status: 'ok',
        statusText: 'Fixed',
        code: `return {
  city: full.city,
  state: full.state,
  country: full.country,
  timezone: full.timezone,
}`,
      },
      {
        title: 'Client',
        lang: 'ts',
        status: 'ok',
        statusText: 'Fixed',
        code: `const data = await client.call(getGeoData, {
  query: { latitude: 40.71, longitude: -74.0 },
})

data.city
data.timezone`,
      },
    ],
  },
  {
    kind: 'single',
    title: '07. Runtime validation and mapped errors',
    goal: 'Even if TS passes, runtime validation still protects the contract.',
    lang: 'bash',
    code: `curl "http://localhost:3000/geo?lat=invalid"

# HTTP 400
{
  "error": "[{ \\"code\\": \\"invalid_type\\", \\"expected\\": \\"number\\" }]",
  "at": "query_validation"
}

curl -X POST "http://localhost:3000/geo" \\
  -H "content-type: application/json" \\
  -d '{ "lat": "invalid" }'

# HTTP 422
{
  "error": "[{ \\"code\\": \\"invalid_type\\", \\"expected\\": \\"number\\" }]",
  "at": "payload_validation"
}`,
    highlights: [
      'Validation runs at runtime for untrusted external inputs.',
      'Errors are mapped to query/payload stages for faster debugging.',
      'Types plus runtime guards create defense in depth.',
    ],
    narration:
      'Compile-time safety is strong, and runtime validation protects boundaries with clear error mapping.',
  },
  {
    kind: 'single',
    title: '08. OpenAPI generated from the same contract',
    goal: 'Docs stay in sync because OpenAPI is generated from definitions.',
    lang: 'json',
    code: `{
  "openapi": "3.0.0",
  "paths": {
    "/api/geo-data": {
      "get": {
        "summary": "Get geo data",
        "operationId": "getGeoData",
        "tags": ["geo"],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": ["city", "state", "country", "timezone"]
                }
              }
            }
          }
        }
      }
    }
  }
}`,
    highlights: [
      'OpenAPI output reuses the exact contract schema.',
      'Documentation and runtime stay synchronized by design.',
      'API explorers and SDK generators consume always-current specs.',
    ],
    narration:
      'The same source contract powers docs, eliminating stale API documentation.',
  },
]

function App() {
  const [frameIndex, setFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [highlighter, setHighlighter] = useState<Awaited<
    ReturnType<typeof createHighlighter>
  > | null>(null)

  const frame = frames[frameIndex]

  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      const instance = await createHighlighter({
        themes: ['github-dark', 'github-light'],
        langs: ['ts', 'json', 'bash'],
      })

      if (mounted) {
        setHighlighter(instance)
      } else {
        instance.dispose()
      }
    }

    void initialize()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!isPlaying) {
      return
    }

    const id = window.setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length)
    }, 3000)

    return () => window.clearInterval(id)
  }, [isPlaying])

  const progress = useMemo(
    () => `${frameIndex + 1}/${frames.length}`,
    [frameIndex],
  )

  return (
    <main className="page">
      <section className="header">
        <div>
          <p className="kicker">api-contract-kit animations</p>
          <h1>Contract-driven workflow animation</h1>
          <p className="subtitle">{frame.goal}</p>
        </div>
        <div className="controls">
          <button
            onClick={() =>
              setFrameIndex((prev) => (prev - 1 + frames.length) % frames.length)
            }
          >
            Previous
          </button>
          <button onClick={() => setFrameIndex((prev) => (prev + 1) % frames.length)}>
            Next
          </button>
          <button onClick={() => setIsPlaying((prev) => !prev)}>
            {isPlaying ? 'Pause' : 'Auto-play'}
          </button>
          <span className="progress">{progress}</span>
        </div>
      </section>

      <section className="timeline">
        {frames.map((item, index) => (
          <button
            key={item.title}
            className={`timeline-step ${index === frameIndex ? 'active' : ''}`}
            onClick={() => setFrameIndex(index)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item.kind === 'sync' ? 'Sync flow' : 'Feature'}</strong>
          </button>
        ))}
      </section>

      <section className={frame.kind === 'sync' ? 'workspace workspace-sync' : 'workspace'}>
        <article className="code-card">
          <h2>{frame.title}</h2>
          {highlighter ? (
            frame.kind === 'single' ? (
              <div className="code-scroll" role="region" aria-label={`${frame.title} code`} tabIndex={0}>
                <ShikiMagicMove
                  code={frame.code}
                  lang={frame.lang}
                  theme="github-dark"
                  highlighter={highlighter}
                  options={{ duration: 950, stagger: 0.3, lineNumbers: true }}
                />
              </div>
            ) : (
              <div className="sync-grid">
                {frame.panels.map((panel) => (
                  <article className={`sync-panel ${panel.status}`} key={panel.title}>
                    <header>
                      <h3>{panel.title}</h3>
                      <span className={`status-pill ${panel.status}`}>
                        {panel.statusText}
                      </span>
                    </header>
                    <div className="code-scroll" role="region" aria-label={`${panel.title} code`} tabIndex={0}>
                      <ShikiMagicMove
                        code={panel.code}
                        lang={panel.lang}
                        theme="github-dark"
                        highlighter={highlighter}
                        options={{ duration: 950, stagger: 0.22, lineNumbers: true }}
                      />
                    </div>
                  </article>
                ))}
              </div>
            )
          ) : (
            <pre className="loading">Loading syntax highlighter...</pre>
          )}

          {frame.kind === 'sync' && frame.errors?.length ? (
            <section className="error-stack">
              <h3>Type checker signals</h3>
              <ul>
                {frame.errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>

        <article className="details-card">
          <h3>Feature focus</h3>
          <ul className="feature-list">
            {frame.highlights.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>

          <h3>Narration cue</h3>
          <p>{frame.narration}</p>

          {frame.kind === 'single' && frame.output ? (
            <>
              <h3>Terminal output</h3>
              <pre className="terminal">{frame.output}</pre>
            </>
          ) : null}
        </article>
      </section>
    </main>
  )
}

export default App
