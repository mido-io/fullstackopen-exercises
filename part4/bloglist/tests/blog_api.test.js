const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

let token = null

beforeEach(async () => {
  // Clear the database
  await Blog.deleteMany({})
  await User.deleteMany({})

  // Create a "root" user to use for testing
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  // Log in as that user to get a Token
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
  
  token = loginResponse.body.token

  // Save initial blogs (linked to this user)
  const blogObjects = helper.initialBlogs.map(blog => new Blog({ ...blog, user: user._id }))
  await Blog.insertMany(blogObjects)
})

describe('when there is initially some blog posts saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
})

describe('addition of a new blog', () => {

  test('a valid blog can be added with token', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) 
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  })

  test('fails with status code 401 if token is missing', async () => {
    const newBlog = {
      title: 'No Token Blog',
      url: 'http://example.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog) 
      .expect(401)
  })
})

describe('deletion of a blog', () => {

  test('succeeds with status code 204 if id is valid and user is creator', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`) 
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})