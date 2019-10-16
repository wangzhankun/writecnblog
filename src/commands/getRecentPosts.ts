import * as vscode from 'vscode';
import { blogOperate } from '../blog/blog-operate';
import { blogFile } from '../blog/blog-file';
import { blogPostProvider } from '../blog/blog-post-provider';

export function getRecentPostsActivate(context: vscode.ExtensionContext) {

    let getRecentPostsDisposable = vscode.commands.registerCommand('writeCnblog.getRecentPosts',
        () => {
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Window,
                title: "获取最近文章!",
                cancellable: true
            }, async (progress, token) => {
                token.onCancellationRequested(() => {
                    console.log("User canceled the long running operation");
                });

                progress.report({ increment: 0 });
                progress.report({ increment: 10, message: "下载文章内容..." });
                let posts = await blogOperate.getRecentPosts(100);
                progress.report({ increment: 40, message: "下载图片和写入文章..." });
                await blogFile.pullPosts(posts);
                progress.report({ increment: 50, message: "下载完成" });

                var p = new Promise(resolve => {
                    blogPostProvider.refresh();
                    resolve();
                });

                return p;
            }).then(r => {
                vscode.window.showInformationMessage("下载文章完成！");
            });

        });

    context.subscriptions.push(getRecentPostsDisposable);
}
