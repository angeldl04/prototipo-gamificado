export type Screen = "home" | "shop" | "results"
export type Choice = "buy" | "wait" | "compare" | "skip"
export type Category = "Todo" | "Moda" | "Tech" | "Accesorios"

export type Product = {
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
  alternativeName: string
  alternativePrice: number
}

export const products: Product[] = [
  {
    id: 1,
    name: "Sneakers Cloud",
    category: "Moda",
    price: 269900,
    oldPrice: 449900,
    image:
      "https://images.unsplash.com/photo-1607861716497-e65ab29fc7ac?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900&h=900",
    color: "lime",
    tag: "−40% HOY",
    reason: "Tus sneakers aún funcionan, pero estas aparecen en todos tus reels.",
    need: 2,
    alternativeName: "Sneakers de segunda mano en buen estado",
    alternativePrice: 129900,
  },
  {
    id: 2,
    name: "Buds Pop",
    category: "Tech",
    price: 189900,
    oldPrice: 249900,
    image:
      "https://images.unsplash.com/photo-1628705985369-0cfe01fcc22d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900&h=900",
    color: "orange",
    tag: "VIRAL",
    reason: "Ya tienes auriculares. Estos prometen hacer tu setup mucho más aesthetic.",
    need: 1,
    alternativeName: "Auriculares reacondicionados",
    alternativePrice: 99900,
  },
  {
    id: 3,
    name: "Gafas Solar ’00",
    category: "Accesorios",
    price: 89900,
    oldPrice: 129900,
    image:
      "https://images.unsplash.com/photo-1589278560486-22a9330c6bb8?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900&h=900",
    color: "violet",
    tag: "TREND ALERT",
    reason: "Tu grupo planea una escapada este finde y todos hablan del look perfecto.",
    need: 3,
    alternativeName: "Gafas de colección anterior",
    alternativePrice: 59900,
  },
  {
    id: 4,
    name: "Hoodie Afterclass",
    category: "Moda",
    price: 219900,
    oldPrice: 299900,
    image:
      "https://images.unsplash.com/photo-1576188973526-0e5d7047b0cf?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900&h=900",
    color: "cream",
    tag: "ÚLTIMAS 3",
    reason: "Es cómodo y está rebajado. Tu armario tiene otros cuatro muy parecidos.",
    need: 2,
    alternativeName: "Sudadera básica de segunda mano",
    alternativePrice: 119900,
  },
  {
    id: 5,
    name: "Mini Speaker Go",
    category: "Tech",
    price: 149900,
    oldPrice: 189900,
    image:
      "https://images.unsplash.com/photo-1664648578369-81fce1ad428c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900&h=900",
    color: "orange",
    tag: "FLASH −20%",
    reason: "La etiqueta de oferta intenta generar urgencia. Sería útil... aunque solo la usarías alguna vez.",
    need: 4,
    alternativeName: "Altavoz portátil usado",
    alternativePrice: 79900,
  },
  {
    id: 6,
    name: "Everyday Kit",
    category: "Accesorios",
    price: 79900,
    oldPrice: 109900,
    image:
      "https://images.unsplash.com/photo-1511556820780-d912e42b4980?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900&h=900",
    color: "violet",
    tag: "BUNDLE",
    reason: "El pack parece una ganga, aunque solo buscabas una funda nueva.",
    need: 3,
    alternativeName: "Comprar solo la funda que necesitas",
    alternativePrice: 39900,
  },
]

export type GameState = {
  budget: number
  points: number
  satisfaction: number
  inventory: Product[]
  rounds: number
  purchases: number
  waited: number
  compared: number
  skipped: number
  influences: Record<string, number>
  decisions: Array<{ productId: number; productName: string; choice: Choice; influence: string; price: number }>
}

export const INITIAL_BUDGET = 600000
export const MISSION_MINIMUM = 200000

export const initialGame: GameState = {
  budget: INITIAL_BUDGET,
  points: 0,
  satisfaction: 58,
  inventory: [],
  rounds: 0,
  purchases: 0,
  waited: 0,
  compared: 0,
  skipped: 0,
  influences: { Oferta: 0, Tendencia: 0, "Presión social": 0, Necesidad: 0, Curiosidad: 0 },
  decisions: [],
}

