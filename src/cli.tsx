import { Command } from 'commander';
import { runInit } from './commands/init.js';
import { runDashboard } from './commands/dashboard.js';
import { runCreate } from './commands/create.js';
import { runSet } from './commands/set.js';
import { runGet } from './commands/get.js';
import { runMake } from './commands/make.js';
import { indexExists } from './utils/paths.js';

const program = new Command();

program
  .name('specmatter')
  .description('Index and browse SPEC.md files from the terminal')
  .version('0.1.0');

program
  .command('init')
  .description('Index all *.SPEC.md files in the current directory')
  .action(runInit);

program
  .command('create <path>')
  .description('Create a template spec file at the given path')
  .action(runCreate);

program
  .command('index')
  .description('Re-index all *.SPEC.md files (update the index)')
  .action(runInit);

program
  .command('dashboard')
  .description('Open the spec dashboard')
  .action(runDashboard);

program.addHelpText('after', `
Spec file commands:
  <spec-path> get <key>                Get a frontmatter value
  <spec-path> set <key> <value>        Set a frontmatter value
  <spec-path> make [--key value ...]   Add frontmatter to a file
`);

program.action(async () => {
  if (indexExists(process.cwd())) {
    await runDashboard();
  } else {
    program.help();
  }
});

// Handle `specmatter <spec-path> set|get|make` patterns
const args = process.argv.slice(2);
if (args.length >= 4 && args[1] === 'set') {
  runSet(args[0], args[2], args[3]).catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
} else if (args.length >= 3 && args[1] === 'get') {
  runGet(args[0], args[2]).catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
} else if (args.length >= 2 && args[1] === 'make') {
  const specPath = args[0];
  const options: Record<string, string> = {};
  for (let i = 2; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    const value = args[i + 1];
    if (key && value !== undefined) {
      options[key] = value;
    }
  }
  runMake(specPath, options).catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
} else {
  program.parse();
}
