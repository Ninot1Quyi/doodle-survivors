import { env } from 'cloudflare:workers';
import { handleStats } from '../../stats-service.mjs';
export const dynamic = 'force-dynamic';
export function GET(request: Request) { return handleStats(request, env.DB); }
export function POST(request: Request) { return handleStats(request, env.DB); }
