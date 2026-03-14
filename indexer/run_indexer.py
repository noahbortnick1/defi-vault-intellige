#!/usr/bin/env python3
"""
DeFi Vault Intelligence - Data Indexer

Fetches vault data from external sources and normalizes it for the backend API.
"""

import json
import os
from pathlib import Path
from datetime import datetime
from adapters.defillama import DeFiLlamaAdapter
from dotenv import load_dotenv

load_dotenv()


def ensure_output_dir():
    """Ensure the output directory exists"""
    output_dir = Path(os.getenv("OUTPUT_DIR", "./data"))
    output_dir.mkdir(parents=True, exist_ok=True)
    return output_dir


def save_vaults(vaults, output_dir: Path):
    """Save normalized vaults to JSON file"""
    output_file = output_dir / "vaults.json"
    
    vault_dicts = [vault.model_dump() for vault in vaults]
    
    with open(output_file, "w") as f:
        json.dump(vault_dicts, f, indent=2)
    
    print(f"\n✅ Saved {len(vaults)} vaults to {output_file}")
    
    stats = {
        "total_vaults": len(vaults),
        "total_tvl": sum(v["tvl"] for v in vault_dicts),
        "avg_apy": sum(v["apy"] for v in vault_dicts) / len(vault_dicts) if vault_dicts else 0,
        "chains": list(set(v["chain"] for v in vault_dicts)),
        "protocols": list(set(v["protocol"] for v in vault_dicts)),
        "generated_at": datetime.utcnow().isoformat(),
    }
    
    stats_file = output_dir / "stats.json"
    with open(stats_file, "w") as f:
        json.dump(stats, f, indent=2)
    
    print(f"✅ Saved statistics to {stats_file}")
    
    return stats


def print_summary(stats):
    """Print indexing summary"""
    print("\n" + "="*60)
    print("INDEXING SUMMARY")
    print("="*60)
    print(f"Total Vaults:    {stats['total_vaults']}")
    print(f"Total TVL:       ${stats['total_tvl']:,.0f}")
    print(f"Average APY:     {stats['avg_apy']:.2f}%")
    print(f"Chains:          {', '.join(stats['chains'][:5])}{'...' if len(stats['chains']) > 5 else ''}")
    print(f"Protocols:       {', '.join(stats['protocols'][:5])}{'...' if len(stats['protocols']) > 5 else ''}")
    print(f"Generated:       {stats['generated_at']}")
    print("="*60 + "\n")


def main():
    """Main indexer entry point"""
    print("🚀 DeFi Vault Intelligence - Data Indexer")
    print("="*60)
    
    output_dir = ensure_output_dir()
    print(f"📁 Output directory: {output_dir.absolute()}\n")
    
    print("📊 Running DeFiLlama adapter...")
    defillama = DeFiLlamaAdapter()
    vaults = defillama.fetch_vaults(limit=100)
    
    if not vaults:
        print("❌ No vaults fetched. Exiting.")
        return
    
    stats = save_vaults(vaults, output_dir)
    print_summary(stats)
    
    print("✨ Indexing complete! Backend can now load this data.")
    print(f"   Run: cd ../backend && uvicorn app.main:app --reload")


if __name__ == "__main__":
    main()
