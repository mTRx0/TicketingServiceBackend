import { app } from './app';

export const appPort = 3000;

app.listen(appPort, () => {
  console.log(`Server running on port ${appPort}`);
})