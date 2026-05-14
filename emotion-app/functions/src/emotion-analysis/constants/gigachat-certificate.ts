import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const GIGACHAT_CA_CERTIFICATE_PATH = join(
  process.cwd(),
  'certs',
  'russian_trusted_root_ca.cer',
);

export const GIGACHAT_CA_CERTIFICATE = readFileSync(
  GIGACHAT_CA_CERTIFICATE_PATH,
);
