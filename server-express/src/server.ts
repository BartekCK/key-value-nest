import express, { Express } from 'express';

const app: Express = express();

const PORT: number | string = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello world').status(200);
});

const server = app.listen(PORT, () => {
    console.log(`App started on PORT ${PORT}`);
});
