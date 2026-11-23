import { expect, test } from '@playwright/test';

test('runs the typed client against both real demo routes', async ({ page }) => {
  await page.goto('/');
  const run = page.getByRole('button', { name: 'Run typed client calls' });
  await run.click();
  const output = page.locator('pre').filter({ hasText: 'geoResponse' });
  await expect(output).toContainText('Mexico City');
  await expect(output).toContainText('"status": "healthy"');
  await expect(run).toBeEnabled();
});

test('reports request failures and unlocks the run button', async ({ page }) => {
  await page.route('**/api/geo?*', route => route.fulfill({ status: 503, json: { error: 'Unavailable' } }));
  await page.goto('/');
  const run = page.getByRole('button', { name: 'Run typed client calls' });
  await run.click();
  await expect(page.getByText(/503|Unavailable/, { exact: false })).toBeVisible();
  await expect(run).toBeEnabled();
});

test('validates all three published API operations', async ({ request }) => {
  const geo = await request.get('/api/geo?latitude=-20&longitude=100');
  expect(geo.status(), await geo.text()).toBe(200);
  expect(await geo.json()).toMatchObject({ city: 'Tokyo', hemisphere: 'south' });
  expect((await request.get('/api/geo?latitude=91&longitude=100')).status()).toBe(400);

  const post = await request.post('/api/geo', { data: { latitude: 18, longitude: 2 } });
  expect(post.status()).toBe(200);
  expect(await post.json()).toMatchObject({ city: 'Madrid' });
  expect((await request.post('/api/geo', { data: { latitude: 'wrong' } })).status()).toBe(422);

  const status = await request.get('/api/status/queue?region=eu');
  expect(status.status()).toBe(200);
  expect(await status.json()).toMatchObject({ service: 'queue', region: 'eu', status: 'degraded' });
  expect((await request.get('/api/status/unknown?region=eu')).status()).toBe(400);
  expect((await request.get('/api/status/cache?region=unknown')).status()).toBe(400);

  console.log('API contract operations exercised: 3/3');
});
