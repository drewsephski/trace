# Home Manager module for Trace
# Usage in flake-based Home Manager config:
#
#   inputs.trace.url = "github:EtienneLescot/trace";
#
#   { inputs, ... }: {
#     imports = [ inputs.trace.homeManagerModules.default ];
#     programs.trace.enable = true;
#   }
self:
{
  config,
  lib,
  pkgs,
  ...
}:

let
  cfg = config.programs.trace;
in
{
  options.programs.trace = {
    enable = lib.mkEnableOption "Trace screen recorder";

    package = lib.mkOption {
      type = lib.types.package;
      default = self.packages.${pkgs.stdenv.hostPlatform.system}.trace;
      defaultText = lib.literalExpression "inputs.trace.packages.\${pkgs.stdenv.hostPlatform.system}.trace";
      description = "The Trace package to use.";
    };
  };

  config = lib.mkIf cfg.enable {
    home.packages = [ cfg.package ];
  };
}
