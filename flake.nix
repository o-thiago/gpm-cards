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
      imports = [ inputs.process-compose-flake.flakeModule ];

      perSystem =
        { pkgs, config, ... }:
        let
          packageJson = builtins.fromJSON (builtins.readFile ./package.json);
          pname = packageJson.name;
          version = packageJson.version;

          buildInputs = [ pkgs.nodejs_20 ];
          nativeBuildInputs = buildInputs;

          npmDepsHash = "sha256-bL+Jaz5ZGzOUkGz+xARGAfNWgWhJM3y5wpso7LlPFWs=";
        in
        {
          process-compose.development =
            { ... }:
            {
              imports = [ inputs.services-flake.processComposeModules.default ];

              settings.processes = {
                application.command = "npm install && npm run dev";
              };

              services.postgres."${pname}-db" = {
                enable = true;
                initialDatabases = [ { name = pname; } ];
                initialScript.after = ''
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
              nativeBuildInputs
              npmDepsHash
              ;

            src = ./.;
            npmBuildScript = "build";

            installPhase = ''
              mkdir -p $out/app
              cp -r .next/standalone/. $out/app/
            '';
          };

          packages.container = pkgs.dockerTools.buildLayeredImage {
            name = "${pname}-image";
            tag = "latest";

            contents = pkgs.buildEnv {
              name = "${pname}-env";
              paths = buildInputs ++ [
                config.packages.default
              ];
            };

            config = {
              Env = [ "NODE_ENV=production" ];
              WorkingDir = "/app";
              Cmd = [
                "node"
                "server.js"
              ];
              ExposedPorts = {
                "3000/tcp" = { };
              };
            };
          };
        };
    };
}
