export function getMultipleUniqueRandom(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())

  const uniqueCities = []
  const unique = shuffled.filter((element) => {
    const isDuplicate = uniqueCities.includes(element.city)

    if (!isDuplicate) {
      uniqueCities.push(element.city)

      return true
    }

    return false
  })

  return unique.slice(0, num)
}
