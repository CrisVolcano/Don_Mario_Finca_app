from __future__ import annotations

import base64
import mimetypes
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components


ROOT = Path(__file__).resolve().parent
VIEWER_DIR = ROOT / "static" / "visor_biomasa"


def data_uri(relative_path: str, mime: str | None = None) -> str:
    path = VIEWER_DIR / relative_path
    guessed_mime = mime or mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{guessed_mime};base64,{encoded}"


def build_viewer_html() -> str:
    html = (VIEWER_DIR / "index.html").read_text(encoding="utf-8")
    css = (VIEWER_DIR / "styles.css").read_text(encoding="utf-8")
    js = (VIEWER_DIR / "app.js").read_text(encoding="utf-8")

    embedded_assets = [
        ("assets/simbolos_especies/vaca_marca.svg", "image/svg+xml"),
        ("assets/simbolos_especies/punto_foto.svg", "image/svg+xml"),
        ("assets/simbolos_especies/arbol_preexistente.svg", "image/svg+xml"),
        ("assets/simbolos_especies/Gulm_guazuma_ulmifolia.svg", "image/svg+xml"),
        ("assets/simbolos_especies/Gsep_gliricidia_sepium.svg", "image/svg+xml"),
        ("assets/simbolos_especies/Ecyc_enterolobium_cyclocarpum.svg", "image/svg+xml"),
        ("assets/simbolos_especies/Ssam_samanea_saman.svg", "image/svg+xml"),
        ("assets/simbolos_especies/Pjul_prosopis_juliflora.svg", "image/svg+xml"),
    ]

    for relative_path, mime in embedded_assets:
        uri = data_uri(relative_path, mime)
        html = html.replace(f'src="{relative_path}"', f'src="{uri}"')
        js = js.replace(f'"{relative_path}"', f'"{uri}"')

    html = html.replace('<link rel="stylesheet" href="./styles.css">', f"<style>{css}</style>")
    html = html.replace('<script src="./app.js"></script>', f"<script>{js}</script>")
    html = html.replace("<head>", '<head><base href="/app/static/visor_biomasa/">', 1)
    return html


st.set_page_config(
    page_title="Propuesta de diseño de finca Don Mario",
    layout="wide",
    initial_sidebar_state="collapsed",
)

st.markdown(
    """
    <style>
      .block-container {
        padding: 0;
        max-width: 100%;
      }
      header, [data-testid="stToolbar"], [data-testid="stDecoration"] {
        display: none;
      }
      iframe {
        display: block;
      }
    </style>
    """,
    unsafe_allow_html=True,
)

components.html(build_viewer_html(), height=920, scrolling=False)
