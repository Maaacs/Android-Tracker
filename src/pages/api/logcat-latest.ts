import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

interface Log {
  timestamp: string;
  level: string;
  message: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { filename, lines } = req.query;

  if (!filename) {
    return res.status(400).json({ message: 'Nome do arquivo ausente.' });
  }

  try {
    const filePath = `${process.cwd()}/${filename}`;

    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Arquivo de log não encontrado.' });
    }

    // Lê as últimas linhas do arquivo
    const logContent = fs.readFileSync(filePath, 'utf-8');
    const logLines = logContent.split('\n');
    const lastLines = logLines.slice(-(Number(lines) || 10)); // Obtém as últimas 10 linhas por padrão

    // Analisa cada linha e cria um objeto Log
    const logs: Log[] = lastLines.map(line => {
      const parts = line.split(/\s+/);
      return {
        timestamp: parts.slice(0, 2).join(' '),
        level: parts[2],
        message: parts.slice(3).join(' ')
      };
    });

    res.status(200).json({ logs });
  } catch (error) {
    console.error('Erro ao ler o arquivo de log:', error);
    res.status(500).json({ message: 'Erro ao ler o arquivo de log.' });
  }
}
