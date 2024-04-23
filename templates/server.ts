import app from './app'
import verify from './services/verifyTransporter.service'

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on PORT: \u001b[1;33m${PORT}`)
})

//verify() //Uncomment if you want to send mails with your server