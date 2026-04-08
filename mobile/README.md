# Productivity Mobile

Expo React Native app for the same to-do backend used by the web client.

## What it does

- Login and register against `/api/auth`
- Persist JWT login on-device with AsyncStorage
- Fetch task list from `/api/tasks`
- Create tasks
- Toggle tasks between `todo` and `done`
- Delete tasks

## Run it

```bash
cd mobile
npm start
```

Then open it with:

- `npm run android` for Android emulator/device
- `npm run web` for a browser preview
- `npm run ios` on macOS

## API target

The app currently uses the deployed backend:

`https://todo-lsd1.onrender.com/api`

If you want to point the mobile app at a different backend, update:

`src/services/api.js`
