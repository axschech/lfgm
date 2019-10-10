import express from 'express';

const app = express(),
    port = process.env.PORT || 9001;

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
