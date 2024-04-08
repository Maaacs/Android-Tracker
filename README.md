# Android Tracker


Android Tracker is an application designed for real-time monitoring of various metrics on Android devices. It provides a user-friendly interface that allows for the tracking of device temperature, processor clock speeds, and system logs. With dynamic charts and automatic data collection, Android Tracker is a tool for developers and enthusiasts seeking insights into their devices' performance.


<p align="center">
  <img alt="Spaceship with Hyper and One Dark" src="https://github.com/Maaacs/Android-Monitors/assets/56925726/72b58dc7-66eb-46fd-a852-3096798e1c75" width="980px">
</p>


## Features

- **Real-time Monitoring**: Track processor clock speeds and device temperature as they happen.
- **Dynamic Charts**: Analyze temperature and processor clock speed variations over time through interactive charts.

## TO-DO
- **System Logs Viewing**: Access system logs in real-time for comprehensive system analysis.
- **User-defined Data Collection Intervals**: Customize how often data is collected to suit your monitoring needs.

## Technologies Used

- **Next.js**: .
- **React**: 
- **Node.js**:
- **@mui/x-charts**

## Getting Started

### Prerequisites

- Ensure the Android Debug Bridge (ADB) is properly set up on your system and that your Android device is connected.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Maaacs/Android-Tracker
   cd Android-Tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the Project

To start the development server, execute:

```bash
npm run build
npm start
```

The application will then be accessible at `http://localhost:3000`.

## API Documentation
The Android Tracker offers several endpoints for accessing device metrics in real-time. Here is a quick overview:

- `GET /api/temperature`: Fetches the current temperature of the device.
- `GET /api/clock`: Retrieves the current processor clock speed.
- `GET /api/logcat`: Accesses the device's system logs.
- `GET /api/model`: Provides the model information of the Android device.


## Contributing

Any contributions you make are **greatly appreciated**.

If you have an idea that would improve the project, follow these steps to contribute:

1. **Fork the Project**: Create your own fork of the project. 

2. **Create a Branch**: For each new feature or improvement, create a new branch in your fork. Naming should be descriptive (e.g., `feature/add-new-chart-types`, `bugfix/temperature-data-accuracy`).

3. **Commit Your Changes**: Once your feature is completed, commit your changes to your branch. Make sure your commit messages clearly describe the changes.

4. **Push to the Branch**: Push your changes to your GitHub repository.

5. **Open a Pull Request**: Go to the original Android Tracker repository and open a pull request from your feature or bugfix branch. Provide a clear title and description of your changes. Link any related issues.

6. **Code Review**: Wait for the code review process. 

Please ensure your code adheres to the project's coding standards and guidelines, as detailed in the project's documentation.

## License

This project is under the MIT License - see the [LICENSE](LICENCE) file for details.


## Contact

- [Linkedin](https://www.linkedin.com/in/max-souza-4533b6196/)

- [Github](https://github.com/seu_usuario/projeto-monitoramentohttps://github.com/Maaacs)
