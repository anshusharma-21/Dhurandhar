import * as fs from "fs";
import * as path from "path";

const envContent = fs.readFileSync(path.resolve(process.cwd(), ".env.local"), "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx !== -1) {
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function checkPaths() {
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
  };

  const res = await fetch(`${url}/rest/v1/`, { headers });
  const spec = await res.json();
  const rpcs = Object.keys(spec.paths || {}).filter((p) => p.startsWith("/rpc/"));
  console.log("Available RPC endpoints:", rpcs);
}

checkPaths().catch(console.error);
