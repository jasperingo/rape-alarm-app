import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { useState } from 'react';

const BACKGROUND_FETCH_TASK = 'background-fetch';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();
  console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 15, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export const useBackgroundTask = ()=> {
  const [isRegistered, setIsRegistered] = useState(false);
  const [status, setStatus] = useState<BackgroundFetch.BackgroundFetchStatus | null>(null);


  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    setStatus(status);
    setIsRegistered(isRegistered);
  };


  const onPress = async ()=> {
    alert('Presssed '+isRegistered);
    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync();
    }

    checkStatusAsync();
  }

  console.log(status);

  return onPress;
}
