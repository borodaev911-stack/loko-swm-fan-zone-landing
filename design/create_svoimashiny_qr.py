from pathlib import Path

import qrcode
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "outputs" / "svoimashiny-loko-swm-qr.png"
COBRAND = ROOT / "landing" / "assets" / "cobrand-optimized.jpg"
RUSSO = ROOT / "landing" / "assets" / "fonts" / "russo-one.ttf"
MANROPE = ROOT / "landing" / "assets" / "fonts" / "manrope-800.ttf"

SIZE = 2048
RED = "#EC1C2B"
DEEP_GREEN = "#041B18"
GREEN = "#006B55"
LIME = "#C9EF46"
CREAM = "#F5F0DF"
INK = "#101817"


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size=size)


def center_text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, text_font, fill, **kwargs) -> None:
    box = draw.textbbox((0, 0), text, font=text_font, **kwargs)
    draw.text((xy[0] - (box[2] - box[0]) / 2, xy[1]), text, font=text_font, fill=fill, **kwargs)


def make_qr() -> Image.Image:
    # H protects the code if the print is slightly damaged; the surrounding white
    # border remains untouched so phone cameras can detect the code reliably.
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=34,
        border=4,
    )
    qr.add_data("https://svoimashiny.ru")
    qr.make(fit=True)
    return qr.make_image(fill_color=DEEP_GREEN, back_color="white").convert("RGB")


def main() -> None:
    image = Image.new("RGB", (SIZE, SIZE), CREAM)
    draw = ImageDraw.Draw(image)

    # Dark offset shadow and red campaign frame.
    draw.rounded_rectangle((130, 106, 1922, 1898), radius=56, fill=DEEP_GREEN)
    draw.rounded_rectangle((72, 68, 1864, 1860), radius=56, fill=RED)
    draw.rounded_rectangle((104, 100, 1832, 1828), radius=40, fill=CREAM)

    # Project-style halftone texture. It stays entirely outside the QR quiet zone.
    for x in range(130, 1800, 28):
        for y in range(125, 1800, 28):
            draw.ellipse((x, y, x + 5, y + 5), fill="#D7D1C3")

    # Top co-brand header.
    draw.rounded_rectangle((190, 162, 1746, 346), radius=24, fill=DEEP_GREEN)
    cobrand = Image.open(COBRAND).convert("RGB").resize((148, 148), Image.Resampling.LANCZOS)
    image.paste(cobrand, (208, 180))
    headline_font = font(RUSSO, 54)
    center_text(draw, (1010, 201), "СКАНИРУЙ И ПЕРЕХОДИ", headline_font, "white")
    center_text(draw, (1010, 267), "НА САЙТ СВОИ МАШИНЫ", font(MANROPE, 25), LIME)

    # QR placement is all-white including its four-module quiet zone.
    code = make_qr()
    qr_x = (SIZE - code.width) // 2
    qr_y = 408
    draw.rounded_rectangle((qr_x - 18, qr_y - 18, qr_x + code.width + 18, qr_y + code.height + 18), radius=16, fill="white")
    image.paste(code, (qr_x, qr_y))

    # Pop-art footer; these details do not overlap the scanning field.
    draw.rectangle((296, 1708, 644, 1725), fill=LIME)
    domain_font = font(RUSSO, 74)
    center_text(draw, (984, 1739), "svoimashiny.ru", domain_font, INK)
    center_text(draw, (984, 1802), "НОВЫЕ АВТОМОБИЛИ ДЛЯ СВОИХ", font(MANROPE, 24), GREEN)

    # Corner stickers echo the landing-page comic accents, without affecting QR readability.
    draw.polygon([(148, 392), (174, 418), (211, 405), (202, 442), (236, 468), (195, 476), (181, 516), (165, 480), (128, 488), (143, 456), (110, 438), (145, 430)], fill=LIME)
    draw.polygon([(1748, 1270), (1774, 1296), (1811, 1283), (1802, 1320), (1836, 1346), (1795, 1354), (1781, 1394), (1765, 1358), (1728, 1366), (1743, 1334), (1710, 1316), (1745, 1308)], fill=RED)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    image.save(OUTPUT, "PNG", optimize=True)
    print(OUTPUT)


if __name__ == "__main__":
    main()
