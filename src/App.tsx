import { useEffect, useMemo, useState } from "react"
import type { CSSProperties } from "react"
import { Icon } from "./components/Icon"
import { initialGame, products, INITIAL_BUDGET, MISSION_MINIMUM } from "./game-model"
import type { Screen, Choice, Category, Product, GameState } from "./game-model"

export default function App() {
  const [screen, setScreen] = useState<Screen>("home")
  const [game, setGame] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem("ctrlcompra-game-v4")
      if (saved) {
        const parsed = JSON.parse(saved) as GameState
        if (typeof parsed.budget === "number" && typeof parsed.rounds === "number" && parsed.rounds >= 0 && parsed.rounds <= 4) {
          return { ...initialGame, ...parsed, influences: { ...initialGame.influences, ...parsed.influences }, decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [] }
        }
      }
    } catch { /* Si el almacenamiento está bloqueado, la partida sigue funcionando en memoria. */ }
    return initialGame
  })
  const [category, setCategory] = useState<Category>("Todo")
  const [selected, setSelected] = useState<Product | null>(null)
  const [feedback, setFeedback] = useState<{ title: string; body: string; tone: string; points: number } | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [pulse, setPulse] = useState(false)
  const [selectedInfluence, setSelectedInfluence] = useState("")
  const [secondsLeft, setSecondsLeft] = useState(522)
  const formatCOP = (amount: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(amount)

  useEffect(() => {
    try { localStorage.setItem("ctrlcompra-game-v4", JSON.stringify(game)) } catch { /* Persistencia opcional */ }
  }, [game])

  useEffect(() => {
    if (!selected) return
    setSecondsLeft(522)
    const timer = window.setInterval(() => setSecondsLeft((seconds) => {
      if (seconds <= 1) {
        window.clearInterval(timer)
        return 0
      }
      return seconds - 1
    }), 1000)
    return () => window.clearInterval(timer)
  }, [selected?.id])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (selected) setSelected(null)
        else if (cartOpen) setCartOpen(false)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [selected, cartOpen])

  const visibleProducts = useMemo(
    () => products.filter((p) => category === "Todo" || p.category === category),
    [category],
  )

  const reset = () => {
    setGame(initialGame)
    try { localStorage.removeItem("ctrlcompra-game-v4") } catch { /* Sin almacenamiento, se reinicia en memoria. */ }
    setSelectedInfluence("")
    setSelected(null)
    setFeedback(null)
    setScreen("shop")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const choose = (choice: Choice) => {
    if (!selected || !selectedInfluence) return
    const canBuy = game.budget >= selected.price
    const next = { ...game, influences: { ...game.influences }, decisions: [...game.decisions], rounds: game.rounds + 1 }
    next.influences[selectedInfluence] = (next.influences[selectedInfluence] ?? 0) + 1
    next.decisions.push({ productId: selected.id, productName: selected.name, choice, influence: selectedInfluence, price: selected.price })
    let response = { title: "", body: "", tone: "lime", points: 0 }

    if (choice === "buy" && canBuy) {
      next.budget -= selected.price
      next.points += 100
      next.satisfaction = Math.min(100, next.satisfaction + 8)
      next.inventory = [...next.inventory, selected]
      next.purchases += 1
      response = {
        title: "Subidón desbloqueado",
        body: `La compra puede dar satisfacción inmediata (+8). Tu saldo baja ${formatCOP(selected.price)}. Después podrás valorar si la compra respondía a una necesidad.`,
        tone: "orange",
        points: 100,
      }
      setPulse(true)
      window.setTimeout(() => setPulse(false), 650)
    } else if (choice === "wait") {
      next.points += 100
      next.satisfaction = Math.min(100, next.satisfaction + 3)
      next.waited += 1
      response = {
        title: "Pausa estratégica",
        body: "Has simulado una pausa de 24 horas. En una compra real, podrías volver a valorar si todavía lo necesitas; tu presupuesto sigue intacto.",
        tone: "violet",
        points: 100,
      }
    } else if (choice === "compare") {
      next.points += 100
      next.satisfaction = Math.min(100, next.satisfaction + 4)
      next.compared += 1
      response = {
        title: "Radar de alternativas",
        body: `Alternativa simulada: ${selected.alternativeName}, por ${formatCOP(selected.alternativePrice)}. Ahorrarías ${formatCOP(selected.price - selected.alternativePrice)} frente al producto original. No compras todavía.`,
        tone: "lime",
        points: 100,
      }
    } else {
      next.points += 100
      next.satisfaction = Math.min(100, next.satisfaction + 3)
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
  const spent = INITIAL_BUDGET - game.budget
  const profile =
    game.purchases >= 3
      ? { name: "Comprador frecuente", text: "Realizaste varias compras en esta partida. Antes de la próxima, puede ayudarte separar lo que necesitas de lo que te apetece.", color: "orange" }
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
            <button className="primary-button" onClick={() => {
              if (game.rounds > 0) {
                setScreen(game.rounds >= 4 ? "results" : "shop")
                window.scrollTo({ top: 0, behavior: "smooth" })
              } else reset()
            }}>
              {game.rounds > 0 ? (game.rounds >= 4 ? "VER MIS RESULTADOS" : "CONTINUAR PARTIDA") : "EMPEZAR PARTIDA"} <span><Icon name="arrow" /></span>
            </button>
            {game.rounds > 0 && <button className="restart-link" onClick={reset}>Empezar una partida nueva</button>}
            <div className="game-meta">
              <div><Icon name="clock" /><span><b>4</b> decisiones por partida</span></div>
              <div><Icon name="wallet" /><span><b>{formatCOP(INITIAL_BUDGET)}</b> de presupuesto</span></div>
              <div><Icon name="trophy" /><span><b>5</b> insignias</span></div>
            </div>
          </div>
          <div className="hero-visual" aria-label="Carrito lleno de productos atractivos">
            <div className="orbit orbit-one">−40%</div>
            <div className="orbit orbit-two">TRENDING</div>
            <div className="spark spark-one">✦</div>
            <div className="spark spark-two">✦</div>
            <div className="hero-product hero-product-one"><img src={products[1].image} alt="Auriculares inalámbricos" onError={(event) => { event.currentTarget.style.display = "none" }} /></div>
            <div className="hero-product hero-product-two"><img src={products[2].image} alt="Gafas de tendencia" onError={(event) => { event.currentTarget.style.display = "none" }} /></div>
            <div className="cart-art">
              <div className="cart-grid" />
              <div className="cart-handle" />
              <div className="wheel left" />
              <div className="wheel right" />
            </div>
            <div className="floating-card"><Icon name="heart" size={18} /><span>Satisfacción</span><b>+8</b></div>
          </div>
        </section>
        <div className="ticker">
          <div>COMPRA <span>✦</span> DUDA <span>✦</span> COMPARA <span>✦</span> DECIDE <span>✦</span> REPITE <span>✦</span> COMPRA <span>✦</span> DUDA <span>✦</span></div>
        </div>
      </main>
    )
  }

  if (screen === "results") {
    const influenceEntries = Object.entries(game.influences).filter(([, value]) => value > 0).sort((a, b) => b[1] - a[1])
    const topInfluence = influenceEntries.length ? influenceEntries[0][0] : "Sin datos suficientes"
    const choiceLabels: Record<Choice, string> = { buy: "Comprar ahora", wait: "Simular pausa de 24 h", compare: "Comparar opciones", skip: "No comprar" }
    const badges = [
      { name: "Pausa consciente", description: "Esperaste antes de decidir", unlocked: game.waited >= 1 },
      { name: "Radar de opciones", description: "Comparaste una alternativa", unlocked: game.compared >= 1 },
      { name: "Presupuesto protegido", description: `Terminaste con al menos ${formatCOP(MISSION_MINIMUM)}`, unlocked: game.budget >= MISSION_MINIMUM },
      { name: "Decisión reflexiva", description: "Tomaste 2 o más decisiones reflexivas: esperar, comparar o no comprar", unlocked: game.waited + game.compared + game.skipped >= 2 },
      { name: "Carrito consciente", description: "Terminaste sin comprar productos", unlocked: game.purchases === 0 },
    ]
    return (
      <main className="results-page">
        <nav className="game-nav dark">
          <div className="brand"><span className="brand-mark"><Icon name="cart" size={19} /></span> CTRL+COMPRA</div>
          <div className="level-pill">PARTIDA COMPLETADA</div>
        </nav>
        <section className="results-wrap">
          <div className="results-kicker"><Icon name="trophy" size={18} /> RESUMEN DE TU PARTIDA</div>
          <div className={`profile-badge ${profile.color}`}><Icon name="star" size={34} /></div>
          <h1>{profile.name}</h1>
          <p className="profile-text">{profile.text}</p>
          <div className="score-strip">
            <div><span>PUNTOS</span><b>{game.points}</b></div>
            <div><span>NIVEL</span><b>{level}</b></div>
            <div><span>SALDO FINAL</span><b>{formatCOP(game.budget)}</b></div>
          </div>

          <div className="results-grid">
            <section className="result-card spending">
              <div className="card-heading"><span>Tu presupuesto</span><Icon name="wallet" /></div>
              <div className="donut" style={{ "--value": `${Math.min(100, (spent / INITIAL_BUDGET) * 100)}%` } as CSSProperties}>
                <div><b>{formatCOP(spent)}</b><span>gastados</span></div>
              </div>
              <div className="legend"><span><i className="dot orange" /> Gastado {formatCOP(spent)}</span><span><i className="dot lime" /> Conservado {formatCOP(game.budget)}</span></div>
            </section>
            <section className="result-card stats">
              <div className="card-heading"><span>Tu partida en datos</span><Icon name="bolt" /></div>
              <div className="stat-row"><span>Compras realizadas</span><b>{game.purchases}</b></div>
              <div className="stat-row"><span>Pausas de 24 horas</span><b>{game.waited}</b></div>
              <div className="stat-row"><span>Alternativas comparadas</span><b>{game.compared}</b></div>
              <div className="stat-row"><span>Productos ignorados</span><b>{game.skipped}</b></div>
            </section>
            <section className="result-card influence">
              <div className="card-heading"><span>Motivos que identificaste</span><Icon name="heart" /></div>
              <strong>{topInfluence}</strong>
              <p>Registro de lo que tú señalaste en cada decisión; no es un diagnóstico ni una medición automática de tus motivos.</p>
              <div className="influence-bars">
                {Object.entries(game.influences).map(([name, value]) => (
                  <div key={name}><span>{name}</span><i><b style={{ width: `${game.rounds ? (value / Math.max(1, game.rounds)) * 100 : 0}%` }} /></i></div>
                ))}
              </div>
            </section>
          </div>
          <section className="result-card decision-history" aria-labelledby="decision-history-title">
            <div className="card-heading"><span id="decision-history-title">Historial de decisiones</span><Icon name="check" /></div>
            <div className="decision-list">
              {game.decisions.map((decision, index) => <div className="decision-item" key={`${decision.productId}-${index}`}><span className="decision-number">{index + 1}</span><div className="decision-detail"><b>{decision.productName}</b><small>{choiceLabels[decision.choice]} · Motivo señalado: {decision.influence}</small></div><strong title="Precio del producto consultado">{formatCOP(decision.price)}</strong></div>)}
            </div>
            <p className="decision-footnote">Los motivos son autorreportados por el jugador. El historial muestra elecciones de esta partida y no pretende diagnosticar conductas.</p>
          </section>
          <section className="result-card mission-result" aria-labelledby="mission-result-title">
            <div className="card-heading"><span id="mission-result-title">Resultado de la misión</span><Icon name="trophy" /></div>
            <strong className="mission-status">{game.rounds === 4 && game.budget >= MISSION_MINIMUM ? "MISIÓN CUMPLIDA" : game.rounds === 4 ? "MISIÓN NO CUMPLIDA" : "PARTIDA INCOMPLETA"}</strong>
            <p>{game.rounds < 4 ? `Has completado ${game.rounds} de 4 decisiones. Termina la partida para evaluar la misión.` : game.budget >= MISSION_MINIMUM ? `¡Bien! Conservaste ${formatCOP(game.budget)}, por encima del mínimo de ${formatCOP(MISSION_MINIMUM)}.` : `Terminaste con ${formatCOP(game.budget)}. Te faltaron ${formatCOP(MISSION_MINIMUM - game.budget)} para alcanzar la meta.`}</p>
          </section>
          <section className="result-card badges-card" aria-labelledby="badges-title">
            <div className="card-heading"><span id="badges-title">Insignias de esta partida</span><Icon name="star" /></div>
            <div className="badges-grid">
              {badges.map((badge) => <div className={`achievement ${badge.unlocked ? "unlocked" : "locked"}`} key={badge.name} aria-label={`${badge.name}: ${badge.unlocked ? "desbloqueada" : "bloqueada"}`}><Icon name={badge.unlocked ? "trophy" : "star"} size={22} /><b>{badge.name}</b><small>{badge.description}</small><span>{badge.unlocked ? "DESBLOQUEADA" : "BLOQUEADA"}</span></div>)}
            </div>
          </section>
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
          <div className="live-tag"><i /> TIENDA SIMULADA</div>
          <h1>Elige tu <em>tentación.</em></h1>
          <p>Tienes 4 decisiones. No hay respuestas correctas, solo consecuencias.</p><p className="simulation-note">Los precios, descuentos, tendencias y mensajes de urgencia son simulados. No se realizan compras reales.</p>
        </div>
        <div className="budget-card">
          <div className="budget-top"><span><Icon name="wallet" /> PRESUPUESTO</span><strong>{formatCOP(game.budget)}</strong></div>
          <div className="budget-track"><i style={{ width: `${(game.budget / INITIAL_BUDGET) * 100}%` }} /></div>
          <small>{spent === 0 ? "Aún no has gastado nada" : `Has gastado ${formatCOP(spent)} de ${formatCOP(INITIAL_BUDGET)}`}</small>
        </div>
      </section>

      <div className="mission-banner">
        <div className="mission-icon"><Icon name="trophy" /></div>
        <div><span>MISIÓN DE HOY</span><b>Termina la partida conservando al menos {formatCOP(MISSION_MINIMUM)}</b></div>
        <strong>{game.rounds >= 4 ? (game.budget >= MISSION_MINIMUM ? "CUMPLIDA" : "NO CUMPLIDA") : (game.budget >= MISSION_MINIMUM ? "EN CURSO" : "EN RIESGO")}</strong>
      </div>

      <section className="catalog">
        <div className="catalog-tools">
          <div className="filters">
            {(["Todo", "Moda", "Tech", "Accesorios"] as Category[]).map((item) => (
              <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
          <div className="trend-note"><Icon name="bolt" size={16} /> Señales de tendencia simuladas</div>
        </div>
        <div className="product-grid">
          {visibleProducts.map((product) => {
            const owned = game.inventory.some((p) => p.id === product.id)
            return (
              <article className={`product-card ${product.color}`} key={product.id}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} onError={(event) => { event.currentTarget.style.display = "none" }} />
                  <span className="product-tag">{product.tag}</span>
                  {owned && <span className="owned"><Icon name="check" size={14} /> EN TU CARRITO</span>}
                </div>
                <div className="product-info">
                  <small>{product.category}</small>
                  <h2>{product.name}</h2>
                  <div className="price"><b>{formatCOP(product.price)}</b><s>{formatCOP(product.oldPrice)}</s></div>
                  <button disabled={owned || game.rounds >= 4} onClick={() => { setSelectedInfluence(""); setSelected(product) }}>
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
          <section className="dilemma-modal" role="dialog" aria-modal="true" aria-labelledby="dilemma-title" onMouseDown={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="Cerrar"><Icon name="close" /></button>
            <div className="dilemma-image">
              <img src={selected.image} alt={selected.name} onError={(event) => { event.currentTarget.style.display = "none" }} />
              <span>DECISIÓN {game.rounds + 1} DE 4</span>
            </div>
            <div className="dilemma-content">
              <div className="dilemma-label"><Icon name="bolt" size={16} /> MOMENTO DE DECIDIR</div>
              <h2 id="dilemma-title">Lo quieres.<br />Pero, ¿lo necesitas?</h2>
              <p>{selected.reason}</p>
              <div className="urgency"><Icon name="clock" /><span>Simulación de urgencia · sin penalización</span><b aria-live="off">{String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:{String(secondsLeft % 60).padStart(2, "0")}</b></div>
              {secondsLeft === 0 && <p className="timer-ended" role="status">La cuenta atrás terminó. Puedes decidir con calma; no hay penalización.</p>}
              <fieldset className="influence-picker"><legend>¿Qué influye más en tu decisión? (elige una opción)</legend>{["Oferta", "Tendencia", "Presión social", "Necesidad", "Curiosidad"].map((item) => <label key={item}><input type="radio" name="influence" value={item} checked={selectedInfluence === item} onChange={() => setSelectedInfluence(item)} /> {item}</label>)}</fieldset>
              <div className="choices">
                <button className="choice buy" disabled={!selectedInfluence || game.budget < selected.price} onClick={() => choose("buy")}>
                  <span><Icon name="bag" /></span><div><b>COMPRAR AHORA</b><small>{game.budget < selected.price ? "No tienes saldo suficiente" : `−${formatCOP(selected.price)} · satisfacción instantánea`}</small></div><Icon name="arrow" />
                </button>
                <button className="choice" disabled={!selectedInfluence} onClick={() => choose("wait")}><span><Icon name="clock" /></span><div><b>SIMULAR PAUSA DE 24 H</b><small>Imagina que vuelves mañana con la cabeza fría</small></div><Icon name="arrow" /></button>
                <button className="choice" disabled={!selectedInfluence} onClick={() => choose("compare")}><span><Icon name="search" /></span><div><b>COMPARAR OPCIONES</b><small>Busca segunda mano o una alternativa</small></div><Icon name="arrow" /></button>
                <button className="choice skip" disabled={!selectedInfluence} onClick={() => choose("skip")}><span><Icon name="close" /></span><div><b>NO COMPRAR</b><small>Sigue explorando sin llevártelo</small></div><Icon name="arrow" /></button>
              </div>
            </div>
          </section>
        </div>
      )}

      {feedback && (
        <div className="modal-backdrop">
          <section className={`feedback-modal ${feedback.tone}`} role="dialog" aria-modal="true" aria-labelledby="feedback-title">
            <div className="feedback-burst"><Icon name={feedback.tone === "orange" ? "bolt" : "check"} size={42} /></div>
            <span>CONSECUENCIA INMEDIATA</span>
            <h2 id="feedback-title">{feedback.title}</h2>
            <p>{feedback.body}</p>
            <div className="feedback-stats">
              <div><small>SALDO</small><b>{formatCOP(game.budget)}</b></div>
              <div><small>PUNTOS</small><b>+{feedback.points}</b></div>
              <div><small>ÁNIMO</small><b>{game.satisfaction}%</b></div>
            </div>
            <button className="primary-button" onClick={continueGame}>{game.rounds >= 4 ? "VER MI PERFIL" : "SEGUIR JUGANDO"} <Icon name="arrow" /></button>
          </section>
        </div>
      )}

      {cartOpen && (
        <div className="cart-drawer-wrap" onMouseDown={() => setCartOpen(false)}>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" onMouseDown={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setCartOpen(false)} aria-label="Cerrar"><Icon name="close" /></button>
            <span className="drawer-label">INVENTARIO</span>
            <h2 id="cart-title">Tu carrito habla.</h2>
            <p>{game.inventory.length ? "Esto es lo que tus decisiones han sumado hasta ahora." : "Todavía está vacío. ¿Paz mental o solo calentando?"}</p>
            <div className="inventory-list">
              {game.inventory.map((product) => (
                <div key={product.id}><img src={product.image} alt="" onError={(event) => { event.currentTarget.style.display = "none" }} /><span><b>{product.name}</b><small>{product.category}</small></span><strong>{formatCOP(product.price)}</strong></div>
              ))}
            </div>
            <div className="drawer-total"><span>TOTAL GASTADO</span><b>{formatCOP(spent)}</b></div>
          </aside>
        </div>
      )}
    </main>
  )
}
