# UniRepo

UniRepo is a flexible repository management system that supports multiple repository types and access control mechanisms. It provides a unified interface for managing different types of repositories, including JetBrains plugins, Maven artifacts, and more.

## Features

- **Multiple Repository Types**:
  - JetBrains Plugin Repository
  - Maven Repository
  - Maven Proxy Repository
  - Tile Proxy Repository
  - Group Repository (combining multiple repositories)

- **Flexible Access Control**:
  - Public access
  - Token-based authentication
  - Basic authentication
  - Anonymous read access
  - JetBrains Hub integration

- **Storage Options**:
  - Directory-based storage
  - Extensible storage system

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure your PostgreSQL database and set the `DATABASE_URL` environment variable
4. Start the server:
   ```
   npm start
   ```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `DATABASE_URL`: PostgreSQL connection string
- `VERBOSE`: Set to any value to enable debug logging

## API

The server provides a RESTful API for interacting with repositories:

- `GET /repo/{repository-name}/{path}`: Retrieve a file from the repository
- `POST /repo/{repository-name}/{path}`: Upload a file to the repository
- `DELETE /repo/{repository-name}/{path}`: Delete a file from the repository

For JetBrains Plugin repositories, a special endpoint is available:
- `GET /repo/{repository-name}/updatePlugins.xml`: Get the plugin repository XML file
- `POST /repo/{repository-name}/updatePlugins.xml`: Update the plugin repository XML file

## Database Schema

The system uses PostgreSQL with the following tables:

- `repositories`: Stores repository configurations
- `access_tokens`: Manages access tokens for repositories
- `packages`: Stores package metadata for repositories

## License

MIT License
