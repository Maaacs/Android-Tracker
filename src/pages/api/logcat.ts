/**
  * @author: Max Souza
  * @github: https://github.com/Maaacs
  * @repo: https://github.com/Maaacs/Android-Tracker
  * 
  * Description:
  * This code is part of the Android Tracker project, which
  * provides a graphical interface for real-time monitoring of Android devices.
  *
  * Contributions are welcome. To contribute, please visit the project's repository on GitHub.
  *
  * License:
  * This code is distributed under the MIT license, meaning it can be used,
  * copied, modified, and distributed freely, provided that the same authorship header is maintained.
  *
  * Copyright © 2024 Max Souza
*/

import { NextApiRequest, NextApiResponse } from 'next';
import { exec, spawn } from 'child_process';

let logcat = '';

const writeLogcat = () => {
  const logcatProcess = spawn('adb', ['logcat', '-v', 'time']);
  logcatProcess.stdout.on('data', (data) => {
    logcat += data.toString();
  });
  logcatProcess.on('error', (error) => {
    console.error(`Error writing logcat:: ${error}`);
  });
};

const clearLogcat = () => {
  exec('adb logcat -c', (error) => {
    if (error) {
      console.error(`Error clearing logcat buffer: ${error}`);
    } else {
      logcat = '';
    }
  });
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const action = req.query.action;
  if (action === 'clear') {
    clearLogcat();
    res.send('OK');
  } else if (action === 'write') {
    writeLogcat();
    res.send('OK');
  } else {
    res.status(400).send('Invalid action.');
  }
}
