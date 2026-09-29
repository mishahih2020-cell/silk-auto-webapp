// Cloudflare Worker — доверенный посредник между кнопкой в админке Mini App
// и GitHub Actions. Держит секреты у себя, клиентскому коду они никогда не видны.
//
// Секреты (задаются командой `wrangler secret put <имя>`, НЕ в этом файле):
//   GH_PAT           — fine-grained GitHub token, доступ только к этому репозиторию,
//                       разрешение "Actions: Read and write"
//   ADMIN_PASSWORD   — пароль, который вводится в админ-панели Mini App
//
// Эндпоинты:
//   OPTIONS *        — CORS preflight
//   POST   /trigger   { password } -> запускает workflow "Обновить базу машин"
//   GET    /status     -> статус последнего запуска + текст прогресса из лога

const OWNER = 'mishahih2020-cell';
const REPO = 'silk-auto-webapp';
const WORKFLOW_FILE = 'sync-cars.yml';

function withCors(resp) {
  resp.headers.set('Access-Control-Allow-Origin', '*');
  resp.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  resp.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return resp;
}
function json(data, status) {
  return withCors(new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json' }
  }));
}

function ghFetch(env, path, options) {
  const opts = options || {};
  const headers = Object.assign({
    'Authorization': 'Bearer ' + env.GH_PAT,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'potatuev-auto-admin-worker'
  }, opts.headers || {});
  return fetch('https://api.github.com' + path, Object.assign({}, opts, { headers: headers }));
}

async function handleTrigger(request, env) {
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  if (!body || body.password !== env.ADMIN_PASSWORD) {
    return json({ error: 'unauthorized' }, 401);
  }
  const res = await ghFetch(env, '/repos/' + OWNER + '/' + REPO + '/actions/workflows/' + WORKFLOW_FILE + '/dispatches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref: 'main' })
  });
  if (res.status !== 204) {
    const detail = await res.text();
    return json({ error: 'github_error', detail: detail }, 502);
  }
  return json({ ok: true });
}

async function handleStatus(request, env) {
  const runsRes = await ghFetch(env, '/repos/' + OWNER + '/' + REPO + '/actions/workflows/' + WORKFLOW_FILE + '/runs?per_page=1');
  if (!runsRes.ok) return json({ status: 'unknown' }, 200);
  const runsData = await runsRes.json();
  const run = runsData.workflow_runs && runsData.workflow_runs[0];
  if (!run) return json({ status: 'none' });

  let progressText = null;
  try {
    const jobsRes = await ghFetch(env, '/repos/' + OWNER + '/' + REPO + '/actions/runs/' + run.id + '/jobs');
    const jobsData = await jobsRes.json();
    const job = jobsData.jobs && jobsData.jobs[0];
    if (job) {
      const logRes = await ghFetch(env, '/repos/' + OWNER + '/' + REPO + '/actions/jobs/' + job.id + '/logs');
      if (logRes.ok) {
        const log = await logRes.text();
        const matches = log.match(/(получено \d+ из [\d?]+|Всего получено:.*|cars\.js обновлён:.*)/g);
        if (matches && matches.length) progressText = matches[matches.length - 1].trim();
      }
    }
  } catch (e) { /* лог может быть ещё не готов — не критично */ }

  return json({
    status: run.status,
    conclusion: run.conclusion,
    html_url: run.html_url,
    progressText: progressText,
    updated_at: run.updated_at
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return withCors(new Response(null, { status: 204 }));
    if (url.pathname === '/trigger' && request.method === 'POST') return handleTrigger(request, env);
    if (url.pathname === '/status' && request.method === 'GET') return handleStatus(request, env);
    return withCors(new Response('Not found', { status: 404 }));
  }
};
