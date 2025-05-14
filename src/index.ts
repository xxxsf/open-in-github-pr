import {
	StatusBarAlignment,
	Disposable,
	window,
	commands,
	env,
	Uri,
	workspace,
	extensions,
} from "vscode";

/**
 * 插件被激活时触发，所有代码总入口
 * @param {*} context 插件上下文
 */
export function activate(context: { subscriptions: Disposable[] }) {
	context.subscriptions.push(
		commands.registerCommand("openInGitHubPRIcon.openProject", () => {
			if (!workspace.workspaceFolders) {
				window.showInformationMessage("Open a folder/workspace first");
				return;
			} else {
				const gitExtension = extensions.getExtension('vscode.git')?.exports;
				const api = gitExtension?.getAPI(1);
				
				if(api.repositories) {
					const repo = api.repositories[0];
					
					const {fetchUrl} = repo.state.remotes[0];
					let url = ''
					if(fetchUrl.indexOf('github.com') > -1) {
						// e.g. https://github.com/xxx.git 
						url = fetchUrl.split('.git')[0].split('https://')[1];
					} else {
						// e.g. git@github.xxx.com:xxx/example.git
						url = fetchUrl.split('@')[1].replace(':', '/').split('.git')[0];
					}
					env.openExternal(Uri.parse(`https://${url}/compare`));

				} else {
					window.showInformationMessage("Cannot get the git info.");
				}
			}
		})
	);

	const statusBar = window.createStatusBarItem(StatusBarAlignment.Left, 0);
	statusBar.command = "openInGitHubPRIcon.openProject";
	statusBar.text = "$(github)";
	statusBar.tooltip = "Open in GitHub PR";
	statusBar.show();
}

/**
 * 插件被释放时触发
 */
export function deactivate() {}
