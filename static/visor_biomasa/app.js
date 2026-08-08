"use strict";

const TILE_SIZE = 256;
const MIN_ZOOM = 14;
const MAX_ZOOM = 20;

const rasterLayers = [
  {
    id: "ortomosaico_rgb",
    name: "Ortomosaico RGB",
    detail: "RGB natural · M05 Mario",
    path: "data/rasters/ortomosaico_rgb",
    minZoom: 14,
    maxZoom: 20,
  },
  {
    id: "hillshade",
    name: "Relieve sombreado",
    detail: "Hillshade · topografía",
    path: "data/rasters/hillshade",
    minZoom: 14,
    maxZoom: 18,
  },
  {
    id: "dem",
    name: "Elevación",
    detail: "DEM recortado · 1 m",
    path: "data/rasters/dem",
    minZoom: 14,
    maxZoom: 18,
  },
  {
    id: "slope_pct",
    name: "Pendiente",
    detail: "Porcentaje de pendiente",
    path: "data/rasters/slope_pct",
    minZoom: 14,
    maxZoom: 18,
  },
  {
    id: "twi",
    name: "TWI",
    detail: "Índice topográfico de humedad",
    path: "data/rasters/twi",
    minZoom: 14,
    maxZoom: 18,
  },
  {
    id: "aspect",
    name: "Orientación",
    detail: "Aspecto en grados",
    path: "data/rasters/aspect",
    minZoom: 14,
    maxZoom: 18,
  },
];

const vectorLayers = [
  {
    id: "finca",
    name: "Polígono finca",
    detail: "Límite principal",
    url: "data/vectors/finca.geojson",
    visible: true,
    style: { stroke: "#111815", fill: "rgba(255,255,255,0.05)", width: 3.6, dash: [] },
  },
  {
    id: "potreros",
    name: "Potreros",
    detail: "Unidades de manejo",
    url: "data/vectors/potreros.geojson",
    visible: true,
    style: { stroke: "rgba(31,107,67,0.82)", fill: "rgba(47,157,103,0.08)", width: 1.2, dash: [] },
  },
  {
    id: "bancos_forrajes",
    name: "Bancos forrajeros",
    detail: "Zonas propuestas",
    url: "data/vectors/bancos_forrajes.geojson",
    visible: true,
    style: { stroke: "#f2b705", fill: "rgba(255,207,64,0.28)", width: 2.8, dash: [12, 4], haloStroke: "rgba(45,34,0,0.42)", haloWidth: 5.8 },
  },
  {
    id: "infraestructura",
    name: "Infraestructura",
    detail: "Elementos construidos",
    url: "data/vectors/infraestructura.geojson",
    visible: true,
    style: { stroke: "#ff4f8b", fill: "rgba(255,79,139,0.24)", width: 2.4, dash: [], haloStroke: "rgba(72,16,36,0.46)", haloWidth: 5.2 },
  },
  {
    id: "drenaje_principal",
    name: "Propuesta de sistemas de drenaje",
    detail: "Drenaje superficial",
    url: "data/vectors/drenaje_principal.geojson",
    visible: false,
    style: { stroke: "#1f78ff", fill: "rgba(31,120,255,0.12)", width: 3.1, dash: [], haloStroke: "rgba(8,42,92,0.34)", haloWidth: 5.8 },
  },
  {
    id: "lineas_offset_10m",
    name: "Líneas de infiltración",
    detail: "Diseño propuesto",
    url: "data/vectors/lineas_offset_10m.geojson",
    visible: false,
    style: { stroke: "#8a5a32", fill: "rgba(138,90,50,0.12)", width: 2.6, dash: [8, 5], haloStroke: "rgba(54,34,18,0.34)", haloWidth: 5.2 },
  },
  {
    id: "ssp_arboles",
    name: "Árboles propuestos",
    detail: "SSP · por especie",
    url: "data/vectors/ssp_arboles.geojson",
    visible: false,
    style: { stroke: "#1e6b43", fill: "#46a758", halo: "rgba(222,247,196,0.72)", width: 1.6, radius: 5.5, iconSize: 24 },
  },
  {
    id: "arboles_existentes",
    name: "Árboles existentes",
    detail: "Puntos preexistentes",
    url: "data/vectors/arboles_existentes.geojson",
    visible: false,
    style: { stroke: "#314f2c", fill: "#78a33f", halo: "rgba(255,232,163,0.66)", width: 1.7, radius: 5.2, iconSize: 22 },
  },
  {
    id: "puntos_fotos",
    name: "Registro fotográfico",
    detail: "Fotos y video de campo",
    url: "data/vectors/puntos_fotos.geojson",
    visible: true,
    style: { stroke: "#1d4ed8", fill: "#2563eb", halo: "rgba(254,243,199,0.78)", width: 1.8, radius: 6, iconSize: 26 },
  },
];

const speciesSymbols = {
  Ecyc: "assets/simbolos_especies/Ecyc_enterolobium_cyclocarpum.svg",
  Gsep: "assets/simbolos_especies/Gsep_gliricidia_sepium.svg",
  Gulm: "assets/simbolos_especies/Gulm_guazuma_ulmifolia.svg",
  Pjul: "assets/simbolos_especies/Pjul_prosopis_juliflora.svg",
  Ssam: "assets/simbolos_especies/Ssam_samanea_saman.svg",
};

const existingTreeSymbol = "assets/simbolos_especies/arbol_preexistente.svg";
const photoPointSymbol = "assets/simbolos_especies/punto_foto.svg";
const symbolImages = new Map();

const mediaByPhotoId = {
  Banco_forraje: "assets/fotos/Banco_forraje.jpeg",
  silo: "assets/fotos/silo.jpeg",
  poterosseco: "assets/fotos/poterosseco.jpeg",
  potrerosseco: "assets/fotos/poterosseco.jpeg",
  potrerosverde: "assets/fotos/potrerosverdes.jpeg",
  potrerosverdes: "assets/fotos/potrerosverdes.jpeg",
  videoinunda: "assets/fotos/videoinunda.mp4",
  anegados: "assets/fotos/annegados.mp4",
  annegados: "assets/fotos/annegados.mp4",
};

const mediaDescriptions = {
  Banco_forraje: "Un ejemplo de cultivo de bancos de forraje en la Finca Don Mario.",
  silo: "La Finca Don Mario viene promoviendo el uso de silo para enfrentar los desafios que plantea el clima.",
  poterosseco: "Durante la epoca seca el paisaje cambia y los pastos tambien, pero lo importante es asegurar alimento, como se observa en esta foto.",
  potrerosseco: "Durante la epoca seca el paisaje cambia y los pastos tambien, pero lo importante es asegurar alimento, como se observa en esta foto.",
  potrerosverde: "En la Finca Don Mario, durante la epoca lluviosa, los potreros recuperan su verdor y vigor.",
  potrerosverdes: "En la Finca Don Mario, durante la epoca lluviosa, los potreros recuperan su verdor y vigor.",
  videoinunda: "Un pequeno video de cuando se inundan los potreros. Y ya saben: esas vacas deben ser amigas.",
};

const state = {
  center: [-85.59231, 10.29571],
  zoom: 18,
  activeRaster: "ortomosaico_rgb",
  rasterOpacity: 0.92,
  dragging: false,
  datasets: new Map(),
  bbox: null,
};

const map = document.querySelector("#map");
const tilePane = document.querySelector("#tile-pane");
const canvas = document.querySelector("#vector-canvas");
const ctx = canvas.getContext("2d");
const popup = document.querySelector("#popup");
const rasterList = document.querySelector("#raster-list");
const vectorList = document.querySelector("#vector-list");
const zoomLabel = document.querySelector("#zoom-label");
const activeRasterName = document.querySelector("#active-raster-name");
const rasterOpacity = document.querySelector("#raster-opacity");
const infiltrationInfoToggle = document.querySelector("#infiltration-info-toggle");
const infiltrationInfo = document.querySelector("#infiltration-info");
const infiltrationInfoClose = document.querySelector("#infiltration-info-close");

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function project(lng, lat, zoom = state.zoom) {
  const sin = clamp(Math.sin((lat * Math.PI) / 180), -0.9999, 0.9999);
  const scale = TILE_SIZE * 2 ** zoom;
  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
}

function unproject(x, y, zoom = state.zoom) {
  const scale = TILE_SIZE * 2 ** zoom;
  const lng = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return [lng, lat];
}

function lngLatToScreen(coord) {
  const center = project(state.center[0], state.center[1]);
  const p = project(coord[0], coord[1]);
  return [p.x - center.x + map.clientWidth / 2, p.y - center.y + map.clientHeight / 2];
}

function screenToLngLat(x, y) {
  const center = project(state.center[0], state.center[1]);
  return unproject(center.x - map.clientWidth / 2 + x, center.y - map.clientHeight / 2 + y);
}

function collectCoords(geometry, list = []) {
  if (!geometry) return list;
  const { type, coordinates } = geometry;
  if (type === "Point") list.push(coordinates);
  if (type === "LineString" || type === "MultiPoint") coordinates.forEach((c) => list.push(c));
  if (type === "Polygon" || type === "MultiLineString") coordinates.flat(1).forEach((c) => list.push(c));
  if (type === "MultiPolygon") coordinates.flat(2).forEach((c) => list.push(c));
  return list;
}

function extendBbox(bbox, coord) {
  if (!bbox) return [coord[0], coord[1], coord[0], coord[1]];
  bbox[0] = Math.min(bbox[0], coord[0]);
  bbox[1] = Math.min(bbox[1], coord[1]);
  bbox[2] = Math.max(bbox[2], coord[0]);
  bbox[3] = Math.max(bbox[3], coord[1]);
  return bbox;
}

function fitBounds(bbox = state.bbox, padding = 72) {
  if (!bbox) return;
  const width = Math.max(320, map.clientWidth - padding * 2);
  const height = Math.max(240, map.clientHeight - padding * 2);
  let chosen = MIN_ZOOM;

  for (let z = MAX_ZOOM; z >= MIN_ZOOM; z -= 1) {
    const nw = project(bbox[0], bbox[3], z);
    const se = project(bbox[2], bbox[1], z);
    if (Math.abs(se.x - nw.x) <= width && Math.abs(se.y - nw.y) <= height) {
      chosen = z;
      break;
    }
  }

  state.zoom = clamp(chosen, MIN_ZOOM, MAX_ZOOM);
  state.center = [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];
  render();
}

function renderTiles() {
  const raster = rasterLayers.find((layer) => layer.id === state.activeRaster);
  tilePane.innerHTML = "";
  if (!raster) return;

  const layerEl = document.createElement("div");
  layerEl.className = "tile-layer";
  layerEl.style.opacity = String(state.rasterOpacity);
  tilePane.appendChild(layerEl);

  const displayZoom = state.zoom;
  const sourceZoom = clamp(displayZoom, raster.minZoom, raster.maxZoom);
  const tileScale = 2 ** (displayZoom - sourceZoom);
  const centerDisplay = project(state.center[0], state.center[1], displayZoom);
  const originDisplay = {
    x: centerDisplay.x - map.clientWidth / 2,
    y: centerDisplay.y - map.clientHeight / 2,
  };
  const originSource = { x: originDisplay.x / tileScale, y: originDisplay.y / tileScale };
  const widthSource = map.clientWidth / tileScale;
  const heightSource = map.clientHeight / tileScale;
  const minX = Math.floor(originSource.x / TILE_SIZE) - 1;
  const maxX = Math.floor((originSource.x + widthSource) / TILE_SIZE) + 1;
  const minY = Math.floor(originSource.y / TILE_SIZE) - 1;
  const maxY = Math.floor((originSource.y + heightSource) / TILE_SIZE) + 1;
  const maxTile = 2 ** sourceZoom - 1;

  for (let x = minX; x <= maxX; x += 1) {
    if (x < 0 || x > maxTile) continue;
    for (let y = minY; y <= maxY; y += 1) {
      if (y < 0 || y > maxTile) continue;
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.alt = "";
      img.src = `${raster.path}/${sourceZoom}/${x}/${y}.png`;
      img.style.left = `${Math.round((x * TILE_SIZE - originSource.x) * tileScale)}px`;
      img.style.top = `${Math.round((y * TILE_SIZE - originSource.y) * tileScale)}px`;
      img.style.width = `${Math.ceil(TILE_SIZE * tileScale)}px`;
      img.style.height = `${Math.ceil(TILE_SIZE * tileScale)}px`;
      img.onerror = () => img.remove();
      layerEl.appendChild(img);
    }
  }
}

function polygonRings(geometry) {
  if (!geometry) return [];
  if (geometry.type === "Polygon") return geometry.coordinates;
  if (geometry.type === "MultiPolygon") return geometry.coordinates.flat(1);
  return [];
}

function lineParts(geometry) {
  if (!geometry) return [];
  if (geometry.type === "LineString") return [geometry.coordinates];
  if (geometry.type === "MultiLineString") return geometry.coordinates;
  return [];
}

function pointParts(geometry) {
  if (!geometry) return [];
  if (geometry.type === "Point") return [geometry.coordinates];
  if (geometry.type === "MultiPoint") return geometry.coordinates;
  return [];
}

function featureLabel(layer, feature, index) {
  const props = feature.properties || {};
  if (props.nombre) return props.nombre;
  if (props.name) return props.name;
  if (props.tipo && layer.id === "bancos_forrajes") return "Banco forrajero";
  if (layer.id === "potreros") return `P${String(index + 1).padStart(2, "0")}`;
  if (layer.id === "infraestructura") return `Infra ${String(index + 1).padStart(2, "0")}`;
  if (layer.id === "drenaje_principal") return props.label ? `Drenaje ${props.label}` : `Drenaje ${String(index + 1).padStart(2, "0")}`;
  if (layer.id === "lineas_offset_10m") return `L${String(index + 1).padStart(2, "0")} · ${Math.round(props.offset_m || 0)} m`;
  if (layer.id === "ssp_arboles") return `Árbol propuesto ${props.id || String(index + 1).padStart(3, "0")}`;
  if (layer.id === "arboles_existentes") return `Árbol existente ${String(index + 1).padStart(3, "0")}`;
  if (layer.id === "finca") return "Finca";
  return layer.name;
}

function lineStyle(feature) {
  const priority = String(feature.properties?.prioridad || "").toLowerCase();
  if (priority === "alta") return { color: "#e13f5f", width: 3.2 };
  if (priority === "baja") return { color: "#7d5cc6", width: 2.3 };
  return { color: "#2f80ed", width: 2.4 };
}

function layerStyle(layer, feature) {
  if (layer.id === "potreros" && Number(feature.properties?.anegacion_problemas) === 1) {
    return {
      ...layer.style,
      stroke: "#1f78ff",
      fill: "rgba(31,120,255,0.28)",
      width: 2.4,
      dash: [6, 3],
      haloStroke: "rgba(7,49,122,0.28)",
      haloWidth: 5,
    };
  }
  if (layer.id === "lineas_offset_10m") {
    return { ...layer.style, ...lineStyle(feature) };
  }
  return layer.style;
}

function getSymbolImage(src) {
  if (!src) return null;
  if (symbolImages.has(src)) return symbolImages.get(src);
  const img = new Image();
  img.decoding = "async";
  img.onload = () => renderVectors();
  img.src = src;
  symbolImages.set(src, img);
  return img;
}

function symbolForPoint(layer, feature) {
  if (layer.id === "ssp_arboles") {
    return speciesSymbols[feature.properties?.cod_sp] || null;
  }
  if (layer.id === "arboles_existentes") {
    return existingTreeSymbol;
  }
  if (layer.id === "puntos_fotos") {
    return photoPointSymbol;
  }
  return null;
}

function drawPath(points, closePath = false) {
  points.forEach((coord, i) => {
    const [x, y] = lngLatToScreen(coord);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  if (closePath) ctx.closePath();
}

function centroid(coords) {
  if (!coords.length) return null;
  let x = 0;
  let y = 0;
  coords.forEach((coord) => {
    x += coord[0];
    y += coord[1];
  });
  return [x / coords.length, y / coords.length];
}

function midpoint(coords) {
  if (!coords.length) return null;
  return coords[Math.floor(coords.length / 2)];
}

function roundRect(x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawLabel(text, coord, tone = "dark") {
  if (!coord) return;
  const [x, y] = lngLatToScreen(coord);
  if (x < -80 || y < -40 || x > map.clientWidth + 80 || y > map.clientHeight + 40) return;
  ctx.font = "750 11px Inter, Segoe UI, sans-serif";
  ctx.textBaseline = "middle";
  const width = Math.ceil(ctx.measureText(text).width) + 14;
  const height = 22;
  const left = Math.round(x - width / 2);
  const top = Math.round(y - height / 2);
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.18)";
  ctx.shadowBlur = 12;
  ctx.fillStyle = tone === "light" ? "rgba(255,255,255,0.88)" : "rgba(24,32,29,0.82)";
  roundRect(left, top, width, height, 7);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = tone === "light" ? "#17201d" : "#ffffff";
  ctx.fillText(text, left + 7, top + height / 2 + 0.5);
  ctx.restore();
}

function drawTreeSymbol(coord, style, layer, feature) {
  const [x, y] = lngLatToScreen(coord);
  if (x < -24 || y < -24 || x > map.clientWidth + 24 || y > map.clientHeight + 24) return;
  const symbol = getSymbolImage(symbolForPoint(layer, feature));
  if (symbol?.complete && symbol.naturalWidth > 0) {
    const size = style.iconSize || 24;
    ctx.save();
    ctx.shadowColor = "rgba(18, 31, 22, 0.22)";
    ctx.shadowBlur = 7;
    ctx.shadowOffsetY = 2;
    ctx.drawImage(symbol, x - size / 2, y - size / 2, size, size);
    ctx.restore();
    return;
  }
  const radius = style.radius || 5.5;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius + 4.5, 0, Math.PI * 2);
  ctx.fillStyle = style.halo || "rgba(222,247,196,0.7)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = style.fill || "#46a758";
  ctx.fill();
  ctx.lineWidth = style.width || 1.5;
  ctx.strokeStyle = style.stroke || "#1e6b43";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x - radius * 0.32, y - radius * 0.34, Math.max(1.4, radius * 0.28), 0, Math.PI * 2);
  ctx.fillStyle = "rgba(230,255,176,0.92)";
  ctx.fill();
  ctx.restore();
}

function drawPhotoSymbol(coord, style, layer, feature) {
  const [x, y] = lngLatToScreen(coord);
  if (x < -28 || y < -28 || x > map.clientWidth + 28 || y > map.clientHeight + 28) return;
  const symbol = getSymbolImage(symbolForPoint(layer, feature));
  if (symbol?.complete && symbol.naturalWidth > 0) {
    const size = style.iconSize || 26;
    ctx.save();
    ctx.shadowColor = "rgba(17, 24, 39, 0.3)";
    ctx.shadowBlur = 9;
    ctx.shadowOffsetY = 2;
    ctx.drawImage(symbol, x - size / 2, y - size / 2, size, size);
    ctx.restore();
    return;
  }
  drawTreeSymbol(coord, style, layer, feature);
}

function renderVectors() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(map.clientWidth * ratio);
  canvas.height = Math.floor(map.clientHeight * ratio);
  canvas.style.width = `${map.clientWidth}px`;
  canvas.style.height = `${map.clientHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, map.clientWidth, map.clientHeight);

  vectorLayers.forEach((layer) => {
    if (!layer.visible) return;
    const data = state.datasets.get(layer.id);
    if (!data) return;

    data.features.forEach((feature) => {
      const style = layerStyle(layer, feature);
      ctx.save();
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = style.stroke || style.color;
      ctx.fillStyle = style.fill;
      ctx.lineWidth = style.width;
      ctx.setLineDash(style.dash || []);

      const rings = polygonRings(feature.geometry);
      if (rings.length) {
        ctx.beginPath();
        rings.forEach((ring) => drawPath(ring, true));
        if (style.fill) ctx.fill("evenodd");
        if (style.haloStroke) {
          ctx.save();
          ctx.strokeStyle = style.haloStroke;
          ctx.lineWidth = style.haloWidth || style.width + 3;
          ctx.stroke();
          ctx.restore();
        }
        ctx.stroke();
      }

      const parts = lineParts(feature.geometry);
      if (parts.length) {
        ctx.beginPath();
        parts.forEach((part) => drawPath(part, false));
        if (style.haloStroke) {
          ctx.save();
          ctx.strokeStyle = style.haloStroke;
          ctx.lineWidth = style.haloWidth || style.width + 3;
          ctx.stroke();
          ctx.restore();
        }
        ctx.stroke();
      }

      pointParts(feature.geometry).forEach((coord) => {
        if (layer.id === "puntos_fotos") drawPhotoSymbol(coord, style, layer, feature);
        else drawTreeSymbol(coord, style, layer, feature);
      });
      ctx.restore();
    });
  });

  vectorLayers.forEach((layer) => {
    if (!layer.visible) return;
    const data = state.datasets.get(layer.id);
    if (!data) return;
    data.features.forEach((feature, index) => {
      const coords = collectCoords(feature.geometry, []);
      if (!coords.length) return;
      const priority = String(feature.properties?.prioridad || "").toLowerCase();
      const showLine = false;
      const showPoint = false;
      const showPolygon = layer.id === "finca";
      if (!showLine && !showPolygon && !showPoint) return;
      const labelCoord = layer.id === "lineas_offset_10m" ? midpoint(coords) : centroid(coords);
      drawLabel(featureLabel(layer, feature, index), labelCoord, layer.id === "potreros" ? "dark" : "light");
    });
  });
}

function render() {
  const raster = rasterLayers.find((layer) => layer.id === state.activeRaster);
  zoomLabel.textContent = `Z${state.zoom}`;
  activeRasterName.textContent = raster?.name || "";
  renderTiles();
  renderVectors();
}

function zoomAt(nextZoom, x = map.clientWidth / 2, y = map.clientHeight / 2) {
  const zoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
  if (zoom === state.zoom) return;
  const anchor = screenToLngLat(x, y);
  state.zoom = zoom;
  const anchorWorld = project(anchor[0], anchor[1], state.zoom);
  const origin = { x: anchorWorld.x - x, y: anchorWorld.y - y };
  const centerWorld = { x: origin.x + map.clientWidth / 2, y: origin.y + map.clientHeight / 2 };
  state.center = unproject(centerWorld.x, centerWorld.y, state.zoom);
  hidePopup();
  render();
}

function valueForPopup(value) {
  if (typeof value === "number") {
    if (Math.abs(value) >= 100) return value.toFixed(0);
    if (Math.abs(value) >= 10) return value.toFixed(1);
    return value.toFixed(2);
  }
  return String(value);
}

function popupFields(feature) {
  const props = feature.properties || {};
  const preferred = ["prioridad", "offset_m", "length_m", "mean_slope_pct", "mean_twi", "mean_spi", "tipo"];
  const keys = preferred.filter((key) => props[key] !== undefined && props[key] !== null && props[key] !== "");
  Object.keys(props).forEach((key) => {
    if (!keys.includes(key) && key !== "criterio") keys.push(key);
  });
  return keys.slice(0, 7);
}

function mediaPath(feature) {
  const raw = String(feature.properties?.Foto || "").trim();
  if (!raw) return null;
  if (mediaByPhotoId[raw]) return mediaByPhotoId[raw];
  const withoutExt = raw.replace(/\.[^.]+$/, "");
  if (mediaByPhotoId[withoutExt]) return mediaByPhotoId[withoutExt];
  return raw.includes("/") || raw.includes("\\") ? raw.replaceAll("\\", "/") : `assets/fotos/${raw}`;
}

function mediaDescription(feature) {
  const raw = String(feature.properties?.Foto || "").trim();
  if (!raw) return "";
  const withoutExt = raw.replace(/\.[^.]+$/, "");
  return mediaDescriptions[raw] || mediaDescriptions[withoutExt] || "";
}

function mediaMarkup(feature) {
  const path = mediaPath(feature);
  if (!path) return "";
  const cleanPath = path.replaceAll('"', "%22");
  const description = mediaDescription(feature);
  const caption = description ? `<p class="popup-description">${description}</p>` : "";
  if (/^data:video\//i.test(cleanPath) || /\.(mp4|webm|mov)(\?|#|$)/i.test(cleanPath)) {
    return `<video class="popup-media" src="${cleanPath}" controls preload="metadata"></video>${caption}`;
  }
  return `<img class="popup-media" src="${cleanPath}" alt="Registro fotografico">${caption}`;
}

function showPopup(layer, feature, index, x, y) {
  const title = layer.id === "puntos_fotos" ? "Conociendo la finca" : featureLabel(layer, feature, index);
  const keys = layer.id === "puntos_fotos" ? [] : popupFields(feature);
  const priority = String(feature.properties?.prioridad || "").toLowerCase();
  const rows = keys.length
    ? keys.map((key) => `<dt>${key.replaceAll("_", " ")}</dt><dd>${key === "prioridad" ? `<span class="badge ${priority}">${valueForPopup(feature.properties[key])}</span>` : valueForPopup(feature.properties[key])}</dd>`).join("")
    : layer.id === "puntos_fotos" ? "" : "<dt>Capa</dt><dd>Sin atributos</dd>";

  popup.innerHTML = `<h2>${title}</h2>${mediaMarkup(feature)}${rows ? `<dl>${rows}</dl>` : ""}`;
  popup.hidden = false;
  const left = clamp(x + 12, 12, map.clientWidth - 312);
  const top = clamp(y + 12, 70, map.clientHeight - popup.offsetHeight - 12);
  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
}

function hidePopup() {
  popup.hidden = true;
}

function setInfiltrationInfo(open) {
  if (!infiltrationInfo || !infiltrationInfoToggle) return;
  infiltrationInfo.hidden = !open;
  infiltrationInfoToggle.setAttribute("aria-expanded", String(open));
}

function pointInRing(point, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersect = yi > point[1] !== yj > point[1] && point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi || 1e-9) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function distanceToSegment(point, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  if (dx === 0 && dy === 0) return Math.hypot(point[0] - a[0], point[1] - a[1]);
  const t = clamp(((point[0] - a[0]) * dx + (point[1] - a[1]) * dy) / (dx * dx + dy * dy), 0, 1);
  return Math.hypot(point[0] - (a[0] + t * dx), point[1] - (a[1] + t * dy));
}

function hitTest(x, y) {
  const screenPoint = [x, y];
  const ordered = [...vectorLayers].reverse();
  for (const layer of ordered) {
    if (!layer.visible) continue;
    const data = state.datasets.get(layer.id);
    if (!data) continue;
    for (let i = data.features.length - 1; i >= 0; i -= 1) {
      const feature = data.features[i];
      const rings = polygonRings(feature.geometry);
      if (rings.some((ring) => pointInRing(screenPoint, ring.map(lngLatToScreen)))) {
        return { layer, feature, index: i };
      }
      const parts = lineParts(feature.geometry);
      for (const part of parts) {
        const pts = part.map(lngLatToScreen);
        for (let p = 1; p < pts.length; p += 1) {
          if (distanceToSegment(screenPoint, pts[p - 1], pts[p]) < 9) return { layer, feature, index: i };
        }
      }
      const points = pointParts(feature.geometry).map(lngLatToScreen);
      if (points.some((point) => Math.hypot(screenPoint[0] - point[0], screenPoint[1] - point[1]) < 12)) {
        return { layer, feature, index: i };
      }
    }
  }
  return null;
}

function buildControls() {
  rasterList.innerHTML = rasterLayers.map((layer, index) => `
    <label class="raster-option">
      <input type="radio" name="raster" value="${layer.id}" ${index === 0 ? "checked" : ""}>
      <span><strong>${layer.name}</strong><small>${layer.detail}</small></span>
      <span class="pill">Z${layer.minZoom}-${layer.maxZoom}</span>
    </label>
  `).join("");

  vectorList.innerHTML = vectorLayers.map((layer) => `
    <label class="layer-option">
      <input type="checkbox" value="${layer.id}" ${layer.visible ? "checked" : ""}>
      <span><strong>${layer.name}</strong><small>${layer.detail}</small></span>
      <span class="pill" id="count-${layer.id}">--</span>
    </label>
  `).join("");

  rasterList.addEventListener("change", (event) => {
    if (!event.target.matches("input[name='raster']")) return;
    state.activeRaster = event.target.value;
    hidePopup();
    render();
  });

  vectorList.addEventListener("change", (event) => {
    if (!event.target.matches("input[type='checkbox']")) return;
    const layer = vectorLayers.find((item) => item.id === event.target.value);
    if (!layer) return;
    layer.visible = event.target.checked;
    hidePopup();
    renderVectors();
  });
}

async function loadData() {
  const datasets = await Promise.all(vectorLayers.map(async (layer) => {
    const response = await fetch(layer.url);
    if (!response.ok) throw new Error(`No se pudo cargar ${layer.url}`);
    return [layer, await response.json()];
  }));

  let bbox = null;
  datasets.forEach(([layer, data]) => {
    state.datasets.set(layer.id, data);
    data.features.forEach((feature) => {
      collectCoords(feature.geometry).forEach((coord) => {
        bbox = extendBbox(bbox, coord);
      });
    });
    const count = document.querySelector(`#count-${layer.id}`);
    if (count) count.textContent = String(data.features.length);
  });

  state.bbox = bbox;
  fitBounds();
}

function bindMapEvents() {
  let dragStart = null;

  map.addEventListener("pointerdown", (event) => {
    map.setPointerCapture(event.pointerId);
    state.dragging = true;
    map.classList.add("dragging");
    dragStart = {
      x: event.clientX,
      y: event.clientY,
      center: project(state.center[0], state.center[1]),
      moved: false,
    };
    hidePopup();
  });

  map.addEventListener("pointermove", (event) => {
    if (!state.dragging || !dragStart) return;
    const dx = event.clientX - dragStart.x;
    const dy = event.clientY - dragStart.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) dragStart.moved = true;
    state.center = unproject(dragStart.center.x - dx, dragStart.center.y - dy);
    render();
  });

  map.addEventListener("pointerup", (event) => {
    map.releasePointerCapture(event.pointerId);
    state.dragging = false;
    map.classList.remove("dragging");
    if (dragStart && !dragStart.moved) {
      const rect = map.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const hit = hitTest(x, y);
      if (hit) showPopup(hit.layer, hit.feature, hit.index, x, y);
      else hidePopup();
    }
    dragStart = null;
  });

  map.addEventListener("wheel", (event) => {
    event.preventDefault();
    const rect = map.getBoundingClientRect();
    const direction = event.deltaY < 0 ? 1 : -1;
    zoomAt(state.zoom + direction, event.clientX - rect.left, event.clientY - rect.top);
  }, { passive: false });

  window.addEventListener("resize", render);
  document.querySelector("#zoom-in").addEventListener("click", () => zoomAt(state.zoom + 1));
  document.querySelector("#zoom-out").addEventListener("click", () => zoomAt(state.zoom - 1));
  document.querySelector("#fit-map").addEventListener("click", () => fitBounds());
  infiltrationInfoToggle?.addEventListener("click", () => {
    setInfiltrationInfo(infiltrationInfo?.hidden ?? true);
  });
  infiltrationInfoClose?.addEventListener("click", () => setInfiltrationInfo(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setInfiltrationInfo(false);
  });
  document.querySelector("#raster-opacity-reset").addEventListener("click", () => {
    state.rasterOpacity = 0.92;
    rasterOpacity.value = "92";
    renderTiles();
  });
  rasterOpacity.addEventListener("input", () => {
    state.rasterOpacity = Number(rasterOpacity.value) / 100;
    renderTiles();
  });
}

buildControls();
bindMapEvents();
loadData().catch((error) => {
  activeRasterName.textContent = error.message;
  console.error(error);
});
