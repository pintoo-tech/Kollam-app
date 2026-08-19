/**
 * Image Compression Utility
 * Safely compresses and resizes user-uploaded images and Data URLs before storing in Firestore,
 * ensuring all documents remain well within Firestore's 1MB (1,048,576 bytes) document size limit.
 */

export async function compressImageFile(
  file: File,
  maxWidth: number = 1000,
  maxHeight: number = 1000,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return resolve("");
      }
      compressBase64Image(reader.result, maxWidth, maxHeight, quality)
        .then(resolve)
        .catch(() => resolve(reader.result as string));
    };
    reader.readAsDataURL(file);
  });
}

export async function compressBase64Image(
  dataUrl: string,
  maxWidth: number = 1000,
  maxHeight: number = 1000,
  quality: number = 0.8
): Promise<string> {
  // If it's a remote URL or not a data URL, return directly
  if (!dataUrl || !dataUrl.startsWith("data:image/")) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let { width, height } = img;

      // Calculate constrained dimensions keeping aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(width, 1);
      canvas.height = Math.max(height, 1);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return resolve(dataUrl);
      }

      // Smooth resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Output as compressed JPEG (consistently compact)
      let compressed = canvas.toDataURL("image/jpeg", quality);

      // Fallback check: if somehow still > 400KB (~530,000 characters), compress further
      if (compressed.length > 500000) {
        compressed = canvas.toDataURL("image/jpeg", 0.6);
      }
      if (compressed.length > 500000) {
        const smallerCanvas = document.createElement("canvas");
        smallerCanvas.width = Math.round(canvas.width * 0.7);
        smallerCanvas.height = Math.round(canvas.height * 0.7);
        const sCtx = smallerCanvas.getContext("2d");
        if (sCtx) {
          sCtx.drawImage(canvas, 0, 0, smallerCanvas.width, smallerCanvas.height);
          compressed = smallerCanvas.toDataURL("image/jpeg", 0.6);
        }
      }

      resolve(compressed);
    };

    img.onerror = () => {
      resolve(dataUrl);
    };

    img.src = dataUrl;
  });
}

/**
 * Ensure image payload is safe for Firestore document size (< 400KB)
 */
export async function ensureSafeImagePayload(urlOrData: string | undefined): Promise<string> {
  if (!urlOrData) return "";
  if (!urlOrData.startsWith("data:image/")) return urlOrData;

  // Approximate byte size check for base64: ~0.75 * string length
  if (urlOrData.length > 300000) {
    try {
      return await compressBase64Image(urlOrData, 1000, 1000, 0.78);
    } catch {
      return urlOrData;
    }
  }
  return urlOrData;
}
