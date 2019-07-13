import express from 'express';

const app = express(),
    port = process.env.PORT || 9001;

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(9001, () => {
    console.log(process.env.PORT)
    console.log(`Example app listening on port ${port}!`)
})
