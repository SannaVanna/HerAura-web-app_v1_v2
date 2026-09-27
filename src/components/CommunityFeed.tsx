import React, { useState, useRef } from 'react';
import { CommunityPost, UserProfile } from '../types';
import {
  Heart,
  MessageCircle,
  Share2,
  Flag,
  Send,
  Search,
  Image as ImageIcon,
  Sparkles,
  Check,
  MoreHorizontal,
  Smile,
  Globe,
  X,
  Tag,
  Link,
  ThumbsUp,
  Camera,
  Upload,
  Bookmark
} from 'lucide-react';

interface CommunityFeedProps {
  user: UserProfile;
  posts: CommunityPost[];
  onAddPost: (newPost: Partial<CommunityPost>) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
}

const FEELINGS_LIST = [
  { label: 'feeling inspired', emoji: '✨' },
  { label: 'feeling blessed', emoji: '🌸' },
  { label: 'feeling empowered', emoji: '💪' },
  { label: 'feeling grateful', emoji: '🙏' },
  { label: 'feeling mindful', emoji: '🍵' },
  { label: 'feeling radiant', emoji: '💖' },
  { label: 'seeking advice', emoji: '💡' },
];

const TOPIC_TAGS = [
  'PersonalGrowth',
  'Confidence',
  'WomenInTech',
  'Wellness',
  'Sisterhood',
  'MentalHealth',
  'Leadership',
];

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  user,
  posts,
  onAddPost,
  onLikePost,
  onAddComment,
}) => {
  const [activeTab, setActiveTab] = useState<'For You' | 'Trending' | 'Latest'>('For You');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  
  // Facebook-style Composer States
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedFeeling, setSelectedFeeling] = useState<{ label: string; emoji: string } | null>(null);
  const [showFeelingsPicker, setShowFeelingsPicker] = useState(false);
  const [newPostTag, setNewPostTag] = useState('PersonalGrowth');
  const [showTagPicker, setShowTagPicker] = useState(false);
  
  // Image Upload State
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrlDraft, setImageUrlDraft] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Interaction States
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<{ [postId: string]: string }>({});
  const [reportedPosts, setReportedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);

  const filteredPosts = posts.filter((post) => {
    const matchesTab = activeTab === 'For You' ? true : post.category === activeTab;
    const query = searchQuery.trim().toLowerCase();
    
    // Filter based on titles, tags, categories, author name, or content in real-time
    const matchesSearch = !query
      ? true
      : (post.title && post.title.toLowerCase().includes(query)) ||
        (post.category && post.category.toLowerCase().includes(query)) ||
        (post.tags && post.tags.some((t) => t.toLowerCase().includes(query))) ||
        post.content.toLowerCase().includes(query) ||
        post.authorName.toLowerCase().includes(query) ||
        (post.feeling && post.feeling.toLowerCase().includes(query));

    const matchesTag = !selectedTagFilter
      ? true
      : post.tags && post.tags.some((t) => t.toLowerCase() === selectedTagFilter.toLowerCase());

    return matchesTab && matchesSearch && matchesTag;
  });

  // Handle local file image upload with validation and error boundary
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select a valid image file (PNG, JPG, WebP, etc.).');
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setUploadError('Image file is too large (maximum 8MB). Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAttachedImage(reader.result);
          setShowUrlInput(false);
          setUploadError(null);
        }
      };
      reader.onerror = () => {
        setUploadError('Could not read image file. Please try selecting a different image.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrlDraft.trim()) {
      setAttachedImage(imageUrlDraft.trim());
      setImageUrlDraft('');
      setShowUrlInput(false);
      setUploadError(null);
    }
  };

  const removeAttachedImage = () => {
    setAttachedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploadError(null);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPublishing) return;
    if (!newPostContent.trim() && !attachedImage) {
      setUploadError('Please enter some text or attach an image to share your story.');
      return;
    }

    setIsPublishing(true);
    setUploadError(null);

    try {
      await onAddPost({
        content: newPostContent.trim(),
        category: activeTab,
        tags: [newPostTag, 'HerAuraSisterhood'],
        image: attachedImage || undefined,
        imageUrl: attachedImage || undefined,
        feeling: selectedFeeling ? `${selectedFeeling.label} ${selectedFeeling.emoji}` : undefined,
      });

      // Reset composer state
      setNewPostContent('');
      setAttachedImage(null);
      setSelectedFeeling(null);
      setShowFeelingsPicker(false);
      setShowTagPicker(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setShareNotice('Post and photo published successfully to Sisterhood! 🌸');
      setTimeout(() => setShareNotice(null), 3500);
    } catch (err: any) {
      setUploadError('Failed to publish post. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentText[postId];
    if (!text || !text.trim()) return;

    onAddComment(postId, text.trim());
    setCommentText((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleShare = (post: CommunityPost) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `"${post.content.slice(0, 100)}..." - By ${post.authorName} on HerAura Safe Space`
      );
    }
    setShareNotice(`Post copied to clipboard! Share the love with your sisters.`);
    setTimeout(() => setShareNotice(null), 3000);
  };

  const handleToggleSave = (postId: string) => {
    if (savedPosts.includes(postId)) {
      setSavedPosts(savedPosts.filter((id) => id !== postId));
    } else {
      setSavedPosts([...savedPosts, postId]);
      setShareNotice('Post saved to your bookmarks!');
      setTimeout(() => setShareNotice(null), 2500);
    }
    setActiveMenuPostId(null);
  };

  const handleReport = (postId: string) => {
    if (!reportedPosts.includes(postId)) {
      setReportedPosts([...reportedPosts, postId]);
      alert('Thank you for keeping HerAura safe. This post has been flagged for moderator review.');
    }
    setActiveMenuPostId(null);
  };

  return (
    <div id="community-feed-screen" className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Sisterhood Community</span>
            <span className="text-pink-500 text-xl">🌸</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Connect, share thoughts, upload photos, and inspire your sisters
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-t-2xl shadow-xs overflow-hidden">
        {(['For You', 'Trending', 'Latest'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === tab
                ? 'border-[#e6007e] text-[#e6007e] dark:text-pink-400 bg-pink-50/40 dark:bg-pink-950/30'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Real-Time Search Bar & Filter Strip */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by title, #tag, category, sister, or keywords in real-time..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400 dark:placeholder-gray-500 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer rounded-full"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Real-time topic and tag filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <button
            onClick={() => setSelectedTagFilter(null)}
            className={`px-2.5 py-1 rounded-full font-semibold shrink-0 transition-colors cursor-pointer ${
              !selectedTagFilter
                ? 'bg-pink-600 text-white shadow-2xs'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            All Topics
          </button>
          {TOPIC_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTagFilter(selectedTagFilter === tag ? null : tag)}
              className={`px-2.5 py-1 rounded-full font-semibold shrink-0 transition-colors cursor-pointer ${
                selectedTagFilter === tag
                  ? 'bg-pink-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Search Results Summary Strip */}
        {(searchQuery.trim() || selectedTagFilter) && (
          <div className="flex items-center justify-between px-2 text-[11px] text-gray-500 dark:text-gray-400">
            <span>
              Found <strong className="text-pink-600 dark:text-pink-400">{filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'post' : 'posts'}
              {searchQuery && <> matching &ldquo;{searchQuery}&rdquo;</>}
              {selectedTagFilter && <> tagged <span className="font-semibold text-pink-600 dark:text-pink-400">#{selectedTagFilter}</span></>}
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTagFilter(null);
              }}
              className="text-pink-600 dark:text-pink-400 hover:underline font-semibold cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* FACEBOOK-STYLE POST COMPOSER CARD                         */}
      {/* ========================================================= */}
      <div
        id="facebook-style-composer"
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xs border border-pink-100/90 dark:border-gray-800 overflow-hidden"
      >
        <div className="p-4 sm:p-5 space-y-3.5">
          {/* Top user row */}
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-pink-200 dark:border-pink-800"
            />
            <div>
              <div className="flex items-center flex-wrap gap-1.5">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</span>
                {selectedFeeling && (
                  <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                    is {selectedFeeling.label} {selectedFeeling.emoji}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                <Globe className="w-3 h-3 text-gray-400" />
                <span>Public to HerAura Sisterhood</span>
                <span>•</span>
                <span className="text-pink-600 dark:text-pink-400 font-semibold">#{newPostTag}</span>
              </div>
            </div>
          </div>

          {/* Textarea input with high-contrast text in both light and dark mode */}
          <textarea
            id="community-post-textarea"
            rows={3}
            placeholder={`What's on your mind, ${user.name.split(' ')[0] || 'sister'}?`}
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400 dark:placeholder-gray-500 resize-none leading-relaxed"
          />

          {/* Attached Image Preview */}
          {attachedImage && (
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-900 group">
              <img
                src={attachedImage}
                alt="Upload preview"
                className="w-full max-h-80 object-cover"
              />
              <button
                type="button"
                onClick={removeAttachedImage}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 hover:bg-black text-white transition-colors cursor-pointer shadow-md"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Optional URL input box */}
          {showUrlInput && !attachedImage && (
            <form onSubmit={handleApplyImageUrl} className="flex gap-2">
              <input
                type="url"
                placeholder="Paste web image URL (e.g. https://...)"
                value={imageUrlDraft}
                onChange={(e) => setImageUrlDraft(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-pink-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-pink-600 text-white text-xs font-semibold hover:bg-pink-700 cursor-pointer"
              >
                Attach
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Feeling Picker Popup */}
          {showFeelingsPicker && (
            <div className="p-3 bg-pink-50/70 dark:bg-gray-800 border border-pink-100 dark:border-gray-700 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">How are you feeling right now?</span>
                <button
                  onClick={() => setShowFeelingsPicker(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {FEELINGS_LIST.map((f) => (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => {
                      setSelectedFeeling(f);
                      setShowFeelingsPicker(false);
                    }}
                    className="px-2.5 py-1 rounded-full bg-white dark:bg-gray-700 border border-pink-200 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-200 hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    {f.emoji} {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tag / Topic Picker Popup */}
          {showTagPicker && (
            <div className="p-3 bg-pink-50/70 dark:bg-gray-800 border border-pink-100 dark:border-gray-700 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Choose Topic / Tag:</span>
                <button
                  onClick={() => setShowTagPicker(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TOPIC_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setNewPostTag(tag);
                      setShowTagPicker(false);
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      newPostTag === tag
                        ? 'bg-[#e6007e] text-white'
                        : 'bg-white dark:bg-gray-700 border border-pink-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-pink-500'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Facebook-style "Add to your post" toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 hidden sm:inline">Add to your post:</span>

            {/* Hidden native file input for photos */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
            />

            <div className="flex items-center gap-1 sm:gap-2">
              {/* Photo Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-gray-800 text-emerald-600 dark:text-emerald-400 text-xs font-semibold transition-colors cursor-pointer"
                title="Upload Photo from device"
              >
                <ImageIcon className="w-4 h-4 text-emerald-500" />
                <span className="hidden xs:inline">Photo</span>
              </button>

              {/* Feelings Button */}
              <button
                type="button"
                onClick={() => setShowFeelingsPicker(!showFeelingsPicker)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-800 text-amber-600 dark:text-amber-400 text-xs font-semibold transition-colors cursor-pointer"
                title="Add Feeling / Activity"
              >
                <Smile className="w-4 h-4 text-amber-500" />
                <span className="hidden xs:inline">Feeling</span>
              </button>

              {/* Tag Button */}
              <button
                type="button"
                onClick={() => setShowTagPicker(!showTagPicker)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-pink-50 dark:hover:bg-gray-800 text-pink-600 dark:text-pink-400 text-xs font-semibold transition-colors cursor-pointer"
                title="Tag Category"
              >
                <Tag className="w-4 h-4 text-pink-500" />
                <span className="hidden xs:inline">Topic</span>
              </button>

              {/* Web image link toggle */}
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-800 text-purple-600 dark:text-purple-400 text-xs font-semibold transition-colors cursor-pointer"
                title="Paste image link URL"
              >
                <Link className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Post button with duplicate submission prevention */}
            <button
              id="submit-community-post"
              onClick={handlePostSubmit}
              disabled={isPublishing || (!newPostContent.trim() && !attachedImage)}
              className="px-6 py-2 rounded-full bg-[#e6007e] hover:bg-[#c9006e] text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center gap-1.5"
            >
              {isPublishing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Post</span>
              )}
            </button>
          </div>
        </div>

        {/* Upload error banner if file or network fails */}
        {uploadError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between gap-2 animate-fadeIn">
            <span>{uploadError}</span>
            <button
              onClick={() => setUploadError(null)}
              className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Share / Success notification toast */}
      {shareNotice && (
        <div className="p-3 rounded-xl bg-pink-50 dark:bg-gray-800 border border-pink-200 dark:border-pink-800 text-xs text-pink-700 dark:text-pink-300 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-pink-600 dark:text-pink-400" />
          <span>{shareNotice}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* POSTS LIST (Facebook-style feed layout)                   */}
      {/* ========================================================= */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const isCommentsOpen = expandedCommentsPostId === post.id;
            const isMenuOpen = activeMenuPostId === post.id;
            const isSaved = savedPosts.includes(post.id);

            return (
              <div
                key={post.id}
                id={`post-card-${post.id}`}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-xs border border-pink-100/90 dark:border-gray-800 overflow-hidden transition-all hover:border-pink-200 dark:hover:border-gray-700"
              >
                {/* Author Info Header */}
                <div className="p-4 sm:p-5 pb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-pink-100 dark:border-gray-700"
                    />
                    <div>
                      <div className="flex items-center flex-wrap gap-1">
                        <span className="text-sm font-bold text-gray-900 dark:text-white hover:underline cursor-pointer">
                          {post.authorName}
                        </span>
                        {post.feeling && (
                          <span className="text-xs text-gray-600 dark:text-gray-300 font-normal">
                            is {post.feeling}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        <span>{post.timestamp}</span>
                        <span>•</span>
                        <Globe className="w-3 h-3 text-gray-400" />
                        <span>Public</span>
                      </div>
                    </div>
                  </div>

                  {/* Options Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuPostId(isMenuOpen ? null : post.id)}
                      className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1.5 z-20 text-xs">
                        <button
                          onClick={() => handleToggleSave(post.id)}
                          className="w-full px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-pink-600" />
                          <span>{isSaved ? 'Unsave Post' : 'Save Post'}</span>
                        </button>
                        <button
                          onClick={() => handleReport(post.id)}
                          className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                        >
                          <Flag className="w-3.5 h-3.5 text-rose-500" />
                          <span>Report Content</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 sm:px-5 pb-3">
                  <p className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Hashtags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold text-pink-600 dark:text-pink-400 hover:underline cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Image: Correctly handled and displayed */}
                {(post.image || post.imageUrl) && (
                  <div className="w-full bg-black/5 dark:bg-black/40 overflow-hidden border-y border-gray-100 dark:border-gray-800">
                    <img
                      src={post.image || post.imageUrl}
                      alt="Community upload"
                      className="w-full max-h-[460px] object-cover hover:scale-[1.01] transition-transform duration-300 cursor-pointer"
                      onClick={() => window.open(post.image || post.imageUrl, '_blank')}
                    />
                  </div>
                )}

                {/* Reactions Count Bar */}
                <div className="px-4 sm:px-5 py-2.5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1.5">
                    <div className="flex -space-x-1 items-center">
                      <span className="w-4 h-4 rounded-full bg-pink-600 flex items-center justify-center text-[10px] text-white shadow-xs">
                        ❤️
                      </span>
                      <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white shadow-xs">
                        👍
                      </span>
                    </div>
                    <span>{post.likes}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      onClick={() => setExpandedCommentsPostId(isCommentsOpen ? null : post.id)}
                      className="hover:underline cursor-pointer"
                    >
                      {post.comments.length} comments
                    </span>
                    <span>•</span>
                    <span>1 share</span>
                  </div>
                </div>

                {/* Facebook Action Bar (Like, Comment, Share) */}
                <div className="px-2 py-1 grid grid-cols-3 gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
                  <button
                    id={`like-btn-${post.id}`}
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center justify-center gap-2 py-2 rounded-xl transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      post.liked ? 'text-pink-600 dark:text-pink-400 font-bold' : 'hover:text-pink-600'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 transition-transform active:scale-125 ${
                        post.liked ? 'fill-pink-600 text-pink-600 dark:fill-pink-400 dark:text-pink-400' : ''
                      }`}
                    />
                    <span>{post.liked ? 'Loved' : 'Like'}</span>
                  </button>

                  <button
                    id={`comment-toggle-${post.id}`}
                    onClick={() => setExpandedCommentsPostId(isCommentsOpen ? null : post.id)}
                    className="flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Comment</span>
                  </button>

                  <button
                    onClick={() => handleShare(post)}
                    className="flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>

                {/* ========================================================= */}
                {/* THREADED COMMENTS SECTION                                 */}
                {/* ========================================================= */}
                {isCommentsOpen && (
                  <div className="p-4 sm:p-5 bg-gray-50/70 dark:bg-gray-950/50 border-t border-gray-100 dark:border-gray-800 space-y-3.5 animate-fadeIn">
                    {/* Comments List */}
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {post.comments.length > 0 ? (
                        post.comments.map((comment) => (
                          <div key={comment.id} className="flex items-start gap-2.5">
                            <img
                              src={comment.authorAvatar}
                              alt={comment.authorName}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5 border border-pink-100 dark:border-gray-700"
                            />
                            <div className="flex-1">
                              <div className="bg-white dark:bg-gray-850 p-3 rounded-2xl shadow-2xs border border-gray-100 dark:border-gray-700 text-xs">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-bold text-gray-900 dark:text-white">{comment.authorName}</span>
                                  <span className="text-[10px] text-gray-400 dark:text-gray-500">{comment.timestamp}</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{comment.content}</p>
                              </div>
                              <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500 mt-1 ml-2 font-medium">
                                <button className="hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer">Like</button>
                                <span>•</span>
                                <button className="hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer">Reply</button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 dark:text-gray-500 italic text-center py-2">
                          No replies yet. Be the first sister to leave encouraging words!
                        </p>
                      )}
                    </div>

                    {/* New Comment Input with User Avatar */}
                    <form
                      onSubmit={(e) => handleCommentSubmit(post.id, e)}
                      className="flex items-center gap-2 pt-1"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-pink-200 dark:border-pink-800"
                      />
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder={`Write a thoughtful reply, ${user.name.split(' ')[0]}...`}
                          value={commentText[post.id] || ''}
                          onChange={(e) =>
                            setCommentText({ ...commentText, [post.id]: e.target.value })
                          }
                          className="w-full pl-3.5 pr-10 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400 dark:placeholder-gray-500 shadow-2xs"
                        />
                        <button
                          type="submit"
                          disabled={!commentText[post.id]?.trim()}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-[#e6007e] text-white hover:bg-[#c9006e] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center bg-white dark:bg-gray-900 rounded-2xl border border-pink-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs space-y-3">
            <Sparkles className="w-7 h-7 text-pink-400 mx-auto" />
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">No community posts match your criteria</p>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {searchQuery || selectedTagFilter
                  ? `We couldn't find any posts matching "${searchQuery || selectedTagFilter}". Try adjusting your keywords or clearing the filter.`
                  : 'Try switching tabs or be the first to share an empowering story with your sisters!'}
              </p>
            </div>
            {(searchQuery || selectedTagFilter) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTagFilter(null);
                }}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>Clear Search & Show All</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
