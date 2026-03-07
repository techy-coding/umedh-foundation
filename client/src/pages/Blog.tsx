import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import { useBlogPosts } from "@/hooks/use-blog";
import { useTranslation } from "react-i18next";

export default function Blog() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useBlogPosts();

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
        <p className="text-red-600">{t("blog.loadError", "Failed to load blog posts.")}</p>
      </div>
    );
  }

  const posts = (data || []).filter((post) => post.published);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t("blog.title", "Blog")}</h1>
        <p className="text-slate-600 mb-8">{t("blog.subtitle", "Stories and updates from Umed Foundation.")}</p>

        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8">
            <p className="text-slate-600">{t("blog.empty", "No blog posts available.")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {post.imageUrl && (
                  <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" loading="lazy" />
                )}
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">{post.title}</h2>
                  <p className="text-slate-600 text-sm line-clamp-3">{post.content}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
