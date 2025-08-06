{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    nix-systems.url = "github:nix-systems/default";
  };

  outputs =
    {
      flake-parts,
      systems,
      ...
    }@inputs:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = import systems;
      perSystem =
        { pkgs, ... }:
        with pkgs;
        {
          devShells.default = mkShell {
            packages = [
              nodejs
            ];
          };
        };
    };
}
