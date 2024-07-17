import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { filename } = req.query;

  if (!filename) {
    return res.status(400).json({ message: 'Nome do arquivo ausente.' });
  }

  try {
    const filePath = `${process.cwd()}/${filename}`;

    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Arquivo de log não encontrado.' });
    }

    
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    
    const fileStream = fs.createReadStream(filePath);

    
    fileStream.pipe(res);

  } catch (error) {
    console.error('Erro ao baixar o arquivo de log:', error);
    res.status(500).json({ message: 'Erro ao baixar o arquivo de log.' });
  }
}
