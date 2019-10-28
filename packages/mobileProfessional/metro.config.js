const blacklist = require("metro-config/src/defaults/blacklist");
const getWorkspaces = require("get-yarn-workspaces");
const path = require("path");

function getConfig(from, options = {}) {
  const workspaces = getWorkspaces(from);

  function getProjectRoots() {
    return workspaces.concat([
      options.nodeModules || path.resolve(from, "..", "..", "node_modules"),
      path.join(__dirname, 'node_modules')
    ]);
  }

  const config = {
    watchFolders: getProjectRoots(),
    resolver: {
      blacklistRE: blacklist(
        workspaces.map(
          workspacePath =>
            `/${workspacePath.replace(
              /\//g,
              '[/\\\\]'
            )}[/\\\\]node_modules[/\\\\]react-native[/\\\\].*/`
        )
      ),
      extraNodeModules: {
        "@babel/runtime": path.resolve(from, "node_modules/@babel/runtime"),
        "react-native": path.resolve(from, "node_modules/react-native")
      }
    }
  };
  return config;
};

module.exports = getConfig(__dirname);
