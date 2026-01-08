interface IFile {
  name: string;
  content?: string;
}

interface IDirectory {
  name: string;
  subdirectories?: IDirectory[];
  files: IFile[];
}

export type { IFile, IDirectory };
