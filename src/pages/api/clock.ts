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
import { exec } from 'child_process';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  exec("adb shell cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq", (error, stdout) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Error. Smartphone inaccessible.');
    }
    const clock = parseInt(stdout) / 1e6;
    res.json({ clock });
  });
}
