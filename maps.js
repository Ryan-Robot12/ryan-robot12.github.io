// 9x9
var maps = [
  [
    // vertical
    ["000000000",
      "101000001",
      "100000001",
      "100000001",
      "100000001",
      "100000001",
      "100000001",
      "100000001",
      "000000000"],
    // horizontal
    [
      "111111111",
      "000100000",
      "000000000",
      "000000000",
      "000000000",
      "000000000",
      "000000000",
      "000000000",
      "111111111"
    ]
  ]
]
function getAMap() {
  return maps[Math.floor(Math.random() * maps.length)]
}