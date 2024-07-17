import { NextApiRequest, NextApiResponse } from 'next';
import { exec, spawn } from 'child_process';
import fs from 'fs';

let logcatProcess: any = null; // Para armazenar a referência ao processo do logcat

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action, filename } = req.query;

  if (action === 'clear') {
    // Limpar o buffer do logcat
    exec('adb logcat -c', (error) => {
      if (error) {
        console.error(`Erro ao limpar o buffer do logcat: ${error}`);
        res.status(500).json({ message: 'Erro ao limpar o logcat.' });
      } else {
        res.status(200).json({ message: 'Logcat limpo com sucesso!' });
      }
    });

  } else if (action === 'start' && filename) {
    // Iniciar a captura do logcat
    if (logcatProcess) {
      // Se já houver um processo em execução, avise
      return res.status(400).json({ message: 'A captura do logcat já está em andamento.' });
    }

    try {
      // Inicia o processo do logcat
      logcatProcess = spawn('adb', ['logcat', '-v', 'time']);
      const logStream = fs.createWriteStream(filename as string, { flags: 'a' });
      logcatProcess.stdout.pipe(logStream);

      console.log('Processo do Logcat iniciado ID:', logcatProcess.pid);

      logcatProcess.stdout.on('data', (data: Buffer) => {
        console.log(`Logcat: ${data}`);
      });

      logcatProcess.stderr.on('data', (data: Buffer) => {
        console.error(`Erro no logcat: ${data}`);
      });

      setTimeout(() => {
        res.status(200).json({ message: 'Coleta de logcat iniciada.', pid: logcatProcess.pid });
      }, 1000);

    } catch (error) {
      console.error('Erro ao iniciar a coleta de logcat:', error);
      res.status(500).json({ message: 'Erro ao iniciar a coleta de logcat.' });
    }

  } else if (action === 'stop') {
    // Parar a captura do logcat
    if (logcatProcess) {
      logcatProcess.kill();
      logcatProcess = null;
      res.status(200).json({ message: 'Coleta de logcat interrompida.' });
    } else {
      res.status(400).json({ message: 'Nenhuma captura de logcat em andamento.' });
    }

  } else {
    res.status(400).send('Ação inválida ou nome de arquivo ausente.');
  }
}
