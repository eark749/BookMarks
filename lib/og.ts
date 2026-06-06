export async function fetchOGData(url: string): Promise<{ title: string; favicon: string }> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BookMarksBot/1.0)" },
      signal: AbortSignal.timeout(5000),
    });
    const html = await res.text();

    const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1];
    const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
    const title = (ogTitle || titleTag || url).trim().slice(0, 200);

    const urlObj = new URL(url);
    const favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;

    return { title, favicon };
  } catch {
    const urlObj = new URL(url);
    return {
      title: urlObj.hostname,
      favicon: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`,
    };
  }
}
