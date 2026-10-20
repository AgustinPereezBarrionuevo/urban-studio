
export function getCloudinaryCroppedUrl(imageUrl, crop) {
  if (!imageUrl || !crop) return imageUrl;

  const x = Number(crop.crop_x);
  const y = Number(crop.crop_y);
  const width = Number(crop.crop_width);
  const height = Number(crop.crop_height);

  if (
    ![x, y, width, height].every(Number.isFinite) ||
    x < 0 ||
    y < 0 ||
    width <= 0 ||
    height <= 0
  ) {
    return imageUrl;
  }

  try {
    const url = new URL(imageUrl);

    if (url.hostname !== 'res.cloudinary.com') {
      return imageUrl;
    }

    const marker = '/image/upload/';

    if (!url.pathname.includes(marker)) {
      return imageUrl;
    }

    const transformation =
      `c_crop,x_${Math.round(x)},y_${Math.round(y)},` +
      `w_${Math.round(width)},h_${Math.round(height)}`;

    url.pathname = url.pathname.replace(
      marker,
      `${marker}${transformation}/`,
    );

    return url.href;
  } catch {
    return imageUrl;
  }
}
