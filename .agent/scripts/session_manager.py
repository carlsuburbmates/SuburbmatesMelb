#!/usr/bin/env python3
"""
Session Manager - Antigravity Kit
=================================
Analyzes project state, detects tech stack, tracks file statistics, and provides
a summary of the current session.

Usage:
    python .agent/scripts/session_manager.py status [path]
    python .agent/scripts/session_manager.py info [path]
"""

import os
import json
import argparse
from pathlib import Path
from typing import Any, Dict, List


def get_project_root(path: str) -> Path:
    return Path(path).resolve()


def analyze_package_json(root: Path) -> Dict[str, Any]:
    pkg_file = root / "package.json"
    if not pkg_file.exists():
        return {"type": "unknown", "dependencies": {}}

    try:
        with open(pkg_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except (json.JSONDecodeError, OSError) as e:
        return {"error": str(e)}

    all_deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}
    stack = _detect_stack(all_deps)

    return {
        "name": data.get("name", "unnamed"),
        "version": data.get("version", "0.0.0"),
        "stack": stack,
        "scripts": list(data.get("scripts", {}).keys())
    }


def _detect_stack(all_deps: Dict[str, str]) -> List[str]:
    """Detect tech stack from dependency map."""
    stack: List[str] = []

    # Framework detection (mutually exclusive)
    framework_checks = [
        ("next", "Next.js"),
        ("react", "React"),
        ("vue", "Vue"),
        ("svelte", "Svelte"),
        ("express", "Express"),
    ]
    for dep, name in framework_checks:
        if dep in all_deps:
            stack.append(name)
            break

    if "@nestjs/core" in all_deps or "nestjs" in all_deps:
        if "NestJS" not in stack:
            stack.append("NestJS")

    # Additive tooling
    if "tailwindcss" in all_deps:
        stack.append("Tailwind CSS")
    if "prisma" in all_deps:
        stack.append("Prisma")
    if "typescript" in all_deps:
        stack.append("TypeScript")

    return stack


def count_files(root: Path) -> Dict[str, int]:
    stats: Dict[str, int] = {"created": 0, "modified": 0, "total": 0}
    exclude = {".git", "node_modules", ".next", "dist", "build", ".agent", ".gemini", "__pycache__"}

    for root_dir, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in exclude]
        stats["total"] += len(files)

    return stats


def detect_features(root: Path) -> List[str]:
    """Detect project features from directory structure."""
    features: List[str] = []
    src = root / "src"
    if not src.exists():
        return features

    possible_dirs = ["components", "modules", "features", "app", "pages", "services"]
    for d in possible_dirs:
        p = src / d
        if not p.exists() or not p.is_dir():
            continue
        for child in p.iterdir():
            if child.is_dir():
                features.append(child.name)

    return features[:10]


def print_status(root: Path) -> None:
    info = analyze_package_json(root)
    stats = count_files(root)
    features = detect_features(root)

    print("\n=== Project Status ===")
    print(f"\n📁 Project: {info.get('name', root.name)}")
    print(f"📂 Path: {root}")
    print(f"🏷️  Type: {', '.join(info.get('stack', ['Generic']))}")
    print(f"📊 Status: Active")

    print("\n🔧 Tech Stack:")
    for tech in info.get('stack', []):
        print(f"   • {tech}")

    print(f"\n✅ Detected Modules/Features ({len(features)}):")
    if features:
        for feat in features:
            print(f"   • {feat}")
    else:
        print("   (No distinct feature modules detected)")

    print(f"\n📄 Files: {stats['total']} total files tracked")
    print("\n====================\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Session Manager")
    parser.add_argument("command", choices=["status", "info"], help="Command to run")
    parser.add_argument("path", nargs="?", default=".", help="Project path")

    args = parser.parse_args()
    root = get_project_root(args.path)

    if args.command == "status":
        print_status(root)
    elif args.command == "info":
        print(json.dumps(analyze_package_json(root), indent=2))


if __name__ == "__main__":
    main()
