
const fs = require('fs')

const express = require ('express')
const app = express()
const PORT = process.env.PORT || 9000;

app.set('view engine' , 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))


//Home page
app.get('/', (req, res) => {
  res.render('home')
})

//CREATE and PUSH>>
app.get('/create',(req, res) => {
  res.render('create')
})

app.post('/create', (req, res) => {
  const title = req.body.title
  const content = req.body.content

  if (title.trim() === '' && content.trim() === '') {
      res.render('create', {error: true});
  } else {
      fs.readFile('./data/blogs.json', (err, data) =>{
          if (err) throw err

          const blogs =JSON.parse(data)

          blogs.push ({
              id: id (),
              title: title,
              content: content,
              })

          fs.writeFile('./data/blogs.json', JSON.stringify(blogs), err => {
              if(err) throw err

              res.render('create', {success :true } )
              })
          })
      }
}) 

//Blogs list page>>
app.get('/blogs', (req, res) => {
  fs.readFile('./data/blogs.json', (err, data) => {
      if (err) throw err
      const blogs = JSON.parse(data)
      res.render('blogs', { blogs: blogs })
  })
})

//Blog by unique Id
app.get('/blogs/:id', (req, res) => {
  const id = req.params.id

  fs.readFile('./data/blogs.json', (err, data) => {
      if (err) throw err

      const blogs = JSON.parse(data)

      const blog = blogs.filter(blog => blog.id == id)[0]

      res.render('detail', { blog: blog})
  })  
})



// UPDATE (SHOW UPDATE FORM)
app.get('/blogs/:id/update', (req, res) => {
  const id= req.params.id

  console.log('asdasdas')

  fs.readFile('./data/blogs.json', (err, data) => {
      if (err) throw err

      const blogs = JSON.parse(data)

      const blog = blogs.find(blog => blog.id == id)

      res.render('edit', { blog: blog })
  })
})



// UPDATE (PERFORM UPDATE OP)
app.post('/blogs/:id/update', (req, res) => {
  const id= req.params.id

  fs.readFile('./data/blogs.json', (err, data) => {
      if (err) throw err

      const blogs = JSON.parse(data)

      const blog = blogs.find(blog => blog.id == id)

      let idx = blogs.indexOf(blog)

      blogs[idx].title = req.body.title
      blogs[idx].content = req.body.content

      fs.writeFile('./data/blogs.json' , JSON.stringify(blogs), err => { 
        if (err) throw err

        res.redirect('/blogs')
      })
  })
})


//DELETE
app.get('/blogs/:id/delete' , (req, res) => {
  const id= req.params.id

  fs.readFile('./data/blogs.json', (err, data) => {
      if (err) throw err

      const blogs = JSON.parse(data)

      const filteredblogs = blogs.filter(blog => blog.id != id)

      fs.writeFile('./data/blogs.json' , JSON.stringify(filteredblogs), (err) => { 
          if (err) throw err

          res.render('blogs', {blogs: filteredblogs , deleted: true })
      })
  })
})




app.listen(PORT, () => {
  console.log(`Server is running on localhost ${PORT}`)
})

function id () {
  return'_' + Math.random().toString(36).substring(2, 9);
}


