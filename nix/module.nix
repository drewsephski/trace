# NixOS module for Trace
# Usage in flake-based NixOS config:
#
#   inputs.trace.url = "github:EtienneLescot/trace";
#
#   { inputs, ... }: {
#     imports = [ inputs.trace.nixosModules.default ];
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
    environment.systemPackages = [ cfg.package ];

    # Screen capture on Wayland requires xdg-desktop-portal.
    # We enable the base portal; users should also enable a
    # desktop-specific portal (e.g. xdg-desktop-portal-gtk,
    # xdg-desktop-portal-hyprland) in their DE config.
    xdg.portal.enable = lib.mkDefault true;
  };
}
