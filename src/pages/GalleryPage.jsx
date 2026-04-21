import React from "react"
import { useNavigate } from "react-router-dom"
import { useBookStore } from "../store/bookStore"

export default function GalleryPage() {
  const navigate = useNavigate()
  const { books } = useBookStore()

  return (
    <div style={{ padding: 20 }}>
      <h1>Gallery</h1>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {books?.map((book, i) => (
          <div
            key={i}
            onClick={() => navigate(`/book/${book.id}`)}
            style={{
              width: 120,
              height: 160,
              background: "#222",
              cursor: "pointer",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            {book.title}
          </div>
        ))}
      </div>
    </div>
  )
}