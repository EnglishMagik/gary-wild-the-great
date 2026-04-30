import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useBookStore = create(
  persist(
    (set, get) => ({
      title: 'Gary Wild: The Great',
      dedication: '',
      coverImage: null,
      chapters: [],
      currentPageIndex: 0,
      toast: null,

      getFlatPages: () => {
        const chapters = get().chapters || [];
        const flat = [];
        chapters.forEach((ch) => {
          if (ch.pages && Array.isArray(ch.pages)) {
            ch.pages.forEach((pg) => {
              flat.push({ ...pg, chapterId: ch.id, chapterTitle: ch.title });
            });
          }
        });
        return flat;
      },

      addChapter: (title) => {
        const id = 'ch-' + Date.now();
        set((s) => ({ chapters: [...s.chapters, { id, title, pages: [] }] }));
        return id;
      },

      deleteChapter: (id) => {
        set((s) => ({
          chapters: s.chapters.filter(ch => ch.id !== id)
        }));
        get().showToast("Entire chapter deleted.");
      },

      // FIXED: This now deletes ONLY the page you are looking at
      deletePage: (chapterId, pageId) => {
        set((s) => ({
          chapters: s.chapters.map((ch) => {
            if (ch.id !== chapterId) return ch;
            return {
              ...ch,
              pages: ch.pages.filter((p) => p.id !== pageId),
            };
          }),
        }));
        // Back up one page so we don't land on a blank screen
        const currentIndex = get().currentPageIndex;
        set({ currentPageIndex: Math.max(0, currentIndex - 1) });
        get().showToast("Page deleted.");
      },

      addPage: (chapterId, text) => {
        set((s) => ({
          chapters: s.chapters.map((ch) => {
            if (ch.id !== chapterId) return ch;
            const pages = [...ch.pages];
            const lastPage = pages[pages.length - 1];
            if (lastPage && lastPage.text.length < 2000) {
              lastPage.text = lastPage.text + "\n\n" + text;
              return { ...ch, pages };
            } else {
              return { 
                ...ch, 
                pages: [...pages, { id: 'pg-' + Date.now(), text, media: [] }] 
              };
            }
          }),
        }));
      },

      updatePage: (chapterId, pageId, newText) => {
        set((s) => ({
          chapters: s.chapters.map((ch) => {
            if (ch.id !== chapterId) return ch;
            return {
              ...ch,
              pages: ch.pages.map((p) => 
                p.id === pageId ? { ...p, text: newText } : p
              ),
            };
          }),
        }));
        get().showToast("Changes saved.");
      },

      processVoiceInput: (rawText, chapterId = null, newChapterTitle = null) => {
        const cleaned = rawText.trim();
        if (!cleaned) return;
        let targetId = chapterId;
        if (newChapterTitle) {
          targetId = get().addChapter(newChapterTitle);
        } else if (!targetId) {
          const chs = get().chapters;
          targetId = chs.length === 0 ? get().addChapter('Chapter One') : chs[chs.length - 1].id;
        }
        get().addPage(targetId, cleaned);
      },

      setCoverImage: (img) => set({ coverImage: img }),
      setCurrentPage: (index) => set({ currentPageIndex: index }),
      showToast: (msg) => {
        set({ toast: msg });
        setTimeout(() => set({ toast: null }), 3000);
      },
    }),
    { name: 'gary-wild-book' } 
  )
)