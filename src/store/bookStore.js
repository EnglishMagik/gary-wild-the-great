import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
              text: 'It is a curious thing to be born great, rather than to achieve greatness or have it thrust upon you. Gary Wild did not ask for the circumstances of his arrival into the world.\n\nHe simply arrived — loudly, unapologetically, and, according to witnesses, wearing an expression of mild impatience. His mother always said he came out looking like he had somewhere better to be.\n\nHis father, a man of few words and fewer opinions, merely nodded and offered the baby a handshake. Gary, to everyone\'s astonishment, appeared to consider it. This was the perfect introduction to a man who would spend his life slightly ahead of wherever everyone else assumed he was going.',
              media: []
            },
            {
              id: 'pg-test-2',
              text: 'Test page 2.\n\nThis is the second page of the first chapter. More of the story would go here, filling the page with rich narrative and carefully chosen words that paint a vivid picture.\n\nThe story continues across multiple pages, each one revealing a little more about the remarkable life of Gary Wild. Every sentence matters. Every word is chosen with care.',
              media: []
            },
            {
              id: 'pg-test-3',
              text: 'Test page 3.\n\nThis is the third page of chapter one. By now the reader is fully immersed in the world of Gary Wild and cannot put the book down.\n\nEvery page turn reveals something new, something unexpected, something that makes you want to keep reading into the small hours of the night. The writing carries you forward effortlessly.',
              media: []
            },
            {
              id: 'pg-test-4',
              text: 'Test page 4.\n\nThis is the fourth and final test page of chapter one. The chapter draws to a close with the quiet confidence of a man who knows exactly where he is going.\n\nAnd where he is going, as it turns out, is somewhere rather extraordinary. The next chapter will reveal all. Turn the page and find out.',
              media: []
            },
          ]
        },
        {
          id: 'ch-test-2',
          title: 'The Incident at the Café',
          pages: [
            {
              id: 'pg-test-5',
              text: 'No story of Gary Wild would be complete without the Café Incident of 2007, which depending on who you ask was either an act of extraordinary courage, a minor misunderstanding, or an elaborate attempt to get a free croissant.\n\nThe truth, as it so often does, contains elements of all three. Gary had entered the establishment on a Wednesday morning, which he always maintained was the universe\'s most underappreciated day.\n\nHe ordered a flat white, sat down by the window, and proceeded to change the life of everyone present — mostly by accident, and entirely without realising he had done so until three weeks later.',
              media: []
            },
          ]
        },
      ],
      currentPageIndex: 0,
      toast: null,
      mediaLibrary: [],

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

      renameChapter: (id, newTitle) => {
        set((s) => ({
          chapters: s.chapters.map((ch) =>
            ch.id === id ? { ...ch, title: newTitle } : ch
          ),
        }));
      },

      updateChapterTitle: (id, newTitle) => {
        set((s) => ({
          chapters: s.chapters.map((ch) =>
            ch.id === id ? { ...ch, title: newTitle } : ch
          ),
        }));
      },

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
if (lastPage && lastPage.text.length < 800) {
  const updatedPage = { ...lastPage, text: lastPage.text + "\n\n" + text };
  return { ...ch, pages: [...pages.slice(0, -1), updatedPage] };
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

      setDedication: (text) => set({ dedication: text }),
      setCoverImage: (img) => set({ coverImage: img }),
      setCurrentPage: (index) => set({ currentPageIndex: index }),

      addToMediaLibrary: (item) => {
        set((s) => ({ mediaLibrary: [...s.mediaLibrary, item] }));
      },

      removeFromMediaLibrary: (id) => {
        set((s) => ({
          mediaLibrary: s.mediaLibrary.filter((m) => m.id !== id)
        }));
      },

      showToast: (msg) => {
        set({ toast: msg });
        setTimeout(() => set({ toast: null }), 3000);
      },
    }),
    {
      name: 'gary-wild-book',
      version: 2,
    }
  )
)