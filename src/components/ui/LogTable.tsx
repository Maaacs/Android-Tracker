"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import { TableCell, TableRow, TableHeader, TableBody, Table } from "@/components/ui/table";
import { FiDownload } from 'react-icons/fi';

interface Log {
  timestamp: string;
  level: string;
  message: string;
}

interface LogTableProps {
  logs: Log[];
  onDownload: () => void;
}

const LogTable: React.FC<LogTableProps> = ({ logs, onDownload }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Timestamp</TableCell>
          <TableCell>Level</TableCell>
          <TableCell>Message</TableCell>
          {/*<TableCell>Download</TableCell>*/}
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log, index) => (
          <TableRow key={index}>
            <TableCell>{log.timestamp}</TableCell>
            <TableCell>{log.level}</TableCell>
            <TableCell>{log.message}</TableCell>
            {/*<TableCell>
              <Button variant="ghost" size="icon" onClick={onDownload}>
                <FiDownload className="h-4 w-4" />
              </Button>
            </TableCell>*/}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LogTable;