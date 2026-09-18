"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileText,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const MAX_PREVIEW_PAGES = 80;
const MIN_ZOOM = 0.85;
const MAX_ZOOM = 1.7;
const ZOOM_STEP = 0.15;

interface PdfImageReaderProps {
  fileUrl: string;
  title: string;
  backHref?: string;
  backLabel?: string;
}

function getJpgAssetPath(assetPath: string) {
  return assetPath.replace(/\.pdf$/i, ".jpg");
}

function getCloudinaryPageImageUrls(fileUrl: string, page: number) {
  try {
    const url = new URL(fileUrl);

    if (url.hostname !== "res.cloudinary.com") return [];

    const candidatePaths = url.pathname.includes("/raw/upload/")
      ? [url.pathname.replace("/raw/upload/", "/image/upload/")]
      : [url.pathname];

    const urls = candidatePaths.flatMap(pathname => {
      const uploadMarker = "/upload/";
      const uploadIndex = pathname.indexOf(uploadMarker);
      if (uploadIndex === -1) return [];

      const prefix = pathname.slice(0, uploadIndex + uploadMarker.length);
      const assetPath = pathname.slice(uploadIndex + uploadMarker.length);
      const jpgAssetPath = getJpgAssetPath(assetPath);
      const transformedPdfPath = `${prefix}f_jpg,pg_${page},q_auto:good,w_1600/${assetPath}`;
      const transformedJpgPath = `${prefix}pg_${page},q_auto:good,w_1600/${jpgAssetPath}`;

      return [transformedPdfPath, transformedJpgPath].map(path => {
        const previewUrl = new URL(url);
        previewUrl.pathname = path;
        previewUrl.search = "";
        return previewUrl.toString();
      });
    });

    return Array.from(new Set(urls));
  } catch {
    return [];
  }
}

function PdfImageReaderContent({
  fileUrl,
  title,
  backHref,
  backLabel = "Back",
}: PdfImageReaderProps) {
  const [pages, setPages] = useState([1]);
  const [lastPageReached, setLastPageReached] = useState(false);
  const [imagePreviewFailed, setImagePreviewFailed] = useState(false);
  const [previewVariantIndex, setPreviewVariantIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

  const canUseImagePreview = useMemo(
    () => getCloudinaryPageImageUrls(fileUrl, 1).length > 0,
    [fileUrl],
  );

  const showImagePreview = canUseImagePreview && !imagePreviewFailed;

  const handlePageLoad = (page: number) => {
    if (page !== pages[pages.length - 1]) return;
    if (page >= MAX_PREVIEW_PAGES) {
      setLastPageReached(true);
      return;
    }

    setPages(current =>
      current.includes(page + 1) ? current : [...current, page + 1],
    );
  };

  const handlePageError = (page: number) => {
    if (page === 1) {
      const nextVariantIndex = previewVariantIndex + 1;
      if (nextVariantIndex < getCloudinaryPageImageUrls(fileUrl, 1).length) {
        setPreviewVariantIndex(nextVariantIndex);
        setPages([1]);
        setLastPageReached(false);
        return;
      }

      setImagePreviewFailed(true);
      return;
    }

    setPages(current => current.filter(item => item < page));
    setLastPageReached(true);
  };

  const zoomOut = () =>
    setZoom(current => Math.max(MIN_ZOOM, Number((current - ZOOM_STEP).toFixed(2))));

  const zoomIn = () =>
    setZoom(current => Math.min(MAX_ZOOM, Number((current + ZOOM_STEP).toFixed(2))));

  return (
    <main className="min-h-[100svh] overflow-x-hidden bg-[#EEF1F4] text-[#23313D] dark:bg-[#16120F] dark:text-[#F6F1EA]">
      <header className="sticky top-0 z-20 border-b border-[#D8DEE5] bg-white/95 px-3 py-3 shadow-sm backdrop-blur dark:border-[#3A2D24] dark:bg-[#1F1A16]/95 sm:px-5">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2">
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-lg border border-[#CED6DF] bg-white px-3 py-2 text-sm font-semibold text-[#23313D] transition hover:bg-[#F5F7F9] focus:outline-none focus:ring-4 focus:ring-[#9BB6D3]/30 dark:border-[#4B3A2A] dark:bg-[#2A221C] dark:text-[#F6F1EA]"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              <span className="min-w-0 truncate">{backLabel}</span>
            </Link>
          )}

          <div className="min-w-0 flex-1 px-1">
            <p className="truncate text-sm font-bold leading-tight sm:text-base">
              {title}
            </p>
            <p className="text-xs text-[#5C6874] dark:text-[#D8C9B4]">
              Read online
            </p>
          </div>

          {showImagePreview && (
            <div className="flex shrink-0 items-center gap-1 rounded-lg border border-[#CED6DF] bg-white p-1 dark:border-[#4B3A2A] dark:bg-[#2A221C]">
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoom <= MIN_ZOOM}
                className="flex h-9 w-9 items-center justify-center rounded-md text-[#23313D] transition hover:bg-[#EEF1F4] disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#F6F1EA] dark:hover:bg-[#3A2D24]"
                aria-label="Zoom out"
                title="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-xs font-bold">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={zoomIn}
                disabled={zoom >= MAX_ZOOM}
                className="flex h-9 w-9 items-center justify-center rounded-md text-[#23313D] transition hover:bg-[#EEF1F4] disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#F6F1EA] dark:hover:bg-[#3A2D24]"
                aria-label="Zoom in"
                title="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          )}

          <a
            href={fileUrl}
            download
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#2F6F4E] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#265D42] focus:outline-none focus:ring-4 focus:ring-[#2F6F4E]/25"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </header>

      {showImagePreview ? (
        <section className="mx-auto w-full max-w-6xl px-2 py-4 sm:px-5 sm:py-6">
          <div className="space-y-5">
            {pages.map(page => {
              const imageUrl =
                getCloudinaryPageImageUrls(fileUrl, page)[previewVariantIndex];
              if (!imageUrl) return null;

              return (
                <div
                  key={page}
                  className="mx-auto w-full overflow-x-auto rounded-[1.65rem] border border-[#DDE3EA] bg-[#F9FAFB] p-2 shadow-[0_12px_34px_rgba(35,49,61,0.12)] dark:border-[#3A2D24] dark:bg-[#211B16] sm:p-4"
                >
                  <div
                    className="relative mx-auto min-w-[320px] max-w-[920px] origin-top"
                    style={{
                      width: `${Math.round(100 * zoom)}%`,
                    }}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${title} page ${page}`}
                      width={1600}
                      height={2070}
                      sizes="(max-width: 640px) 100vw, 920px"
                      className="h-auto w-full rounded-[1.2rem] bg-white object-contain"
                      loading={page === 1 ? "eager" : "lazy"}
                      onLoad={() => handlePageLoad(page)}
                      onError={() => handlePageError(page)}
                    />
                    <span className="absolute bottom-3 right-3 rounded-lg bg-black/55 px-3 py-1.5 text-sm font-bold text-white shadow-lg">
                      Page {page}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {!lastPageReached && (
            <div className="flex justify-center py-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#5C6874] shadow-sm dark:bg-[#2A221C] dark:text-[#D8C9B4]">
                <FileText className="h-4 w-4" />
                Loading pages...
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="flex min-h-[calc(100svh-4.25rem)] flex-col gap-4 px-3 py-4 sm:px-5">
          <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 rounded-lg border border-[#D8DEE5] bg-white p-4 dark:border-[#3A2D24] dark:bg-[#211B16]">
            <div className="min-w-0">
              <p className="font-bold">Preview opened in fallback mode</p>
              <p className="text-sm text-[#5C6874] dark:text-[#D8C9B4]">
                If your phone cannot show the document below, use Download.
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#CED6DF] px-3 py-2 text-sm font-semibold transition hover:bg-[#F5F7F9] dark:border-[#4B3A2A] dark:hover:bg-[#2A221C]"
            >
              <RotateCcw className="h-4 w-4" />
              Retry
            </button>
          </div>

          <iframe
            src={fileUrl}
            className="mx-auto min-h-[72svh] w-full max-w-6xl flex-1 rounded-lg border border-[#D8DEE5] bg-white dark:border-[#3A2D24]"
            title={title}
          />
        </section>
      )}
    </main>
  );
}

export default function PdfImageReader(props: PdfImageReaderProps) {
  return <PdfImageReaderContent key={props.fileUrl} {...props} />;
}
