#!/usr/bin/env python3
"""
Reduce image weight for imported antmag assets while preserving file paths.

Default behavior:
- process JPG/JPEG/PNG files under public/images/zines/antmag
- resize only when dimensions exceed max side
- replace file only when optimized output is smaller
"""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Iterable, Tuple

from PIL import Image, ImageOps, UnidentifiedImageError


SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def iter_images(root: Path) -> Iterable[Path]:
    for path in root.rglob("*"):
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS:
            yield path


def optimize_image(path: Path, max_side: int, jpg_quality: int) -> Tuple[int, int, bool]:
    before = path.stat().st_size
    temp_path = path.with_suffix(path.suffix + ".tmp")

    with Image.open(path) as image:
        image = ImageOps.exif_transpose(image)

        if image.width > max_side or image.height > max_side:
            image.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)

        ext = path.suffix.lower()
        if ext in {".jpg", ".jpeg"}:
            if image.mode not in {"RGB", "L"}:
                image = image.convert("RGB")
            image.save(
                temp_path,
                format="JPEG",
                quality=jpg_quality,
                optimize=True,
                progressive=True,
            )
        elif ext == ".png":
            if image.mode not in {"1", "L", "LA", "P", "RGB", "RGBA"}:
                image = image.convert("RGBA")
            image.save(
                temp_path,
                format="PNG",
                optimize=True,
                compress_level=9,
            )

    after = temp_path.stat().st_size
    if after < before:
        temp_path.replace(path)
        return before, after, True

    temp_path.unlink(missing_ok=True)
    return before, before, False


def main() -> int:
    parser = argparse.ArgumentParser(description="Optimize antmag images in place.")
    parser.add_argument(
        "--root",
        default="public/images/zines/antmag",
        help="Root directory that contains imported antmag images",
    )
    parser.add_argument(
        "--max-side",
        type=int,
        default=2200,
        help="Resize images only when width/height is greater than this value",
    )
    parser.add_argument(
        "--jpg-quality",
        type=int,
        default=82,
        help="JPEG quality (1-95)",
    )
    args = parser.parse_args()

    root = Path(args.root).resolve()
    if not root.exists():
        print(f"[skip] directory not found: {root}")
        return 0

    files = list(iter_images(root))
    if not files:
        print(f"[skip] no supported images found in: {root}")
        return 0

    processed = 0
    replaced = 0
    errors = 0
    before_total = 0
    after_total = 0

    for path in files:
        try:
            before, after, did_replace = optimize_image(path, args.max_side, args.jpg_quality)
            processed += 1
            before_total += before
            after_total += after
            if did_replace:
                replaced += 1
        except (OSError, UnidentifiedImageError) as error:
            errors += 1
            print(f"[error] {path}: {error}")

    saved = before_total - after_total
    print(f"processed={processed}")
    print(f"replaced={replaced}")
    print(f"errors={errors}")
    print(f"before_mb={before_total / 1_048_576:.2f}")
    print(f"after_mb={after_total / 1_048_576:.2f}")
    print(f"saved_mb={saved / 1_048_576:.2f}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
