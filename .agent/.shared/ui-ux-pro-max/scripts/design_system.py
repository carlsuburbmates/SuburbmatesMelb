#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Design System Generator - Aggregates search results and applies reasoning
to generate comprehensive design system recommendations.

Usage:
    from design_system import generate_design_system
    result = generate_design_system("SaaS dashboard", "My Project")
    
    # With persistence (Master + Overrides pattern)
    result = generate_design_system("SaaS dashboard", "My Project", persist=True)
    result = generate_design_system("SaaS dashboard", "My Project", persist=True, page="dashboard")
"""

import csv
import json
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from core import search, DATA_DIR


# ============ CONFIGURATION ============
REASONING_FILE = "ui-reasoning.csv"

SEARCH_CONFIG: Dict[str, Dict[str, int]] = {
    "product": {"max_results": 1},
    "style": {"max_results": 3},
    "color": {"max_results": 2},
    "landing": {"max_results": 2},
    "typography": {"max_results": 2}
}


# ============ DESIGN SYSTEM GENERATOR ============
class DesignSystemGenerator:
    """Generates design system recommendations from aggregated searches."""

    def __init__(self) -> None:
        self.reasoning_data: List[Dict[str, str]] = self._load_reasoning()

    def _load_reasoning(self) -> List[Dict[str, str]]:
        """Load reasoning rules from CSV."""
        filepath = DATA_DIR / REASONING_FILE
        if not filepath.exists():
            return []
        with open(filepath, 'r', encoding='utf-8') as f:
            return list(csv.DictReader(f))

    def _apply_reasoning(self, category: str, search_results: Dict[str, Any]) -> Dict[str, Any]:
        """Apply reasoning rules to refine recommendations."""
        reasoning: Dict[str, Any] = {
            "style_priority": [],
            "anti_patterns": "",
            "key_effects": "",
            "typography_mood": "",
            "pattern": "Hero + Features + CTA",
            "severity": "MEDIUM",
            "decision_rules": {}
        }

        for rule in self.reasoning_data:
            rule_category = rule.get("Category", "").strip()
            if rule_category.lower() == category.lower() or rule_category == "*":
                if rule.get("Style Priority"):
                    reasoning["style_priority"] = [s.strip() for s in rule["Style Priority"].split(",")]
                if rule.get("Anti-Patterns"):
                    reasoning["anti_patterns"] = rule["Anti-Patterns"]
                if rule.get("Key Effects"):
                    reasoning["key_effects"] = rule["Key Effects"]
                if rule.get("Typography Mood"):
                    reasoning["typography_mood"] = rule["Typography Mood"]
                if rule.get("Default Pattern"):
                    reasoning["pattern"] = rule["Default Pattern"]
                if rule.get("Severity"):
                    reasoning["severity"] = rule["Severity"]
                if rule.get("Decision Rules"):
                    try:
                        reasoning["decision_rules"] = json.loads(rule["Decision Rules"])
                    except (json.JSONDecodeError, TypeError):
                        reasoning["decision_rules"] = {"raw": rule["Decision Rules"]}

        return reasoning

    def _multi_domain_search(self, query: str, style_priority: List[str]) -> Dict[str, Any]:
        """Search across all configured domains."""
        results: Dict[str, Any] = {}
        for domain, config in SEARCH_CONFIG.items():
            if domain == "product":
                continue
            search_query = query
            if domain == "style" and style_priority:
                search_query = f"{query} {' '.join(style_priority[:2])}"
            results[domain] = search(search_query, domain, config["max_results"])
        return results

    def _select_best_match(self, results: List[Dict[str, str]], priorities: List[str]) -> Dict[str, str]:
        """Select the best matching result based on priority keywords."""
        if not results:
            return {}
        if not priorities:
            return results[0]

        scored: List[Tuple[int, Dict[str, str]]] = []
        for result in results:
            result_str = " ".join(str(v).lower() for v in result.values())
            score = 0
            for kw in priorities:
                kw_lower = kw.lower()
                if kw_lower in result.get("Style Category", "").lower():
                    score += 5
                elif kw_lower in result.get("Keywords", "").lower():
                    score += 3
                elif kw_lower in result_str:
                    score += 1
            scored.append((score, result))

        scored.sort(key=lambda x: x[0], reverse=True)
        return scored[0][1] if scored and scored[0][0] > 0 else results[0]

    def _extract_results(self, search_result: Dict[str, Any]) -> List[Dict[str, str]]:
        """Extract results list from search result dict."""
        return search_result.get("results", [])

    def generate(self, query: str, project_name: Optional[str] = None) -> Dict[str, Any]:
        """Generate complete design system recommendation."""
        product_result = search(query, "product", 1)
        product_results = product_result.get("results", [])
        category = product_results[0].get("Product Type", "General") if product_results else "General"

        reasoning = self._apply_reasoning(category, {})
        search_results = self._multi_domain_search(query, reasoning.get("style_priority", []))
        search_results["product"] = product_result

        best_style = self._select_best_match(
            self._extract_results(search_results.get("style", {})),
            reasoning.get("style_priority", [])
        )
        best_color = (self._extract_results(search_results.get("color", {})) or [{}])[0]
        best_typography = (self._extract_results(search_results.get("typography", {})) or [{}])[0]
        best_landing = (self._extract_results(search_results.get("landing", {})) or [{}])[0]

        style_effects = best_style.get("Effects & Animation", "")
        reasoning_effects = reasoning.get("key_effects", "")

        return {
            "project_name": project_name or query.upper(),
            "category": category,
            "pattern": _build_pattern(best_landing, reasoning),
            "style": _build_style(best_style),
            "colors": _build_colors(best_color),
            "typography": _build_typography(best_typography, reasoning),
            "key_effects": style_effects if style_effects else reasoning_effects,
            "anti_patterns": reasoning.get("anti_patterns", ""),
            "decision_rules": reasoning.get("decision_rules", {}),
            "severity": reasoning.get("severity", "MEDIUM")
        }


# ============ DATA BUILDERS ============
def _build_pattern(landing: Dict[str, str], reasoning: Dict[str, Any]) -> Dict[str, str]:
    return {
        "name": landing.get("Pattern Name", reasoning.get("pattern", "Hero + Features + CTA")),
        "sections": landing.get("Section Order", "Hero > Features > CTA"),
        "cta_placement": landing.get("Primary CTA Placement", "Above fold"),
        "color_strategy": landing.get("Color Strategy", ""),
        "conversion": landing.get("Conversion Optimization", "")
    }


def _build_style(style: Dict[str, str]) -> Dict[str, str]:
    return {
        "name": style.get("Style Category", "Minimalism"),
        "type": style.get("Type", "General"),
        "effects": style.get("Effects & Animation", ""),
        "keywords": style.get("Keywords", ""),
        "best_for": style.get("Best For", ""),
        "performance": style.get("Performance", ""),
        "accessibility": style.get("Accessibility", "")
    }


def _build_colors(color: Dict[str, str]) -> Dict[str, str]:
    return {
        "primary": color.get("Primary (Hex)", "#2563EB"),
        "secondary": color.get("Secondary (Hex)", "#3B82F6"),
        "cta": color.get("CTA (Hex)", "#F97316"),
        "background": color.get("Background (Hex)", "#F8FAFC"),
        "text": color.get("Text (Hex)", "#1E293B"),
        "notes": color.get("Notes", "")
    }


def _build_typography(typo: Dict[str, str], reasoning: Dict[str, Any]) -> Dict[str, str]:
    return {
        "heading": typo.get("Heading Font", "Inter"),
        "body": typo.get("Body Font", "Inter"),
        "mood": typo.get("Mood/Style Keywords", reasoning.get("typography_mood", "")),
        "best_for": typo.get("Best For", ""),
        "google_fonts_url": typo.get("Google Fonts URL", ""),
        "css_import": typo.get("CSS Import", "")
    }


# ============ OUTPUT FORMATTERS ============
BOX_WIDTH = 90


def _wrap_text(text: str, prefix: str, width: int) -> List[str]:
    """Wrap long text into multiple lines."""
    if not text:
        return []
    words = text.split()
    lines: List[str] = []
    current_line = prefix
    for word in words:
        if len(current_line) + len(word) + 1 <= width - 2:
            current_line += (" " if current_line != prefix else "") + word
        else:
            if current_line != prefix:
                lines.append(current_line)
            current_line = prefix + word
    if current_line != prefix:
        lines.append(current_line)
    return lines


def _box_line(text: str) -> str:
    """Format a single line within the ASCII box."""
    return text.ljust(BOX_WIDTH) + "|"


def _box_separator() -> str:
    return "+" + "-" * (BOX_WIDTH - 1) + "+"


def _box_empty() -> str:
    return "|" + " " * BOX_WIDTH + "|"


PRE_DELIVERY_CHECKLIST: List[str] = [
    "[ ] No emojis as icons (use SVG: Heroicons/Lucide)",
    "[ ] cursor-pointer on all clickable elements",
    "[ ] Hover states with smooth transitions (150-300ms)",
    "[ ] Light mode: text contrast 4.5:1 minimum",
    "[ ] Focus states visible for keyboard nav",
    "[ ] prefers-reduced-motion respected",
    "[ ] Responsive: 375px, 768px, 1024px, 1440px"
]

FORBIDDEN_PATTERNS: List[str] = [
    "**Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)",
    "**Missing cursor:pointer** — All clickable elements must have cursor:pointer",
    "**Layout-shifting hovers** — Avoid scale transforms that shift layout",
    "**Low contrast text** — Maintain 4.5:1 minimum contrast ratio",
    "**Instant state changes** — Always use transitions (150-300ms)",
    "**Invisible focus states** — Focus states must be visible for a11y",
]


def _format_box_pattern(pattern: Dict[str, str]) -> List[str]:
    """Format pattern section for ASCII box."""
    lines = [_box_line(f"|  PATTERN: {pattern.get('name', '')}")]
    if pattern.get('conversion'):
        lines.append(_box_line(f"|     Conversion: {pattern.get('conversion', '')}"))
    if pattern.get('cta_placement'):
        lines.append(_box_line(f"|     CTA: {pattern.get('cta_placement', '')}"))
    sections = [s.strip() for s in pattern.get("sections", "").split(">") if s.strip()]
    lines.append(_box_line("|     Sections:"))
    for i, section in enumerate(sections, 1):
        lines.append(_box_line(f"|       {i}. {section}"))
    lines.append(_box_empty())
    return lines


def _format_box_style(style: Dict[str, str]) -> List[str]:
    """Format style section for ASCII box."""
    lines = [_box_line(f"|  STYLE: {style.get('name', '')}")]
    if style.get("keywords"):
        lines.extend(_box_line(l) for l in _wrap_text(f"Keywords: {style['keywords']}", "|     ", BOX_WIDTH))
    if style.get("best_for"):
        lines.extend(_box_line(l) for l in _wrap_text(f"Best For: {style['best_for']}", "|     ", BOX_WIDTH))
    if style.get("performance") or style.get("accessibility"):
        perf_a11y = f"Performance: {style.get('performance', '')} | Accessibility: {style.get('accessibility', '')}"
        lines.append(_box_line(f"|     {perf_a11y}"))
    lines.append(_box_empty())
    return lines


def _format_box_colors(colors: Dict[str, str]) -> List[str]:
    """Format colors section for ASCII box."""
    lines = [_box_line("|  COLORS:")]
    for role in ["primary", "secondary", "cta", "background", "text"]:
        label = role.capitalize() + ":"
        lines.append(_box_line(f"|     {label:<14}{colors.get(role, '')}"))
    if colors.get("notes"):
        lines.extend(_box_line(l) for l in _wrap_text(f"Notes: {colors['notes']}", "|     ", BOX_WIDTH))
    lines.append(_box_empty())
    return lines


def _format_box_typography(typography: Dict[str, str]) -> List[str]:
    """Format typography section for ASCII box."""
    lines = [_box_line(f"|  TYPOGRAPHY: {typography.get('heading', '')} / {typography.get('body', '')}")]
    if typography.get("mood"):
        lines.extend(_box_line(l) for l in _wrap_text(f"Mood: {typography['mood']}", "|     ", BOX_WIDTH))
    if typography.get("best_for"):
        lines.extend(_box_line(l) for l in _wrap_text(f"Best For: {typography['best_for']}", "|     ", BOX_WIDTH))
    if typography.get("google_fonts_url"):
        lines.append(_box_line(f"|     Google Fonts: {typography['google_fonts_url']}"))
    if typography.get("css_import"):
        lines.append(_box_line(f"|     CSS Import: {typography['css_import'][:70]}..."))
    lines.append(_box_empty())
    return lines


def format_ascii_box(design_system: Dict[str, Any]) -> str:
    """Format design system as ASCII box with emojis (MCP-style)."""
    project = design_system.get("project_name", "PROJECT")
    lines = [
        _box_separator(),
        _box_line(f"|  TARGET: {project} - RECOMMENDED DESIGN SYSTEM"),
        _box_separator(),
        _box_empty(),
    ]

    lines.extend(_format_box_pattern(design_system.get("pattern", {})))
    lines.extend(_format_box_style(design_system.get("style", {})))
    lines.extend(_format_box_colors(design_system.get("colors", {})))
    lines.extend(_format_box_typography(design_system.get("typography", {})))

    effects = design_system.get("key_effects", "")
    if effects:
        lines.append(_box_line("|  KEY EFFECTS:"))
        lines.extend(_box_line(l) for l in _wrap_text(effects, "|     ", BOX_WIDTH))
        lines.append(_box_empty())

    anti_patterns = design_system.get("anti_patterns", "")
    if anti_patterns:
        lines.append(_box_line("|  AVOID (Anti-patterns):"))
        lines.extend(_box_line(l) for l in _wrap_text(anti_patterns, "|     ", BOX_WIDTH))
        lines.append(_box_empty())

    lines.append(_box_line("|  PRE-DELIVERY CHECKLIST:"))
    for item in PRE_DELIVERY_CHECKLIST:
        lines.append(_box_line(f"|     {item}"))
    lines.append(_box_empty())
    lines.append(_box_separator())

    return "\n".join(lines)


def _format_md_section(title: str, items: List[str]) -> List[str]:
    """Format a markdown section with title and items."""
    return [f"### {title}", ""] + items + [""]


def format_markdown(design_system: Dict[str, Any]) -> str:
    """Format design system as markdown."""
    project = design_system.get("project_name", "PROJECT")
    pattern = design_system.get("pattern", {})
    style = design_system.get("style", {})
    colors = design_system.get("colors", {})
    typography = design_system.get("typography", {})
    effects = design_system.get("key_effects", "")
    anti_patterns = design_system.get("anti_patterns", "")

    lines = [f"## Design System: {project}", ""]

    # Pattern
    pattern_items = [f"- **Name:** {pattern.get('name', '')}"]
    if pattern.get('conversion'):
        pattern_items.append(f"- **Conversion Focus:** {pattern['conversion']}")
    if pattern.get('cta_placement'):
        pattern_items.append(f"- **CTA Placement:** {pattern['cta_placement']}")
    if pattern.get('color_strategy'):
        pattern_items.append(f"- **Color Strategy:** {pattern['color_strategy']}")
    pattern_items.append(f"- **Sections:** {pattern.get('sections', '')}")
    lines.extend(_format_md_section("Pattern", pattern_items))

    # Style
    style_items = [f"- **Name:** {style.get('name', '')}"]
    if style.get('keywords'):
        style_items.append(f"- **Keywords:** {style['keywords']}")
    if style.get('best_for'):
        style_items.append(f"- **Best For:** {style['best_for']}")
    if style.get('performance') or style.get('accessibility'):
        style_items.append(f"- **Performance:** {style.get('performance', '')} | **Accessibility:** {style.get('accessibility', '')}")
    lines.extend(_format_md_section("Style", style_items))

    # Colors table
    color_items = [
        "| Role | Hex |", "|------|-----|",
        f"| Primary | {colors.get('primary', '')} |",
        f"| Secondary | {colors.get('secondary', '')} |",
        f"| CTA | {colors.get('cta', '')} |",
        f"| Background | {colors.get('background', '')} |",
        f"| Text | {colors.get('text', '')} |",
    ]
    if colors.get("notes"):
        color_items.append(f"\n*Notes: {colors['notes']}*")
    lines.extend(_format_md_section("Colors", color_items))

    # Typography
    typo_items = [f"- **Heading:** {typography.get('heading', '')}", f"- **Body:** {typography.get('body', '')}"]
    if typography.get("mood"):
        typo_items.append(f"- **Mood:** {typography['mood']}")
    if typography.get("best_for"):
        typo_items.append(f"- **Best For:** {typography['best_for']}")
    if typography.get("google_fonts_url"):
        typo_items.append(f"- **Google Fonts:** {typography['google_fonts_url']}")
    if typography.get("css_import"):
        typo_items.extend([f"- **CSS Import:**", "```css", typography['css_import'], "```"])
    lines.extend(_format_md_section("Typography", typo_items))

    if effects:
        lines.extend(_format_md_section("Key Effects", [effects]))
    if anti_patterns:
        newline_bullet = '\n- '
        lines.extend(_format_md_section("Avoid (Anti-patterns)", [f"- {anti_patterns.replace(' + ', newline_bullet)}"]))

    lines.extend(_format_md_section("Pre-Delivery Checklist", [f"- {item}" for item in PRE_DELIVERY_CHECKLIST]))

    return "\n".join(lines)


# ============ MASTER.MD FORMATTER ============
def _format_master_global_rules(colors: Dict[str, str], typography: Dict[str, str]) -> List[str]:
    """Format global rules section of MASTER.md."""
    lines = ["## Global Rules", ""]

    # Color Palette
    lines.extend([
        "### Color Palette", "",
        "| Role | Hex | CSS Variable |",
        "|------|-----|--------------|",
        f"| Primary | `{colors.get('primary', '#2563EB')}` | `--color-primary` |",
        f"| Secondary | `{colors.get('secondary', '#3B82F6')}` | `--color-secondary` |",
        f"| CTA/Accent | `{colors.get('cta', '#F97316')}` | `--color-cta` |",
        f"| Background | `{colors.get('background', '#F8FAFC')}` | `--color-background` |",
        f"| Text | `{colors.get('text', '#1E293B')}` | `--color-text` |",
        ""
    ])
    if colors.get("notes"):
        lines.extend([f"**Color Notes:** {colors['notes']}", ""])

    # Typography
    lines.extend(["### Typography", "", f"- **Heading Font:** {typography.get('heading', 'Inter')}", f"- **Body Font:** {typography.get('body', 'Inter')}"])
    if typography.get("mood"):
        lines.append(f"- **Mood:** {typography['mood']}")
    if typography.get("google_fonts_url"):
        lines.append(f"- **Google Fonts:** [{typography.get('heading', '')} + {typography.get('body', '')}]({typography['google_fonts_url']})")
    lines.append("")
    if typography.get("css_import"):
        lines.extend(["**CSS Import:**", "```css", typography["css_import"], "```", ""])

    # Spacing
    lines.extend([
        "### Spacing Variables", "",
        "| Token | Value | Usage |", "|-------|-------|-------|",
        "| `--space-xs` | `4px` / `0.25rem` | Tight gaps |",
        "| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |",
        "| `--space-md` | `16px` / `1rem` | Standard padding |",
        "| `--space-lg` | `24px` / `1.5rem` | Section padding |",
        "| `--space-xl` | `32px` / `2rem` | Large gaps |",
        "| `--space-2xl` | `48px` / `3rem` | Section margins |",
        "| `--space-3xl` | `64px` / `4rem` | Hero padding |",
        ""
    ])

    # Shadows
    lines.extend([
        "### Shadow Depths", "",
        "| Level | Value | Usage |", "|-------|-------|-------|",
        "| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |",
        "| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |",
        "| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |",
        "| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |",
        ""
    ])

    return lines


def _format_master_components(colors: Dict[str, str]) -> List[str]:
    """Format component specs section of MASTER.md."""
    lines = ["---", "", "## Component Specs", ""]

    # Buttons
    lines.extend([
        "### Buttons", "", "```css", "/* Primary Button */", ".btn-primary {",
        f"  background: {colors.get('cta', '#F97316')};", "  color: white;",
        "  padding: 12px 24px;", "  border-radius: 8px;", "  font-weight: 600;",
        "  transition: all 200ms ease;", "  cursor: pointer;", "}", "",
        ".btn-primary:hover {", "  opacity: 0.9;", "  transform: translateY(-1px);", "}", "",
        "/* Secondary Button */", ".btn-secondary {", f"  background: transparent;",
        f"  color: {colors.get('primary', '#2563EB')};",
        f"  border: 2px solid {colors.get('primary', '#2563EB')};",
        "  padding: 12px 24px;", "  border-radius: 8px;", "  font-weight: 600;",
        "  transition: all 200ms ease;", "  cursor: pointer;", "}", "```", ""
    ])

    # Cards
    lines.extend([
        "### Cards", "", "```css", ".card {",
        f"  background: {colors.get('background', '#FFFFFF')};",
        "  border-radius: 12px;", "  padding: 24px;", "  box-shadow: var(--shadow-md);",
        "  transition: all 200ms ease;", "  cursor: pointer;", "}", "",
        ".card:hover {", "  box-shadow: var(--shadow-lg);", "  transform: translateY(-2px);", "}", "```", ""
    ])

    # Inputs
    lines.extend([
        "### Inputs", "", "```css", ".input {",
        "  padding: 12px 16px;", "  border: 1px solid #E2E8F0;", "  border-radius: 8px;",
        "  font-size: 16px;", "  transition: border-color 200ms ease;", "}", "",
        ".input:focus {", f"  border-color: {colors.get('primary', '#2563EB')};",
        "  outline: none;", f"  box-shadow: 0 0 0 3px {colors.get('primary', '#2563EB')}20;", "}", "```", ""
    ])

    # Modals
    lines.extend([
        "### Modals", "", "```css", ".modal-overlay {",
        "  background: rgba(0, 0, 0, 0.5);", "  backdrop-filter: blur(4px);", "}", "",
        ".modal {", "  background: white;", "  border-radius: 16px;", "  padding: 32px;",
        "  box-shadow: var(--shadow-xl);", "  max-width: 500px;", "  width: 90%;", "}", "```", ""
    ])

    return lines


def _format_master_style(style: Dict[str, str], effects: str, pattern: Dict[str, str],
                         anti_patterns: str) -> List[str]:
    """Format style guidelines section of MASTER.md."""
    lines = ["---", "", "## Style Guidelines", "", f"**Style:** {style.get('name', 'Minimalism')}", ""]

    if style.get("keywords"):
        lines.extend([f"**Keywords:** {style['keywords']}", ""])
    if style.get("best_for"):
        lines.extend([f"**Best For:** {style['best_for']}", ""])
    if effects:
        lines.extend([f"**Key Effects:** {effects}", ""])

    lines.extend([
        "### Page Pattern", "", f"**Pattern Name:** {pattern.get('name', '')}", ""
    ])
    if pattern.get('conversion'):
        lines.append(f"- **Conversion Strategy:** {pattern['conversion']}")
    if pattern.get('cta_placement'):
        lines.append(f"- **CTA Placement:** {pattern['cta_placement']}")
    lines.extend([f"- **Section Order:** {pattern.get('sections', '')}", ""])

    # Anti-patterns
    lines.extend(["---", "", "## Anti-Patterns (Do NOT Use)", ""])
    if anti_patterns:
        for anti in [a.strip() for a in anti_patterns.split("+") if a.strip()]:
            lines.append(f"- {anti}")
    lines.append("")

    lines.extend(["### Additional Forbidden Patterns", ""])
    for fp in FORBIDDEN_PATTERNS:
        lines.append(f"- {fp}")
    lines.append("")

    # Checklist
    lines.extend(["---", "", "## Pre-Delivery Checklist", "", "Before delivering any UI code, verify:", ""])
    for item in PRE_DELIVERY_CHECKLIST:
        lines.append(f"- {item}")
    lines.extend(["- [ ] No content hidden behind fixed navbars", "- [ ] No horizontal scroll on mobile", ""])

    return lines


def format_master_md(design_system: Dict[str, Any]) -> str:
    """Format design system as MASTER.md with hierarchical override logic."""
    project = design_system.get("project_name", "PROJECT")
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    lines = [
        "# Design System Master File", "",
        "> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.",
        "> If that file exists, its rules **override** this Master file.",
        "> If not, strictly follow the rules below.", "",
        "---", "",
        f"**Project:** {project}",
        f"**Generated:** {timestamp}",
        f"**Category:** {design_system.get('category', 'General')}",
        "", "---", ""
    ]

    colors = design_system.get("colors", {})
    typography = design_system.get("typography", {})

    lines.extend(_format_master_global_rules(colors, typography))
    lines.extend(_format_master_components(colors))
    lines.extend(_format_master_style(
        design_system.get("style", {}),
        design_system.get("key_effects", ""),
        design_system.get("pattern", {}),
        design_system.get("anti_patterns", "")
    ))

    return "\n".join(lines)


# ============ PAGE OVERRIDE FORMATTER ============
PAGE_TYPE_PATTERNS: List[Tuple[List[str], str]] = [
    (["dashboard", "admin", "analytics", "data", "metrics", "stats", "monitor", "overview"], "Dashboard / Data View"),
    (["checkout", "payment", "cart", "purchase", "order", "billing"], "Checkout / Payment"),
    (["settings", "profile", "account", "preferences", "config"], "Settings / Profile"),
    (["landing", "marketing", "homepage", "hero", "home", "promo"], "Landing / Marketing"),
    (["login", "signin", "signup", "register", "auth", "password"], "Authentication"),
    (["pricing", "plans", "subscription", "tiers", "packages"], "Pricing / Plans"),
    (["blog", "article", "post", "news", "content", "story"], "Blog / Article"),
    (["product", "item", "detail", "pdp", "shop", "store"], "Product Detail"),
    (["search", "results", "browse", "filter", "catalog", "list"], "Search Results"),
    (["empty", "404", "error", "not found", "zero"], "Empty State"),
]


def _detect_page_type(context: str, style_results: List[Dict[str, str]]) -> str:
    """Detect page type from context and search results."""
    context_lower = context.lower()

    for keywords, page_type in PAGE_TYPE_PATTERNS:
        if any(kw in context_lower for kw in keywords):
            return page_type

    if style_results:
        best_for = style_results[0].get("Best For", "").lower()
        if "dashboard" in best_for or "data" in best_for:
            return "Dashboard / Data View"
        if "landing" in best_for or "marketing" in best_for:
            return "Landing / Marketing"

    return "General"


def _build_layout_overrides(keywords: str) -> Dict[str, str]:
    """Build layout overrides from style keywords."""
    kw_lower = keywords.lower()
    if any(kw in kw_lower for kw in ["data", "dense", "dashboard", "grid"]):
        return {"Max Width": "1400px or full-width", "Grid": "12-column grid for data flexibility"}
    if any(kw in kw_lower for kw in ["minimal", "simple", "clean", "single"]):
        return {"Max Width": "800px (narrow, focused)", "Layout": "Single column, centered"}
    return {"Max Width": "1200px (standard)", "Layout": "Full-width sections, centered content"}


def _generate_intelligent_overrides(page_name: str, page_query: Optional[str],
                                     design_system: Dict[str, Any]) -> Dict[str, Any]:
    """Generate intelligent overrides based on page type using layered search."""
    from core import search as core_search

    combined_context = f"{page_name.lower()} {(page_query or '').lower()}"

    style_results = core_search(combined_context, "style", max_results=1).get("results", [])
    ux_results = core_search(combined_context, "ux", max_results=3).get("results", [])
    landing_results = core_search(combined_context, "landing", max_results=1).get("results", [])

    page_type = _detect_page_type(combined_context, style_results)

    layout: Dict[str, str] = {}
    spacing: Dict[str, str] = {}
    colors: Dict[str, str] = {}
    components: List[str] = []
    recommendations: List[str] = []

    if style_results:
        style = style_results[0]
        layout = _build_layout_overrides(style.get("Keywords", ""))
        if style.get("Keywords", ""):
            kw_lower = style["Keywords"].lower()
            if any(kw in kw_lower for kw in ["data", "dense", "dashboard", "grid"]):
                spacing["Content Density"] = "High — optimize for information display"
            elif any(kw in kw_lower for kw in ["minimal", "simple", "clean", "single"]):
                spacing["Content Density"] = "Low — focus on clarity"
        effects = style.get("Effects & Animation", "")
        if effects:
            recommendations.append(f"Effects: {effects}")

    for ux in ux_results:
        do_text = ux.get("Do", "")
        dont_text = ux.get("Don't", "")
        category = ux.get("Category", "")
        if do_text:
            recommendations.append(f"{category}: {do_text}")
        if dont_text:
            components.append(f"Avoid: {dont_text}")

    if landing_results:
        landing = landing_results[0]
        if landing.get("Section Order"):
            layout["Sections"] = landing["Section Order"]
        if landing.get("Primary CTA Placement"):
            recommendations.append(f"CTA Placement: {landing['Primary CTA Placement']}")
        if landing.get("Color Strategy"):
            colors["Strategy"] = landing["Color Strategy"]

    if not layout:
        layout = {"Max Width": "1200px", "Layout": "Responsive grid"}
    if not recommendations:
        recommendations = ["Refer to MASTER.md for all design rules", "Add specific overrides as needed for this page"]

    return {
        "page_type": page_type,
        "layout": layout,
        "spacing": spacing,
        "typography": {},
        "colors": colors,
        "components": components,
        "unique_components": [],
        "recommendations": recommendations
    }


def _format_override_section(title: str, data: Any) -> List[str]:
    """Format a generic override section."""
    lines = [f"### {title}", ""]
    if isinstance(data, dict) and data:
        for key, value in data.items():
            lines.append(f"- **{key}:** {value}")
    elif isinstance(data, list) and data:
        for item in data:
            lines.append(f"- {item}")
    else:
        lines.append(f"- No overrides — use Master {title.lower()}")
    lines.append("")
    return lines


def format_page_override_md(design_system: Dict[str, Any], page_name: str,
                            page_query: Optional[str] = None) -> str:
    """Format a page-specific override file."""
    project = design_system.get("project_name", "PROJECT")
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    page_title = page_name.replace("-", " ").replace("_", " ").title()
    overrides = _generate_intelligent_overrides(page_name, page_query, design_system)

    lines = [
        f"# {page_title} Page Overrides", "",
        f"> **PROJECT:** {project}",
        f"> **Generated:** {timestamp}",
        f"> **Page Type:** {overrides.get('page_type', 'General')}", "",
        "> IMPORTANT: Rules in this file **override** the Master file (`design-system/MASTER.md`).",
        "> Only deviations from the Master are documented here. For all other rules, refer to the Master.",
        "", "---", "",
        "## Page-Specific Rules", ""
    ]

    lines.extend(_format_override_section("Layout Overrides", overrides.get("layout", {})))
    lines.extend(_format_override_section("Spacing Overrides", overrides.get("spacing", {})))
    lines.extend(_format_override_section("Typography Overrides", overrides.get("typography", {})))
    lines.extend(_format_override_section("Color Overrides", overrides.get("colors", {})))
    lines.extend(_format_override_section("Component Overrides", overrides.get("components", [])))

    lines.extend(["---", "", "## Page-Specific Components", ""])
    unique = overrides.get("unique_components", [])
    lines.extend([f"- {c}" for c in unique] if unique else ["- No unique components for this page"])
    lines.append("")

    lines.extend(["---", "", "## Recommendations", ""])
    for rec in overrides.get("recommendations", []):
        lines.append(f"- {rec}")
    lines.append("")

    return "\n".join(lines)


# ============ PERSISTENCE ============
def persist_design_system(design_system: Dict[str, Any], project_name: Optional[str] = None,
                          page: Optional[str] = None, page_query: Optional[str] = None,
                          output_dir: Optional[str] = None) -> str:
    """Persist design system to file system as MASTER.md + optional page overrides."""
    project_slug = (project_name or "default").lower().replace(" ", "-")
    base_dir = Path(output_dir) if output_dir else Path(".")
    ds_dir = base_dir / "design-system" / project_slug
    pages_dir = ds_dir / "pages"

    os.makedirs(pages_dir, exist_ok=True)

    master_path = ds_dir / "MASTER.md"
    master_content = format_master_md(design_system)
    with open(master_path, 'w', encoding='utf-8') as f:
        f.write(master_content)

    if page:
        page_filename = page.lower().replace(" ", "-")
        page_path = pages_dir / f"{page_filename}.md"
        page_content = format_page_override_md(design_system, page, page_query)
        with open(page_path, 'w', encoding='utf-8') as f:
            f.write(page_content)

    return master_content


# ============ MAIN ENTRY POINT ============
def generate_design_system(query: str, project_name: Optional[str] = None,
                           output_format: str = "ascii", persist: bool = False,
                           page: Optional[str] = None, output_dir: Optional[str] = None) -> str:
    """Main entry point for design system generation."""
    generator = DesignSystemGenerator()
    design_system = generator.generate(query, project_name)

    if persist:
        return persist_design_system(design_system, project_name, page, query, output_dir)

    if output_format == "markdown":
        return format_markdown(design_system)
    return format_ascii_box(design_system)


# ============ CLI SUPPORT ============
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Generate Design System")
    parser.add_argument("query", help="Search query (e.g., 'SaaS dashboard')")
    parser.add_argument("--project-name", "-p", type=str, default=None, help="Project name")
    parser.add_argument("--format", "-f", choices=["ascii", "markdown"], default="ascii", help="Output format")

    args = parser.parse_args()

    result = generate_design_system(args.query, args.project_name, args.format)
    print(result)
