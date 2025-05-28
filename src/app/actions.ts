
'use server';

import * as cheerio from 'cheerio';

interface LinkMetadata {
  title?: string;
  description?: string;
  faviconUrl?: string;
  ogImageUrl?: string;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  const response = await fetch(url, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

export async function fetchLinkMetadata(url: string): Promise<LinkMetadata> {
  const metadata: LinkMetadata = {};
  
  // Updated User-Agent to mimic a common browser
  const commonBrowserUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  const fetchOptions: RequestInit = {
    headers: {
      'User-Agent': commonBrowserUserAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    redirect: 'follow',
  };

  try {
    // Try Reddit oEmbed for Reddit URLs
    if (url.includes('reddit.com/r/') && (url.includes('/comments/') || url.includes('/s/'))) {
      try {
        const oembedUrl = `https://www.reddit.com/oembed?url=${encodeURIComponent(url)}`;
        const oembedResponse = await fetchWithTimeout(oembedUrl, { headers: fetchOptions.headers });
        if (oembedResponse.ok) {
          const oembedData = await oembedResponse.json();
          if (oembedData.title) {
            metadata.title = oembedData.title;
          }
          if (oembedData.thumbnail_url) {
            metadata.ogImageUrl = oembedData.thumbnail_url;
          }
          // oEmbed for Reddit doesn't usually give a direct description or favicon for the page itself.
          // We might still want to parse the main page for those.
        }
      } catch (oembedError) {
        console.warn(`Reddit oEmbed fetch failed for ${url}:`, oembedError instanceof Error ? oembedError.message : String(oembedError));
      }
    }

    // General HTML parsing (will also run for Reddit if oEmbed fails or to get more details like description/favicon)
    const response = await fetchWithTimeout(url, fetchOptions);

    if (!response.ok) {
      console.error(`Failed to fetch URL: ${url}, Status: ${response.status} ${response.statusText}`);
      // Return whatever metadata we might have gotten from oEmbed (if any)
      return metadata; 
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Title (prioritize existing metadata if oEmbed found a title)
    if (!metadata.title) {
      metadata.title = $('title').first().text() || $('meta[property="og:title"]').attr('content') || $('meta[name="twitter:title"]').attr('content');
    }

    // Description
    metadata.description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || $('meta[name="twitter:description"]').attr('content');

    // Favicon
    let favicon = $('link[rel="icon"]').attr('href') || 
                  $('link[rel="shortcut icon"]').attr('href') ||
                  $('link[rel="apple-touch-icon"]').attr('href');
    
    if (favicon) {
      try {
        const base = new URL(url);
        metadata.faviconUrl = new URL(favicon, base.origin + base.pathname).href;
      } catch (e) {
        console.warn(`Could not construct absolute URL for favicon: ${favicon} relative to ${url} - ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    // OpenGraph Image (prioritize existing if oEmbed found one)
    if (!metadata.ogImageUrl) {
      let ogImage = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');
      if (ogImage) {
         try {
          const base = new URL(url);
          metadata.ogImageUrl = new URL(ogImage, base.origin + base.pathname).href;
        } catch (e) {
          console.warn(`Could not construct absolute URL for ogImage: ${ogImage} relative to ${url} - ${e instanceof Error ? e.message : String(e)}`);
        }
      }
    }
    
    // Clean up title and description
    if (metadata.title) metadata.title = metadata.title.trim();
    if (metadata.description) metadata.description = metadata.description.trim();

    return metadata;
  } catch (error) {
    console.error(`Error fetching metadata for ${url}:`, error instanceof Error ? error.message : String(error));
    // Return whatever metadata we might have (e.g. from a successful oEmbed but failed main fetch)
    return metadata;
  }
}
