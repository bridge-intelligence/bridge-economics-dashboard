import { useEffect, useState } from "react";

const GATEWAY = "https://gateway.service.d.bridgeintelligence.ltd";
const PUBLIC_KEY = "bridge-public-read-2026"; // Public, read-only, rate-limited.

interface Asset {
  id: string;
  symbol: string;
  name: string;
  assetClass: string;
  pegAsset: string;
  pegRatio: number;
  totalIssued: number;
  status: string;
  externalAttestationUrl?: string;
}

export function App() {
  const [assets, setAssets] = useState<Asset[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${GATEWAY}/api/v1/assets`, {
      headers: { "X-API-Key": PUBLIC_KEY, Accept: "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Asset[]) => setAssets(data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="dashboard">
      <header className="header">
        <div className="logo">BRIDGE</div>
        <nav className="subtitle">Platform economics — live</nav>
      </header>

      <section className="grid">
        <Card title="Tokenized assets" value={assets?.length ?? "—"} subtitle="registered in tokenization-register" />
        <Card title="Stablecoins" value={assets?.filter((a) => a.assetClass === "STABLECOIN").length ?? "—"} subtitle="BRIDGE-issued + listed" />
        <Card title="Commodities" value={assets?.filter((a) => a.assetClass === "COMMODITY").length ?? "—"} subtitle="bGOLD, bWHEAT, bRICE..." />
        <Card title="Listed natives" value={assets?.filter((a) => a.assetClass === "LISTED_NATIVE").length ?? "—"} subtitle="BTC, ETH, SOL" />
      </section>

      <section className="asset-table">
        <h2>Asset catalog</h2>
        {loading && <p>Loading…</p>}
        {error && <p className="error">Error: {error}</p>}
        {assets && (
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Class</th>
                <th>Peg</th>
                <th>Issued</th>
                <th>Status</th>
                <th>Attestation</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr key={a.id}>
                  <td className="mono bold">{a.symbol}</td>
                  <td>{a.name}</td>
                  <td><span className={`tag tag-${a.assetClass.toLowerCase()}`}>{a.assetClass}</span></td>
                  <td className="mono">{a.pegAsset}</td>
                  <td className="mono right">{Number(a.totalIssued).toLocaleString()}</td>
                  <td><span className={`tag tag-${a.status.toLowerCase()}`}>{a.status}</span></td>
                  <td>
                    {a.externalAttestationUrl ? (
                      <a href={a.externalAttestationUrl} target="_blank" rel="noreferrer">view</a>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <footer>
        <p>
          Data live from <a href={`${GATEWAY}/api/v1/assets`} target="_blank" rel="noreferrer">{GATEWAY}</a>.
          This is draft 0.1 — TVL, revenue, per-chain supply, reserves feeds land in subsequent releases.
          See{" "}
          <a href="https://github.com/bridge-intelligence/bridge-docs/blob/dev/economics/PLATFORM-ECONOMICS.md" target="_blank" rel="noreferrer">
            bridge-docs/economics
          </a>{" "}
          for the full model.
        </p>
      </footer>
    </main>
  );
}

function Card({ title, value, subtitle }: { title: string; value: number | string; subtitle?: string }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
      {subtitle && <div className="card-subtitle">{subtitle}</div>}
    </div>
  );
}
