// Program liturgic — șablon simplu.
// Datele sunt scrise de rută în „data.json”, în același director de compilare.
// Structura: { "<zi>": { "data": "<data>", "activitati": [{ "nume", "ora" }] } }

#set document(title: "Program liturgic")
#set page(paper: "a4", margin: 2cm)
#set text(size: 11pt, lang: "ro")

#let program = json("data.json")

#align(center)[
  #text(size: 22pt, weight: "bold")[Program liturgic]
]

#v(1em)

#for (zi, info) in program {
  let titlu = upper(zi.slice(0, 1)) + zi.slice(1)
  heading(level: 2)[#titlu — #info.data]
  for act in info.activitati {
    if act.ora == "" [
      - #act.nume
    ] else [
      - *#act.ora* — #act.nume
    ]
  }
}
