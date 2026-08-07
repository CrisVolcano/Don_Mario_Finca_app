# Streamlit - Visor Don Mario

Esta carpeta es una copia independiente para probar deploy en Streamlit.
No modifica el visor local original en `E:\MAE\Cambio_climatico\visor_biomasa`.

## Estructura

- `streamlit_app.py`: app Streamlit que embebe el visor.
- `.streamlit/config.toml`: activa static serving.
- `requirements.txt`: dependencia minima.
- `static/visor_biomasa`: copia autocontenida del visor y sus datos.

## Ejecutar localmente

```powershell
.\run_streamlit.ps1
```

O manualmente:

```powershell
.\.venv\Scripts\python.exe -m streamlit run streamlit_app.py
```

## Nota

El wrapper embebe CSS/JS/SVG y el video dentro del componente para evitar problemas de tipos MIME en Streamlit. Las teselas, GeoJSON y fotos se sirven desde `static/visor_biomasa`.
