import { $ } from "bun";
import type { IDirectory } from "./types";

export enum Mode {
  LIGHT = "#fef7f7",
  DARK = "#020202",
}

export async function createDirectoryStructure(
  directory: IDirectory,
  basePath: string
): Promise<void> {
  const currentPath =
    directory.name === "." ? basePath : `${basePath}/${directory.name}`;

  if (directory.name !== ".") {
    await $`mkdir -p ${currentPath}`;
  }

  if (directory.files && directory.files.length > 0) {
    for (const file of directory.files) {
      const filePath = `${currentPath}/${file.name}`;
      await Bun.write(filePath, file.content ?? "");
    }
  }

  if (directory.subdirectories && directory.subdirectories.length > 0) {
    for (const subdir of directory.subdirectories) {
      await createDirectoryStructure(subdir, currentPath);
    }
  }
}
