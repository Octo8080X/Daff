const text = `daff 1.0.0

USAGE:
  daff [OPTIONS] [SUBCOMMAND] [CLIENT TYPE] [FILE NAME] [LIMIT TIME]

OPTIONS:
  -h, --help        Print help information

SUBCOMMANDS:
  base          Generate file to be compared.
  diff          Do diff.
`;

export function help() {
  console.log(text);
}
