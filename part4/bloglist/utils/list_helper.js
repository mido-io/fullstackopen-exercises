
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    return (
        blogs.reduce((sum, blog) => sum + blog.likes, 0)
    )
}


const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const favorite = blogs.reduce((prev, current) => {
    return (prev.likes > current.likes) ? prev : current
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}


const mostBlogs = (blogs) => {

  if (blogs.length === 0) return null

  const authorCounts = blogs.reduce((acc, blog) => {

    // if authot first time appear in object ==> 0 + 1 
    // if auther alreay exsits in the object ==> prev. Count + 1 

    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  let topAuthor = ''
  let maxBlogs = 0

  for (const author in authorCounts) {
    if (authorCounts[author] > maxBlogs) {
      topAuthor = author
      maxBlogs = authorCounts[author]
    }
  }

  return {
    author: topAuthor,
    blogs: maxBlogs
  }


}

const mostLikes = (blogs) => {

  if (blogs.length === 0) return null

  const authorLikes = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

  let topAuthor = ''
  let maxLikes = 0

  for (const author in authorLikes) {
    if (authorLikes[author] > maxLikes) {
      topAuthor = author
      maxLikes = authorLikes[author]
    }

  }

  return {
    author: topAuthor,
    likes: maxLikes
  }

}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
