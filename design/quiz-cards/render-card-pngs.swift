import AppKit
import CoreText

let width = 1800
let height = 1200
let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let outputDirectory = root.appendingPathComponent("design/quiz-cards/png")
let backgroundPath = "/var/folders/s1/tw60mvr16bn0bf8wmf5ldx9h0000gn/T/codex-clipboard-66a1d719-fa93-4091-a977-acd2aab80f8b.png"
let logoPath = "/var/folders/s1/tw60mvr16bn0bf8wmf5ldx9h0000gn/T/codex-clipboard-8163e8c5-57d9-4357-b313-8db192e807a2.png"

func color(_ hex: UInt32, alpha: CGFloat = 1) -> CGColor {
  CGColor(
    red: CGFloat((hex >> 16) & 0xff) / 255,
    green: CGFloat((hex >> 8) & 0xff) / 255,
    blue: CGFloat(hex & 0xff) / 255,
    alpha: alpha
  )
}

func loadImage(_ path: String) -> CGImage {
  guard let image = NSImage(contentsOfFile: path) else { fatalError("Не удалось открыть \(path)") }
  var rect = NSRect(origin: .zero, size: image.size)
  guard let cgImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil) else {
    fatalError("Не удалось преобразовать \(path)")
  }
  return cgImage
}

func context() -> CGContext {
  let colorSpace = CGColorSpaceCreateDeviceRGB()
  guard let output = CGContext(
    data: nil,
    width: width,
    height: height,
    bitsPerComponent: 8,
    bytesPerRow: 0,
    space: colorSpace,
    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
  ) else { fatalError("Не удалось создать холст") }
  output.interpolationQuality = .high
  return output
}

func rectTop(_ x: CGFloat, _ y: CGFloat, _ w: CGFloat, _ h: CGFloat) -> CGRect {
  CGRect(x: x, y: CGFloat(height) - y - h, width: w, height: h)
}

func roundedPath(_ rect: CGRect, radius: CGFloat) -> CGPath {
  CGPath(roundedRect: rect, cornerWidth: radius, cornerHeight: radius, transform: nil)
}

func fillRounded(_ context: CGContext, x: CGFloat, y: CGFloat, w: CGFloat, h: CGFloat, radius: CGFloat, fill: CGColor) {
  context.addPath(roundedPath(rectTop(x, y, w, h), radius: radius))
  context.setFillColor(fill)
  context.fillPath()
}

func strokeRounded(_ context: CGContext, x: CGFloat, y: CGFloat, w: CGFloat, h: CGFloat, radius: CGFloat, color: CGColor, lineWidth: CGFloat) {
  context.addPath(roundedPath(rectTop(x, y, w, h), radius: radius))
  context.setStrokeColor(color)
  context.setLineWidth(lineWidth)
  context.strokePath()
}

func drawImageTop(_ context: CGContext, image: CGImage, x: CGFloat, y: CGFloat, w: CGFloat, h: CGFloat) {
  context.draw(image, in: rectTop(x, y, w, h))
}

func drawText(_ context: CGContext, _ text: String, x: CGFloat, y: CGFloat, size: CGFloat, color: CGColor) {
  let font = CTFontCreateWithName("Arial-BoldMT" as CFString, size, nil)
  let attributed = NSAttributedString(string: text, attributes: [
    kCTFontAttributeName as NSAttributedString.Key: font,
    kCTForegroundColorAttributeName as NSAttributedString.Key: color,
  ])
  let line = CTLineCreateWithAttributedString(attributed)
  context.saveGState()
  context.textMatrix = .identity
  context.textPosition = CGPoint(x: x, y: CGFloat(height) - y - size)
  CTLineDraw(line, context)
  context.restoreGState()
}

func whiteMark(from image: CGImage) -> CGImage {
  let imageWidth = image.width
  let imageHeight = image.height
  let colorSpace = CGColorSpaceCreateDeviceRGB()
  guard let sourceContext = CGContext(
    data: nil,
    width: imageWidth,
    height: imageHeight,
    bitsPerComponent: 8,
    bytesPerRow: imageWidth * 4,
    space: colorSpace,
    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
  ) else { fatalError("Не удалось обработать логотип") }
  sourceContext.draw(image, in: CGRect(x: 0, y: 0, width: imageWidth, height: imageHeight))
  let source = sourceContext.data!.assumingMemoryBound(to: UInt8.self)
  var pixels = [UInt8](repeating: 255, count: imageWidth * imageHeight * 4)
  for index in stride(from: 0, to: pixels.count, by: 4) {
    let brightness = min(Int(source[index]), min(Int(source[index + 1]), Int(source[index + 2])))
    let alpha = max(0, min(255, (brightness - 126) * 2))
    pixels[index + 3] = UInt8(alpha)
  }
  let provider = CGDataProvider(data: Data(pixels) as CFData)!
  return CGImage(
    width: imageWidth,
    height: imageHeight,
    bitsPerComponent: 8,
    bitsPerPixel: 32,
    bytesPerRow: imageWidth * 4,
    space: colorSpace,
    bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue),
    provider: provider,
    decode: nil,
    shouldInterpolate: true,
    intent: .defaultIntent
  )!
}

func save(_ context: CGContext, named filename: String) {
  guard let image = context.makeImage() else { fatalError("Не удалось сохранить изображение") }
  let bitmap = NSBitmapImageRep(cgImage: image)
  guard let data = bitmap.representation(using: .png, properties: [:]) else { fatalError("Не удалось закодировать PNG") }
  try! data.write(to: outputDirectory.appendingPathComponent(filename))
}

try! FileManager.default.createDirectory(at: outputDirectory, withIntermediateDirectories: true)
let background = loadImage(backgroundPath)
let fullLogo = loadImage(logoPath)

// Оборот: исходный тёмный фон и крупный белый логотип без квадратной подложки.
let back = context()
back.saveGState()
back.addPath(roundedPath(CGRect(x: 0, y: 0, width: width, height: height), radius: 62))
back.clip()
let crop = background.cropping(to: CGRect(x: 11, y: 7, width: 400, height: 267))!
drawImageTop(back, image: crop, x: 0, y: 0, w: width, h: height)
back.restoreGState()
strokeRounded(back, x: 48, y: 48, w: 1704, h: 1104, radius: 24, color: color(0xf5f0df, alpha: 0.84), lineWidth: 4)
strokeRounded(back, x: 62, y: 62, w: 1676, h: 1076, radius: 16, color: color(0x041b18, alpha: 0.54), lineWidth: 12)
let mark = whiteMark(from: fullLogo)
drawImageTop(back, image: mark, x: 350, y: 402, w: 1100, h: 457)
save(back, named: "quiz-card-back-60x40.png")

// Лицевая: белая карточка с рамкой, полями «Вопрос» и «Ответ» и брендом справа.
let front = context()
fillRounded(front, x: 0, y: 0, w: width, h: height, radius: 62, fill: color(0xffffff))
strokeRounded(front, x: 49, y: 49, w: 1702, h: 1102, radius: 24, color: color(0x052f27), lineWidth: 17)
strokeRounded(front, x: 78, y: 78, w: 1644, h: 1044, radius: 12, color: color(0xec1c2b), lineWidth: 5)
drawImageTop(front, image: fullLogo, x: 1260, y: 106, w: 410, h: 170)
drawText(front, "Вопрос", x: 130, y: 172, size: 54, color: color(0xec1c2b))
strokeRounded(front, x: 130, y: 280, w: 1320, h: 310, radius: 0, color: color(0x052f27), lineWidth: 5)
drawText(front, "Ответ", x: 130, y: 682, size: 54, color: color(0x006b55))
strokeRounded(front, x: 130, y: 790, w: 1320, h: 225, radius: 0, color: color(0x006b55), lineWidth: 5)
save(front, named: "quiz-card-question-01-60x40.png")
