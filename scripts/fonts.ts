// Converts the static TTF fonts to WOFF2.
// Run with `bun run fonts` after adding or replacing a font in static/fonts.
import { readdir } from 'node:fs/promises';
import { compress } from 'wawoff2';

const FONT_DIR = `${import.meta.dir}/../static/fonts`;

const files = (await readdir(FONT_DIR)).filter((f) => f.endsWith('.ttf'));

for (const file of files) {
	const ttf = await Bun.file(`${FONT_DIR}/${file}`).arrayBuffer();
	const woff2 = await compress(new Uint8Array(ttf));
	const out = file.replace(/\.ttf$/, '.woff2');
	await Bun.write(`${FONT_DIR}/${out}`, woff2);

	const ratio = (100 * (1 - woff2.byteLength / ttf.byteLength)).toFixed(1);
	console.log(
		`${file} → ${out}  ${(ttf.byteLength / 1024).toFixed(0)}KB → ${(woff2.byteLength / 1024).toFixed(0)}KB (-${ratio}%)`
	);
}
