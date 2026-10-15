import { NextRequest, NextResponse } from 'next/server';

/**
 * Regex patterns to extract coordinates from Google Maps URLs and HTML
 */
function extractCoords(rawText: string): { lat: number; lng: number } | null {
  if (!rawText) return null;

  let decoded = rawText;
  try {
    decoded = decodeURIComponent(rawText.replace(/\\u003d/g, '=').replace(/\\u0026/g, '&'));
  } catch {
    decoded = rawText;
  }

  // 1. Place coordinate format: !3d-6.2472357!4d106.3627961
  const placeMatch = decoded.match(/!3d(-?\d+(?:\.\d+)?)[^!]*!4d(-?\d+(?:\.\d+)?)/);
  if (placeMatch) {
    const lat = parseFloat(placeMatch[1]);
    const lng = parseFloat(placeMatch[2]);
    if (isValidLatLng(lat, lng)) return { lat, lng };
  }

  // 2. Viewport format: @-6.2424985,106.3581531 or %40-6.2424985,106.3581531
  const atMatch = decoded.match(/[@%40](-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (isValidLatLng(lat, lng)) return { lat, lng };
  }

  // 3. Center format: center=-6.2424985,106.3581531 or center%3D-6.2424985%2C106.3581531
  const centerMatch = decoded.match(/center[=:\s]+(-?\d+(?:\.\d+)?)[,;%2C]+(-?\d+(?:\.\d+)?)/i);
  if (centerMatch) {
    const lat = parseFloat(centerMatch[1]);
    const lng = parseFloat(centerMatch[2]);
    if (isValidLatLng(lat, lng)) return { lat, lng };
  }

  // 4. Query param format: ?q=-6.2472,106.3627 or ?ll=-6.2472,106.3627
  const queryMatch = decoded.match(/[?&](?:q|ll|query)=(-?\d+(?:\.\d+)?)[,;]+(-?\d+(?:\.\d+)?)/i);
  if (queryMatch) {
    const lat = parseFloat(queryMatch[1]);
    const lng = parseFloat(queryMatch[2]);
    if (isValidLatLng(lat, lng)) return { lat, lng };
  }

  return null;
}

function isValidLatLng(lat: number, lng: number): boolean {
  return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetUrl = body.url || req.nextUrl.searchParams.get('url');

    if (!targetUrl || typeof targetUrl !== 'string') {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    const trimmedUrl = targetUrl.trim();

    // Check if targetUrl itself already contains coordinates
    const directCoords = extractCoords(trimmedUrl);
    if (directCoords) {
      return NextResponse.json({ success: true, ...directCoords });
    }

    // 1. Try quick redirect: manual with curl User-Agent (Google Maps responds with 302 + Location header immediately)
    try {
      const headRes = await fetch(trimmedUrl, {
        method: 'GET',
        redirect: 'manual',
        signal: AbortSignal.timeout(4000),
        headers: {
          'User-Agent': 'curl/8.4.0',
        },
      });

      const locationHeader = headRes.headers.get('location');
      if (locationHeader) {
        const locationCoords = extractCoords(locationHeader);
        if (locationCoords) {
          return NextResponse.json({ success: true, ...locationCoords, resolvedUrl: locationHeader });
        }
      }
    } catch (e) {
      console.warn('Manual redirect attempt failed, falling back to full fetch', e);
    }

    // 2. Fallback: follow redirect and extract from final URL or HTML body
    try {
      const res = await fetch(trimmedUrl, {
        method: 'GET',
        redirect: 'follow',
        signal: AbortSignal.timeout(5000),
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      const finalUrl = res.url || '';
      const finalCoords = extractCoords(finalUrl);

      if (finalCoords) {
        return NextResponse.json({ success: true, ...finalCoords, resolvedUrl: finalUrl });
      }

      // Check response HTML body
      const htmlText = await res.text();
      const bodyCoords = extractCoords(htmlText);

      if (bodyCoords) {
        return NextResponse.json({ success: true, ...bodyCoords, resolvedUrl: finalUrl });
      }
    } catch (e) {
      console.warn('Full fetch attempt failed', e);
    }

    return NextResponse.json(
      { success: false, error: 'Koordinat tidak ditemukan di dalam tautan Google Maps tersebut.' },
      { status: 422 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal memproses tautan Google Maps.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
