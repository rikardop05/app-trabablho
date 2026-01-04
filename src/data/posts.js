// posts iniciais; a app vai migrar para localStorage ao iniciar
export const initialPosts = [
  {
    id: 1,
    user: { id: 1, name: "Ana" },
    image: "https://source.unsplash.com/random/300x300?nature",
    caption: "Bom dia, pessoal!",
    likes: 12,
    comments: [{ id: 1, user: "João", text: "Top!" }]
  },
  {
    id: 2,
    user: { id: 2, name: "Carlos" },
    image: "https://source.unsplash.com/random/300x300?beach",
    caption: "Fim de semana!",
    likes: 8,
    comments: [{ id: 1, user: "Mariana", text: "Aproveita!" }]
  },
  {
    id: 3,
    user: { id: 3, name: "Beatriz" },
    image: "https://source.unsplash.com/random/300x300?party",
    caption: "Festa de aniversário!",
    likes: 25,
    comments: [{ id: 1, user: "Pedro", text: "Parabéns!" }, { id: 2, user: "Lia", text: "Que massa!" }]
  }
];