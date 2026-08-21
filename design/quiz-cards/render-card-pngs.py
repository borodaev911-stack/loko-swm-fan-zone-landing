from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


WIDTH, HEIGHT = 1800, 1200
ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "design/quiz-cards/png"
BACKGROUND = Path("/var/folders/s1/tw60mvr16bn0bf8wmf5ldx9h0000gn/T/codex-clipboard-66a1d719-fa93-4091-a977-acd2aab80f8b.png")
LOGO = Path("/var/folders/s1/tw60mvr16bn0bf8wmf5ldx9h0000gn/T/codex-clipboard-e146e679-de4a-41df-838e-8e3f4dc3c153.png")
FONT = ROOT / "landing/assets/fonts/manrope-800.ttf"

CREAM = "#f5f0df"
RED = "#ec1c2b"
GREEN = "#006b55"
DEEP_GREEN = "#052f27"
INK = "#101817"


def resize(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    return image.resize(size, Image.Resampling.LANCZOS)


def extract_mark(image: Image.Image, fill: tuple[int, int, int]) -> Image.Image:
    source = image.convert("RGBA")
    pixels = []
    for red, green, blue, _ in source.getdata():
        alpha = max(0, min(255, (min(red, green, blue) - 126) * 2))
        pixels.append((*fill, alpha))
    mark = Image.new("RGBA", source.size)
    mark.putdata(pixels)
    return mark


def rounded_mask() -> Image.Image:
    mask = Image.new("L", (WIDTH, HEIGHT), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, WIDTH - 1, HEIGHT - 1), radius=62, fill=255)
    return mask


def draw_frame(draw: ImageDraw.ImageDraw, first: str, second: str) -> None:
    draw.rounded_rectangle((49, 49, 1751, 1151), radius=24, outline=first, width=17)
    draw.rounded_rectangle((78, 78, 1722, 1122), radius=12, outline=second, width=5)


def back_card(background: Image.Image, logo: Image.Image) -> Image.Image:
    source = background.convert("RGBA").crop((11, 8, 411, 275))
    card = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    card.paste(resize(source, (WIDTH, HEIGHT)), (0, 0), rounded_mask())
    draw = ImageDraw.Draw(card)
    draw.rounded_rectangle((48, 48, 1752, 1152), radius=24, outline=CREAM, width=4)
    draw.rounded_rectangle((62, 62, 1738, 1138), radius=16, outline=(4, 27, 24, 138), width=12)
    mark = resize(extract_mark(logo, (255, 255, 255)), (1100, 457))
    card.alpha_composite(mark, (350, 402))
    return card


def front_card(logo: Image.Image) -> Image.Image:
    card = Image.new("RGBA", (WIDTH, HEIGHT), "white")
    draw = ImageDraw.Draw(card)
    draw_frame(draw, DEEP_GREEN, RED)
    badge = resize(extract_mark(logo, (16, 24, 23)), (440, 172))
    card.alpha_composite(badge, (1230, 106))

    font_label = ImageFont.truetype(str(FONT), 58)
    draw.text((130, 168), "Вопрос", font=font_label, fill=INK)
    draw.rectangle((130, 285, 1450, 595), outline=INK, width=5)
    draw.text((130, 680), "Ответ", font=font_label, fill=INK)
    draw.rectangle((130, 795, 1450, 1020), outline=INK, width=5)
    return card


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    background = Image.open(BACKGROUND)
    # В приложенном референсе есть белая полоса слева от логоблока — исключаем её из макета.
    logo = Image.open(LOGO).crop((19, 0, 312, 122))
    back_card(background, logo).save(OUTPUT / "quiz-card-back-60x40.png", dpi=(600, 600))
    front_card(logo).save(OUTPUT / "quiz-card-question-01-60x40.png", dpi=(600, 600))


if __name__ == "__main__":
    main()
