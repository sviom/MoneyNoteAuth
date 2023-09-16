console.log('test');
import express from 'express';

const port = 3011;
const app = express();

app.listen(port, () => {
    console.log('app listen ');
});
