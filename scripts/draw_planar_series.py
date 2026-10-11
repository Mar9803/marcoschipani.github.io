"""Figures for the series «Il disegno non è il grafo». One-off generator."""

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyBboxPatch
from PIL import Image
import numpy as np

OUT = Path(__file__).resolve().parents[1] / "public"
OUT.mkdir(exist_ok=True)

PAPER = "#fbf8f3"
INK = "#1c1917"
EDGE = "#44403c"
TEAL = "#1e9aa3"
AMBER = "#b45309"
RUST = "#c2410c"
MUTED = "#78716c"
FACE = "#e7f4f5"

W, H = 8.2, 5.4
DPI = 120


def seg_cross(p, q, r, s, eps=1e-8):
    p, q, r, s = map(np.asarray, (p, q, r, s))
    def orient(a, b, c):
        return np.sign((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]))

    o1, o2 = orient(p, q, r), orient(p, q, s)
    o3, o4 = orient(r, s, p), orient(r, s, q)
    if abs(o1) < eps or abs(o2) < eps or abs(o3) < eps or abs(o4) < eps:
        return False
    return o1 != o2 and o3 != o4


def crossing_points(pos, edges):
    pts = []
    for i, (a, b) in enumerate(edges):
        for c, d in edges[i + 1 :]:
            if len({a, b, c, d}) < 4:
                continue
            if seg_cross(pos[a], pos[b], pos[c], pos[d]):
                p, q = np.asarray(pos[a], float), np.asarray(pos[b], float)
                r, s = np.asarray(pos[c], float), np.asarray(pos[d], float)
                A = np.array([q - p, r - s]).T
                try:
                    t, _ = np.linalg.solve(A, r - p)
                except np.linalg.LinAlgError:
                    continue
                pts.append(p + t * (q - p))
    return pts


def new_ax(title, subtitle=None):
    fig, ax = plt.subplots(figsize=(W, H), dpi=DPI)
    fig.patch.set_facecolor(PAPER)
    ax.set_facecolor(PAPER)
    ax.set_aspect("equal")
    ax.axis("off")
    fig.suptitle(title, fontsize=15, color=INK, fontweight="medium", y=0.96)
    if subtitle:
        ax.set_title(subtitle, fontsize=11, color=MUTED, pad=8)
    return fig, ax


def draw(ax, pos, edges, labels, colors=None, lw=2.4, node_r=0.16, cross=True, edge_colors=None, fontsize=10):
    pos = {k: np.asarray(v, float) for k, v in pos.items()}
    for i, (a, b) in enumerate(edges):
        c = EDGE if edge_colors is None else edge_colors.get((a, b), edge_colors.get((b, a), EDGE))
        ax.plot(
            [pos[a][0], pos[b][0]],
            [pos[a][1], pos[b][1]],
            color=c,
            lw=lw,
            solid_capstyle="round",
            zorder=2,
        )
    xs = crossing_points(pos, edges) if cross else []
    for x in xs:
        ax.add_patch(
            Circle(x, node_r * 0.42, facecolor=RUST, edgecolor="white", lw=1.2, zorder=4)
        )
    for name, p in pos.items():
        col = INK if colors is None else colors.get(name, INK)
        ax.add_patch(Circle(p, node_r, facecolor=col, edgecolor="white", lw=1.6, zorder=5))
        ax.text(
            p[0],
            p[1],
            labels[name],
            ha="center",
            va="center",
            color="white",
            fontsize=fontsize,
            fontweight="medium",
            zorder=6,
        )
    return len(xs)


def counter(ax, n, x=0.02, y=0.04, singular="incrocio", plural="incroci"):
    word = singular if n == 1 else plural
    ax.text(
        x,
        y,
        f"{n} {word}",
        transform=ax.transAxes,
        fontsize=12,
        color=TEAL if n == 0 else RUST,
        fontweight="medium",
    )


def finish(fig, ax, pad=0.55):
    ax.relim()
    ax.autoscale_view()
    ax.margins(0.18)
    fig.tight_layout(rect=(0, 0.02, 1, 0.93))
    fig.canvas.draw()
    buf = np.asarray(fig.canvas.buffer_rgba())
    plt.close(fig)
    return Image.fromarray(buf[:, :, :3])


def save_gif(frames, name, ms=80):
    durations = [ms] * len(frames)
    durations[0] = 1100
    durations[-1] = 1700
    frames[0].save(
        OUT / name,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        optimize=False,
        disposal=2,
    )
    print(name, frames[0].size, (OUT / name).stat().st_size // 1024, "KB")


def save_png(img, name):
    img.save(OUT / name, optimize=True)
    print(name, img.size, (OUT / name).stat().st_size // 1024, "KB")


def lerp(a, b, t):
    a, b = np.asarray(a, float), np.asarray(b, float)
    return (1 - t) * a + t * b


def morph(start, end, t):
    return {k: lerp(start[k], end[k], t) for k in start}


# --- 1. Isomorphism: one crossing that belongs to the drawing ---
iso_edges = [("a", "b"), ("b", "c"), ("c", "d"), ("d", "e"), ("e", "a"), ("a", "d"), ("b", "e")]
iso_labels = {k: k for k in "abcde"}
iso_start = {
    "a": (0.0, 1.6),
    "b": (1.5, 0.1),
    "c": (2.5, 1.15),
    "d": (1.7, 2.7),
    "e": (0.2, 2.55),
}
iso_end = {
    "a": (0.0, 0.2),
    "b": (2.2, 0.0),
    "c": (3.1, 1.6),
    "d": (1.5, 2.9),
    "e": (1.15, 1.35),
}
print("iso crossings", len(crossing_points(iso_start, iso_edges)), len(crossing_points(iso_end, iso_edges)))

iso_frames = []
for t in np.linspace(0, 1, 28):
    s = t * t * (3 - 2 * t)
    fig, ax = new_ax("Lo stesso grafo, due disegni", "Gli archi non cambiano. L'incrocio sì.")
    n = draw(ax, morph(iso_start, iso_end, s), iso_edges, iso_labels)
    counter(ax, n)
    iso_frames.append(finish(fig, ax))
save_gif(iso_frames, "disegno-isomorfismo.gif", ms=70)

# --- 2. K4 untangles ---
k4_edges = [(i, j) for i in range(4) for j in range(i + 1, 4)]
k4_labels = {i: str(i + 1) for i in range(4)}
k4_start = {0: (0, 0), 1: (3, 0), 2: (3, 3), 3: (0, 3)}
k4_end = {0: (0, 0), 1: (3, 0), 2: (1.5, 2.7), 3: (1.5, 0.95)}
print("k4", len(crossing_points(k4_start, k4_edges)), len(crossing_points(k4_end, k4_edges)))

k4_frames = []
for t in np.linspace(0, 1, 28):
    s = t * t * (3 - 2 * t)
    fig, ax = new_ax("K₄ è planare", "Un vertice entra nel triangolo e l'incrocio sparisce.")
    n = draw(ax, morph(k4_start, k4_end, s), k4_edges, k4_labels)
    counter(ax, n)
    k4_frames.append(finish(fig, ax))
save_gif(k4_frames, "disegno-k4.gif", ms=70)

# --- 3. K5 never reaches zero ---
k5_edges = [(i, j) for i in range(5) for j in range(i + 1, 5)]
k5_labels = {i: str(i + 1) for i in range(5)}
ang = np.linspace(np.pi / 2, np.pi / 2 + 2 * np.pi, 5, endpoint=False)
k5_pent = {i: (2.2 * np.cos(ang[i]), 2.2 * np.sin(ang[i])) for i in range(5)}
# Triangle, one vertex inside (K4, zero crossings), the fifth in a face: exactly one crossing.
k5_inner = {
    0: (0.0, 0.0),
    1: (4.0, 0.0),
    2: (2.0, 3.6),
    3: (2.0, 1.35),
    4: (1.15, 0.42),
}
print("k5", len(crossing_points(k5_pent, k5_edges)), len(crossing_points(k5_inner, k5_edges)))

k5_frames = []
for t in np.linspace(0, 1, 28):
    s = t * t * (3 - 2 * t)
    fig, ax = new_ax("K₅ non si scioglie", "Sposti i vertici: resta almeno un incrocio.")
    n = draw(ax, morph(k5_pent, k5_inner, s), k5_edges, k5_labels, node_r=0.2)
    counter(ax, n)
    k5_frames.append(finish(fig, ax))
save_gif(k5_frames, "disegno-k5.gif")

k5_en_frames = []
for t in np.linspace(0, 1, 28):
    s = t * t * (3 - 2 * t)
    fig, ax = new_ax("K₅ will not untangle", "Move the vertices: at least one crossing remains.")
    n = draw(ax, morph(k5_pent, k5_inner, s), k5_edges, k5_labels, node_r=0.2)
    counter(ax, n, singular="crossing", plural="crossings")
    k5_en_frames.append(finish(fig, ax))
save_gif(k5_en_frames, "disegno-k5-en.gif")

# --- 4. K3,3 ---
k33_edges = [(a, b) for a in ("a", "b", "c") for b in ("d", "e", "f")]
k33_labels = {"a": "a", "b": "b", "c": "c", "d": "d", "e": "e", "f": "f"}
k33_colors = {k: TEAL for k in "abc"} | {k: AMBER for k in "def"}
k33_cols = {
    "a": (0, 2.4),
    "b": (0, 1.2),
    "c": (0, 0),
    "d": (3.2, 2.4),
    "e": (3.2, 1.2),
    "f": (3.2, 0),
}
k33_best = {
    "a": (0.24, 2.59),
    "b": (-1.64, 0.80),
    "c": (-0.91, -4.83),
    "d": (-3.25, 3.32),
    "e": (0.70, -2.14),
    "f": (2.45, -0.51),
}
print(
    "k33",
    len(crossing_points(k33_cols, k33_edges)),
    len(crossing_points(k33_best, k33_edges)),
)

k33_frames = []
for t in np.linspace(0, 1, 28):
    s = t * t * (3 - 2 * t)
    fig, ax = new_ax("K₃,₃ non si scioglie", "Tre e tre, tutti gli archi. Le due parti hanno colori diversi.")
    n = draw(
        ax,
        morph(k33_cols, k33_best, s),
        k33_edges,
        k33_labels,
        colors=k33_colors,
        node_r=0.18,
    )
    counter(ax, n)
    k33_frames.append(finish(fig, ax))
save_gif(k33_frames, "disegno-k33.gif", ms=70)

# --- 5. Euler on a planar drawing of a square plus a diagonal ---
fig, ax = new_ax("Il conto di Eulero", "v − e + f = 2, faccia esterna compresa.")
sq = {0: (0, 0), 1: (2.6, 0), 2: (2.6, 2.2), 3: (0, 2.2)}
sq_edges = [(0, 1), (1, 2), (2, 3), (3, 0), (0, 2)]
tri1 = plt.Polygon([sq[0], sq[1], sq[2]], closed=True, facecolor=FACE, edgecolor="none", zorder=0)
tri2 = plt.Polygon([sq[0], sq[2], sq[3]], closed=True, facecolor="#f3e6d8", edgecolor="none", zorder=0)
ax.add_patch(tri1)
ax.add_patch(tri2)
draw(ax, sq, sq_edges, {i: str(i + 1) for i in range(4)}, cross=False, node_r=0.16)
ax.text(1.7, 0.85, "f₁", color=TEAL, fontsize=13)
ax.text(0.85, 1.55, "f₂", color=AMBER, fontsize=13)
ax.text(1.3, -0.55, "f₃  faccia esterna", color=MUTED, fontsize=11, ha="center")
ax.text(
    0.0,
    -1.15,
    "v = 4    e = 5    f = 3    4 − 5 + 3 = 2",
    color=INK,
    fontsize=12,
    ha="left",
)
img = finish(fig, ax)
save_png(img, "disegno-euler.png")

# --- 6. Subdivision grows on an edge of K3,3 ---
base_pos = {
    "a": (0.24, 2.59),
    "b": (-1.64, 0.80),
    "c": (-0.91, -4.83),
    "d": (-3.25, 3.32),
    "e": (0.70, -2.14),
    "f": (2.45, -0.51),
}
sub_edges_plain = [(a, b) for a in "abc" for b in "def"]
# split a—e by m
print("subdivision host crossings", len(crossing_points(base_pos, sub_edges_plain)))

sub_frames = []
for t in np.linspace(0, 1, 24):
    s = t * t * (3 - 2 * t)
    mid = lerp(base_pos["a"], base_pos["d"], 0.45)
    pos = dict(base_pos)
    pos["m"] = mid
    edges = [(a, b) for a in "abc" for b in "def" if (a, b) != ("a", "d")]
    # grow: at s=0 the vertex is invisible and the edge is whole; we always draw split
    # visual grow by moving m from the edge midpoint outward slightly? Better:
    # interpolate edge a-e unbroken until late, then show m.
    fig, ax = new_ax(
        "Una suddivisione di K₃,₃",
        "Il vertice nuovo ha grado 2. Il disegno non si scioglie lo stesso.",
    )
    if s < 0.45:
        n = draw(ax, base_pos, sub_edges_plain, {k: k for k in "abcdef"}, colors=k33_colors)
    else:
        labels = {k: k for k in "abcdef"}
        labels["m"] = "m"
        colors = dict(k33_colors)
        colors["m"] = INK
        u = (s - 0.45) / 0.55
        # pop m along the normal so the eye sees a vertex appear on the path
        direction = np.asarray(base_pos["d"]) - np.asarray(base_pos["a"])
        normal = np.array([-direction[1], direction[0]])
        normal = normal / np.linalg.norm(normal)
        pos["m"] = mid + normal * 0.02 * (1 - u)
        n = draw(ax, pos, edges + [("a", "m"), ("m", "d")], labels, colors=colors)
    counter(ax, n)
    sub_frames.append(finish(fig, ax))
save_gif(sub_frames, "disegno-suddivisione.gif", ms=90)

# --- 7. Industrial certificate: analyst drawing + extracted subdivision ---
fig, axes = plt.subplots(1, 2, figsize=(10.4, 5.6), dpi=DPI)
fig.patch.set_facecolor(PAPER)
fig.suptitle(
    "Il certificato sotto il disegno",
    fontsize=15,
    color=INK,
    fontweight="medium",
    y=0.98,
)
titles = (
    "Il disegno che ha davanti l'analista",
    "La suddivisione di K₃,₃ estratta",
)
# Payment-flavored labels, same geometry
pay_labels = {
    "a": "C1",
    "b": "C2",
    "c": "C3",
    "d": "P1",
    "e": "P2",
    "f": "P3",
    "m": "m",
}
pay_colors = {"a": TEAL, "b": TEAL, "c": TEAL, "d": AMBER, "e": AMBER, "f": AMBER, "m": INK}
pos = dict(base_pos)
mid = lerp(base_pos["a"], base_pos["d"], 0.45)
pos["m"] = mid
full_edges = [(a, b) for a in "abc" for b in "def" if (a, b) != ("a", "d")] + [("a", "m"), ("m", "d")]
for ax, title in zip(axes, titles):
    ax.set_facecolor(PAPER)
    ax.set_aspect("equal")
    ax.axis("off")
    ax.set_title(title, fontsize=12, color=INK, pad=10)
    if title.startswith("Il disegno"):
        draw(ax, pos, full_edges, pay_labels, colors=pay_colors, node_r=0.34, fontsize=12)
        ax.text(
            0.0,
            -0.15,
            "C conti   P controparti   m intermediario",
            transform=ax.transAxes,
            fontsize=9,
            color=MUTED,
        )
    else:
        # highlight the nine subdivided paths; all edges are the certificate
        highlight = {e: TEAL for e in full_edges}
        highlight[("a", "e")] = RUST
        highlight[("b", "f")] = RUST
        draw(
            ax,
            pos,
            full_edges,
            pay_labels,
            colors=pay_colors,
            node_r=0.34,
            fontsize=12,
            edge_colors=highlight,
            lw=2.8,
        )
        ax.text(
            0.0,
            -0.15,
            "Ogni disegno di questo sottografo ha almeno un incrocio",
            transform=ax.transAxes,
            fontsize=9,
            color=RUST,
        )
fig.tight_layout(rect=(0, 0.02, 1, 0.94))
fig.canvas.draw()
buf = np.asarray(fig.canvas.buffer_rgba())
plt.close(fig)
save_png(Image.fromarray(buf[:, :, :3]), "disegno-certificato.png")

fig, axes = plt.subplots(1, 2, figsize=(10.4, 5.6), dpi=DPI)
fig.patch.set_facecolor(PAPER)
fig.suptitle(
    "The certificate under the drawing",
    fontsize=15,
    color=INK,
    fontweight="medium",
    y=0.98,
)
en_titles = (
    "The drawing in front of the analyst",
    "The extracted subdivision of K₃,₃",
)
for ax, title in zip(axes, en_titles):
    ax.set_facecolor(PAPER)
    ax.set_aspect("equal")
    ax.axis("off")
    ax.set_title(title, fontsize=12, color=INK, pad=10)
    if title.startswith("The drawing"):
        draw(ax, pos, full_edges, pay_labels, colors=pay_colors, node_r=0.34, fontsize=12)
        ax.text(
            0.0,
            -0.15,
            "C accounts    P counterparties    m intermediary",
            transform=ax.transAxes,
            fontsize=9,
            color=MUTED,
        )
    else:
        highlight = {e: TEAL for e in full_edges}
        highlight[("a", "e")] = RUST
        highlight[("b", "f")] = RUST
        draw(
            ax,
            pos,
            full_edges,
            pay_labels,
            colors=pay_colors,
            node_r=0.34,
            fontsize=12,
            edge_colors=highlight,
            lw=2.8,
        )
        ax.text(
            0.0,
            -0.15,
            "Every drawing of this subgraph has at least one crossing",
            transform=ax.transAxes,
            fontsize=9,
            color=RUST,
        )
fig.tight_layout(rect=(0, 0.02, 1, 0.94))
fig.canvas.draw()
buf = np.asarray(fig.canvas.buffer_rgba())
plt.close(fig)
save_png(Image.fromarray(buf[:, :, :3]), "disegno-certificato-en.png")

# small gif: edges fade in as the certificate, crossing stays
cert_frames = []
order = full_edges
for k in range(1, len(order) + 1):
    fig, ax = new_ax(
        "Sotto la figura, K₃,₃",
        "Gli archi del certificato. L'incrocio non è un tratto stonato.",
    )
    shown = order[:k]
    draw(ax, pos, shown, pay_labels, colors=pay_colors, node_r=0.18, lw=2.6)
    cert_frames.append(finish(fig, ax))
save_gif(cert_frames, "disegno-certificato.gif", ms=160)
