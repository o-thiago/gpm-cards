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
        let
        in
        {
          pkgs,
          config,
          lib,
          ...
        }:
        let
          packageJson = builtins.fromJSON (builtins.readFile ./package.json);
          pname = packageJson.name;
          version = packageJson.version;
          buildInputs = with pkgs; [
            nodejs_20
          ];
          nativeBuildInputs = buildInputs;
          npmDepsHash = "sha256-LmqXK2d7ePMAiQ/G5UbdZ82i8CgpXpyo1JIm56HSlOk=";
        in
        {
          process-compose.development =
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
              config.process-compose."development".services.outputs.devShell
            ];
            packages =
              buildInputs
              ++ (with pkgs; [
                biome
                prefetch-npm-deps
              ]);
          };

          packages.default = pkgs.buildNpmPackage {
            inherit
              pname
              version
              buildInputs
              npmDepsHash
              nativeBuildInputs
              ;

            src = ./.;

            postInstall = ''
              mkdir -p $out/bin
              exe="$out/bin/${pname}"
              lib="$out/lib/node_modules/${pname}"
              cp -r ./.next $lib
              touch $exe
              chmod +x $exe
              echo "#!/usr/bin/env bash
                cd $lib
                ${pkgs.nodePackages_latest.nodejs}/bin/npm run start
              " > $exe
            '';
          };
        };
    };
}
