export function formatPrice(price: string | number) {
  return Number(price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function toggleFavoriteInSet(id: string) {
  return (prev: Set<string>) => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  }
}
