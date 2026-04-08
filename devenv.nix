{ pkgs, devenv-root, ... }:
{
  devenv.root =
    let
      devenvRootFileContent = builtins.readFile devenv-root.outPath;
    in
    pkgs.lib.mkIf (devenvRootFileContent != "") devenvRootFileContent;

  packages = [
    pkgs.nodejs_22
    pkgs.just
  ];

  dotenv.disableHint = true;
}
