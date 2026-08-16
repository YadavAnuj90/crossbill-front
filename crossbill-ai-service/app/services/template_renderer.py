from __future__ import annotations

from pathlib import Path
from typing import Any

from jinja2 import Environment, FileSystemLoader, select_autoescape


class TemplateRenderer:
    """Render HTML templates with Jinja2."""

    def __init__(self, templates_dir: str | Path) -> None:
        self.templates_dir = Path(templates_dir)
        self.env = Environment(
            loader=FileSystemLoader(str(self.templates_dir)),
            autoescape=select_autoescape(["html", "xml"]),
        )

    def render(self, template_name: str, context: dict[str, Any]) -> str:
        template = self.env.get_template(template_name)
        return template.render(**context)
