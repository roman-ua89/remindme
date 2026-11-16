import { createApp } from './app.js';
import { env } from './config/env.js';

const app = await createApp();

app.listen(env.PORT, () => {
    console.log(`RemindMe API listening on http://localhost:${env.PORT}`);
    if (env.NODE_ENV === 'development') {
        console.log(`Swagger UI: http://localhost:${env.PORT}/api/docs`);
    }
});
