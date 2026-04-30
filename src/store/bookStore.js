import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useBookStore = create(
  persist(
    (set, get) => ({
      title: 'Gary Wild: The Great',
      dedication: '',
      coverImage: null,

      chapters: [
        {
          id: 'ch-test-1',
          title: 'In the Beginning, There Was Gary',
          pages: [
            {
              id: 'pg-test-1',
              text: 'It is a curious thing to be born great...',
              media: []
            }
          ]
        }
      ],

      currentPageIndex: 0,
      toast: null,
      mediaLibrary: [],

      // ---------------- CHAPTERS ----------------
      addChapter: (title) => {
        const id = 'ch-' + Date.now();
        set((s) => ({
          chapters: [...s.chapters, { id, title, pages: [] }]
        }));
        return id;
      },

      deleteChapter: (id) => {
        set((s) => ({
          chapters: s.chapters.filter((ch) => ch.id !== id)
        }));
        get().showToast('Chapter deleted');
      },

      renameChapter: (id, newTitle) => {
        set((s) => ({
          chapters: s.chapters.map((ch) =>
            ch.id === id ? { ...ch, title: newTitle } : ch
          )
        }));
      },

      // ---------------- PAGES ----------------
      addPage: (chapterId, text) => {
        set((s) => ({
          chapters: s.chapters.map((ch) => {
            if (ch.id !== chapterId) return ch;

            const pages = [...ch.pages];
            const last = pages[pages.length - 1];

            if (last && last.text.length < 800) {
              last.text += '\n\n' + text;
              return { ...ch, pages };
            }

            return {
              ...ch,
              pages: [
                ...pages,
                { id: 'pg-' + Date.now(), text, media: [] }
              ]
            };
          })
        }));
      },

      deletePage: (chapterId, pageId) => {
        set((s) => ({
          chapters: s.chapters.map((ch) => {
            if (ch.id !== chapterId) return ch;
            return {
              ...ch,
              pages: ch.pages.filter((p) => p.id !== pageId)
            };
          })
        }));
      },

      // ---------------- VOICE PIPELINE ----------------
      processVoiceInput: (rawText, chapterId = null, newChapterTitle = null) => {
        const cleaned = rawText.trim();
        if (!cleaned) return;

        let targetId = chapterId;

        if (newChapterTitle) {
          targetId = get().addChapter(newChapterTitle);
        }

        if (!targetId) {
          const chs = get().chapters;
          targetId =
            chs.length === 0
              ? get().addChapter('Chapter One')
              : chs[chs.length - 1].id;
        }

        get().addPage(targetId, cleaned);
      },

      // ---------------- UI HELPERS ----------------
      setDedication: (text) => set({ dedication: text }),
      setCoverImage: (img) => set({ coverImage: img }),

      setCurrentPage: (index) => set({ currentPageIndex: index }),

      showToast: (msg) => {
        set({ toast: msg });
        setTimeout(() => set({ toast: null }), 3000);
      }
    }),
    {
      name: 'gary-wild-book',
      version: 2
    }
  )
);