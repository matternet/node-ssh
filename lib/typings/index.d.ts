/// <reference types="node" />
/// <reference types="node" />
import { Client, ConnectConfig, ClientChannel, SFTPWrapper, ExecOptions } from 'ssh2';
import { Prompt, TransferOptions } from 'ssh2-streams';
type Config = ConnectConfig & {
    password?: string;
    privateKey?: string;
    publicKey?: string;
    tryKeyboard?: boolean;
    onKeyboardInteractive?: (name: string, instructions: string, lang: string, prompts: Prompt[], finish: (responses: string[]) => void) => void;
};
interface SSHExecCommandOptions {
    cwd?: string;
    stdin?: string;
    execOptions?: ExecOptions;
    encoding?: BufferEncoding;
    onChannel?: (clientChannel: ClientChannel) => void;
    onStdout?: (chunk: Buffer) => void;
    onStderr?: (chunk: Buffer) => void;
}
interface SSHExecCommandResponse {
    stdout: string;
    stderr: string;
    code: number | null;
    signal: string | null;
}
interface SSHExecOptions extends SSHExecCommandOptions {
    stream?: 'stdout' | 'stderr' | 'both';
}
interface SSHPutFilesOptions {
    sftp?: SFTPWrapper | null;
    concurrency?: number;
    transferOptions?: TransferOptions;
}
interface SSHGetPutDirectoryOptions extends SSHPutFilesOptions {
    tick?: (localFile: string, remoteFile: string, error: Error | null) => void;
    validate?: (path: string) => boolean;
    recursive?: boolean;
}
type SSHMkdirMethod = 'sftp' | 'exec';
declare class NodeSSH {
    connection: Client | null;
    private getConnection;
    connect(givenConfig: Config): Promise<this>;
    isConnected(): boolean;
    requestShell(): Promise<ClientChannel>;
    withShell(callback: (channel: ClientChannel) => Promise<void>): Promise<void>;
    requestSFTP(): Promise<SFTPWrapper>;
    withSFTP(callback: (sftp: SFTPWrapper) => Promise<void>): Promise<void>;
    execCommand(givenCommand: string, options?: SSHExecCommandOptions): Promise<SSHExecCommandResponse>;
    exec(command: string, parameters: string[], options?: SSHExecOptions & {
        stream?: 'stdout' | 'stderr';
    }): Promise<string>;
    exec(command: string, parameters: string[], options?: SSHExecOptions & {
        stream: 'both';
    }): Promise<SSHExecCommandResponse>;
    mkdir(path: string, method?: SSHMkdirMethod, givenSftp?: SFTPWrapper | null): Promise<void>;
    getFile(localFile: string, remoteFile: string, givenSftp?: SFTPWrapper | null, transferOptions?: TransferOptions | null): Promise<void>;
    putFile(localFile: string, remoteFile: string, givenSftp?: SFTPWrapper | null, transferOptions?: TransferOptions | null): Promise<void>;
    putFiles(files: {
        local: string;
        remote: string;
    }[], { concurrency, sftp: givenSftp, transferOptions }?: SSHPutFilesOptions): Promise<void>;
    putDirectory(localDirectory: string, remoteDirectory: string, { concurrency, sftp: givenSftp, transferOptions, recursive, tick, validate, }?: SSHGetPutDirectoryOptions): Promise<boolean>;
    getDirectory(localDirectory: string, remoteDirectory: string, { concurrency, sftp: givenSftp, transferOptions, recursive, tick, validate, }?: SSHGetPutDirectoryOptions): Promise<boolean>;
    dispose(): void;
}
export = NodeSSH;
