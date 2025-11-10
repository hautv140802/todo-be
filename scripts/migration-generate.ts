import { execSync } from 'child_process';

const name = process.argv[2];
if (!name) {
  console.error(
    '❌ Missing migration name. Usage: yarn migration:generate <name>',
  );
  process.exit(1);
}

execSync(
  `npx typeorm-ts-node-commonjs migration:generate ./src/migrations/${name} -d ./src/data-source.ts`,
  { stdio: 'inherit' },
);
