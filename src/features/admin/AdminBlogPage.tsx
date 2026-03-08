/**
 * Admin Blog Management - Create, edit, delete blog posts
 */

import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCalendar, FiHeart, FiEye, FiEyeOff } from 'react-icons/fi';
import { mockBlogPosts } from '@/data/blogMockData';
import { BlogPost } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatDate } from '@/utils/helpers';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  post?: BlogPost;
  onSubmit: (data: Partial<BlogPost>) => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ isOpen, onClose, post, onSubmit }) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [tags, setTags] = useState(post?.tags.join(', ') || '');

  React.useEffect(() => {
    setTitle(post?.title || '');
    setContent(post?.content || '');
    setExcerpt(post?.excerpt || '');
    setTags(post?.tags.join(', ') || '');
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title, content,
      excerpt: excerpt || content.slice(0, 150) + '...',
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      author: 'Abu Kathir AbdulHameed',
      authorRole: 'admin',
      isPublished: true,
    });
    setTitle(''); setContent(''); setExcerpt(''); setTags('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border shadow-strong w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">{post ? t.editBlogPost : t.newBlogPost}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors"><FiX className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.titleRequired}</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder={t.blogTitle} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.blogExcerpt}</label>
            <Input value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder={t.excerptOptional} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.tagsCommaSeparated}</label>
            <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="Education, Islam, IT" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.contentRequired}</label>
            <textarea value={content} onChange={e => setContent(e.target.value)}
              className="w-full h-48 px-3 py-2 rounded-lg border border-input bg-background text-foreground resize-none"
              placeholder={t.writeBlogPost} required />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">{t.cancel}</Button>
            <Button type="submit" className="flex-1">{post ? t.updatePost : t.publishPost}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AdminBlogPage: React.FC = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>();

  const handleSubmit = (data: Partial<BlogPost>) => {
    if (editingPost) {
      setPosts(posts.map(p => p.id === editingPost.id ? { ...p, ...data, updatedAt: new Date().toISOString().split('T')[0] } as BlogPost : p));
      toast.success(t.blogPostUpdated);
    } else {
      const newPost: BlogPost = {
        ...data as BlogPost,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        likes: [],
      };
      setPosts([newPost, ...posts]);
      toast.success(t.blogPostPublished);
    }
    setEditingPost(undefined);
  };

  const handleDelete = (id: string) => {
    if (confirm(t.confirmDeletePost)) {
      setPosts(posts.filter(p => p.id !== id));
      toast.success(t.blogPostDeleted);
    }
  };

  const togglePublish = (id: string) => {
    const post = posts.find(p => p.id === id);
    setPosts(posts.map(p => p.id === id ? { ...p, isPublished: !p.isPublished } : p));
    toast.success(post?.isPublished ? t.postUnpublished : t.postPublished);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t.blog}</h1>
          <p className="text-muted-foreground mt-1">{t.createAndManage}</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="btn-glow">
          <FiPlus className="w-4 h-4 mr-2" />{t.newPost}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-2xl font-bold text-foreground">{posts.length}</p>
          <p className="text-sm text-muted-foreground">{t.totalPosts}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-2xl font-bold text-primary">{posts.filter(p => p.isPublished).length}</p>
          <p className="text-sm text-muted-foreground">{t.published}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-2xl font-bold text-secondary">{posts.reduce((s, p) => s + p.likes.length, 0)}</p>
          <p className="text-sm text-muted-foreground">{t.totalLikes}</p>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className={`bg-card rounded-2xl border border-border p-6 shadow-soft transition-opacity ${!post.isPublished ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="font-semibold text-foreground">{post.title}</h3>
                  {!post.isPublished && <Badge variant="outline" className="opacity-60">{t.draft}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><FiCalendar className="w-3 h-3" />{formatDate(post.createdAt)}</span>
                  <span className="flex items-center gap-1"><FiHeart className="w-3 h-3" />{post.likes.length} {t.likes}</span>
                  <div className="flex gap-1">{post.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => togglePublish(post.id)} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                  {post.isPublished ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => { setEditingPost(post); setShowModal(true); }} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <p className="text-muted-foreground">{t.noBlogPostsYet}</p>
            <Button onClick={() => setShowModal(true)} className="mt-4">{t.createFirstPost}</Button>
          </div>
        )}
      </div>

      <BlogModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingPost(undefined); }}
        post={editingPost}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
