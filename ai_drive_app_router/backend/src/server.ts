import app from './app';

const port = Number(process.env.PORT) || 3003;

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server is running on http://0.0.0.0:${port}`);
});
