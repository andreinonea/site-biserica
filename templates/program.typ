// Program liturgic — șablon PDF (design „Foișorul Mavrocordaților”).
//
// Datele sunt scrise de rută în „data.json”, în directorul de compilare.
// Structura: { "<zi>": { "data": "<text>", "activitati": [{ "nume", "ora" }] } }
//
// Fonturi (bundle în „fonts/”, OFL): Cinzel (titlu), Cormorant SC (rest).
// Compilare: typst compile --font-path fonts program.typ program.pdf

// ─── Paletă ──────────────────────────────────────────────────────────────
#let gold = rgb("#d4ac20") // fundal de rezervă, dacă lipsește textura
#let ink = rgb("#3b2a12") // maro espresso pentru text

// ─── Date ────────────────────────────────────────────────────────────────
#let program = json("data.json")
#let zile = program.pairs()

// Titlu-case sigur pe UTF-8 (diacritice): prima grupă grafemică → majusculă.
#let title-case(s) = {
  let cl = s.clusters()
  if cl.len() == 0 { return s }
  upper(cl.first()) + cl.slice(1).join()
}

// Oră normalizată la HH:MM („8:00” → „08:00”, gol → gol).
#let fmt-time(t) = {
  if t == none or t == "" { return "" }
  let p = t.split(":")
  let h = p.at(0)
  if h.len() == 1 { h = "0" + h }
  h + ":" + p.at(1, default: "00")
}

// Interval săptămânal pentru subtitlu (prima – ultima zi).
#let subtitle = if zile.len() > 0 {
  "Săptămâna " + zile.first().at(1).data + " – " + zile.last().at(1).data
} else { "Săptămâna" }

// ─── Pagină ──────────────────────────────────────────────────────────────
#set page(
  width: 148mm,
  height: 210mm,
  margin: (x: 16mm, top: 13mm, bottom: 18mm),
  fill: gold,
  background: {
    // Textura aurie pe toată pagina.
    place(top + left, image(
      "fundal.png",
      width: 148mm,
      height: 210mm,
      fit: "cover",
    ))
    // Stema estompată, filigran central.
    // place(center + horizon, image("logo-fundal.png", width: 96mm))
    // Chenare ornamentale pe margini (dreapta = oglindit).
    // place(left + horizon, image("margine.png", height: 190mm))
    // place(right + horizon, scale(x: -100%, reflow: false, image(
    //   "margine.png",
    //   height: 190mm,
    // )))
  },
  footer: align(center)[
    #set par(leading: 0.35em)
    #image("linie-footer.png", height: 2.5mm)
    #v(1mm)
    #text(font: "Cormorant SC", size: 8pt, fill: ink, tracking: 1pt)[biserica]
    #linebreak()
    #text(
      font: "Cormorant SC",
      weight: "bold",
      size: 10.5pt,
      fill: ink,
      tracking: 2pt,
    )[FOIȘORUL]
    #linebreak()
    #text(
      font: "Cormorant SC",
      weight: "bold",
      size: 10.5pt,
      fill: ink,
      tracking: 2pt,
    )[MAVROCORDAȚILOR]
  ],
  footer-descent: 4mm,
)

#set text(fill: ink, lang: "ro")
#set par(leading: 0.5em, spacing: 0.5em)

// ─── Antet ───────────────────────────────────────────────────────────────
#align(center)[
  #image("logo-header.png", height: 9mm)
  #v(2mm)
  #text(font: "Cinzel", size: 27pt, tracking: 2pt)[Program]
  #v(0.5mm)
  #text(font: "Cormorant SC", size: 14pt, tracking: 1.5pt)[#subtitle]
]

#v(4mm)

// ─── Un bloc pentru fiecare zi ───────────────────────────────────────────
#let day-block(name, date, acts) = {
  grid(
    columns: (auto, 1fr),
    column-gutter: 12pt,
    align: top,
    // Coloana stângă: numele zilei + data (interlinie strânsă).
    {
      set par(leading: 0.35em)
      text(
        font: "Cormorant SC",
        weight: "bold",
        size: 14pt,
        tracking: 0.5pt,
      )[#name]
      linebreak()
      text(font: "Cormorant SC", size: 11pt)[#date]
    },
    // Coloana dreaptă: activitățile, aliniate la dreapta, cu ora în capăt.
    {
      set par(leading: 0.4em)
      grid(
        columns: (1fr, auto),
        column-gutter: 10pt,
        row-gutter: 2.5pt,
        ..acts
          .map(a => (
            align(right, text(
              font: "Cormorant SC",
              weight: "bold",
              size: 10.5pt,
            )[#a.nume]),
            align(right, text(
              font: "Cormorant SC",
              weight: "bold",
              size: 10.5pt,
            )[#fmt-time(a.ora)]),
          ))
          .flatten(),
      )
    },
  )
  v(2pt)
  image("despartitor.png", width: 100%)
  v(3pt)
}

#for (zi, info) in program {
  day-block(title-case(zi), info.data, info.activitati)
}
