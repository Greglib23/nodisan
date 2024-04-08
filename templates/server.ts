import app from './app'

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on PORT: \u001b[1;33m${PORT}`)
})