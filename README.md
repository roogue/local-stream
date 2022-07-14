# local-stream

A program that helps in local server streaming.

# Installation

Download desired compressed execution files from `Releases`. Extract the file after downloaded.

# Usage

1. Head to your stream folder or video contained folder.
2. Copy and paste the folder location to `dir` under `config.ini` file.
3. Run `local-stream.exe` .
4. Copy the local ip shown in the terminal.
5. Login to client.

# Config

```ini
[General]
; Default port (7237), do not change if you don't know what you are doing.
port = 7237

; Directory, change to your stream folder path, avoid changing to root directory
; If none was provided, the program will use the current working directory.
; Warning: Use double backslash (\\) or single slash (/) as directory separator to avoid unwanted error, Example: "C:\\User\\Path\\To\\Folder"
dir = ""
```

# Api

`/list` - show file list in the container. For more typings info [Click Me](https://github.com/roogue/local-stream/blob/main/src/struct/FileInfo.ts#L6)

`/file?dir={shortPath}` - Get access to the target video file. For more typings info [Click Me](https://github.com/roogue/local-stream/blob/main/src/struct/FileInfo.ts#L19)

`/video` - Video rendering endpoint.