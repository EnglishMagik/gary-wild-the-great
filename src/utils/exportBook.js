/**
 * exportBook.js
 * Generates a self-contained HTML export of the book
 * and a JSON data export.
 */

export function exportAsHTML(book) {
  const { title, dedication, chapters } = book

  const dedicationSection = `
    <section class="page dedication-page">
      <h2>Dedication</h2>
      <div class="dedication-text">${dedication.replace(/\n/g, '<br>')}</div>
    </section>`

  const chapterSections = chapters.flatMap((ch, ci) =>
    ch.pages.map(
      (pg, pi) => `
    <section class="page">
      <div class="pg-label">Chapter ${ci + 1}</div>
      <h2>${ch.title}</h2>
      ${pg.text
        .split('\n')
        .filter((t) => t.trim())
        .map((t) => `<p>${t}</p>`)
        .join('')}
      <div class="pg-num">— ${pi + 1} —</div>
    </section>`
    )
  )

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Crimson+Text:ital,wght@0,400;1,400&family=Cinzel&display=swap" rel="stylesheet">
<style>
  :root { --gold:#c9a84c; --parchment:#f5ead6; --ink:#1a1208; }
  body { background:#2a1f0d; font-family:'Crimson Text',serif; color:var(--ink); display:flex; flex-direction:column; align-items:center; padding:2rem; }
  h1.book-title { font-family:'Cinzel',serif; color:var(--gold); font-size:clamp(2rem,6vw,4rem); text-align:center; margin:2rem 0 0.5rem; }
  .book-byline { color:rgba(201,168,76,0.6); font-style:italic; margin-bottom:3rem; }
  .page { background:var(--parchment); max-width:700px; width:100%; padding:4rem 4rem 3rem; margin:1.5rem 0; box-shadow:0 10px 40px rgba(0,0,0,0.6); position:relative; min-height:500px; }
  .pg-label { font-family:'Cinzel',serif; font-size:0.75rem; letter-spacing:0.3em; color:#8b6914; text-align:center; text-transform:uppercase; margin-bottom:0.5rem; }
  h2 { font-family:'Playfair Display',serif; font-size:1.8rem; font-style:italic; text-align:center; margin-bottom:2rem; padding-bottom:1.5rem; border-bottom:1px solid #8b6914; }
  p { font-size:1.05rem; line-height:1.9; text-align:justify; margin-bottom:1.2em; text-indent:2em; }
  p:first-of-type { text-indent:0; }
  p:first-of-type::first-letter { font-family:'Playfair Display',serif; font-size:3.5em; float:left; line-height:0.8; margin-right:0.1em; color:#8b1a1a; font-weight:700; }
  .pg-num { text-align:center; font-family:'Cinzel',serif; font-size:0.75rem; color:#8b6914; margin-top:2rem; }
  .dedication-page { text-align:center; }
  .dedication-text { font-family:'Playfair Display',serif; font-style:italic; font-size:1.3rem; line-height:2; margin-top:2rem; }
</style>
</head>
<body>
<h1 class="book-title">${title}</h1>
<p class="book-byline">An Online Book</p>
${dedicationSection}
${chapterSections.join('\n')}
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html' })
  const a    = document.createElement('a')
  a.href     = URL.createObjectURL(blob)
  a.download = 'gary-wild-the-great.html'
  a.click()
}

export function exportAsJSON(book) {
  const json = JSON.stringify(book, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const a    = document.createElement('a')
  a.href     = URL.createObjectURL(blob)
  a.download = 'gary-wild-book-data.json'
  a.click()
}
