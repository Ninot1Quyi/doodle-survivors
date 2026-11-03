const response = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
export async function handleStats(request, db, now = Date.now()) {
  if (!db) return response({ error: '统计暂时不可用' }, 503);
  try {
    if (request.method === 'POST') {
      const origin = request.headers.get('Origin');
      if (origin && origin !== new URL(request.url).origin) return response({ error: '来源不匹配' }, 403);
      if (!request.headers.get('Content-Type')?.startsWith('application/json')) return response({ error: '需要 JSON' }, 415);
      const raw = await request.text();
      if (raw.length > 1024) return response({ error: '请求过大' }, 413);
      let input; try { input = JSON.parse(raw); } catch { return response({ error: '无效数据' }, 400); }
      if (!input || typeof input.id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.id) || !Number.isSafeInteger(input.activeMs) || input.activeMs < 0 || input.activeMs > 7 * 86400000) {
        return response({ error: '无效局数记录' }, 400);
      }
      // Cumulative updates are monotonic and idempotent. D1 batches are atomic;
      // migration-owned triggers keep the small public aggregate in the same transaction.
      await db.batch([
        db.prepare('INSERT INTO game_runs (id, created_at, updated_at, active_ms) VALUES (?, ?, ?, 0) ON CONFLICT(id) DO NOTHING').bind(input.id, now, now),
        db.prepare('UPDATE game_runs SET active_ms = MAX(active_ms, MIN(?, MAX(0, ? - created_at) + 15000)), updated_at = MAX(updated_at, ?) WHERE id = ?').bind(input.activeMs, now, now, input.id),
      ]);
    } else if (request.method !== 'GET') return response({ error: '方法不支持' }, 405);
    const total = await db.prepare('SELECT runs, active_ms, since FROM game_totals WHERE id = 1').first();
    return response({ runs: total?.runs ?? 0, activeMs: total?.active_ms ?? 0, since: total?.since ?? null });
  } catch (error) {
    console.error('Global game statistics unavailable', error?.message);
    return response({ error: '统计暂时不可用' }, 503);
  }
}
