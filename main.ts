const mozcEmojiTsvUrl =
  "https://raw.githubusercontent.com/google/mozc/master/src/data/emoji/emoji_data.tsv";

const res = await fetch(mozcEmojiTsvUrl);
const tsvData = (await res.text()).split("\n");
const result: Map<string, string> = new Map();

for (const line of tsvData) {
  if (line.startsWith("#")) continue;

  const items = line.split("\t").map((e) => e.trim());
  if (items.length !== 7) continue;

  for (const yomi of items[2].split(" ")) {
    const emojis = result.get(yomi) ?? "";
    result.set(yomi, `${emojis}/${items[1]}`);
  }
}

const license = Deno.readTextFileSync("./LICENSE").replaceAll(/^/gm, ";; ");

const jisyo = [...result.entries()]
  .map(([yomi, emoji]) => `${yomi} ${emoji}/`)
  .join("\n");

const template =
  `;; This dictionary is generated from emoji_data.tsv in google/mozc (https://github.com/google/mozc) repository.
;;
${license}
;; okuri-nasi entries.
${jisyo}
`;

Deno.writeTextFileSync("./skk-jisyo-emoji-ja.utf8", template);
