import { Loader2, Image as ImageIcon, Video } from "lucide-react";
import { useGallery } from "@/hooks/use-gallery";
import { useTranslation } from "react-i18next";

export default function Gallery() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGallery();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <p className="text-red-600">{t("gallery.loadError", "Failed to load gallery.")}</p>
        </div>
      </div>
    );
  }

  const items = data || [];
  const categories = Array.from(new Set(items.map((item) => item.category).filter(Boolean)));

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{t("gallery.title", "Gallery")}</h1>
          <p className="text-slate-600 mt-2">{t("gallery.subtitle", "Moments from Umed Foundation activities and events.")}</p>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <span key={category} className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs capitalize">
                {category}
              </span>
            ))}
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <p className="text-slate-600">{t("gallery.empty", "No gallery items available yet.")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="aspect-[4/3] bg-slate-100">
                  {item.mediaType === "video" ? (
                    <video src={item.mediaUrl} controls className="w-full h-full object-cover" />
                  ) : (
                    <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-semibold text-slate-900 truncate">{item.title}</h2>
                    {item.mediaType === "video" ? (
                      <Video className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 capitalize">{item.category || t("gallery.general", "general")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
