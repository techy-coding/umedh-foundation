import { useRoute } from "wouter";
import { Loader2 } from "lucide-react";
import { useBlogPost } from "@/hooks/use-blog";
import { useTranslation } from "react-i18next";

export default function BlogPost() {
  const { t } = useTranslation();
  const [match, params] = useRoute("/blog/:slug");
  const slug = match ? params.slug : "";
  const { data, isLoading, isError } = useBlogPost(slug);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-red-600">{t("blogPost.loadError", "Failed to load blog post.")}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-slate-600">{t("blogPost.notFound", "Blog post not found.")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {data.imageUrl && (
          <img src={data.imageUrl} alt={data.title} className="w-full h-72 object-cover rounded-2xl mb-6" />
        )}
        <h1 className="text-3xl font-bold text-slate-900 mb-4">{data.title}</h1>
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <p className="text-slate-700 whitespace-pre-wrap">{data.content}</p>
        </div>
      </div>
    </div>
  );
}
