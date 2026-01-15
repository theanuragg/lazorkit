import app from './app';
import { getEnv } from './config/env';

const env = getEnv();
const port = env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});