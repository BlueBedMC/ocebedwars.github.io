const query = location.search.slice(1).split("&").map(a => a.split("="))
export function getQuery(key) {
  return query.find(a => a[0] == key)[1]
}