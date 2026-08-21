#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
CARD_DIR="$ROOT_DIR/design/quiz-cards"
OUT_DIR="$CARD_DIR/png"
FONT="$ROOT_DIR/landing/assets/fonts/russo-one.ttf"
BACKDROP="/var/folders/s1/tw60mvr16bn0bf8wmf5ldx9h0000gn/T/codex-clipboard-66a1d719-fa93-4091-a977-acd2aab80f8b.png"
LOGO="$ROOT_DIR/landing/assets/cobrand-optimized.jpg"
PAPER="$CARD_DIR/quiz-card-paper-texture-v1.png"

mkdir -p "$OUT_DIR"

# 60 × 40 mm proportion, exported at 1800 × 1200 px for a sharp print-ready PNG.
ffmpeg -y -i "$BACKDROP" -i "$LOGO" -filter_complex "
  [0:v]crop=400:267:11:8,scale=1800:1200:flags=lanczos,format=rgba[base];
  [1:v]scale=760:760:flags=lanczos,format=rgba,
    geq=r='255':g='255':b='255':a='if(gt(min(min(r(X,Y),g(X,Y)),b(X,Y)),185),255,0)'[logo];
  [base][logo]overlay=(W-w)/2:(H-h)/2,
    drawbox=x=49:y=49:w=1702:h=1102:color=0xf5f0df@0.82:t=4,
    drawbox=x=61:y=61:w=1678:h=1078:color=0x041b18@0.45:t=12
" -frames:v 1 "$OUT_DIR/quiz-card-back-60x40.png"

ffmpeg -y -loop 1 -i "$PAPER" -i "$LOGO" -filter_complex "
  [0:v]scale=1800:1200:force_original_aspect_ratio=increase:flags=lanczos,crop=1800:1200,format=rgba[paper];
  [1:v]scale=230:230:flags=lanczos[badge];
  [paper][badge]overlay=1480:86,
    drawbox=x=42:y=42:w=1716:h=1116:color=0x052f27:t=14,
    drawbox=x=71:y=71:w=1658:h=1058:color=0xec1c2b:t=4,
    drawbox=x=112:y=170:w=510:h=12:color=0xec1c2b:t=fill,
    drawbox=x=112:y=286:w=1380:h=300:color=0xffffff@0.38:t=fill,
    drawbox=x=112:y=684:w=1320:h=102:color=0x006b55:t=fill,
    drawbox=x=112:y=817:w=1320:h=102:color=0xffffff@0.62:t=fill,
    drawbox=x=112:y=950:w=1320:h=102:color=0xffffff@0.62:t=fill,
    drawbox=x=145:y=324:w=970:h=16:color=0x101817@0.78:t=fill,
    drawbox=x=145:y=372:w=1140:h=16:color=0x101817@0.78:t=fill,
    drawbox=x=145:y=420:w=810:h=16:color=0x101817@0.78:t=fill,
    drawbox=x=145:y=706:w=34:h=34:color=0xc9ef46:t=fill,
    drawbox=x=145:y=839:w=34:h=34:color=0xec1c2b:t=fill,
    drawbox=x=145:y=972:w=34:h=34:color=0x006b55:t=fill
" -frames:v 1 "$OUT_DIR/quiz-card-question-01-60x40.png"
