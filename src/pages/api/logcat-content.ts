import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { filename } = req.query;

  if (!filename) {
    return res.status(400).json({ message: 'Nome do arquivo ausente.' });
  }

  try {
    const filePath = `${process.cwd()}/${filename}`; // Caminho completo do arquivo

    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Arquivo de log não encontrado.' });
    }

    // Lê o conteúdo do arquivo
    const logContent = fs.readFileSync(filePath, 'utf-8');

    res.status(200).json({ logContent });
  } catch (error) {
    console.error('Erro ao ler o arquivo de log:', error);
    res.status(500).json({ message: 'Erro ao ler o arquivo de log.' });
  }
}
