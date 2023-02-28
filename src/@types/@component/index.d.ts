declare namespace component {
  interface Comment {
    id: number,
    liked: number,
    content: string,
    commented: number,
    created_at: string,
    thumb_count?: number,
    commentable?: Comment
    user: {
      id: number,
      name: string
      avatar: string
    }
  }

  interface Article {
[x: string]: string
    author: { name: string },
    identity: string,
    title: string,
    summary: string,
    gallery?: Gallery,
    visited: number
  }

  interface Album {
    id: number,
    name: string,
    total: number,
    gallery_id: number,
    gallery?: {
      id: number,
      url: string
    }
  }

  interface ArticleInfo {
    article: {
      commented: number,
      content: string,
      created_at: string,
      identity: string,
      thumbs: boolean,
      title: string,
      visited: number,
      gallery: {
        thumbnail: string,
        url: string
      },
      author: {
        id: number,
        name: string,
        avatar: string
      }
    }
  }
}
