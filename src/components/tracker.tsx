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

"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { LineChart } from '@mui/x-charts/LineChart';
import LogTable from "@/components/ui/LogTable";
import { saveAs } from 'file-saver';
import { FiDownload } from 'react-icons/fi';
import { Log } from "@/types/types"; 
import axios from 'axios';

export function Tracker() {
  const [deviceName, setDeviceName] = useState<string>('');
  const [buildVersion, setBuildVersion] = useState<string>('');
  const [temperature, setTemperature] = useState<string>('');
  const [clockSpeed, setClockSpeed] = useState<string>('');
  const [averageTemperature, setAverageTemperature] = useState<string>('');
  const [averageClockSpeed, setAverageClockSpeed] = useState<string>('');
  const [temperatureReadings, setTemperatureReadings] = useState<number[]>([]);
  const [clockSpeedReadings, setClockSpeedReadings] = useState<number[]>([]);
  const [graphTemperatureData, setGraphTemperatureData] = useState<GraphData[]>([{ id: "Temperature", data: [] }]);
  const [graphClockData, setGraphClockData] = useState<GraphData[]>([{ id: "Clock", data: [] }]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentFilename, setCurrentFilename] = useState<string>(''); 
  const [logs, setLogs] = useState<Log[]>([]);
  const [logFilename, setLogFilename] = useState('logcat.txt'); 
  const [isLogcatRunning, setIsLogcatRunning] = useState(false); 
  
  interface DataPoint {
    x: number | string;
    y: number;
  }
  
  interface GraphData {
    id: string;
    data: DataPoint[];
  }
  
  const convertedData = graphTemperatureData[0].data.map((item) => ({
    x: item.x,
    y: item.y,
  }));
  
  const convertedDataClock = graphClockData[0].data.map((item) => ({
    x: item.x,
    y: item.y,
  }));
  
  const toggleCapture = () => {
    if (!isCapturing) {
      setTemperatureReadings([]);
      setClockSpeedReadings([]);
      startLogcat();
    } else {
      const tempSum = temperatureReadings.reduce((acc, val) => acc + val, 0);
      const clockSum = clockSpeedReadings.reduce((acc, val) => acc + val, 0);
      setAverageTemperature(`${(tempSum / temperatureReadings.length).toFixed(2)}°C`);
      setAverageClockSpeed(`${(clockSum / clockSpeedReadings.length).toFixed(2)} GHz`);
      stopLogcat();
    }
    setIsCapturing(!isCapturing);
  };
  
  useEffect(() => {
    const fetchData = () => {
      fetch('/api/model')
        .then(response => response.json())
        .then(data => setDeviceName(data.model));
      fetch('/api/build')
        .then(response => response.json())
        .then(data => setBuildVersion(data.buildVersion));
      fetch('/api/temperature')
        .then(response => response.json())
        .then(data => {
          setTemperature(`${data.temperature}°C`);
          if (isCapturing) {
            setTemperatureReadings(prev => [...prev, data.temperature]);
            setGraphTemperatureData(prevState => [{
              ...prevState[0],
              data: [...prevState[0].data, { x: Date.now(), y: data.temperature }]
            }]);
          }
        });
      fetch('/api/clock')
        .then(response => response.json())
        .then(data => {
          setClockSpeed(`${data.clock} GHz`);
          if (isCapturing) {
            setClockSpeedReadings(prev => [...prev, data.clock]);
            setGraphClockData(prevState => [{
              ...prevState[0],
              data: [...prevState[0].data, { x: Date.now(), y: data.clock }]
            }]);
          }
        });
    };
    let intervalId: ReturnType<typeof setInterval> | null = null;
    if (isCapturing) {
      fetchData();
      intervalId = setInterval(fetchData, 100); // Milliseconds
    } else {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    }
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isCapturing]);
  
  
  const valueFormatter = (value: number | string) => {
    const date = new Date(value);
    return date.getHours().toString().padStart(2, '0') + ':' +
           date.getMinutes().toString().padStart(2, '0') + ':' +
           date.getSeconds().toString().padStart(2, '0');
  };
  
  const startLogcat = async () => {
    const date = new Date();
    const filename = `logcat-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}.txt`;
    setCurrentFilename(filename); 
    setLogFilename(filename); 
    try {
      // Limpa o buffer do logcat antes de iniciar
      await fetch('/api/logcat?action=clear');
      // Inicia a captura do logcat
      await axios.get(`/api/logcat?action=start&filename=${filename}`);
      setIsLogcatRunning(true);
      console.log('Coleta de logcat iniciada.');
    } catch (error) {
      console.error('Erro ao iniciar a coleta de logcat:', error);
    }
  };
  
  const stopLogcat = async () => {
    try {
      // Para a captura do logcat
      await axios.get('/api/logcat?action=stop');
      setIsLogcatRunning(false);
      console.log('Coleta de logcat interrompida.');
      fetchLogs();
    } catch (error) {
      console.error('Erro ao interromper a coleta de logcat:', error);
    }
  };
  
  const fetchLogs = async () => {
    try {
      const response = await axios.get(`/api/logcat-content?filename=${logFilename}`);
      if (response.status === 200) {
        setLogs(response.data.logContent.split('\n'));
      }
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
    }
  };
  
  // Função para baixar o arquivo de log
  const downloadLog = () => {
    if (currentFilename) {
      fetch(`/api/download-logcat?filename=${currentFilename}`)
        .then(res => res.blob()) 
        .then(blob => saveAs(blob, currentFilename)); 
    } else {
      console.error('Nome do arquivo de log não definido.');
    }
  };
  
  useEffect(() => {
    const fetchLatestLogs = async () => {
      if (isCapturing && currentFilename) {
        try {
          const response = await fetch(`/api/logcat-latest?filename=${currentFilename}&lines=20`); // Busca as últimas 20 linhas
          const data = await response.json();
          if (data.logs) {
            setLogs(data.logs);
          }
        } catch (error) {
          console.error('Erro ao buscar os últimos logs:', error);
        }
      }
    };
    let intervalId: ReturnType<typeof setInterval> | null = null;
    if (isCapturing) {
      intervalId = setInterval(fetchLatestLogs, 2000); // Busca logs a cada 2 segundos
    } else {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    }
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isCapturing, currentFilename]);

  return (
    (<div className="flex flex-col h-screen">
      <header className="flex items-center p-4 border-b gap-4">
        <div className="flex items-center gap-2">
          <MonitorIcon className="w-8 h-8" />
          <h1 className="text-lg font-bold">Android Tracker</h1>
        </div>
        <nav className="ml-auto flex items-center gap-4">
        <Button size="sm" onClick={toggleCapture} className={`text-white py-2 px-4 rounded ${isCapturing ? 'bg-red-500' : 'bg-gray-900'}`}>
          {isCapturing ? 'Stop' : 'Start'}
        </Button>
          <Button size="sm" variant="outline">
            Tools
          </Button>
          <Button size="sm" variant="outline">
            Settings
          </Button>
          <Button size="sm" variant="outline" onClick={downloadLog}> 
            <FiDownload className="h-4 w-4 mr-2" />
            Download Logs
          </Button>
        </nav>
      </header>
      <main className="flex flex-col flex-1 p-4 gap-4">
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Device</CardTitle>
              <CardDescription>Device information</CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Model</p>
                <p className="text-sm text-right model-info">{deviceName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Android Version</p>
                <p className="text-sm text-right">{buildVersion}</p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-800" />
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Serial number</p>
                <p className="text-sm text-right">HT6A3N5K</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">CPU architecture</p>
                <p className="text-sm text-right">ARMv8</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Temperature</CardTitle>
              <CardDescription>Real-time temperature</CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Temperature</p>
                <p className="text-sm text-right text-blue-500 font-semibold">
                  <ThermometerIcon className="h-4 w-4 inline-block -mt-1 mr-1" />
                  {temperature}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Temperature Average</p>
                <p className="text-sm text-right text-blue-500 font-semibold">
                  <ThermometerIcon className="h-4 w-4 inline-block -mt-1 mr-1" />
                  {averageTemperature}
                </p>
              </div>
                <div className="w-full"> 
                  {convertedData.length > 0 && (
                    <LineChart 
                      dataset={convertedData}
                      xAxis={[{
                        dataKey: 'x', 
                        valueFormatter: valueFormatter, 
                        label: 'Hour',
                      }]}
                      series={[
                        { 
                          curve: "linear", 
                          dataKey: 'y' ,
                          showMark: false, // remove points
                          label: 'Temperature', 
                        }
                      ]}
                      height={300}
                      yAxis={[{
                        label: 'Celsius',
                      }]}
                    />
                  )}
                </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Clock Speed</CardTitle>
              <CardDescription>Processor clock frequency</CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Clock Speed</p>
                <p className="text-sm text-right text-blue-500 font-semibold">
                  <ClockIcon className="h-4 w-4 inline-block -mt-1 mr-1" />
                  {clockSpeed} 
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Clock Speed Average</p>
                <p className="text-sm text-right text-blue-500 font-semibold">
                  <ClockIcon className="h-4 w-4 inline-block -mt-1 mr-1" />
                  {averageClockSpeed}
                </p>
              </div>
              <div className="w-full"> 
                  {convertedDataClock.length > 0 && (
                    <LineChart 
                      dataset={convertedDataClock}
                      xAxis={[{
                        dataKey: 'x', 
                        valueFormatter: valueFormatter, 
                        label: 'Hour',
                      }]}
                      series={[
                        { 
                          curve: "linear", 
                          dataKey: 'y' ,
                          showMark: false, // remove points
                          label: 'Clock', 
                        }
                      ]}
                      height={300}
                      yAxis={[{
                        label: 'Clock', 
                      }]}
                    />
                  )}
                </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Logs</CardTitle>
            <CardDescription>System logs</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <LogTable logs={logs} onDownload={downloadLog} /> 
          </CardContent>
        </Card>
      </main>
      <Card className="mx-4">
        <CardHeader className="flex flex-row">
          <div className="grid gap-1.5">
            <CardTitle>New Feature</CardTitle>
            <CardDescription>Showcase new features in the dashboard.</CardDescription>
          </div>
          <ActivityIcon className="ml-auto text-gray-500 w-8 h-8 dark:text-gray-400" />
        </CardHeader>
      </Card>
    </div>)
  );
}

function MonitorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  )
}

function ThermometerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
  )
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
