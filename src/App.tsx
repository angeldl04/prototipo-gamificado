import { useMemo, useState } from "react"

type Screen = "home" | "shop" | "results"
type Choice = "buy" | "wait" | "compare" | "skip"
type Category = "Todo" | "Moda" | "Tech" | "Accesorios"

type Product = {
  id: number
  name: string
  category: Exclude<Category, "Todo">
  price: number
  oldPrice: number
  image: string
  color: string
  tag: string
  reason: string
  need: number
}

const products: Product[] = [
  {
    id: 1,
    name: "Sneakers Cloud",
    category: "Moda",
    price: 54,
    oldPrice: 89,
    image:
      "https://images.unsplash.com/photo-1607861716497-e65ab29fc7ac?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900&h=900",
    color: "lime",
    tag: "−40% HOY",
    reason: "Tus sneakers aún funcionan, pero estas aparecen en todos tus reels.",
    need: 2,
  },
  {
    id: 2,
    name: "Buds Pop",
    category: "Tech",
    price: 38,
    oldPrice: 49,
    image:
      "https://images.unsplash.com/photo-1628705985369-0cfe01fcc22d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900&h=900",
    color: "orange",
    tag: "VIRAL",
    reason: "Ya tienes auriculares. Estos prometen hacer tu setup mucho más aesthetic.",
    need: 1,
  },
  {
    id: 3,
    name: "Gafas Solar ’00",
    category: "Accesorios",
    price: 24,
    oldPrice: 32,
    image:
      "https://images.unsplash.com/photo-1589278560486-22a9330c6bb8?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900&h=900",
    color: "violet",
    tag: "TREND ALERT",
    reason: "Tu grupo planea una escapada este finde y todos hablan del look perfecto.",
    need: 3,
  },
  {
    id: 4,
    name: "Hoodie Afterclass",
    category: "Moda",
    price: 46,
    oldPrice: 62,
    image:
      "https://images.unsplash.com/photo-1576188973526-0e5d7047b0cf?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900&h=900",
    color: "cream",
    tag: "ÚLTIMAS 3",
    reason: "Es cómodo y está rebajado. Tu armario tiene otros cuatro muy parecidos.",
    need: 2,
  },
  {
    id: 5,
    name: "Mini Speaker Go",
    category: "Tech",
    price: 31,
    oldPrice: 39,
    image:
      "https://images.unsplash.com/photo-1664648578369-81fce1ad428c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900&h=900",
    color: "orange",
    tag: "FLASH −20%",
    reason: "La oferta termina en 08:42. Sería útil... aunque solo la usarías alguna vez.",
    need: 4,
  },
  {
    id: 6,
    name: "Everyday Kit",
    category: "Accesorios",
    price: 19,
    oldPrice: 27,
    image:
      "https://images.unsplash.com/photo-1511556820780-d912e42b4980?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900&h=900",
    color: "violet",
    tag: "BUNDLE",
    reason: "El pack parece una ganga, aunque solo buscabas una funda nueva.",
    need: 3,
  },
]

const Icon = ({ name, size = 20 }: { name: string; size?: number }) => {
  const paths: Record<string, React.ReactNode> = {
    cart: <><circle cx="9" cy="20" r="1.5" /><circle cx="19" cy="20" r="1.5" /><path d="M3 4h2l2.4 11.1a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 1.9-1.4L22 8H7" /></>,
    bolt: <path d="m13 2-9 12h8l-1 8 9-12h-8l1-8Z" />,
    star: <path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5Z" />,
    wallet: <><path d="M4 6.5h14a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2h12v4" /><path d="M15 11h7v5h-7a2.5 2.5 0 0 1 0-5Z" /></>,
    arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 13v5M8 21h8M9 18h6" /></>,
    rotate: <><path d="M20 7v5h-5" /><path d="M18.5 16a8 8 0 1 1 .5-8l1 4" /></>,
    bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

type GameState = {
  budget: number
  points: number
  satisfaction: number
  inventory: Product[]
  rounds: number
  impulse: number
  waited: number
  compared: number
  skipped: number
  influences: Record<string, number>
}

const initialGame: GameState = {
  budget: 120,
  points: 0,
  satisfaction: 58,
  inventory: [],
  rounds: 0,
  impulse: 0,
  waited: 0,
  compared: 0,
  skipped: 0,
  influences: { Oferta: 0, Tendencia: 0, Social: 0 },
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home")
  const [game, setGame] = useState<GameState>(initialGame)
  const [category, setCategory] = useState<Category>("Todo")
  const [selected, setSelected] = useState<Product | null>(null)
  const [feedback, setFeedback] = useState<{ title: string; body: string; tone: string; points: number } | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [pulse, setPulse] = useState(false)

  const visibleProducts = useMemo(
    () => products.filter((p) => category === "Todo" || p.category === category),
    [category],
  )

  const reset = () => {
    setGame(initialGame)
    setSelected(null)
    setFeedback(null)
    setScreen("shop")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const choose = (choice: Choice) => {
    if (!selected) return
    const canBuy = game.budget >= selected.price
    const next = { ...game, influences: { ...game.influences }, rounds: game.rounds + 1 }
    let response = { title: "", body: "", tone: "lime", points: 0 }

    if (choice === "buy" && canBuy) {
      next.budget -= selected.price
      next.points += 80
      next.satisfaction = Math.min(100, next.satisfaction + 17)
      next.inventory = [...next.inventory, selected]
      next.impulse += 1
      next.influences[selected.tag.includes("%") || selected.tag.includes("FLASH") ? "Oferta" : selected.tag.includes("VIRAL") || selected.tag.includes("TREND") ? "Tendencia" : "Social"] += 1
      response = {
        title: "Subidón desbloqueado",
        body: `+17 de satisfacción ahora. Tu saldo baja ${selected.price} €. Veremos cuánto dura el efecto.`,
        tone: "orange",
        points: 80,
      }
      setPulse(true)
      window.setTimeout(() => setPulse(false), 650)
    } else if (choice === "wait") {
      next.points += 140
      next.satisfaction = Math.max(0, next.satisfaction - 3)
      next.waited += 1
      response = {
        title: "Pausa estratégica",
        body: "Has guardado el producto 24 h. La urgencia baja y tu presupuesto sigue intacto.",
        tone: "violet",
        points: 140,
      }
    } else if (choice === "compare") {
      next.points += 110
      next.satisfaction = Math.min(100, next.satisfaction + 3)
      next.compared += 1
      response = {
        title: "Radar de alternativas",
        body: `Encontraste una opción reacondicionada por ${Math.round(selected.price * 0.62)} €. No compras todavía.`,
        tone: "lime",
        points: 110,
      }
    } else {
      next.points += 100
      next.satisfaction = Math.max(0, next.satisfaction - 6)
      next.skipped += 1
      response = {
        title: "Scroll superado",
        body: "El FOMO pica un poco, pero acabas de conservar dinero para algo que sí te importe.",
        tone: "cream",
        points: 100,
      }
    }

    setGame(next)
    setSelected(null)
    setFeedback(response)
  }

  const continueGame = () => {
    setFeedback(null)
    if (game.rounds >= 4) {
      setScreen("results")
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const level = Math.min(5, 1 + Math.floor(game.points / 180))
  const spent = 120 - game.budget
  const profile =
    game.impulse >= 3
      ? { name: "Cazatendencias veloz", text: "Te mueve la emoción del momento. Tu superpoder pendiente: darle tiempo al deseo antes de decidir.", color: "orange" }
      : game.waited + game.compared >= 2
        ? { name: "Estratega del carrito", text: "Disfrutas comprar, pero sabes crear distancia. Comparar y esperar son tus mejores combos.", color: "lime" }
        : { name: "Minimalista flexible", text: "Sabes soltar productos sin perder la diversión. Eliges dónde poner tu atención y tu dinero.", color: "violet" }

  if (screen === "home") {
    return (
      <main className="home">
        <nav className="home-nav">
          <div className="brand"><span className="brand-mark"><Icon name="cart" size={19} /></span> CTRL+COMPRA</div>
          <div className="ods-pill">ODS 12 <span /> MODO JUEGO</div>
        </nav>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><Icon name="bolt" size={16} /> Experimento de consumo</div>
            <h1>¿DE VERDAD<br /><em>LO NECESITAS?</em></h1>
            <p className="hero-lead">Entra, llena el carrito y descubre quién toma realmente tus decisiones: tú, el algoritmo o ese <strong>−40%</strong>.</p>
            <button className="primary-button" onClick={reset}>
              EMPEZAR PARTIDA <span><Icon name="arrow" /></span>
            </button>
            <div className="game-meta">
              <div><Icon name="clock" /><span><b>4 min</b> por partida</span></div>
              <div><Icon name="wallet" /><span><b>120 €</b> de presupuesto</span></div>
              <div><Icon name="trophy" /><span><b>5</b> insignias</span></div>
            </div>
          </div>
          <div className="hero-visual" aria-label="Carrito lleno de productos atractivos">
            <div className="orbit orbit-one">−40%</div>
            <div className="orbit orbit-two">TRENDING</div>
            <div className="spark spark-one">✦</div>
            <div className="spark spark-two">✦</div>
            <div className="hero-product hero-product-one"><img src={products[1].image} alt="Auriculares inalámbricos" /></div>
            <div className="hero-product hero-product-two"><img src={products[2].image} alt="Gafas de tendencia" /></div>
            <div className="cart-art">
              <div className="cart-grid" />
              <div className="cart-handle" />
              <div className="wheel left" />
              <div className="wheel right" />
            </div>
            <div className="floating-card"><Icon name="heart" size={18} /><span>Satisfacción</span><b>+17</b></div>
          </div>
        </section>
        <div className="ticker">
          <div>COMPRA <span>✦</span> DUDA <span>✦</span> COMPARA <span>✦</span> DECIDE <span>✦</span> REPITE <span>✦</span> COMPRA <span>✦</span> DUDA <span>✦</span></div>
        </div>
      </main>
    )
  }

  if (screen === "results") {
    const topInfluence = Object.entries(game.influences).sort((a, b) => b[1] - a[1])[0]?.[0] || "Curiosidad"
    return (
      <main className="results-page">
        <nav className="game-nav dark">
          <div className="brand"><span className="brand-mark"><Icon name="cart" size={19} /></span> CTRL+COMPRA</div>
          <div className="level-pill">PARTIDA COMPLETADA</div>
        </nav>
        <section className="results-wrap">
          <div className="results-kicker"><Icon name="trophy" size={18} /> PERFIL DESBLOQUEADO</div>
          <div className={`profile-badge ${profile.color}`}><Icon name="star" size={34} /></div>
          <h1>{profile.name}</h1>
          <p className="profile-text">{profile.text}</p>
          <div className="score-strip">
            <div><span>PUNTOS</span><b>{game.points}</b></div>
            <div><span>NIVEL</span><b>{level}</b></div>
            <div><span>SALDO FINAL</span><b>{game.budget} €</b></div>
          </div>

          <div className="results-grid">
            <section className="result-card spending">
              <div className="card-heading"><span>Tu presupuesto</span><Icon name="wallet" /></div>
              <div className="donut" style={{ "--value": `${Math.min(100, (spent / 120) * 100)}%` } as React.CSSProperties}>
                <div><b>{spent} €</b><span>gastados</span></div>
              </div>
              <div className="legend"><span><i className="dot orange" /> Gastado {spent} €</span><span><i className="dot lime" /> Conservado {game.budget} €</span></div>
            </section>
            <section className="result-card stats">
              <div className="card-heading"><span>Tu partida en datos</span><Icon name="bolt" /></div>
              <div className="stat-row"><span>Compras impulsivas</span><b>{game.impulse}</b></div>
              <div className="stat-row"><span>Pausas de 24 horas</span><b>{game.waited}</b></div>
              <div className="stat-row"><span>Alternativas comparadas</span><b>{game.compared}</b></div>
              <div className="stat-row"><span>Productos ignorados</span><b>{game.skipped}</b></div>
            </section>
            <section className="result-card influence">
              <div className="card-heading"><span>Lo que más te movió</span><Icon name="heart" /></div>
              <strong>{topInfluence}</strong>
              <p>No es bueno ni malo: reconocerlo te da una elección extra la próxima vez.</p>
              <div className="influence-bars">
                {Object.entries(game.influences).map(([name, value]) => (
                  <div key={name}><span>{name}</span><i><b style={{ width: `${Math.max(10, value * 32)}%` }} /></i></div>
                ))}
              </div>
            </section>
          </div>
          <div className="reflection">
            <span>LA PREGUNTA BONUS</span>
            <h2>¿Qué compra habrías hecho distinto sin ver el descuento?</h2>
          </div>
          <button className="primary-button replay" onClick={reset}><Icon name="rotate" /> VOLVER A JUGAR</button>
        </section>
      </main>
    )
  }

  return (
    <main className="shop-page">
      <nav className="game-nav">
        <button className="brand brand-button" onClick={() => setScreen("home")}><span className="brand-mark"><Icon name="cart" size={19} /></span> CTRL+COMPRA</button>
        <div className="round-progress">
          <div className="round-label"><span>MISIÓN ACTIVA</span><b>{game.rounds}/4 decisiones</b></div>
          <div className="progress-track"><i style={{ width: `${game.rounds * 25}%` }} /></div>
        </div>
        <div className="nav-stats">
          <div><small>NIVEL {level}</small><b><Icon name="star" size={15} /> {game.points} XP</b></div>
          <button className={`cart-button ${pulse ? "pulse" : ""}`} onClick={() => setCartOpen(true)}><Icon name="cart" /><b>{game.inventory.length}</b></button>
        </div>
      </nav>

      <section className="shop-header">
        <div>
          <div className="live-tag"><i /> TIENDA EN VIVO</div>
          <h1>Elige tu <em>tentación.</em></h1>
          <p>Tienes 4 decisiones. No hay respuestas correctas, solo consecuencias.</p>
        </div>
        <div className="budget-card">
          <div className="budget-top"><span><Icon name="wallet" /> PRESUPUESTO</span><strong>{game.budget} €</strong></div>
          <div className="budget-track"><i style={{ width: `${(game.budget / 120) * 100}%` }} /></div>
          <small>{spent === 0 ? "Aún no has gastado nada" : `Has gastado ${spent} € de 120 €`}</small>
        </div>
      </section>

      <div className="mission-banner">
        <div className="mission-icon"><Icon name="trophy" /></div>
        <div><span>MISIÓN DE HOY</span><b>Termina la partida conservando al menos 40 €</b></div>
        <strong>{game.budget >= 40 ? "EN CURSO" : "EN RIESGO"}</strong>
      </div>

      <section className="catalog">
        <div className="catalog-tools">
          <div className="filters">
            {(["Todo", "Moda", "Tech", "Accesorios"] as Category[]).map((item) => (
              <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
          <div className="trend-note"><Icon name="bolt" size={16} /> 3 productos subiendo ahora</div>
        </div>
        <div className="product-grid">
          {visibleProducts.map((product) => {
            const owned = game.inventory.some((p) => p.id === product.id)
            return (
              <article className={`product-card ${product.color}`} key={product.id}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <span className="product-tag">{product.tag}</span>
                  {owned && <span className="owned"><Icon name="check" size={14} /> EN TU CARRITO</span>}
                </div>
                <div className="product-info">
                  <small>{product.category}</small>
                  <h2>{product.name}</h2>
                  <div className="price"><b>{product.price} €</b><s>{product.oldPrice} €</s></div>
                  <button disabled={owned || game.rounds >= 4} onClick={() => setSelected(product)}>
                    {owned ? "YA ES TUYO" : game.rounds >= 4 ? "PARTIDA COMPLETA" : "QUIERO ESTO"} <Icon name="arrow" size={17} />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {selected && (
        <div className="modal-backdrop" onMouseDown={() => setSelected(null)}>
          <section className="dilemma-modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="Cerrar"><Icon name="close" /></button>
            <div className="dilemma-image">
              <img src={selected.image} alt={selected.name} />
              <span>DECISIÓN {game.rounds + 1} DE 4</span>
            </div>
            <div className="dilemma-content">
              <div className="dilemma-label"><Icon name="bolt" size={16} /> MOMENTO DE DECIDIR</div>
              <h2>Lo quieres.<br />Pero, ¿lo necesitas?</h2>
              <p>{selected.reason}</p>
              <div className="urgency"><Icon name="clock" /><span>La oferta “termina pronto”</span><b>08:42</b></div>
              <div className="choices">
                <button className="choice buy" disabled={game.budget < selected.price} onClick={() => choose("buy")}>
                  <span><Icon name="bag" /></span><div><b>COMPRAR AHORA</b><small>{game.budget < selected.price ? "No tienes saldo suficiente" : `−${selected.price} € · satisfacción instantánea`}</small></div><Icon name="arrow" />
                </button>
                <button className="choice" onClick={() => choose("wait")}><span><Icon name="clock" /></span><div><b>ESPERAR 24 HORAS</b><small>Guárdalo y vuelve con la cabeza fría</small></div><Icon name="arrow" /></button>
                <button className="choice" onClick={() => choose("compare")}><span><Icon name="search" /></span><div><b>COMPARAR OPCIONES</b><small>Busca segunda mano o una alternativa</small></div><Icon name="arrow" /></button>
                <button className="choice skip" onClick={() => choose("skip")}><span><Icon name="close" /></span><div><b>NO COMPRAR</b><small>Sigue explorando sin llevártelo</small></div><Icon name="arrow" /></button>
              </div>
            </div>
          </section>
        </div>
      )}

      {feedback && (
        <div className="modal-backdrop">
          <section className={`feedback-modal ${feedback.tone}`}>
            <div className="feedback-burst"><Icon name={feedback.tone === "orange" ? "bolt" : "check"} size={42} /></div>
            <span>CONSECUENCIA INMEDIATA</span>
            <h2>{feedback.title}</h2>
            <p>{feedback.body}</p>
            <div className="feedback-stats">
              <div><small>SALDO</small><b>{game.budget} €</b></div>
              <div><small>PUNTOS</small><b>+{feedback.points}</b></div>
              <div><small>ÁNIMO</small><b>{game.satisfaction}%</b></div>
            </div>
            <button className="primary-button" onClick={continueGame}>{game.rounds >= 4 ? "VER MI PERFIL" : "SEGUIR JUGANDO"} <Icon name="arrow" /></button>
          </section>
        </div>
      )}

      {cartOpen && (
        <div className="cart-drawer-wrap" onMouseDown={() => setCartOpen(false)}>
          <aside className="cart-drawer" onMouseDown={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setCartOpen(false)} aria-label="Cerrar"><Icon name="close" /></button>
            <span className="drawer-label">INVENTARIO</span>
            <h2>Tu carrito habla.</h2>
            <p>{game.inventory.length ? "Esto es lo que tus decisiones han sumado hasta ahora." : "Todavía está vacío. ¿Paz mental o solo calentando?"}</p>
            <div className="inventory-list">
              {game.inventory.map((product) => (
                <div key={product.id}><img src={product.image} alt="" /><span><b>{product.name}</b><small>{product.category}</small></span><strong>{product.price} €</strong></div>
              ))}
            </div>
            <div className="drawer-total"><span>TOTAL GASTADO</span><b>{spent} €</b></div>
          </aside>
        </div>
      )}
    </main>
  )
}
