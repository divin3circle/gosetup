#!/usr/bin/env bun

import { createCliRenderer, RGBA, TextAttributes } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { $ } from "bun";
import { createDirectoryStructure, Mode } from "./utils/utils";
import { RootDirectory } from "./utils/data";

enum Screen {
  Welcome,
  Username,
  Form,
  Success,
}

function App() {
  const [screen, setScreen] = useState(Screen.Welcome);
  const [projectName, setProjectName] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useKeyboard((key) => {
    if (screen === Screen.Welcome && key.name === "return") {
      setScreen(Screen.Username);
    }
  });

  useKeyboard((key) => {
    if (key.name === "escape") {
      switch (screen) {
        case Screen.Username:
          setScreen(Screen.Welcome);
          break;
        case Screen.Form:
          setScreen(Screen.Username);
          break;
      }
    }
  });

  const handleSubmit = async (value: string) => {
    if (!value.trim()) {
      setStatus("Project name is required.");
      return;
    }
    if (!githubUsername.trim()) {
      setStatus("GitHub username is required.");
      return;
    }

    setStatus("Creating project...");

    try {
      setLoading(true);
      const name = value.trim();

      const isCurrentDir = name === ".";

      let targetPath: string;
      let moduleName: string;

      if (isCurrentDir) {
        targetPath = ".";

        const cwd = process.cwd();
        moduleName = cwd.split("/").pop() || "app";
      } else {
        targetPath = name;
        moduleName = name;
        await $`mkdir -p ${targetPath}`;
      }

      await $`cd ${targetPath} && go mod init github.com/${githubUsername}/${moduleName}`;

      await createDirectoryStructure(RootDirectory, targetPath);

      await $`cd ${targetPath} && go mod tidy`;

      setLoading(false);

      if (isCurrentDir) {
        setStatus(
          `Project "${moduleName}" created successfully in current directory`
        );
      } else {
        setStatus(`Project "${name}" created successfully in ./${name}`);
      }

      setScreen(Screen.Success);
    } catch (error: any) {
      setLoading(false);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <box
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor={RGBA.fromHex(Mode.DARK)}
    >
      {screen === Screen.Welcome && (
        <box flexDirection="column" alignItems="center">
          <ascii-font
            font="tiny"
            text="Go Setup"
            color={RGBA.fromHex(Mode.LIGHT)}
          />
          <text
            attributes={TextAttributes.DIM | TextAttributes.BOLD}
            marginTop={1}
          >
            Welcome to Go Backend Setup.
          </text>
          <text attributes={TextAttributes.BOLD} marginTop={2} fg="#ff6e58">
            Press Enter to start
          </text>
        </box>
      )}

      {screen === Screen.Username && (
        <box flexDirection="column" alignItems="center" width={50}>
          <text
            attributes={TextAttributes.DIM | TextAttributes.BOLD}
            marginBottom={1}
          >
            Enter GitHub Username:
          </text>
          <input
            value={githubUsername}
            onChange={setGithubUsername}
            onSubmit={() => setScreen(Screen.Form)}
            placeholder="your-github-username"
            focused
            width="100%"
            backgroundColor={RGBA.fromHex("#020202")}
          />
          <text attributes={TextAttributes.DIM} marginTop={4}>
            [Esc to go back]
          </text>
        </box>
      )}

      {screen === Screen.Form && (
        <box flexDirection="column" alignItems="center" width={50}>
          <text attributes={TextAttributes.DIM} marginBottom={1}>
            Enter Project Name:
          </text>
          <input
            value={projectName}
            onChange={setProjectName}
            onSubmit={handleSubmit}
            placeholder="my-go-app"
            focused
            width="100%"
            backgroundColor={RGBA.fromHex("#020202")}
          />
          <text attributes={TextAttributes.DIM} marginTop={4}>
            [Esc to go back]
          </text>
        </box>
      )}

      {screen === Screen.Success && (
        <box flexDirection="column" alignItems="center">
          <ascii-font text="Success!" font="tiny" />
          <text marginTop={6} fg={RGBA.fromHex("#95f764")}>
            {status}
          </text>
          <text marginTop={2}>Press Ctrl+C to exit.</text>
        </box>
      )}
    </box>
  );
}

async function main() {
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
  });
  createRoot(renderer).render(<App />);
  renderer.start();
}

main().catch(console.error);
