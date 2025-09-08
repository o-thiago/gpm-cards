{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/default";
    flake-parts.url = "github:hercules-ci/flake-parts";
    process-compose-flake.url = "github:Platonic-Systems/process-compose-flake";
    services-flake.url = "github:juspay/services-flake";
  };

  outputs =
    inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      systems = import inputs.systems;
      imports = [
        inputs.process-compose-flake.flakeModule
      ];
      perSystem =
        {
          pkgs,
          config,
          ...
        }:
        {
          process-compose."default" =
            { ... }:
            {
              imports = [
                inputs.services-flake.processComposeModules.default
              ];

              settings.processes = {
                application.command = "npm install && npm run dev";
              };

              services.postgres."gpm-cards-db" = {
                enable = true;
                port = 5433;
                initialDatabases = [ { name = "gpm-cards"; } ];
                initialScript.after = # sql
                  ''
                    CREATE ROLE postgres WITH SUPERUSER LOGIN PASSWORD 'postgres';
                  '';
              };
            };

          devShells.default = pkgs.mkShell {
            inputsFrom = [
              config.process-compose."default".services.outputs.devShell
            ];
            packages = [
              pkgs.nodejs
              pkgs.biome
            ];
          };
        };
    };
}
